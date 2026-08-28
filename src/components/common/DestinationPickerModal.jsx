import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Globe, Check, Sparkles } from 'lucide-react';
import { worldCatalogService } from '../../services/worldCatalogService';
import { ALL_WORLD_DESTINATIONS } from '../../data/allWorldDestinations';
import { formatCurrency, convertCurrency } from '../../utils/currency';

export function DestinationPickerModal({ isOpen, onClose, onSelectDestination, currentDestinationId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [onlineDestinations, setOnlineDestinations] = useState(null);
  const inputRef = useRef(null);

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Auto-focus input smoothly on mobile without viewport jump
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus({ preventScroll: true });
        }
      }, 100);

      return () => {
        document.body.style.overflow = prevOverflow;
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  // Instant local filtering with ranking
  const localFiltered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_WORLD_DESTINATIONS.filter((d) => {
      const matchesContinent =
        selectedContinent === 'All' || d.continent.toLowerCase() === selectedContinent.toLowerCase();
      if (!matchesContinent) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        (d.tag && d.tag.toLowerCase().includes(q))
      );
    }).sort((a, b) => {
      if (!q) return 0;
      const aStarts = a.city.toLowerCase().startsWith(q) || a.country.toLowerCase().startsWith(q);
      const bStarts = b.city.toLowerCase().startsWith(q) || b.country.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
  }, [searchQuery, selectedContinent]);

  // Debounced online fallback search for any city/country worldwide
  useEffect(() => {
    if (!isOpen || !searchQuery.trim() || localFiltered.length > 0) {
      return;
    }

    const handler = setTimeout(() => {
      let isMounted = true;
      worldCatalogService.searchDestinations(searchQuery, selectedContinent).then((results) => {
        if (isMounted) {
          setOnlineDestinations(results);
        }
      });
      return () => {
        isMounted = false;
      };
    }, 250);

    return () => clearTimeout(handler);
  }, [isOpen, searchQuery, selectedContinent, localFiltered.length]);

  if (!isOpen) return null;

  const destinations =
    onlineDestinations !== null && localFiltered.length === 0 && searchQuery.trim()
      ? onlineDestinations
      : localFiltered;

  const continents = ['All', 'Africa', 'Europe', 'Asia', 'Americas', 'Middle East'];

  const handlePick = (dest) => {
    onSelectDestination(dest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#f5f2ed] rounded-t-3xl sm:rounded-2xl border border-[#e4e1db] shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col overscroll-contain">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e4e1db] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1f4a35] text-white flex items-center justify-center shadow-xs">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="font-800 text-base text-[#111110]">Choose Any Destination</h3>
              <p className="text-xs text-[#8a8680]">Find any country or city worldwide</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-[#8a8680] hover:text-[#111110] rounded-full hover:bg-[#f5f2ed] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Continent Filters */}
        <div className="p-4 space-y-3 bg-white/80 border-b border-[#e4e1db] shrink-0">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-[#8a8680] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              inputMode="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              autoCapitalize="none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ANY city or country (e.g. Ibadan, Paris, Tokyo)..."
              className="w-full text-[16px] sm:text-xs font-600 pl-10 pr-10 py-2.5 rounded-xl border border-[#e4e1db] bg-white text-[#111110] placeholder-[#8a8680] focus:outline-none focus:border-[#1f4a35] focus:ring-1 focus:ring-[#1f4a35]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-[#8a8680] hover:text-[#111110] cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {continents.map((continent) => (
              <button
                key={continent}
                type="button"
                onClick={() => setSelectedContinent(continent)}
                className={`px-3 py-1.5 rounded-full text-xs font-700 whitespace-nowrap transition-all cursor-pointer ${
                  selectedContinent === continent
                    ? 'bg-[#1f4a35] text-white shadow-xs'
                    : 'bg-white text-[#8a8680] border border-[#e4e1db] hover:border-[#8a8680]'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>

        {/* Destination List (Isolated touch scrolling) */}
        <div className="p-4 overflow-y-auto space-y-2.5 max-h-[55vh] overscroll-contain touch-pan-y flex-1">
          {destinations.length === 0 ? (
            <div className="space-y-3 py-2">
              <div className="p-4 rounded-2xl bg-[#e8f0ec] border border-[#1f4a35]/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-[#1f4a35] font-800 text-xs">
                  <Sparkles size={16} />
                  <span>Explore "{searchQuery}" Worldwide</span>
                </div>
                <p className="text-xs text-[#111110]">
                  Generate a budget itinerary with real-world places, local currency, and sights for <strong>{searchQuery}</strong>!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const customDest = {
                      id: searchQuery.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                      name: searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1),
                      city: searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1),
                      country: searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1),
                      continent: selectedContinent !== 'All' ? selectedContinent : 'Africa',
                      flag: '🌍',
                      currency: 'USD',
                      priceIndexUSD: 70,
                      tag: 'Custom Worldwide Destination',
                      category: 'Popular',
                      img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&auto=format',
                      description: `Explore authentic venues, sights, and dining in ${searchQuery}.`,
                    };
                    handlePick(customDest);
                  }}
                  className="w-full py-3 bg-[#1f4a35] text-white rounded-xl font-800 text-xs hover:bg-[#163526] transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  ✨ Travel to "{searchQuery}"
                </button>
              </div>
            </div>
          ) : (
            destinations.map((dest) => {
              const isSelected = currentDestinationId === dest.id;
              const localPrice = convertCurrency(dest.priceIndexUSD || 70, 'USD', dest.currency || 'USD');

              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handlePick(dest)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs group active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#e8f0ec] border-[#1f4a35] ring-1 ring-[#1f4a35]'
                      : 'bg-white border-[#e4e1db] hover:border-[#1f4a35] active:bg-[#f5f2ed]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pointer-events-none">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                      <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-1 right-1 text-xs">{dest.flag}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-800 text-sm text-[#111110] group-hover:text-[#1f4a35] truncate">
                          {dest.city}, {dest.country}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#8a8680] truncate mt-0.5">{dest.tag}</p>
                      <span className="text-[10px] font-700 uppercase tracking-wider text-[#1f4a35] bg-[#e8f0ec] px-1.5 py-0.2 rounded mt-1 inline-block">
                        Currency: {dest.currency}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pointer-events-none">
                    <div className="text-xs font-800 text-[#111110]">
                      {formatCurrency(localPrice, dest.currency || 'USD')}
                    </div>
                    <span className="text-[10px] text-[#8a8680]">/ day est.</span>
                    {isSelected && (
                      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-[#1f4a35]">
                        <Check size={12} /> Active
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
