import React, { useState, useEffect } from 'react';
import { type ErrorAnalysisItem, type TemplateProps } from '../../types/itemTypes';

/**
 * Corrected ErrorAnalysis Template
 * Added item reset logic and improved focus states for tablet use.
 */
export const ErrorAnalysis: React.FC<TemplateProps<ErrorAnalysisItem>> = ({ item, onChangeLocal }) => {
  const { lines } = item.interaction.config.student_work;
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [corrections, setCorrections] = useState<Record<string, string>>({});

  // Reset internal state when question switches
  useEffect(() => {
    setSelectedLine(null);
    setCorrections({});
  }, [item.item_id]);

  useEffect(() => {
    // Notify runner of current values
    onChangeLocal?.({ wrong_line: selectedLine, ...corrections });
  }, [selectedLine, corrections]);

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="bg-amber-50 rounded-[2.5rem] p-10 border-2 border-amber-100 shadow-sm">
        <h3 className="text-amber-800 font-black text-xs uppercase mb-8 tracking-[0.2em]">Student's Step Log</h3>
        <div className="space-y-4">
          {lines.map((line, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedLine(idx + 1)}
              className={`w-full text-left p-6 rounded-2xl border-4 transition-all font-bold text-lg ${
                selectedLine === idx + 1 
                ? 'border-indigo-600 bg-white shadow-xl text-indigo-700 scale-[1.02]' 
                : 'border-transparent bg-white/60 hover:bg-white text-slate-600'
              }`}
            >
              <span className="mr-4 text-slate-300 font-black italic">{idx + 1}.</span>
              {line}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {item.interaction.config.response_inputs.filter(inp => inp.type === 'number').map(inp => (
          <div key={inp.input_id} className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Enter Correct {inp.input_id.replace(/_/g, ' ')}
            </label>
            <input 
              type="number"
              className="w-full p-6 rounded-3xl border-4 border-slate-100 focus:border-indigo-500 outline-none text-2xl font-black text-indigo-600 bg-slate-50 transition-all"
              placeholder="0.00"
              value={corrections[inp.input_id] || ''}
              onChange={(e) => setCorrections({ ...corrections, [inp.input_id]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};