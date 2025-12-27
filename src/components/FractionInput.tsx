import React, { useState, useEffect } from 'react';

interface FractionInputProps {
  value: string;
  onChange: (val: string) => void;
  type?: 'fraction' | 'fraction_or_mixed';
}

/**
 * FractionInput
 * Provides a structured UI for entering math fractions.
 * Handles internal state for whole, numerator, and denominator parts
 * and syncs them back to a single string for the scoring engine.
 */
export const FractionInput: React.FC<FractionInputProps> = ({ 
  value, 
  onChange, 
  type = 'fraction' 
}) => {
  const parseValue = (val: string) => {
    const parts = { whole: '', num: '', den: '' };
    if (!val) return parts;

    if (val.includes(' ')) {
      const [w, f] = val.split(' ');
      parts.whole = w;
      if (f?.includes('/')) {
        const [n, d] = f.split('/');
        parts.num = n;
        parts.den = d;
      }
    } 
    else if (val.includes('/')) {
      const [n, d] = val.split('/');
      parts.num = n;
      parts.den = d;
    } 
    else {
      parts.num = val;
    }
    return parts;
  };

  const [parts, setParts] = useState(parseValue(value));

  useEffect(() => {
    setParts(parseValue(value));
  }, [value]);

  const handlePartChange = (key: keyof typeof parts, val: string) => {
    const newParts = { ...parts, [key]: val };
    setParts(newParts);

    let combined = '';
    if (type === 'fraction_or_mixed' && newParts.whole) {
      combined = `${newParts.whole} ${newParts.num}/${newParts.den}`;
    } else if (newParts.num && newParts.den) {
      combined = `${newParts.num}/${newParts.den}`;
    } else {
      combined = newParts.num;
    }
    
    onChange(combined.trim());
  };

  const inputClass = "text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none font-black text-indigo-600 bg-white transition-all shadow-inner border-2 border-indigo-50 hover:border-indigo-200";

  return (
    <div className="flex items-center gap-2">
      {type === 'fraction_or_mixed' && (
        <div className="flex flex-col items-center gap-1">
          <input
            type="text"
            placeholder="0"
            className={`${inputClass} w-12 h-16 rounded-xl text-xl`}
            value={parts.whole}
            onChange={(e) => handlePartChange('whole', e.target.value)}
          />
          <span className="text-[8px] font-black text-slate-300 uppercase">Whole</span>
        </div>
      )}

      <div className="flex flex-col items-center gap-1">
        <input
          type="text"
          placeholder="n"
          className={`${inputClass} w-14 h-10 rounded-t-xl border-b-0 text-lg`}
          value={parts.num}
          onChange={(e) => handlePartChange('num', e.target.value)}
        />
        <div className="w-14 h-1 bg-indigo-200 rounded-full"></div>
        <input
          type="text"
          placeholder="d"
          className={`${inputClass} w-14 h-10 rounded-b-xl border-t-0 text-lg`}
          value={parts.den}
          onChange={(e) => handlePartChange('den', e.target.value)}
        />
      </div>
    </div>
  );
};