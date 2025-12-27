import React, { useState, useEffect } from 'react';
import { type WorkedExampleItem, type TemplateProps } from '../../types/itemTypes';
import { FractionInput } from '../FractionInput';

/**
 * MathSpan (Sub-component)
 * * WHY: This is the fix for the "formatting gone" issue.
 * HOW: By using React.memo, we tell React to only re-render this span if the 'html'
 * string actually changes. When a user types in an input box, the parent re-renders,
 * but this component stays stable. This prevents React from overwriting the 
 * DOM nodes that KaTeX has already "beautified".
 */
const MathSpan = React.memo(({ html }: { html: string }) => (
  <span dangerouslySetInnerHTML={{ __html: html }} />
));

/**
 * WorkedExampleComplete (CBSE Ch 2 Fractions)
 * 1. Renders multi-line LaTeX steps using dangerouslySetInnerHTML.
 * 2. Provides specialized FractionInput components for math completion.
 * 3. FIX: Uses Memoized MathSpan to preserve formatting during state updates.
 * 4. FIX: Repaired split math delimiters to ensure fractions render around input boxes.
 */
export const WorkedExampleComplete: React.FC<TemplateProps<WorkedExampleItem>> = ({ item, onChangeLocal }) => {
  const [responses, setResponses] = useState<Record<string, string>>({});

  // Reset local state when item changes to prevent data leakage between questions
  useEffect(() => {
    setResponses({});
  }, [item.item_id]);

  // Bubble up response state to the QuizRunner for scoring
  useEffect(() => {
    onChangeLocal?.(responses);
  }, [responses]);

  /**
   * renderLine
   * Parses steps and injects inputs into LaTeX-styled lines.
   * If the line contains a blank, it splits the text and balances LaTeX delimiters
   * so that KaTeX can render each segment independently.
   */
  const renderLine = (step: any) => {
    // Plain text line (no input)
    if (!step.blank_id) {
      return (
        <div className="text-xl text-slate-600 mb-8 py-4 px-6 bg-slate-50/50 rounded-2xl border border-transparent">
          <MathSpan html={step.line} />
        </div>
      );
    }

    /**
     * Logic for balancing LaTeX delimiters:
     * When splitting at '\boxed{\ \ \ }', we often cut a '$$...$$' block in half.
     * Part 0: "1) $$\frac{3}{4}..." (Unclosed)
     * Part 1: "...$$" (No opening)
     * We manually add closing/opening '$$' tags to the split parts so the browser 
     * finds complete math blocks to render.
     */
    const parts = step.line.split('\\boxed{\\ \\ \\ }');
    
    // Check if the left part has an opening delimiter '$$' that isn't closed
    let leftHtml = parts[0];
    if ((leftHtml.match(/\$\$/g) || []).length % 2 !== 0) {
      leftHtml += '$$'; // Force close math mode for the left segment
    }

    // Check if the right part starts inside a math block that was split
    let rightHtml = parts[1] || '';
    if (rightHtml && (rightHtml.match(/\$\$/g) || []).length % 2 !== 0) {
      rightHtml = '$$\ ' + rightHtml; // Force re-open math mode for the right segment
    }

    return (
      <div className="flex items-center gap-6 mb-8 text-xl text-slate-900 bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm transition-all hover:border-indigo-100">
        <MathSpan html={leftHtml} />
        
        <div className="flex items-center gap-3">
          {/* Conditional rendering of Input type based on JSON config */}
          {(step.input === 'fraction' || step.input === 'fraction_or_mixed') ? (
            <FractionInput
              type={step.input as any}
              value={responses[step.blank_id] || ''}
              onChange={(val) => setResponses({ ...responses, [step.blank_id]: val })}
            />
          ) : (
            <div className="flex flex-col gap-1">
              <input 
                type="text"
                placeholder="?"
                className="w-32 text-center p-3 rounded-2xl border-4 border-indigo-100 focus:border-indigo-500 focus:outline-none font-black text-indigo-600 bg-white transition-all shadow-inner text-2xl"
                value={responses[step.blank_id] || ''}
                onChange={(e) => setResponses({ ...responses, [step.blank_id]: e.target.value })}
                aria-label={`Fill in blank ${step.blank_id}`}
              />
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest text-center">Value</span>
            </div>
          )}
        </div>

        {rightHtml && <MathSpan html={rightHtml} />}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      {item.interaction.config.steps.map((step, idx) => (
        <div key={`${item.item_id}_step_${idx}`}>
          {renderLine(step)}
        </div>
      ))}
    </div>
  );
};