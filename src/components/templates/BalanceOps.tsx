import React, { useState, useEffect } from 'react';
import { type BalanceOpsItem, type TemplateProps } from '../../types/itemTypes';
import { RotateCcw } from 'lucide-react';

/**
 * BalanceOps Interaction (CBSE Ch 4 Equations)
 * 1. Handles positive and negative constants and simplifies display sign (e.g., handles "4x - 7").
 * 2. Communicates numeric results and isolation state back to QuizRunner.
 */
export const BalanceOps: React.FC<TemplateProps<BalanceOpsItem>> = ({ item, onChangeLocal }) => {
  const config = item.interaction.config;
  
  // Track state with numeric values to handle algebra logic correctly
  const [leftCoefficient, setLeftCoefficient] = useState(config.equation.left.a);
  const [leftConstant, setLeftConstant] = useState(config.equation.left.b);
  const [currentRight, setCurrentRight] = useState(config.equation.right.value);
  
  const [history, setHistory] = useState<{ op_id: string; label: string }[]>([]);
  const [isolated, setIsolated] = useState(false);
  const [isDivided, setIsDivided] = useState(false);

  // Initialize/Reset state when the item changes
  useEffect(() => {
    setLeftCoefficient(config.equation.left.a);
    setLeftConstant(config.equation.left.b);
    setCurrentRight(config.equation.right.value);
    setHistory([]);
    setIsolated(false);
    setIsDivided(false);
  }, [item.item_id]);

  /**
   * Helper to format the left side of the equation.
   * Logic ensures that negative constants display as "4x - 7" rather than "4x + -7".
   */
  const formatLeftLabel = () => {
    if (isDivided) return config.equation.left.variable;

    const varPart = leftCoefficient === 1 
      ? config.equation.left.variable 
      : `${leftCoefficient}${config.equation.left.variable}`;
    
    // Check for zero with float precision tolerance
    if (Math.abs(leftConstant) < 0.0001) return varPart;
    
    const sign = leftConstant > 0 ? "+" : "-";
    return `${varPart} ${sign} ${Math.abs(leftConstant)}`;
  };

  const applyOp = (op: any) => {
    const newHistory = [...history, op];
    setHistory(newHistory);

    if (op.op_id === 'SUBTRACT') {
      setLeftConstant(prev => prev - op.value);
      setCurrentRight(prev => prev - op.value);
    }
    
    if (op.op_id === 'ADD') {
      setLeftConstant(prev => prev + op.value);
      setCurrentRight(prev => prev + op.value);
    }
    
    if (op.op_id === 'DIVIDE') {
      // Isolation check: only allow successful isolation if constant is 0
      if (Math.abs(leftConstant) < 0.0001 && Math.abs(op.value - leftCoefficient) < 0.0001) {
        setLeftCoefficient(1);
        setIsDivided(true);
        setIsolated(true);
      }
      setCurrentRight(prev => prev / op.value);
    }
    
    if (op.op_id === 'MULTIPLY') {
      setLeftCoefficient(prev => prev * op.value);
      setLeftConstant(prev => prev * op.value);
      setCurrentRight(prev => prev * op.value);
    }
  };

  // Synchronize internal state with the QuizRunner
  useEffect(() => {
    onChangeLocal?.({ 
      history, 
      currentX: isolated ? currentRight : null, 
      isolated,
      leftConstant,
      leftCoefficient
    });
  }, [history, currentRight, leftConstant, leftCoefficient, isolated, isDivided]);

  return (
    <div className="flex flex-col items-center py-4 w-full">
      <div className="flex items-center gap-12 mb-16 w-full justify-center">
        <div className="flex flex-col items-center">
          <div className="p-8 bg-indigo-50 border-4 border-indigo-100 rounded-[2.5rem] text-3xl font-black text-indigo-900 min-w-[220px] text-center shadow-inner transition-all duration-300">
            {formatLeftLabel()}
          </div>
          <div className="w-40 h-3 bg-slate-200 rounded-full mt-4"></div>
        </div>
        
        <div className="text-5xl font-black text-slate-200 select-none">=</div>

        <div className="flex flex-col items-center">
          <div className="p-8 bg-indigo-50 border-4 border-indigo-100 rounded-[2.5rem] text-3xl font-black text-indigo-900 min-w-[160px] text-center shadow-inner transition-all duration-300">
            {/* Round to 2 decimal places if not an integer, otherwise show clean number */}
            {Number.isInteger(currentRight) ? currentRight : Math.round(currentRight * 100) / 100}
          </div>
          <div className="w-40 h-3 bg-slate-200 rounded-full mt-4"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-md">
        {config.operations.map(op => (
          <button
            key={op.op_id}
            onClick={() => applyOp(op)}
            className="flex items-center justify-center p-6 bg-white border-2 border-slate-100 rounded-3xl font-black text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
          >
            {op.label} <span className="ml-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Both Sides</span>
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-10 w-full flex justify-between items-center px-6">
          <div className="flex gap-2 flex-wrap max-w-[70%]">
            {history.map((h, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase">
                {h.label}
              </span>
            ))}
          </div>
          <button 
            onClick={() => { 
              setLeftCoefficient(config.equation.left.a);
              setLeftConstant(config.equation.left.b);
              setCurrentRight(config.equation.right.value);
              setHistory([]);
              setIsolated(false);
              setIsDivided(false);
            }}
            className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-rose-500 transition-colors"
          >
            <RotateCcw size={16} /> Reset Equation
          </button>
        </div>
      )}
    </div>
  );
};