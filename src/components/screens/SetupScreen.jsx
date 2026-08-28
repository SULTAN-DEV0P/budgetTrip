import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Users,
  Wallet,
  Minus,
  Plus,
  Check,
  Globe2,
  Sparkles,
} from 'lucide-react';
import { WORLD_DESTINATIONS } from '../../services/destinationService';
import { formatCurrency, getCurrencyForCountry, convertCurrency } from '../../utils/currency';

const INTERESTS = ['Art', 'Food', 'Nightlife', 'Culture', 'Nature', 'Beach', 'History', 'Shopping', 'Adventure'];

const STAY_OPTIONS = [
  { id: 'cheapest', label: 'Budget Hostel & Suites', desc: 'Maximum savings & essential comfort' },
  { id: 'budget', label: 'Boutique Mid-Range', desc: 'Best value design stay & breakfast' },
  { id: 'comfortable', label: 'Luxury Panorama Resort', desc: 'Premium view, wellness spa & amenities' },
];

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getFutureStr = (days = 3) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export function SetupScreen({
  setScreen,
  tripParams,
  setTripParams,
  onGenerateTrip,
  onOpenDestinationPicker,
}) {
  const [destinationId, setDestinationId] = useState(tripParams?.destinationId || 'tokyo');
  const [travelers, setTravelers] = useState(tripParams?.travelers || 2);
  const [startDate, setStartDate] = useState(tripParams?.startDate || getTodayStr());
  const [endDate, setEndDate] = useState(tripParams?.endDate || getFutureStr(3));

  const activeDest = WORLD_DESTINATIONS.find((d) => d.id === destinationId) || WORLD_DESTINATIONS[0];
  const cur = activeDest.currency || getCurrencyForCountry(activeDest.country);

  // Calculate actual duration in days from start/end dates
  const calculatedDays = React.useMemo(() => {
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffTime = e - s;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(1, diffDays || 3);
    } catch {
      return 3;
    }
  }, [startDate, endDate]);

  const [budget, setBudget] = useState(() => {
    if (tripParams?.currency === cur && tripParams?.totalBudget) {
      return tripParams.totalBudget;
    }
    const baseUSD = activeDest.priceIndexUSD || 75;
    return Math.round(convertCurrency(baseUSD * calculatedDays * (tripParams?.travelers || 2) * 1.5, 'USD', cur));
  });

  const handleSelectDestId = (newId) => {
    setDestinationId(newId);
    const dest = WORLD_DESTINATIONS.find((d) => d.id === newId) || WORLD_DESTINATIONS[0];
    const newCur = dest.currency || getCurrencyForCountry(dest.country);
    const baseUSD = dest.priceIndexUSD || 75;
    const defaultBudget = Math.round(convertCurrency(baseUSD * calculatedDays * travelers * 1.5, 'USD', newCur));
    setBudget(defaultBudget);
  };

  const [selectedInterests, setSelectedInterests] = useState(
    tripParams?.interests || ['Culture', 'Food', 'Art']
  );
  const [stayPreference, setStayPreference] = useState(
    tripParams?.accommodationPreference || 'budget'
  );

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleBuildTrip = () => {
    const params = {
      destinationId: activeDest.id,
      destinationName: activeDest.name,
      country: activeDest.country,
      currency: cur,
      startDate,
      endDate,
      totalDays: calculatedDays,
      travelers,
      totalBudget: Number(budget) || 1000,
      interests: selectedInterests,
      accommodationPreference: stayPreference,
    };
    if (setTripParams) setTripParams(params);
    if (onGenerateTrip) onGenerateTrip(params);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8f7f4]">
      {/* Top Sticky Header */}
      <div className="bg-white sticky top-0 z-20 px-5 pt-12 pb-4 border-b border-[#ebe8e2] shadow-2xs">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setScreen('home')}
            className="flex items-center gap-1.5 text-xs font-700 text-[#8a8680] hover:text-[#111110] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </button>
          <span className="text-xs font-800 uppercase tracking-wider text-[#1f4a35] bg-[#e8f0ec] px-2.5 py-0.5 rounded-full">
            Trip Wizard
          </span>
        </div>
        <h1 className="text-2xl font-800 text-[#111110] tracking-tight mt-2">Create New Trip</h1>
        <p className="text-xs text-[#8a8680] font-500 mt-0.5">
          Pick your destination, travel dates & budget target.
        </p>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 pb-32">
        {/* 1. Destination Picker */}
        <div className="bg-white p-4 rounded-2xl border border-[#e4e1db] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-800 uppercase tracking-wider text-[#111110]">
              1. Choose Destination
            </label>
            <button
              type="button"
              onClick={onOpenDestinationPicker}
              className="text-xs font-700 text-[#1f4a35] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Globe2 size={12} />
              <span>Search All (250+)</span>
            </button>
          </div>

          {/* Quick Destination Pills */}
          <div className="grid grid-cols-3 gap-1.5">
            {WORLD_DESTINATIONS.slice(0, 6).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelectDestId(d.id)}
                className={`py-2 px-1 rounded-xl text-xs font-700 border transition-all cursor-pointer truncate ${
                  destinationId === d.id
                    ? 'bg-[#1f4a35] text-white border-[#1f4a35] shadow-2xs'
                    : 'bg-[#f8f7f4] text-[#111110] border-[#e4e1db] hover:border-[#8a8680]'
                }`}
              >
                {d.flag} {d.city}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenDestinationPicker}
            className="w-full bg-[#f8f7f4] border border-[#e4e1db] hover:border-[#1f4a35] rounded-xl p-3 flex items-center justify-between cursor-pointer transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeDest.flag}</span>
              <div>
                <span className="font-800 text-[#111110] text-sm block">
                  {activeDest.city}, {activeDest.country}
                </span>
                <span className="text-[11px] text-[#8a8680]">
                  Currency: {cur} • {activeDest.continent}
                </span>
              </div>
            </div>
            <span className="text-xs font-700 text-[#1f4a35] bg-white px-2.5 py-1 rounded-lg border border-[#e4e1db]">
              Change
            </span>
          </button>
        </div>

        {/* 2. Travel Dates & Duration */}
        <div className="bg-white p-4 rounded-2xl border border-[#e4e1db] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-800 uppercase tracking-wider text-[#111110]">
              2. Dates & Duration
            </label>
            <span className="text-xs font-800 text-[#1f4a35] bg-[#e8f0ec] px-2 py-0.5 rounded-md">
              {calculatedDays} {calculatedDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#f8f7f4] border border-[#e4e1db] rounded-xl p-3 space-y-1">
              <p className="text-[11px] text-[#8a8680] font-700 uppercase">Start Date</p>
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#1f4a35] shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  min={getTodayStr()}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (new Date(e.target.value) > new Date(endDate)) {
                      setEndDate(e.target.value);
                    }
                  }}
                  className="w-full text-[16px] sm:text-xs font-700 text-[#111110] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-[#f8f7f4] border border-[#e4e1db] rounded-xl p-3 space-y-1">
              <p className="text-[11px] text-[#8a8680] font-700 uppercase">End Date</p>
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#1f4a35] shrink-0" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-[16px] sm:text-xs font-700 text-[#111110] bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Travelers */}
        <div className="bg-white p-4 rounded-2xl border border-[#e4e1db] shadow-xs space-y-3">
          <label className="text-xs font-800 uppercase tracking-wider text-[#111110]">
            3. Group Size
          </label>
          <div className="bg-[#f8f7f4] border border-[#e4e1db] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users size={18} className="text-[#1f4a35]" />
              <span className="font-800 text-[#111110] text-sm">
                {travelers} {travelers === 1 ? 'Traveler (Solo)' : 'Travelers'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                disabled={travelers <= 1}
                className="w-8 h-8 rounded-xl border border-[#e4e1db] bg-white flex items-center justify-center text-[#111110] disabled:opacity-30 cursor-pointer active:scale-95"
              >
                <Minus size={14} />
              </button>
              <span className="font-800 text-sm w-4 text-center text-[#111110]">{travelers}</span>
              <button
                type="button"
                onClick={() => setTravelers(Math.min(10, travelers + 1))}
                className="w-8 h-8 rounded-xl bg-[#1f4a35] flex items-center justify-center text-white cursor-pointer active:scale-95 shadow-xs"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Total Budget */}
        <div className="bg-white p-4 rounded-2xl border border-[#e4e1db] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-800 uppercase tracking-wider text-[#111110]">
              4. Total Trip Budget
            </label>
            <span className="text-xs font-800 text-[#1f4a35]">
              {formatCurrency(budget, cur)}
            </span>
          </div>

          <div className="bg-[#f8f7f4] border border-[#e4e1db] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-1">
              <Wallet size={18} className="text-[#1f4a35]" />
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="font-800 text-lg text-[#111110] w-full bg-transparent focus:outline-none"
              />
            </div>
            <span className="text-xs font-800 text-[#1f4a35] bg-[#e8f0ec] rounded-lg px-2.5 py-1 shrink-0">
              {cur}
            </span>
          </div>
        </div>

        {/* 5. Interests */}
        <div className="bg-white p-4 rounded-2xl border border-[#e4e1db] shadow-xs space-y-3">
          <label className="text-xs font-800 uppercase tracking-wider text-[#111110]">
            5. Trip Interests & Vibe
          </label>
          <div className="flex flex-wrap gap-1.5">
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-700 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1f4a35] text-white border-[#1f4a35] shadow-xs'
                      : 'bg-[#f8f7f4] text-[#111110] border-[#e4e1db] hover:border-[#8a8680]'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Stay Preference */}
        <div className="bg-white p-4 rounded-2xl border border-[#e4e1db] shadow-xs space-y-3">
          <label className="text-xs font-800 uppercase tracking-wider text-[#111110]">
            6. Accommodation Style
          </label>
          <div className="space-y-2">
            {STAY_OPTIONS.map((option) => {
              const isSelected = stayPreference === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setStayPreference(option.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#e8f0ec] border-[#1f4a35] ring-1 ring-[#1f4a35]'
                      : 'bg-[#f8f7f4] border-[#e4e1db] hover:border-[#8a8680]'
                  }`}
                >
                  <div className="text-left">
                    <p className={`font-800 text-xs ${isSelected ? 'text-[#1f4a35]' : 'text-[#111110]'}`}>
                      {option.label}
                    </p>
                    <p className="text-[11px] text-[#8a8680] font-500 mt-0.5">{option.desc}</p>
                  </div>
                  {isSelected && <Check size={16} className="text-[#1f4a35]" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#ebe8e2] z-30 shadow-lg">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleBuildTrip}
            className="w-full bg-[#1f4a35] hover:bg-[#163526] text-white rounded-2xl py-4 font-800 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 transition-all"
          >
            <Sparkles size={16} />
            <span>Generate {activeDest.city} Itinerary 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
}
