import React, { useState, useEffect } from 'react';
import { type AnyItem, type CommitResult } from '../types/itemTypes';
import { ProgressHeader } from './ProgressHeader';
import { FeedbackPanel } from './FeedbackPanel';
import { TemplateRenderer } from './TemplateRenderer';
import { scoreItem } from '../utils/scoring';
import { Check, ChevronRight, BookOpen } from 'lucide-react';

/**
 * TypeScript declaration to allow the use of the KaTeX auto-render function 
 * added via script tags in index.html.
 */
declare global {
  interface Window {
    renderMathInElement: (elem: HTMLElement, options?: any) => void;
  }
}

interface QuizRunnerProps {
  items: AnyItem[];
}

/**
 * Corrected QuizRunner
 * 1. Properly handles localResponse resets.
 * 2. Added key switching to force-re-mount children on question change.
 * 3. Integrated KaTeX re-rendering trigger to fix fraction formatting.
 * 4. FIX: Added isReady state and opacity transitions to eliminate unformatted LaTeX "flash".
 */
export const QuizRunner: React.FC<QuizRunnerProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [stage, setStage] = useState<'MAIN' | 'TRANSFER'>('MAIN');
  const [localResponse, setLocalResponse] = useState<any>(null);
  const [lastResult, setLastResult] = useState<CommitResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Determine which item to render based on current stage
  const currentItem = stage === 'MAIN' ? items[currentIndex] : items[currentIndex].transfer_item;

  /**
   * KaTeX Re-render Effect
   * This is the critical fix for fraction formatting. Since React updates the DOM 
   * dynamically, the auto-render script in index.html doesn't see new content.
   * This effect triggers a re-scan of the page every time the question or result changes.
   */
  useEffect(() => {
    // Hide content immediately when moving to a new state to avoid unformatted flash
    setIsReady(false);

    const renderMath = () => {
      if (window.renderMathInElement) {
        window.renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
        
        // WHY: We use requestAnimationFrame to ensure the browser has processed 
        // the KaTeX DOM changes before we remove the 'opacity-0' class.
        requestAnimationFrame(() => setIsReady(true));
      }
    };

    // Initial render call
    renderMath();
    
    // Short delay to catch any late-mounting DOM elements or late-loading KaTeX scripts
    const timer = setTimeout(renderMath, 100);
    return () => clearTimeout(timer);
  }, [currentIndex, stage, attempt, showSolution, lastResult]);

  /**
   * handleCommit
   * Triggers the scoring utility and updates the result state.
   * If incorrect, increments the attempt count to trigger scaffolding hints.
   */
  const handleCommit = () => {
    if (!localResponse) return;
    const result = scoreItem(currentItem, localResponse, attempt);
    setLastResult(result);
    
    if (!result.isCorrect) {
      setAttempt(prev => prev + 1);
    }
  };

  /**
   * handleNext
   * Manages the flow between questions.
   * If a transfer item exists after a successful main item, it prioritizes that.
   */
  const handleNext = () => {
    if (stage === 'MAIN' && lastResult?.isCorrect && currentItem.transfer_item) {
      // Move to transfer task for the same concept
      setStage('TRANSFER');
      resetFlowState();
    } else {
      // Move to the next concept in the list
      if (currentIndex < items.length - 1) {
        setStage('MAIN');
        setCurrentIndex(prev => prev + 1);
        resetFlowState();
      } else {
        // App Completion State
        alert("Quest Complete! You've mastered all Grade 7 concepts.");
      }
    }
  };

  /**
   * resetFlowState
   * Wipes internal tracking variables when moving to a new question.
   */
  const resetFlowState = () => {
    setAttempt(1);
    setLocalResponse(null);
    setLastResult(null);
    setShowSolution(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Navigation and Progress Tracking Header */}
      <ProgressHeader 
        current={currentIndex + 1} 
        total={items.length} 
        stage={stage} 
      />

      <main className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Left Side: Pedagogical Guidance & Instructions */}
        <section className={`w-full md:w-1/3 p-10 bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-10">
            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-indigo-600 bg-indigo-50 rounded-full uppercase border border-indigo-100">
              Module: {currentItem.template_id.replace(/_/g, ' ')}
            </span>
            <h1 className="text-3xl font-black leading-tight mb-6 text-slate-800">
              {currentItem.prompt.latex || currentItem.prompt.text}
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

        {/* Right Side: Interactive Problem Solving Area */}
        <section className="w-full md:w-2/3 p-12 relative flex flex-col items-center justify-center bg-slate-50/50">
          <div 
            key={`${currentItem.item_id}_${stage}`} // Key ensures component remounts and resets state on navigation
            className={`w-full max-w-3xl bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 p-12 border-4 border-white transition-all duration-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <TemplateRenderer 
              item={currentItem} 
              attempt={attempt}
              onCommit={handleCommit}
              onChangeLocal={setLocalResponse}
            />
          </div>

          {/* Answer Commitment Bar */}
          <div className="absolute bottom-10 right-10 flex items-center gap-4">
            {/* Show solution option after multiple failed attempts */}
            {attempt > 2 && !lastResult?.isCorrect && (
              <button 
                onClick={() => setShowSolution(true)}
                className="flex items-center gap-2 px-8 py-4 text-slate-500 font-black uppercase text-xs hover:bg-slate-100 rounded-3xl transition-all"
              >
                <BookOpen size={18} /> Reveal Solution
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
                {stage === 'MAIN' && currentItem.transfer_item ? 'Start Transfer' : 'Next Question'} 
                <ChevronRight size={28} />
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};