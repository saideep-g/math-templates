import React, { useState, useEffect } from 'react';
import { type ErrorAnalysisItem, type TemplateProps } from '../../types/itemTypes';

/**
 * MathSpan
 * Prevents React from overwriting KaTeX-formatted math nodes 
 * when the user types in correction fields.
 */
const MathSpan = React.memo(({ html }: { html: string }) => (
  <span dangerouslySetInnerHTML={{ __html: html }} />
));

/**
 * ErrorAnalysis Template (Revised for Phase 2)
 * * PEDAGOGICAL APPROACH:
 * 1. Audit Phase: Student identifies the first point of logical failure.
 * 2. Repair Phase: Student must provide the corrected "downstream" values.
 * * UI FIXES:
 * - Uses a flex-row layout on large screens to prevent vertical overflow.
 * - Dynamic instructions based on the selected line.
 */
export const ErrorAnalysis: React.FC<TemplateProps<ErrorAnalysisItem>> = ({ item, onChangeLocal }) => {
  const { lines } = item.interaction.config.student_work;
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [corrections, setCorrections] = useState<Record<string, string>>({});

  // Reset state when the item changes to ensure no cross-question contamination
  useEffect(() => {
    setSelectedLine(null);
    setCorrections({});
  }, [item.item_id]);

  // Bubble state to QuizRunner for scoring
  useEffect(() => {
    onChangeLocal?.({ wrong_line: selectedLine, ...corrections });
  }, [selectedLine, corrections]);

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      <div className="mb-4">
        <h3 className="text-slate-900 font-black text-xl">Audit & Repair</h3>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
          Locate the first error, then fix the calculation chain.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* LEFT: The Audit Log (Step List) */}
        <div className={`transition-all duration-500 ${selectedLine ? 'lg:w-3/5' : 'w-full'} flex flex-col`}>
          <div className="bg-slate-50 rounded-[2rem] p-6 border-2 border-slate-100 flex-1 overflow-y-auto custom-scrollbar">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">
              Student Work
            </h4>
            <div className="space-y-3">
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isSelected = selectedLine === lineNum;
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedLine(lineNum)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 ${
                      isSelected 
                        ? 'border-indigo-600 bg-white shadow-lg -translate-y-1' 
                        : 'border-transparent bg-white/60 hover:bg-white text-slate-600'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm mt-0.5 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {lineNum}
                    </div>
                    <div className="text-base font-bold leading-relaxed pt-1">
                      <MathSpan html={line} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: The Correction Panel (Appears only after selection) */}
        {selectedLine ? (
          <div className="lg:w-2/5 animate-in slide-in-from-right-8 duration-500 flex flex-col">
            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-2xl h-full flex flex-col overflow-hidden">
              <div className="mb-6">
                <span className="inline-block bg-indigo-400/30 text-indigo-100 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3">
                  Repairing Step {selectedLine}
                </span>
                <h4 className="text-lg font-black leading-tight">Correct the Logic</h4>
                <p className="text-indigo-200 text-xs font-bold mt-2 leading-snug">
                  If Step {selectedLine} is the first mistake, what are the correct final values?
                </p>
              </div>

              <div className="space-y-5 overflow-y-auto custom-scrollbar pr-2 pb-4">
                {item.interaction.config.response_inputs
                  .filter(inp => inp.type === 'number')
                  .map(inp => (
                    <div key={inp.input_id} className="flex flex-col gap-2">
                      <label className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.15em] ml-4">
                        Correct {inp.input_id.replace(/_/g, ' ')}
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          className="w-full p-4 rounded-2xl border-2 border-indigo-500 focus:border-white outline-none text-xl font-black text-white bg-indigo-700/50 placeholder:text-indigo-400/30 transition-all"
                          placeholder="0.00"
                          value={corrections[inp.input_id] || ''}
                          onChange={(e) => setCorrections({ ...corrections, [inp.input_id]: e.target.value })}
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-400 font-black">₹</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-auto pt-4 border-t border-indigo-500/30">
                <p className="text-[9px] font-black text-indigo-300 uppercase text-center tracking-tighter">
                  Tap "Check Answer" to commit your fix
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex lg:w-2/5 items-center justify-center p-8 border-4 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300 text-center">
            <p className="font-black uppercase text-[10px] tracking-widest leading-loose">
              Pick the first line <br/> with a mistake <br/> to start the repair
            </p>
          </div>
        )}
      </div>
    </div>
  );
};