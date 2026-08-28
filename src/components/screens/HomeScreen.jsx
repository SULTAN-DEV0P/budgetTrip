import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Globe2,
  Calendar,
  Wallet,
  Search,
  CheckCircle2,
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
    WORLD_DESTINATIONS.find((d) => d.id === currentTrip.destinationId) ||
    WORLD_DESTINATIONS.find((d) => d.country.toLowerCase() === (currentTrip.country || '').toLowerCase()) ||
    WORLD_DESTINATIONS[0];

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed]">
      {/* Top Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1f4a35] flex items-center justify-center text-white shadow-2xs">
            <Compass size={18} />
          </div>
          <div>
            <span className="font-800 text-lg text-[#111110] tracking-tight">BudgetTrip</span>
          </div>
        </div>

        {/* Change Destination Button */}
        <button
          onClick={onOpenDestinationPicker}
          className="flex items-center gap-1.5 text-xs font-700 bg-white border border-[#e4e1db] hover:border-[#1f4a35] text-[#111110] px-3 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer"
        >
          <Globe2 size={13} className="text-[#1f4a35]" />
          <span>{activeDestMeta.flag} {activeDestMeta.city}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 pb-28 space-y-6">
        {/* Tag Pill */}
        <div className="inline-flex items-center gap-1.5 bg-[#e8f0ec] rounded-full px-3 py-1 text-xs font-700 text-[#1f4a35]">
          <Sparkles size={13} />
          <span>Worldwide Budget Travel Engine</span>
        </div>

        {/* Hero Title */}
        <div>
          <h1 className="text-3xl font-800 text-[#111110] leading-tight tracking-tight">
            Explore the world without budget anxiety.
          </h1>
          <p className="text-sm text-[#8a8680] font-500 mt-2 leading-relaxed">
            Pick any country or city worldwide. We calculate local currencies, live travel essentials, and allocate itineraries to fit your budget.
          </p>
        </div>

        {/* Live Moving Suggestion Carousel */}
        <LiveDestinationCarousel onSelectDestination={onSelectDestination} />

        {/* Live Country Travel Essentials Card */}
        <CountryEssentialsCard destination={currentTrip} />

        {/* Active Trip Quick Summary */}
        <div className="bg-white rounded-2xl border border-[#e4e1db] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#e4e1db]">
            <div>
              <span className="text-[10px] font-700 uppercase tracking-wider text-[#8a8680]">
                Active Itinerary
              </span>
              <h3 className="font-800 text-base text-[#111110] mt-0.5">
                {currentTrip.destinationName}
              </h3>
            </div>
            <span className="text-xs font-700 bg-[#e8f0ec] text-[#1f4a35] px-2.5 py-1 rounded-full">
              {currentTrip.currency}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#8a8680]">
              <Calendar size={14} className="text-[#1f4a35]" />
              <span>{currentTrip.totalDays} Days Trip</span>
            </div>
            <div className="flex items-center gap-2 text-[#8a8680]">
              <Wallet size={14} className="text-[#1f4a35]" />
              <span>Budget: {formatCurrency(currentTrip.totalBudget, currentTrip.currency)}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setScreen('mytrip')}
              className="flex-1 py-2.5 bg-[#1f4a35] text-white rounded-xl text-xs font-700 hover:bg-[#183a2a] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>View Itinerary</span>
              <ArrowRight size={13} />
            </button>

            <button
              onClick={() => setScreen('budget')}
              className="flex-1 py-2.5 bg-white border border-[#e4e1db] text-[#111110] hover:border-[#8a8680] rounded-xl text-xs font-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Check Budget</span>
            </button>
          </div>
        </div>

        {/* Global Explorer CTA */}
        <button
          onClick={onOpenDestinationPicker}
          className="w-full py-4 bg-[#111110] text-white rounded-2xl text-sm font-800 flex items-center justify-center gap-2 hover:bg-black transition-colors cursor-pointer shadow-md"
        >
          <Globe2 size={16} />
          <span>Browse All Global Locations</span>
        </button>
      </div>
    </div>
  );
}
