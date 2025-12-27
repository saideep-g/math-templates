import React, { useState, useEffect } from 'react';
import { type BalanceOpsItem,type TemplateProps } from '../../types/itemTypes';
import { RotateCcw } from 'lucide-react';

export const BalanceOps: React.FC<TemplateProps<BalanceOpsItem>> = ({ item, onChangeLocal }) => {
  const config = item.interaction.config;
  const [left, setLeft] = useState(config.equation.left.a * 5 + config.equation.left.b); // Just a visual proxy
  const [currentLeftLabel, setCurrentLeftLabel] = useState(`${config.equation.left.a}${config.equation.left.variable} + ${config.equation.left.b}`);
  const [currentRight, setCurrentRight] = useState(config.equation.right.value);
  const [history, setHistory] = useState<{ op_id: string; label: string }[]>([]);

  // Simulation of algebraic transformation
  const applyOp = (op: any) => {
    setHistory([...history, op]);
    if (op.op_id === 'SUBTRACT') {
      // Logic for 3x + 5 - 5 = 20 - 5
      setCurrentLeftLabel(`${config.equation.left.a}${config.equation.left.variable}`);
      setCurrentRight(prev => prev - op.value);
    }
    if (op.op_id === 'DIVIDE') {
      setCurrentLeftLabel(`${config.equation.left.variable}`);
      setCurrentRight(prev => prev / op.value);
    }
  };

  useEffect(() => {
    const currentX = currentLeftLabel === config.equation.left.variable ? currentRight : null;
    onChangeLocal?.({ history, currentX, currentRight });
  }, [history, currentRight, currentLeftLabel]);

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex items-center gap-12 mb-16 w-full justify-center">
        <div className="flex flex-col items-center">
          <div className="p-6 bg-indigo-50 border-2 border-indigo-200 rounded-2xl text-2xl font-bold text-indigo-900 min-w-[120px] text-center shadow-inner">
            {currentLeftLabel}
          </div>
          <div className="w-32 h-2 bg-slate-300 rounded-full mt-4"></div>
        </div>
        
        <div className="text-4xl font-black text-slate-200">=</div>

        <div className="flex flex-col items-center">
          <div className="p-6 bg-indigo-50 border-2 border-indigo-200 rounded-2xl text-2xl font-bold text-indigo-900 min-w-[120px] text-center shadow-inner">
            {currentRight}
          </div>
          <div className="w-32 h-2 bg-slate-300 rounded-full mt-4"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {config.operations.map(op => (
          <button
            key={op.op_id}
            onClick={() => applyOp(op)}
            className="flex items-center justify-center p-5 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm"
          >
            {op.label} to both sides
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end w-full">
        <button 
          onClick={() => { setHistory([]); setCurrentLeftLabel(`${config.equation.left.a}${config.equation.left.variable} + ${config.equation.left.b}`); setCurrentRight(config.equation.right.value); }}
          className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase hover:text-slate-600"
        >
          <RotateCcw size={16} /> Reset Steps
        </button>
      </div>
    </div>
  );
};