import React, { useState, useEffect } from 'react';
import { type ClassifySortItem, type TemplateProps } from '../../types/itemTypes';

export const ClassifySort: React.FC<TemplateProps<ClassifySortItem>> = ({ item, onChangeLocal }) => {
  const { bins, items } = item.interaction.config;
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    onChangeLocal?.(mapping);
  }, [mapping]);

  const handlePlace = (binId: string) => {
    if (!selectedItem) return;
    setMapping({ ...mapping, [selectedItem]: binId });
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Draggable/Selectable Items */}
      <div className="flex flex-wrap gap-3 justify-center">
        {items.map(card => {
          const isPlaced = !!mapping[card.item_id];
          return (
            <button
              key={card.item_id}
              disabled={isPlaced}
              onClick={() => setSelectedItem(card.item_id)}
              className={`p-4 rounded-2xl border-2 font-semibold transition-all ${
                isPlaced ? 'opacity-30 border-slate-100' : 
                selectedItem === card.item_id ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-105' : 
                'border-slate-200 bg-white hover:border-indigo-300 shadow-sm'
              }`}
            >
              {card.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {bins.map(bin => {
          const placedCount = Object.values(mapping).filter(v => v === bin.bin_id).length;
          return (
            <div 
              key={bin.bin_id}
              onClick={() => handlePlace(bin.bin_id)}
              className={`flex flex-col p-6 rounded-3xl border-2 min-h-[140px] transition-all cursor-pointer ${
                selectedItem ? 'border-indigo-400 bg-indigo-50/50 scale-95 animate-pulse' : 'border-slate-100 bg-slate-50/50'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-500 uppercase text-xs tracking-widest">{bin.label}</span>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg text-xs font-bold">{placedCount}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(mapping).filter(k => mapping[k] === bin.bin_id).map(k => (
                  <div key={k} className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium shadow-sm">
                    {items.find(i => i.item_id === k)?.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};