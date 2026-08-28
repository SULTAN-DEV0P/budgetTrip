import React, { useState, useMemo } from 'react';
import {
  Wallet,
  SlidersHorizontal,
  MapPin,
  Bookmark,
  Navigation,
  Search,
  X,
} from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { FilterModal } from '../modals/FilterModal';
import { AddToDayModal } from '../modals/AddToDayModal';
import { DESTINATIONS_DATA } from '../../data/mockDestinations';

export function ExploreScreen({
  setScreen,
  setDetailItem,
  currentTrip,
  savedPlaces = [],
  onToggleSave,
  onAddToTrip,
}) {
  const [activeCategory, setActiveCategory] = useState('stay'); // 'stay' | 'eat' | 'do'
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: Infinity,
    sortBy: 'recommended',
  });

  // Modal for adding a place to a specific day
  const [placeToAddToDay, setPlaceToAddToDay] = useState(null);

  const destinationKey = currentTrip?.destinationId || 'lagos';
  const destData = DESTINATIONS_DATA[destinationKey] || DESTINATIONS_DATA.lagos;

  const travelers = currentTrip?.travelers || 2;
  const days = currentTrip?.totalDays || 3;
  const nights = Math.max(1, days - 1);
  const totalBudget = currentTrip?.totalBudget || 150000;
  const estimatedCost = currentTrip?.breakdown?.totalEstimated || 127500;
  const remainingBudget = currentTrip?.breakdown?.remaining ?? (totalBudget - estimatedCost);
  const percentageUsed = currentTrip?.breakdown?.percentageUsed ?? ((estimatedCost / totalBudget) * 100);

  const isSaved = (id) => savedPlaces.some((p) => p.id === id);

  // Raw list for active category
  const rawPlaces = useMemo(() => {
    if (activeCategory === 'stay') return destData.hotels;
    if (activeCategory === 'eat') return destData.restaurants;
    return destData.activities;
  }, [activeCategory, destData]);

  // Filtered & Sorted list
  const filteredPlaces = useMemo(() => {
    let list = [...rawPlaces];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.location.neighborhood?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
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
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [rawPlaces, searchQuery, filters]);

  const handleCardClick = (place, type) => {
    setDetailItem({ ...place, itemType: type });
    setScreen('detail');
  };

  const handleConfirmAddToDay = (place, dayNum, slotTime) => {
    if (onAddToTrip) {
      onAddToTrip(place, dayNum, slotTime);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed]">
      {/* Top Header */}
      <div className="bg-white border-b border-[#e4e1db] px-5 pt-12 pb-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-800 text-[#111110]">
              Your {destData.name} trip
            </h1>
            <p className="text-xs text-[#8a8680] font-500 mt-0.5">
              {days} days · {travelers} {travelers > 1 ? 'travelers' : 'traveler'}
            </p>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 bg-[#e8f0ec] rounded-full px-3 py-1.5">
              <Wallet size={13} className="text-[#1f4a35]" />
              <span className="text-xs font-700 text-[#1f4a35]">
                ₦{totalBudget.toLocaleString()} budget
              </span>
            </div>
            <p className={`text-xs font-700 mt-1.5 ${remainingBudget < 0 ? 'text-[#c24a1e]' : 'text-[#1f4a35]'}`}>
              {remainingBudget < 0
                ? `₦${Math.abs(remainingBudget).toLocaleString()} over budget`
                : `₦${remainingBudget.toLocaleString()} remaining`}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-[#e4e1db] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              remainingBudget < 0 ? 'bg-[#c24a1e]' : 'bg-[#1f4a35]'
            }`}
            style={{ width: `${Math.min(100, percentageUsed)}%` }}
          />
        </div>

        {/* Search Bar & Filter Button */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8680]" />
            <input
              type="text"
              placeholder={`Search in ${destData.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f5f2ed] border border-[#e4e1db] rounded-xl pl-9 pr-8 py-2 text-xs text-[#111110] placeholder:text-[#8a8680] focus:outline-none focus:border-[#1f4a35]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8680] cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2.5 rounded-xl border border-[#e4e1db] bg-[#f5f2ed] text-[#111110] hover:border-[#1f4a35] transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={15} className="text-[#1f4a35]" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-6 pt-1">
          {[
            { id: 'stay', label: 'Stay' },
            { id: 'eat', label: 'Eat' },
            { id: 'do', label: 'Things To Do' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`text-sm font-700 pb-1.5 border-b-2 transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'border-[#1f4a35] text-[#1f4a35]'
                  : 'border-transparent text-[#8a8680] hover:text-[#111110]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Place List Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 space-y-4 pt-3">
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="font-700 text-sm text-[#111110]">No places match your filter</p>
            <p className="text-xs text-[#8a8680]">Try adjusting your search query or price filters.</p>
          </div>
        ) : (
          filteredPlaces.map((place) => {
            const saved = isSaved(place.id);
            const isHotel = activeCategory === 'stay';
            const isRestaurant = activeCategory === 'eat';

            if (isHotel) {
              const totalForStay = place.estimatedPrice * nights;
              return (
                <div
                  key={place.id}
                  onClick={() => handleCardClick(place, 'hotel')}
                  className="bg-white rounded-[16px] border border-[#e4e1db] overflow-hidden cursor-pointer hover:border-[#1f4a35]/40 transition-all shadow-sm"
                >
                  <div className="relative h-48 bg-[#e8f0ec]">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleSave) onToggleSave(place);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <Bookmark
                        size={15}
                        fill={saved ? '#1f4a35' : 'none'}
                        className="text-[#1f4a35]"
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="font-700 text-[#111110] text-base">{place.name}</h3>
                      <RatingStars rating={place.rating} />
                    </div>

                    <div className="flex items-center gap-1 text-[#8a8680] mb-3">
                      <MapPin size={12} />
                      <span className="text-xs font-500">
                        {place.location.neighborhood || place.location.address} · {place.distanceKm || 2.4} km away
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xl font-800 text-[#111110]">
                          ₦{place.estimatedPrice.toLocaleString()}
                          <span className="text-sm font-500 text-[#8a8680]"> / night</span>
                        </p>
                        <p className="text-xs text-[#8a8680] font-500">
                          ₦{totalForStay.toLocaleString()} estimated total
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlaceToAddToDay(place);
                        }}
                        className="bg-[#1f4a35] text-white rounded-xl px-5 py-2.5 text-sm font-700 cursor-pointer active:opacity-90 transition-opacity"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            if (isRestaurant) {
              const totalForTravelers = place.estimatedPrice * travelers;
              return (
                <div
                  key={place.id}
                  onClick={() => handleCardClick(place, 'restaurant')}
                  className="bg-white rounded-[16px] border border-[#e4e1db] overflow-hidden cursor-pointer hover:border-[#1f4a35]/40 transition-all shadow-sm"
                >
                  <div className="relative h-40 bg-[#e8f0ec]">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleSave) onToggleSave(place);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <Bookmark
                        size={15}
                        fill={saved ? '#1f4a35' : 'none'}
                        className="text-[#1f4a35]"
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-700 text-[#111110] text-base">{place.name}</h3>
                      <RatingStars rating={place.rating} />
                    </div>

                    <p className="text-xs text-[#8a8680] font-500 mb-3">
                      {place.category} · {place.location.neighborhood || place.location.address}
                    </p>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xl font-800 text-[#111110]">
                          ₦{place.estimatedPrice.toLocaleString()}
                          <span className="text-sm font-500 text-[#8a8680]"> / person</span>
                        </p>
                        <p className="text-xs text-[#8a8680] font-500">
                          ≈ ₦{totalForTravelers.toLocaleString()} for {travelers}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlaceToAddToDay(place);
                        }}
                        className="bg-[#1f4a35] text-white rounded-xl px-5 py-2.5 text-sm font-700 cursor-pointer active:opacity-90 transition-opacity"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // ACTIVITIES
            return (
              <div
                key={place.id}
                onClick={() => handleCardClick(place, 'activity')}
                className="bg-white rounded-[16px] border border-[#e4e1db] overflow-hidden flex cursor-pointer hover:border-[#1f4a35]/40 transition-all shadow-sm"
              >
                <div className="relative w-28 flex-shrink-0 bg-[#e8f0ec]">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-700 text-sm text-[#111110] leading-snug">
                        {place.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleSave) onToggleSave(place);
                        }}
                        className="cursor-pointer"
                      >
                        <Bookmark
                          size={14}
                          fill={saved ? '#1f4a35' : 'none'}
                          className="text-[#1f4a35]"
                        />
                      </button>
                    </div>

                    <RatingStars rating={place.rating} />

                    <p className="text-xs text-[#8a8680] font-500 mt-1 mb-2">
                      {place.category} · {place.location.neighborhood || place.location.address}
                    </p>
                  </div>

                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <p className="font-800 text-base text-[#111110]">
                        ₦{place.estimatedPrice.toLocaleString()}
                        <span className="text-xs font-500 text-[#8a8680]"> / person</span>
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Navigation size={10} className="text-[#8a8680]" />
                        <span className="text-xs text-[#8a8680] font-500">
                          {place.distanceKm || 3.0} km away
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlaceToAddToDay(place);
                      }}
                      className="bg-[#1f4a35] text-white rounded-lg px-3 py-1.5 text-xs font-700 cursor-pointer active:opacity-90 transition-opacity"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />

      {/* Add To Day Modal */}
      <AddToDayModal
        isOpen={!!placeToAddToDay}
        onClose={() => setPlaceToAddToDay(null)}
        place={placeToAddToDay}
        totalDays={days}
        onConfirmAdd={handleConfirmAddToDay}
      />
    </div>
  );
}
