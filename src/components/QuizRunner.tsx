import React, { useState, useEffect } from 'react';
import {type AnyItem, type CommitResult } from '../types/itemTypes';
import { ProgressHeader } from './ProgressHeader';
import { FeedbackPanel } from './FeedbackPanel';
import { TemplateRenderer } from './TemplateRenderer';
import { scoreItem } from '../utils/scoring';
import { Check, ChevronRight, HelpCircle, BookOpen } from 'lucide-react';

interface QuizRunnerProps {
  items: AnyItem[];
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [stage, setStage] = useState<'MAIN' | 'TRANSFER'>('MAIN');
  const [localResponse, setLocalResponse] = useState<any>(null);
  const [lastResult, setLastResult] = useState<CommitResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const currentItem = stage === 'MAIN' ? items[currentIndex] : items[currentIndex].transfer_item;

  useEffect(() => {
    // Check onboarding logic
    const onboarding = JSON.parse(localStorage.getItem('templateOnboardingSeen') || '{}');
    if (!onboarding[currentItem.template_id]) {
      // Show micro-tip logic would go here
      localStorage.setItem('templateOnboardingSeen', JSON.stringify({ ...onboarding, [currentItem.template_id]: true }));
    }
  }, [currentItem.template_id]);

  const handleCommit = () => {
    const result = scoreItem(currentItem, localResponse, attempt);
    setLastResult(result);
    
    if (result.isCorrect) {
      // Success logic
    } else {
      setAttempt(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (stage === 'MAIN' && lastResult?.isCorrect && currentItem.transfer_item) {
      setStage('TRANSFER');
      resetState();
    } else {
      setStage('MAIN');
      setCurrentIndex(prev => prev + 1);
      resetState();
    }
  };

  const resetState = () => {
    setAttempt(1);
    setLocalResponse(null);
    setLastResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <ProgressHeader 
        current={currentIndex + 1} 
        total={items.length} 
        stage={stage} 
      />

      <main className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Left: Content & Instructions */}
        <section className="w-full md:w-1/3 p-8 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-indigo-600 bg-indigo-50 rounded-full uppercase">
              {currentItem.template_id.replace(/_/g, ' ')}
            </span>
            <h1 className="text-2xl font-semibold leading-snug mb-4">
              {currentItem.prompt.text}
            </h1>
            <p className="text-slate-500 text-lg italic">
              {currentItem.instruction}
            </p>
          </div>

          <FeedbackPanel 
            result={lastResult} 
            attempt={attempt}
            workedSolution={showSolution ? currentItem.worked_solution : undefined}
          />
        </section>

        {/* Right: Workspace */}
        <section className="w-full md:w-2/3 p-8 relative flex flex-col items-center justify-center bg-slate-50">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100">
            <TemplateRenderer 
              item={currentItem} 
              attempt={attempt}
              onCommit={handleCommit}
              onChangeLocal={setLocalResponse}
            />
          </div>

          {/* Action Bar */}
          <div className="absolute bottom-8 right-8 flex items-center gap-4">
            {attempt > 1 && !lastResult?.isCorrect && (
              <button 
                onClick={() => setShowHint(true)}
                className="flex items-center gap-2 px-6 py-3 text-indigo-600 font-medium hover:bg-indigo-50 rounded-2xl transition-all"
              >
                <HelpCircle size={20} /> Show Hint
              </button>
            )}

            {attempt > 2 && !lastResult?.isCorrect && (
              <button 
                onClick={() => setShowSolution(true)}
                className="flex items-center gap-2 px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-2xl transition-all"
              >
                <BookOpen size={20} /> Show Steps
              </button>
            )}

            {!lastResult?.isCorrect ? (
              <button 
                onClick={handleCommit}
                disabled={!localResponse}
                className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-bold text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
              >
                <Check size={24} /> Check Answer
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-bold text-lg shadow-lg hover:bg-black transition-all"
              >
                {stage === 'MAIN' && currentItem.transfer_item ? 'Start Transfer' : 'Next Question'} 
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};