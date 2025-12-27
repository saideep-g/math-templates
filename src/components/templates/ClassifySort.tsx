import React, { useState, useEffect } from 'react';
import { type ClassifySortItem, type TemplateProps } from '../../types/itemTypes';
import { RotateCcw, X } from 'lucide-react';

/**
 * ClassifySort Interaction
 * 1. Allows users to select an item and then a bin to categorize it.
 * 2. Provides the ability to remove items from bins if a mistake is made.
 * 3. Includes a global reset to clear the entire sorting state.
 */
export const ClassifySort: React.FC<TemplateProps<ClassifySortItem>> = ({ item, onChangeLocal }) => {
  const { bins, items } = item.interaction.config;
  
  // mapping: { item_id: bin_id }
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Synchronize local mapping with the QuizRunner for scoring
  useEffect(() => {
    onChangeLocal?.(mapping);
  }, [mapping]);

  /**
   * handlePlace
   * Associates the currently selected item with a specific bin.
   * Resets the selection state after placement.
   */
  const handlePlace = (binId: string) => {
    if (!selectedItem) return;
    setMapping({ ...mapping, [selectedItem]: binId });
    setSelectedItem(null);
  };

  /**
   * handleRemove
   * Removes a specific item from the mapping, making it "available" again.
   * This prevents users from getting stuck if they misplace a card.
   */
  const handleRemove = (itemId: string, e: React.MouseEvent) => {
    // Stop propagation to prevent triggering the bin's onClick (handlePlace)
    e.stopPropagation();
    const newMapping = { ...mapping };
    delete newMapping[itemId];
    setMapping(newMapping);
  };

  /**
   * handleReset
   * Wipes all current placements and selections to start fresh.
   */
  const handleReset = () => {
    setMapping({});
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Draggable/Selectable Items Area */}
      <div className="flex flex-wrap gap-3 justify-center min-h-[60px]">
        {items.map(card => {
          const isPlaced = !!mapping[card.item_id];
          return (
            <button
              key={card.item_id}
              disabled={isPlaced}
              onClick={() => setSelectedItem(card.item_id)}
              className={`p-4 rounded-2xl border-2 font-semibold transition-all duration-200 ${
                isPlaced 
                  ? 'opacity-20 border-slate-100 bg-slate-50 grayscale cursor-not-allowed' 
                  : selectedItem === card.item_id 
                    ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-105 ring-2 ring-indigo-200' 
                    : 'border-slate-200 bg-white hover:border-indigo-300 shadow-sm hover:shadow-md'
              }`}
            >
              {card.label}
            </button>
          );
        })}
      </div>

      {/* Sorting Bins Grid */}
      <div className="grid grid-cols-2 gap-4">
        {bins.map(bin => {
          const placedItemsForThisBin = Object.keys(mapping).filter(k => mapping[k] === bin.bin_id);
          const placedCount = placedItemsForThisBin.length;
          
          return (
            <div 
              key={bin.bin_id}
              onClick={() => handlePlace(bin.bin_id)}
              className={`flex flex-col p-6 rounded-[2.5rem] border-2 min-h-[160px] transition-all cursor-pointer ${
                selectedItem 
                  ? 'border-indigo-400 bg-indigo-50/50 scale-[0.98] animate-pulse border-dashed' 
                  : 'border-slate-100 bg-slate-50/50'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-black text-slate-400 uppercase text-[10px] tracking-[0.15em]">{bin.label}</span>
                <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-black shadow-sm border border-indigo-50">
                  {placedCount}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {placedItemsForThisBin.map(itemId => (
                  <button
                    key={itemId}
                    onClick={(e) => handleRemove(itemId, e)}
                    className="group flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold shadow-sm hover:border-rose-300 hover:text-rose-600 transition-all animate-in zoom-in duration-200"
                    title="Click to remove"
                  >
                    {items.find(i => i.item_id === itemId)?.label}
                    <X size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {Object.keys(mapping).length > 0 && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 text-slate-400 font-black uppercase text-xs hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
          >
            <RotateCcw size={16} /> Reset All Sorting
          </button>
        </div>
      )}
    </div>
  );
};