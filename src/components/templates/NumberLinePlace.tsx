import React, { useState, useEffect } from 'react';
import { type NumberLineItem, type TemplateProps } from '../../types/itemTypes';

export const NumberLinePlace: React.FC<TemplateProps<NumberLineItem>> = ({ item, onChangeLocal }) => {
  const { min, max, snap } = item.interaction.config.number_line;
  const start = item.interaction.config.start_marker;
  const [position, setPosition] = useState(start);

  useEffect(() => {
    onChangeLocal?.(position);
  }, [position]);

  const ticks = [];
  for (let i = min; i <= max; i++) ticks.push(i);

  return (
    <div className="py-16 px-4">
      <div className="relative h-2 bg-slate-200 rounded-full">
        {/* Ticks */}
        <div className="absolute inset-0 flex justify-between px-[-4px]">
          {ticks.map(t => (
            <div key={t} className="relative h-4 w-0.5 bg-slate-300 mt-[-4px]">
              {t % 5 === 0 && (
                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">
                  {t}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Start Dot */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-400 rounded-full"
          style={{ left: `${((start - min) / (max - min)) * 100}%` }}
        ></div>

        {/* Interactive Handle */}
        <input 
          type="range"
          min={min}
          max={max}
          step={snap}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-2 bg-transparent appearance-none cursor-pointer accent-indigo-600 z-10"
        />
      </div>

      <div className="mt-20 text-center">
        <div className="inline-block px-10 py-6 bg-indigo-600 text-white rounded-[2rem] text-5xl font-black shadow-xl shadow-indigo-100">
          {position}
        </div>
      </div>
    </div>
  );
};