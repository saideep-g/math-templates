import React, { useState, useEffect } from 'react';
import { type AnyItem, type CommitResult } from '../types/itemTypes';
import { ProgressHeader } from './ProgressHeader';
import { FeedbackPanel } from './FeedbackPanel';
import { TemplateRenderer } from './TemplateRenderer';
import { scoreItem } from '../utils/scoring';
import { Check, ChevronRight, HelpCircle, BookOpen, RefreshCw } from 'lucide-react';

interface QuizRunnerProps {
  items: AnyItem[];
}

/**
 * Corrected QuizRunner
 * 1. Properly handles localResponse resets.
 * 2. Added key switching to force-re-mount children on question change.
 */
export const QuizRunner: React.FC<QuizRunnerProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [stage, setStage] = useState<'MAIN' | 'TRANSFER'>('MAIN');
  const [localResponse, setLocalResponse] = useState<any>(null);
  const [lastResult, setLastResult] = useState<CommitResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const currentItem = stage === 'MAIN' ? items[currentIndex] : items[currentIndex].transfer_item;

  // Handle Commit: Score the user's current response
  const handleCommit = () => {
    const result = scoreItem(currentItem, localResponse, attempt);
    setLastResult(result);
    
    if (!result.isCorrect) {
      setAttempt(prev => prev + 1);
    }
  };

  // Navigation Logic: Handle progression and state resets
  const handleNext = () => {
    if (stage === 'MAIN' && lastResult?.isCorrect && currentItem.transfer_item) {
      // If correct and a transfer exists, move to transfer task
      setStage('TRANSFER');
      resetFlowState();
    } else {
      // Otherwise, move to the next item in the main list
      if (currentIndex < items.length - 1) {
        setStage('MAIN');
        setCurrentIndex(prev => prev + 1);
        resetFlowState();
      } else {
        // Handle completion
        alert("Quest Complete!");
      }
    }
  };

  const resetFlowState = () => {
    setAttempt(1);
    setLocalResponse(null);
    setLastResult(null);
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
        {/* Left Side: Question Context */}
        <section className="w-full md:w-1/3 p-10 bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar">
          <div className="mb-10">
            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-indigo-600 bg-indigo-50 rounded-full uppercase border border-indigo-100">
              Template: {currentItem.template_id.replace(/_/g, ' ')}
            </span>
            <h1 className="text-3xl font-black leading-tight mb-6 text-slate-800">
              {currentItem.prompt.text}
            </h1>
            <p className="text-slate-400 text-lg font-bold italic leading-relaxed">
              {currentItem.instruction}
            </p>
          </div>

          <FeedbackPanel 
            result={lastResult} 
            attempt={attempt}
            workedSolution={showSolution ? currentItem.worked_solution : undefined}
          />
        </section>

        {/* Right Side: Interactive Area */}
        <section className="w-full md:w-2/3 p-12 relative flex flex-col items-center justify-center bg-slate-50/50">
          <div 
            key={`${currentItem.item_id}_${stage}`} // Force re-mount of child when item/stage changes
            className="w-full max-w-3xl bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 p-12 border-4 border-white transition-all duration-500"
          >
            <TemplateRenderer 
              item={currentItem} 
              attempt={attempt}
              onCommit={handleCommit}
              onChangeLocal={setLocalResponse}
            />
          </div>

          {/* Action Bar */}
          <div className="absolute bottom-10 right-10 flex items-center gap-4">
            {attempt > 2 && !lastResult?.isCorrect && (
              <button 
                onClick={() => setShowSolution(true)}
                className="flex items-center gap-2 px-8 py-4 text-slate-500 font-black uppercase text-xs hover:bg-slate-100 rounded-3xl transition-all"
              >
                <BookOpen size={18} /> Reveal Method
              </button>
            )}

            {!lastResult?.isCorrect ? (
              <button 
                onClick={handleCommit}
                disabled={!localResponse}
                className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-20 disabled:grayscale transition-all active:scale-95"
              >
                <Check size={28} /> Check Answer
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-black transition-all animate-in zoom-in duration-300"
              >
                {stage === 'MAIN' && currentItem.transfer_item ? 'Start Transfer' : 'Next Step'} 
                <ChevronRight size={28} />
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};