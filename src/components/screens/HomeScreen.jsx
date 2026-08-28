import React from 'react';
import {
  Compass,
  ArrowRight,
  Globe2,
  Calendar,
  Wallet,
  Search,
  PlusCircle,
  Bookmark,
} from 'lucide-react';
import { LiveDestinationCarousel } from '../home/LiveDestinationCarousel';
import { CountryEssentialsCard } from '../home/CountryEssentialsCard';
import { WORLD_DESTINATIONS } from '../../services/destinationService';
import { formatCurrency } from '../../utils/currency';

export function HomeScreen({
  setScreen,
  currentTrip,
  onSelectDestination,
  onOpenDestinationPicker,
}) {
  const activeDestMeta =
    WORLD_DESTINATIONS.find((d) => d.id === currentTrip?.destinationId) ||
    WORLD_DESTINATIONS.find((d) => d.country && currentTrip?.country && d.country.toLowerCase() === currentTrip.country.toLowerCase()) ||
    WORLD_DESTINATIONS[0];

  const cur = currentTrip?.currency || activeDestMeta?.currency || 'USD';

  return (
    <div className="flex flex-col min-h-full bg-[#f8f7f4]">
      {/* Top Header */}
      <header className="px-5 pt-12 pb-3 bg-white border-b border-[#ebe8e2] sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1f4a35] flex items-center justify-center text-white shadow-xs">
              <Compass size={20} />
            </div>
            <div>
              <span className="font-800 text-lg text-[#121212] tracking-tight block leading-tight">
                BudgetTrip
              </span>
              <span className="text-[11px] font-600 text-[#8a8680]">Smart Worldwide Travel</span>
            </div>
          </div>

          {/* Quick Destination Pill */}
          <button
            type="button"
            onClick={onOpenDestinationPicker}
            className="flex items-center gap-1.5 text-xs font-700 bg-[#f5f2ed] border border-[#e4e1db] hover:border-[#1f4a35] text-[#111110] px-3 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Globe2 size={13} className="text-[#1f4a35]" />
            <span className="truncate max-w-[120px]">{activeDestMeta.flag} {activeDestMeta.city}</span>
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 px-5 pt-4 pb-28 space-y-5">
        {/* Prominent Global Search Bar */}
        <button
          type="button"
          onClick={onOpenDestinationPicker}
          className="w-full p-3.5 bg-white rounded-2xl border border-[#e4e1db] shadow-xs hover:border-[#1f4a35] transition-all flex items-center justify-between text-left cursor-pointer group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Search size={16} />
            </div>
            <div>
              <span className="text-sm font-800 text-[#111110] block">Where to next?</span>
              <span className="text-xs text-[#8a8680] font-500">Search 250+ countries, cities & islands...</span>
            </div>
          </div>
          <span className="text-[11px] font-700 text-[#1f4a35] bg-[#e8f0ec] px-2.5 py-1 rounded-lg">
            Search
          </span>
        </button>

        {/* Active Trip Hero Banner Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#e4e1db] bg-slate-900 group">
          <img
            src={activeDestMeta.img}
            alt={activeDestMeta.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Top Tag Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="text-xs font-700 text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
              <span>{activeDestMeta.flag}</span>
              <span>{activeDestMeta.city}, {activeDestMeta.country}</span>
            </span>

            <span className="text-[11px] font-800 text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30">
              {currentTrip?.currency || 'USD'}
            </span>
          </div>

          {/* Bottom Card Content */}
          <div className="absolute bottom-3 left-3.5 right-3.5 text-white space-y-2">
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider block">
                  Active Itinerary
                </span>
                <h2 className="text-lg font-800 text-white leading-tight">
                  {currentTrip?.destinationName || activeDestMeta.name}
                </h2>
                <div className="flex items-center gap-3 text-xs text-white/80 font-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-emerald-400" />
                    {currentTrip?.totalDays || 3} Days
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet size={12} className="text-emerald-400" />
                    {formatCurrency(currentTrip?.totalBudget, cur)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setScreen('mytrip')}
                className="px-3.5 py-2 bg-[#1f4a35] hover:bg-[#163526] text-white rounded-xl text-xs font-800 flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <span>Open Trip</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Card Quick Action Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-800 text-[#8a8680] uppercase tracking-wider">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* New Trip Wizard */}
            <button
              type="button"
              onClick={() => setScreen('setup')}
              className="p-3.5 bg-white rounded-2xl border border-[#e4e1db] hover:border-[#1f4a35] shadow-xs text-left transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center mb-2 group-hover:bg-[#1f4a35] group-hover:text-white transition-colors">
                <PlusCircle size={17} />
              </div>
              <h4 className="font-800 text-xs text-[#111110]">Plan New Trip</h4>
              <p className="text-[11px] text-[#8a8680] font-500 mt-0.5">Dates, budget & style</p>
            </button>

            {/* Explore Places */}
            <button
              type="button"
              onClick={() => setScreen('explore')}
              className="p-3.5 bg-white rounded-2xl border border-[#e4e1db] hover:border-[#1f4a35] shadow-xs text-left transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Search size={17} />
              </div>
              <h4 className="font-800 text-xs text-[#111110]">Explore Spots</h4>
              <p className="text-[11px] text-[#8a8680] font-500 mt-0.5">Hotels, food & sights</p>
            </button>

            {/* Budget Tracker */}
            <button
              type="button"
              onClick={() => setScreen('budget')}
              className="p-3.5 bg-white rounded-2xl border border-[#e4e1db] hover:border-[#1f4a35] shadow-xs text-left transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Wallet size={17} />
              </div>
              <h4 className="font-800 text-xs text-[#111110]">Budget Tracker</h4>
              <p className="text-[11px] text-[#8a8680] font-500 mt-0.5">Live spending gauge</p>
            </button>

            {/* Saved Bookmarks */}
            <button
              type="button"
              onClick={() => setScreen('saved')}
              className="p-3.5 bg-white rounded-2xl border border-[#e4e1db] hover:border-[#1f4a35] shadow-xs text-left transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Bookmark size={17} />
              </div>
              <h4 className="font-800 text-xs text-[#111110]">Saved Bookmarks</h4>
              <p className="text-[11px] text-[#8a8680] font-500 mt-0.5">Favorites collection</p>
            </button>
          </div>
        </div>

        {/* Live Moving Suggestion Carousel */}
        <LiveDestinationCarousel onSelectDestination={onSelectDestination} />

        {/* Country Travel Essentials Card */}
        <CountryEssentialsCard destination={currentTrip} />

        {/* Browse All Locations Full CTA Button */}
        <button
          type="button"
          onClick={onOpenDestinationPicker}
          className="w-full py-3.5 bg-[#121212] hover:bg-black text-white rounded-2xl text-xs font-800 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
        >
          <Globe2 size={15} />
          <span>Browse All 250+ World Destinations</span>
        </button>
      </main>
    </div>
  );
}
