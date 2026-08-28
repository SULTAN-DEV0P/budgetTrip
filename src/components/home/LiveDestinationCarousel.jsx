import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { WORLD_DESTINATIONS } from '../../services/destinationService';
import { formatCurrency, convertCurrency } from '../../utils/currency';

export function LiveDestinationCarousel({ onSelectDestination }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  const categories = ['All', 'Popular', 'Budget', 'Luxury', 'Tropical', 'Cultural'];

  const filteredDestinations = WORLD_DESTINATIONS.filter((d) => {
    if (activeCategory === 'All') return true;
    return d.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // Auto-scroll loop effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused, filteredDestinations]);

  const handleManualScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-700 uppercase tracking-wider text-[#1f4a35]">
            <span className="w-2 h-2 rounded-full bg-[#1f4a35] animate-ping" />
            <span>Live World Suggestions</span>
          </div>
          <h2 className="text-base font-800 text-[#111110]">Popular Global Escapes</h2>
        </div>

        {/* Scroll Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleManualScroll('left')}
            className="w-8 h-8 rounded-full bg-white border border-[#e4e1db] hover:border-[#1f4a35] text-[#111110] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => handleManualScroll('right')}
            className="w-8 h-8 rounded-full bg-white border border-[#e4e1db] hover:border-[#1f4a35] text-[#111110] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-700 whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#1f4a35] text-white shadow-xs'
                : 'bg-white text-[#8a8680] border border-[#e4e1db] hover:border-[#8a8680]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Moving Carousel Container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex gap-3.5 overflow-x-auto no-scrollbar py-1 snap-x snap-mandatory"
      >
        {filteredDestinations.map((dest) => {
          const localPrice = convertCurrency(dest.priceIndexUSD, 'USD', dest.currency);

          return (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="flex-shrink-0 w-[240px] sm:w-[260px] bg-white rounded-2xl border border-[#e4e1db] hover:border-[#1f4a35] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden group snap-start relative flex flex-col"
            >
              {/* Moving Image Container with Ken Burns Parallax effect */}
              <div className="relative h-36 overflow-hidden bg-slate-900">
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Country Flag & Tag */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-base px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 shadow-xs">
                    {dest.flag}
                  </span>
                  <span className="text-[10px] font-700 uppercase tracking-wider text-white bg-[#1f4a35]/90 backdrop-blur-xs px-2 py-0.5 rounded-md">
                    {dest.continent}
                  </span>
                </div>

                {/* City and Country title */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-800 text-base leading-tight drop-shadow-sm flex items-center gap-1">
                    <span>{dest.city}</span>
                    <span className="text-xs font-500 opacity-90">, {dest.country}</span>
                  </h3>
                  <p className="text-[11px] text-white/80 font-500 truncate mt-0.5">{dest.tag}</p>
                </div>
              </div>

              {/* Card Footer with Live Price and CTA */}
              <div className="p-3 flex items-center justify-between gap-2 flex-1 bg-white">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8a8680] block">Est. Daily Budget</span>
                  <div className="text-xs font-800 text-[#1f4a35]">
                    {formatCurrency(localPrice, dest.currency)} <span className="text-[10px] font-500 text-[#8a8680]">/ day</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-[#e8f0ec] text-[#1f4a35] group-hover:bg-[#1f4a35] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
