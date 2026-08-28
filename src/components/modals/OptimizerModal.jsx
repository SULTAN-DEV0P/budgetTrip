import React from 'react';
import { X, Sparkles, ArrowRight, Check, BedDouble, Utensils } from 'lucide-react';

export function OptimizerModal({
  isOpen,
  onClose,
  optimizationData,
  onApply,
}) {
  if (!isOpen || !optimizationData) return null;

  const { suggestions, totalPotentialSavings } = optimizationData;

  const handleApplyAll = () => {
    onApply(suggestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl border-t sm:border border-[#e4e1db] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e4e1db]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-800 text-base text-[#111110]">Budget Optimizer</h3>
              <p className="text-xs text-[#1f4a35] font-700">
                Potential Savings: ₦{totalPotentialSavings?.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0ece6] flex items-center justify-center text-[#8a8680] hover:text-[#111110] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-[#e8f0ec] rounded-xl p-3 border border-[#1f4a35]/15 text-xs text-[#1f4a35] font-500 leading-relaxed">
          We found higher-value alternative stays and dining spots that will instantly bring your trip back under budget without sacrificing quality!
        </div>

        {/* Suggestions List */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {suggestions?.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-[#e4e1db] bg-[#f5f2ed] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-700 uppercase tracking-wider text-[#1f4a35] flex items-center gap-1">
                  {item.type === 'hotel' ? <BedDouble size={13} /> : <Utensils size={13} />}
                  {item.type === 'hotel' ? 'Stay Swap' : 'Dining Swap'}
                </span>
                <span className="text-xs font-800 text-[#1f4a35] bg-white px-2 py-0.5 rounded-full border border-[#e4e1db]">
                  Save ₦{item.savings.toLocaleString()}
                </span>
              </div>

              {/* Swap Visual */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="max-w-[42%]">
                  <p className="text-[10px] text-[#8a8680] font-600 line-through">Current</p>
                  <p className="font-700 text-[#8a8680] truncate">{item.currentName}</p>
                  <p className="text-xs text-[#8a8680]">₦{item.currentPrice.toLocaleString()}</p>
                </div>

                <ArrowRight size={16} className="text-[#1f4a35] shrink-0" />

                <div className="max-w-[48%] text-right">
                  <p className="text-[10px] text-[#1f4a35] font-700">Recommended</p>
                  <p className="font-800 text-[#111110] truncate">{item.suggestedPlace.name}</p>
                  <p className="text-xs font-700 text-[#1f4a35]">
                    ₦{item.suggestedPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Apply CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleApplyAll}
            className="w-full bg-[#1f4a35] text-white rounded-xl py-3.5 font-700 text-sm active:opacity-90 transition-opacity cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Check size={16} strokeWidth={3} />
            <span>Apply All Optimizations (Save ₦{totalPotentialSavings?.toLocaleString()})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
