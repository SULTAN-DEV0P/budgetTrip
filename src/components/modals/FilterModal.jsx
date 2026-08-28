import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Star, Check } from 'lucide-react';

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}) {
  const [minRating, setMinRating] = useState(filters?.minRating || 0);
  const [maxPrice, setMaxPrice] = useState(filters?.maxPrice || Infinity);
  const [sortBy, setSortBy] = useState(filters?.sortBy || 'recommended');

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({ minRating, maxPrice, sortBy });
    onClose();
  };

  const handleReset = () => {
    setMinRating(0);
    setMaxPrice(Infinity);
    setSortBy('recommended');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 space-y-5 shadow-2xl border-t sm:border border-[#e4e1db] overscroll-contain touch-pan-y animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e4e1db]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#1f4a35]" />
            <h3 className="font-800 text-base text-[#111110]">Filter & Sort</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0ece6] flex items-center justify-center text-[#8a8680] hover:text-[#111110] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sort Options */}
        <div className="space-y-2">
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680]">
            Sort By
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'recommended', label: 'Best Match' },
              { id: 'price_low', label: 'Cheapest First' },
              { id: 'price_high', label: 'Highest Price' },
              { id: 'rating', label: 'Highest Rated' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSortBy(option.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-700 border transition-all text-left flex items-center justify-between cursor-pointer ${
                  sortBy === option.id
                    ? 'bg-[#e8f0ec] border-[#1f4a35] text-[#1f4a35]'
                    : 'bg-[#f5f2ed] border-[#e4e1db] text-[#111110]'
                }`}
              >
                <span>{option.label}</span>
                {sortBy === option.id && <Check size={14} className="text-[#1f4a35]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="space-y-2">
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680]">
            Minimum Rating
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: 0, label: 'Any' },
              { val: 4.0, label: '4.0+' },
              { val: 4.5, label: '4.5+' },
              { val: 4.7, label: '4.7+' },
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                onClick={() => setMinRating(r.val)}
                className={`py-2 rounded-xl text-xs font-700 border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  minRating === r.val
                    ? 'bg-[#1f4a35] text-white border-[#1f4a35]'
                    : 'bg-[#f5f2ed] text-[#111110] border-[#e4e1db]'
                }`}
              >
                {r.val > 0 && <Star size={12} className={minRating === r.val ? 'fill-white' : 'fill-[#1f4a35] text-[#1f4a35]'} />}
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Maximum Price Filter */}
        <div className="space-y-2">
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680]">
            Max Price Per Unit
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: Infinity, label: 'Any' },
              { val: 10000, label: '≤ ₦10k' },
              { val: 30000, label: '≤ ₦30k' },
              { val: 60000, label: '≤ ₦60k' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setMaxPrice(p.val)}
                className={`py-2 rounded-xl text-xs font-700 border transition-all cursor-pointer ${
                  maxPrice === p.val
                    ? 'bg-[#1f4a35] text-white border-[#1f4a35]'
                    : 'bg-[#f5f2ed] text-[#111110] border-[#e4e1db]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3.5 rounded-xl border border-[#e4e1db] text-xs font-700 text-[#8a8680] hover:text-[#111110] cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-2 bg-[#1f4a35] text-white rounded-xl py-3.5 font-700 text-sm active:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
