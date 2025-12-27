import React, { useState, useEffect } from 'react';
import { type WorkedExampleItem, type TemplateProps } from '../../types/itemTypes';

/**
 * WorkedExampleComplete (CBSE Ch 2 Fractions)
 * 1. Renders multi-line LaTeX steps using dangerouslySetInnerHTML.
 * 2. Provides blank inputs for the student to complete the process.
 * 3. Syncs current blank inputs with QuizRunner for equivalence scoring.
 */
export const WorkedExampleComplete: React.FC<TemplateProps<WorkedExampleItem>> = ({ item, onChangeLocal }) => {
  const [responses, setResponses] = useState<Record<string, string>>({});

  // Reset local state when item changes
  useEffect(() => {
    setResponses({});
  }, [item.item_id]);

  useEffect(() => {
    onChangeLocal?.(responses);
  }, [responses]);

  /**
   * Parses steps and injects inputs into LaTeX-styled lines.
   * Note: The math rendering itself is triggered by the global KaTeX hook in QuizRunner.
   */
  const renderLine = (step: any) => {
    if (!step.blank_id) {
      return (
        <div 
          className="text-xl text-slate-600 mb-8 py-4 px-6 bg-slate-50/50 rounded-2xl border border-transparent" 
          dangerouslySetInnerHTML={{ __html: step.line }} 
        />
      );
    }

    // Split the line by the boxed placeholder defined in the JSON configuration
    const parts = step.line.split('\\boxed{\\ \\ \\ }');
    return (
      <div className="flex items-center gap-4 mb-8 text-xl text-slate-900 bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm transition-all hover:border-indigo-100">
        <span dangerouslySetInnerHTML={{ __html: parts[0] }} />
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
        {parts[1] && <span dangerouslySetInnerHTML={{ __html: parts[1] }} />}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      {item.interaction.config.steps.map((step, idx) => (
        <div key={`${item.item_id}_step_${idx}`}>{renderLine(step)}</div>
      ))}
    </div>
  );
};