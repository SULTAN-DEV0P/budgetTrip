import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  MapPin,
  Bookmark,
  Search,
  X,
  Bed,
  Utensils,
  Compass,
  Plus,
} from 'lucide-react';
import { FilterModal } from '../modals/FilterModal';
import { AddToDayModal } from '../modals/AddToDayModal';
import { formatCurrency } from '../../utils/currency';

export function ExploreScreen({
  setDetailItem,
  currentTrip,
  placesCatalog = [],
  savedPlaces = [],
  onToggleSave,
  onAddToTrip,
  onOpenDestinationPicker,
}) {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'stay' | 'eat' | 'do'
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: Infinity,
    sortBy: 'recommended',
  });

  // Modal for adding a place to a specific day
  const [placeToAddToDay, setPlaceToAddToDay] = useState(null);

  const cur = currentTrip?.currency || 'USD';
  const isSaved = (id) => savedPlaces.some((p) => p.id === id);

  // Filtered & Sorted list
  const filteredPlaces = useMemo(() => {
    let list = [...placesCatalog];

    // Category filter
    if (activeCategory === 'stay') {
      list = list.filter((p) => p.type === 'hotel');
    } else if (activeCategory === 'eat') {
      list = list.filter((p) => p.type === 'restaurant');
    } else if (activeCategory === 'do') {
      list = list.filter((p) => p.type === 'activity');
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.location?.neighborhood?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      list = list.filter((p) => (p.rating || 4.5) >= filters.minRating);
    }

    // Price filter
    if (filters.maxPrice < Infinity) {
      list = list.filter((p) => p.estimatedPrice <= filters.maxPrice);
    }

    // Sort
    if (filters.sortBy === 'price_low') {
      list.sort((a, b) => a.estimatedPrice - b.estimatedPrice);
    } else if (filters.sortBy === 'price_high') {
      list.sort((a, b) => b.estimatedPrice - a.estimatedPrice);
    } else if (filters.sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [placesCatalog, activeCategory, searchQuery, filters]);

  const handleCardClick = (place) => {
    if (setDetailItem) {
      setDetailItem(place);
    }
  };

  const handleConfirmAddToDay = (place, dayNum, slotTime) => {
    if (onAddToTrip) {
      onAddToTrip(place, dayNum, slotTime);
    }
    setPlaceToAddToDay(null);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8f7f4]">
      {/* Sticky Header */}
      <header className="px-5 pt-12 pb-3 bg-white border-b border-[#ebe8e2] sticky top-0 z-20 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-800 text-[#111110] tracking-tight">Explore Places</h1>
            <p className="text-xs text-[#8a8680] font-500">
              Top curated stays, food & activities in {currentTrip?.destinationName || 'your city'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenDestinationPicker}
            className="text-xs font-700 text-[#1f4a35] bg-[#e8f0ec] hover:bg-[#d8e6df] px-3 py-1.5 rounded-full transition-all cursor-pointer"
          >
            Switch City
          </button>
        </div>

        {/* Search Bar & Filter Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8680]" />
            <input
              type="text"
              placeholder={`Search in ${currentTrip?.destinationName || 'destination'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f5f2ed] border border-[#e4e1db] rounded-xl pl-9 pr-8 py-2.5 text-[16px] sm:text-xs text-[#111110] placeholder:text-[#8a8680] focus:outline-none focus:border-[#1f4a35]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8680] cursor-pointer p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2.5 bg-[#f5f2ed] border border-[#e4e1db] rounded-xl text-[#111110] hover:border-[#1f4a35] transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Spots', icon: null },
            { id: 'stay', label: 'Stays', icon: Bed },
            { id: 'eat', label: 'Dining', icon: Utensils },
            { id: 'do', label: 'Sights', icon: Compass },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveCategory(id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-700 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeCategory === id
                  ? 'bg-[#1f4a35] text-white shadow-xs'
                  : 'bg-[#f5f2ed] text-[#8a8680] border border-[#e4e1db] hover:border-[#8a8680]'
              }`}
            >
              {Icon && <Icon size={13} />}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Place Cards List */}
      <main className="flex-1 px-5 pt-4 pb-28 space-y-4">
        {filteredPlaces.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#e4e1db] space-y-2 mt-4">
            <Compass size={32} className="mx-auto text-[#8a8680]" />
            <h3 className="font-800 text-sm text-[#111110]">No places found</h3>
            <p className="text-xs text-[#8a8680]">Try searching another keyword or clearing filters.</p>
          </div>
        ) : (
          filteredPlaces.map((place) => {
            const saved = isSaved(place.id);
            const isHotel = place.type === 'hotel';

            return (
              <div
                key={place.id}
                className="bg-white rounded-3xl border border-[#e4e1db] overflow-hidden shadow-xs hover:shadow-md transition-all group"
              >
                {/* Photo Header */}
                <div
                  onClick={() => handleCardClick(place)}
                  className="relative h-44 overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-800 uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {place.category}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleSave) onToggleSave(place);
                    }}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                      saved
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-black/50 text-white hover:bg-black/80'
                    }`}
                  >
                    <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                  </button>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                    <h3 className="font-800 text-base leading-tight drop-shadow-sm truncate">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                      <span className="text-amber-300 font-bold flex items-center gap-0.5">
                        ★ {place.rating?.toFixed(1) || '4.8'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin size={12} />
                        {place.location?.neighborhood || 'City Center'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body & Quick Actions */}
                <div className="p-4 flex items-center justify-between gap-3 bg-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8a8680] block">
                      {isHotel ? 'Per Night' : 'Per Person'}
                    </span>
                    <div className="text-sm font-800 text-[#1f4a35]">
                      {formatCurrency(place.estimatedPrice, cur)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPlaceToAddToDay(place)}
                    className="px-4 py-2 bg-[#1f4a35] hover:bg-[#163526] text-white rounded-xl text-xs font-800 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus size={14} />
                    <span>Add to Trip</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        maxPriceLimit={500000}
      />

      {/* Add To Day Modal */}
      {placeToAddToDay && (
        <AddToDayModal
          isOpen={!!placeToAddToDay}
          onClose={() => setPlaceToAddToDay(null)}
          place={placeToAddToDay}
          totalDays={currentTrip?.totalDays || 3}
          onConfirm={handleConfirmAddToDay}
        />
      )}
    </div>
  );
}
