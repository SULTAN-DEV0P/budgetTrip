import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Minus,
  Plus,
  Check,
} from 'lucide-react';

const INTERESTS = ['Art', 'Food', 'Nightlife', 'Culture', 'Nature', 'Beach', 'History'];

const STAY_OPTIONS = [
  { id: 'cheapest', label: 'Cheapest', desc: 'Save the most' },
  { id: 'budget', label: 'Budget', desc: 'Best value' },
  { id: 'comfortable', label: 'Comfortable', desc: 'More comfort' },
];

const BUDGET_PRESETS = [
  { label: '₦100k', value: 100000 },
  { label: '₦150k', value: 150000 },
  { label: '₦250k', value: 250000 },
  { label: '₦500k', value: 500000 },
];

const DESTINATIONS = [
  { id: 'lagos', name: 'Lagos, Nigeria' },
  { id: 'abuja', name: 'Abuja, Nigeria' },
  { id: 'abeokuta', name: 'Abeokuta, Nigeria' },
];

export function SetupScreen({
  setScreen,
  tripParams,
  setTripParams,
  onGenerateTrip,
}) {
  const [destination, setDestination] = useState(tripParams?.destinationId || 'lagos');
  const [travelers, setTravelers] = useState(tripParams?.travelers || 2);
  const [budget, setBudget] = useState(tripParams?.totalBudget || 150000);
  const [selectedInterests, setSelectedInterests] = useState(
    tripParams?.interests || ['Art', 'Food']
  );
  const [stayPreference, setStayPreference] = useState(
    tripParams?.accommodationPreference || 'budget'
  );
  const [startDate, setStartDate] = useState(tripParams?.startDate || '2026-08-28');
  const [endDate, setEndDate] = useState(tripParams?.endDate || '2026-08-30');

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleBuildTrip = () => {
    const params = {
      destinationId: destination,
      startDate,
      endDate,
      travelers,
      totalBudget: budget,
      currency: 'NGN',
      interests: selectedInterests,
      accommodationPreference: stayPreference,
    };
    if (setTripParams) setTripParams(params);
    if (onGenerateTrip) onGenerateTrip(params);
    setScreen('loading');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed]">
      {/* Top Sticky Header */}
      <div className="bg-[#f5f2ed] sticky top-0 z-10 px-5 pt-12 pb-4 border-b border-[#e4e1db]">
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-[#8a8680] hover:text-[#111110] mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-600">Back</span>
        </button>
        <h1 className="text-2xl font-800 text-[#111110]">Build your trip</h1>
        <p className="text-sm text-[#8a8680] font-500 mt-1">Tell us what matters to you.</p>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-28">
        {/* Destination */}
        <div>
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680] mb-2 block">
            Destination
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {DESTINATIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDestination(d.id)}
                className={`py-2 px-1 rounded-xl text-xs font-700 border transition-all cursor-pointer ${
                  destination === d.id
                    ? 'bg-[#1f4a35] text-white border-[#1f4a35]'
                    : 'bg-white text-[#111110] border-[#e4e1db] hover:border-[#8a8680]'
                }`}
              >
                {d.name.split(',')[0]}
              </button>
            ))}
          </div>
          <div className="bg-white border border-[#e4e1db] rounded-xl p-3.5 flex items-center gap-3">
            <MapPin size={18} className="text-[#1f4a35]" />
            <span className="font-600 text-[#111110]">
              {DESTINATIONS.find((d) => d.id === destination)?.name}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div>
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680] mb-2 block">
            Dates
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#e4e1db] rounded-xl p-3.5 space-y-1">
              <p className="text-xs text-[#8a8680] font-600">Start</p>
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#1f4a35]" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs font-700 text-[#111110] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-white border border-[#e4e1db] rounded-xl p-3.5 space-y-1">
              <p className="text-xs text-[#8a8680] font-600">End</p>
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#1f4a35]" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs font-700 text-[#111110] bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Travelers */}
        <div>
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680] mb-2 block">
            Travelers
          </label>
          <div className="bg-white border border-[#e4e1db] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#1f4a35]" />
              <span className="font-600 text-[#111110]">
                {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                disabled={travelers <= 1}
                className="w-8 h-8 rounded-full border border-[#e4e1db] flex items-center justify-center text-[#111110] disabled:opacity-30 cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <span className="font-800 text-base w-4 text-center text-[#111110]">{travelers}</span>
              <button
                type="button"
                onClick={() => setTravelers(Math.min(8, travelers + 1))}
                className="w-8 h-8 rounded-full bg-[#1f4a35] flex items-center justify-center text-white cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680]">
              Total Budget
            </label>
            <span className="text-xs font-700 text-[#1f4a35]">
              ≈ ₦{Math.round(budget / (travelers * 3)).toLocaleString()} / day / person
            </span>
          </div>

          <div className="bg-white border border-[#e4e1db] rounded-xl p-3.5 flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1">
              <Wallet size={18} className="text-[#1f4a35]" />
              <div className="flex items-center">
                <span className="font-800 text-lg text-[#111110] mr-1">₦</span>
                <input
                  type="number"
                  step={5000}
                  min={20000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="font-800 text-lg text-[#111110] w-32 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            <span className="text-xs font-700 text-[#8a8680] bg-[#f0ece6] rounded-lg px-2.5 py-1">
              NGN ₦
            </span>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-2">
            {BUDGET_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setBudget(p.value)}
                className={`py-1.5 rounded-lg text-xs font-700 border transition-all cursor-pointer ${
                  budget === p.value
                    ? 'bg-[#1f4a35] text-white border-[#1f4a35]'
                    : 'bg-white text-[#8a8680] border-[#e4e1db] hover:border-[#8a8680]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680] mb-3 block">
            What are you into?
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-xs font-600 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1f4a35] text-white border-[#1f4a35]'
                      : 'bg-white text-[#111110] border-[#e4e1db] hover:border-[#8a8680]'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stay Preference */}
        <div>
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680] mb-3 block">
            Where do you want to stay?
          </label>
          <div className="space-y-2.5">
            {STAY_OPTIONS.map((option) => {
              const isSelected = stayPreference === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setStayPreference(option.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#e8f0ec] border-[#1f4a35]'
                      : 'bg-white border-[#e4e1db] hover:border-[#8a8680]'
                  }`}
                >
                  <div className="text-left">
                    <p className={`font-700 text-sm ${isSelected ? 'text-[#1f4a35]' : 'text-[#111110]'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-[#8a8680] font-500 mt-0.5">{option.desc}</p>
                  </div>
                  {isSelected && <Check size={18} className="text-[#1f4a35]" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#f5f2ed] border-t border-[#e4e1db]">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleBuildTrip}
            className="w-full bg-[#1f4a35] text-white rounded-xl py-4 font-700 text-sm active:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            Build My Trip
          </button>
        </div>
      </div>
    </div>
  );
}
