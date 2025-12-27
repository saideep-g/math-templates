import React, { useState, useEffect } from 'react';
import { type WorkedExampleItem, type TemplateProps } from '../../types/itemTypes';

export const WorkedExampleComplete: React.FC<TemplateProps<WorkedExampleItem>> = ({ item, onChangeLocal }) => {
  const [responses, setResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    onChangeLocal?.(responses);
  }, [responses]);

  const renderLine = (step: any) => {
    if (!step.blank_id) {
      return <div className="text-xl text-slate-600 mb-6 py-2" dangerouslySetInnerHTML={{ __html: step.line }} />;
    }

    const parts = step.line.split('\\boxed{\\ \\ \\ }');
    return (
      <div className="flex items-center gap-2 mb-6 text-xl text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <span dangerouslySetInnerHTML={{ __html: parts[0] }} />
        <input 
          type="text"
          placeholder="?"
          className="w-24 text-center p-2 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none font-bold text-indigo-600 bg-white"
          value={responses[step.blank_id] || ''}
          onChange={(e) => setResponses({ ...responses, [step.blank_id]: e.target.value })}
        />
        {parts[1] && <span dangerouslySetInnerHTML={{ __html: parts[1] }} />}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {item.interaction.config.steps.map((step, idx) => (
        <div key={idx}>{renderLine(step)}</div>
      ))}
    </div>
  );
};