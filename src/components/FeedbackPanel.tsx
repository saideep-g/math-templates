import React from 'react';
import {type CommitResult } from '../types/itemTypes';
import { MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FeedbackProps {
  result: CommitResult | null;
  attempt: number;
  workedSolution?: { steps: string[]; final_answer: string };
}

export const FeedbackPanel: React.FC<FeedbackProps> = ({ result, attempt, workedSolution }) => {
  if (!result && !workedSolution) return null;

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {result && (
        <div className={`p-6 rounded-3xl border ${result.isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-rose-50 border-rose-100 text-rose-900'}`}>
          <div className="flex items-center gap-3 mb-3">
            {result.isCorrect ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-rose-500" />}
            <span className="font-bold uppercase tracking-widest text-xs">
              {result.isCorrect ? 'Great Strategy' : `Attempt ${attempt - 1} Check`}
            </span>
          </div>
          <p className="text-lg leading-relaxed font-medium">
            {result.feedbackText}
          </p>
        </div>
      )}

      {workedSolution && (
        <div className="p-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="text-indigo-400" size={24} />
            <span className="font-bold uppercase text-xs tracking-widest text-slate-400">Step-by-Step Solution</span>
          </div>
          <div className="space-y-4 mb-8">
            {workedSolution.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-slate-500 font-bold">{i + 1}.</span>
                <p className="text-slate-200" dangerouslySetInnerHTML={{ __html: step }} />
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-800 text-2xl font-black text-indigo-400">
            {workedSolution.final_answer}
          </div>
        </div>
      )}
    </div>
  );
};