import React, { useState, useEffect } from 'react';
import { type ErrorAnalysisItem, type TemplateProps } from '../../types/itemTypes';

export const ErrorAnalysis: React.FC<TemplateProps<ErrorAnalysisItem>> = ({ item, onChangeLocal }) => {
  const { lines } = item.interaction.config.student_work;
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [corrections, setCorrections] = useState<Record<string, string>>({});

  useEffect(() => {
    onChangeLocal?.({ wrong_line: selectedLine, ...corrections });
  }, [selectedLine, corrections]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
        <h3 className="text-amber-800 font-bold text-sm uppercase mb-6 tracking-wider">Student's Calculation Log</h3>
        <div className="space-y-3">
          {lines.map((line, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedLine(idx + 1)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${
                selectedLine === idx + 1 
                ? 'border-indigo-600 bg-white shadow-md text-indigo-700' 
                : 'border-transparent bg-white/50 hover:bg-white text-slate-600'
              }`}
            >
              {line}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {item.interaction.config.response_inputs.filter(inp => inp.type === 'number').map(inp => (
          <div key={inp.input_id}>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
              Corrected {inp.input_id.replace(/_/g, ' ')}
            </label>
            <input 
              type="number"
              className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none text-xl font-bold text-indigo-600"
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