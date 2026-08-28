import React from 'react';
import { Star, MapPin, X, Bookmark, BookmarkCheck, CalendarPlus } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export function PlaceDetailModal({ place, isOpen, onClose, onToggleSave, isSaved, onAddToTrip, currency }) {
  if (!isOpen || !place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#e4e1db] shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cover Photo */}
        <div className="relative h-56 bg-slate-900 overflow-hidden">
          <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-700 uppercase tracking-wider bg-[#1f4a35] text-white px-2 py-0.5 rounded-md">
                {place.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>{place.rating?.toFixed(1)}</span>
                {place.reviewCount && <span className="text-white/70 font-normal">({place.reviewCount} reviews)</span>}
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-800 text-white leading-tight drop-shadow-sm">{place.name}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex items-start gap-1.5 text-xs text-[#8a8680]">
            <MapPin size={14} className="text-[#1f4a35] shrink-0 mt-0.5" />
            <span>{place.location?.address} {place.location?.neighborhood ? `(${place.location.neighborhood})` : ''}</span>
          </div>

          {place.tags && (
            <div className="flex flex-wrap gap-1.5">
              {place.tags.map((tag) => (
                <span key={tag} className="text-[11px] font-600 px-2.5 py-0.5 rounded-lg bg-[#f0ece6] text-[#111110]">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs sm:text-sm text-[#111110] leading-relaxed">
            {place.description}
          </p>

          {/* Pricing Highlight */}
          <div className="p-3.5 rounded-2xl bg-[#fbf9f6] border border-[#e4e1db] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-700 uppercase tracking-wider text-[#8a8680] block">Estimated Rate</span>
              <div className="text-base font-800 text-[#1f4a35]">
                {place.estimatedPrice === 0 ? 'Free Entry' : formatCurrency(place.estimatedPrice, currency || place.currency)}
                <span className="text-xs font-500 text-[#8a8680] ml-1">/ {place.priceUnit}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-700 uppercase tracking-wider text-[#8a8680] block">Price Level</span>
              <div className="text-xs font-800 text-[#111110]">
                {'$'.repeat(place.priceLevel || 2)} ({place.priceLevel <= 2 ? 'Budget-Friendly' : 'Premium'})
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={() => onToggleSave(place)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-700 border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#e8f0ec] text-[#1f4a35] border-[#1f4a35]'
                  : 'bg-white text-[#111110] border-[#e4e1db] hover:border-[#8a8680]'
              }`}
            >
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              <span>{isSaved ? 'Bookmarked' : 'Save to Wishlist'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onAddToTrip(place);
              }}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-700 bg-[#1f4a35] text-white flex items-center justify-center gap-2 transition-all hover:bg-[#183a2a] cursor-pointer shadow-sm"
            >
              <CalendarPlus size={16} />
              <span>Add to Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
