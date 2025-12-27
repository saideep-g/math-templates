import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeaderProps {
  current: number;
  total: number;
  stage: 'MAIN' | 'TRANSFER';
}

export const ProgressHeader: React.FC<HeaderProps> = ({ current, total, stage }) => {
  return (
    <header className="px-10 py-6 bg-white border-b border-slate-200 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Quest Mode</h2>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
            {stage === 'MAIN' ? 'Core Learning' : 'Transfer Challenge'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex-1 w-64 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-out"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
           <span className="text-slate-400 font-bold">Item</span>
           <span className="text-slate-900 font-black">{current}</span>
           <span className="text-slate-400 font-bold">/</span>
           <span className="text-slate-400 font-bold">{total}</span>
        </div>
      </div>
    </header>
  );
};