import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Users,
  Wallet,
  Sparkles,
  Plus,
  Minus,
  Check,
  BedDouble,
  Palette,
  Utensils,
  Trees,
  Waves,
  Moon,
  Landmark,
  PiggyBank,
} from 'lucide-react';
import { DestinationSelector } from './DestinationSelector';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { TRIP_INTERESTS, ACCOMMODATION_TIERS } from '../../types';
import { calculateDaysBetween, getDefaultDateRange } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

const INTEREST_ICONS = {
  culture: Palette,
  foodie: Utensils,
  nature: Trees,
  beach: Waves,
  nightlife: Moon,
  heritage: Landmark,
  budget: PiggyBank,
};

const BUDGET_PRESETS_NGN = [
  { label: '₦100k', value: 100000, desc: 'Budget' },
  { label: '₦200k', value: 200000, desc: 'Comfort' },
  { label: '₦350k', value: 350000, desc: 'Popular' },
  { label: '₦500k', value: 500000, desc: 'Premium' },
  { label: '₦1M', value: 1000000, desc: 'Luxury' },
];

export function TripSetupWizard({ onGenerateTrip, initialValues = null, loading = false }) {
  const defaultDates = getDefaultDateRange();

  const [destinationId, setDestinationId] = useState(initialValues?.destinationId || 'lagos');
  const [startDate, setStartDate] = useState(initialValues?.startDate || defaultDates.startDate);
  const [endDate, setEndDate] = useState(initialValues?.endDate || defaultDates.endDate);
  const [travelers, setTravelers] = useState(initialValues?.travelers || 1);
  const [budgetNgn, setBudgetNgn] = useState(initialValues?.totalBudget || 250000);
  const [selectedInterests, setSelectedInterests] = useState(
    initialValues?.interests || ['culture', 'foodie']
  );
  const [accommodationPreference, setAccommodationPreference] = useState(
    initialValues?.accommodationPreference || 'any'
  );
  const [currency] = useState('NGN');

  // Live calculations
  const totalDays = useMemo(() => calculateDaysBetween(startDate, endDate), [startDate, endDate]);
  const nights = Math.max(1, totalDays - 1);
  const dailyPerPersonBudget = useMemo(() => {
    if (!budgetNgn || totalDays <= 0 || travelers <= 0) return 0;
    return Math.round(budgetNgn / (totalDays * travelers));
  }, [budgetNgn, totalDays, travelers]);

  // Handle Interest Toggle
  const toggleInterest = (interestId) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destinationId || !startDate || !endDate || budgetNgn <= 0) return;

    onGenerateTrip({
      destinationId,
      startDate,
      endDate,
      travelers,
      totalBudget: budgetNgn,
      currency,
      interests: selectedInterests,
      accommodationPreference,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 py-2 px-1">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          Budget-First Travel Planner
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Plan Your Next Trip in Nigeria
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Set your destination, dates and budget. BudgetTrip will curate matching stays, dining and activities without exceeding your budget.
        </p>
      </div>

      {/* 1. Destination Selection */}
      <Card className="p-4 sm:p-6">
        <DestinationSelector
          selectedDestinationId={destinationId}
          onSelect={setDestinationId}
        />
      </Card>

      {/* 2. Dates & Travelers Section */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Travel Dates & Companions</span>
          </label>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 font-medium border border-slate-700">
            {totalDays} {totalDays > 1 ? 'Days' : 'Day'} • {nights} {nights > 1 ? 'Nights' : 'Night'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (new Date(e.target.value) > new Date(endDate)) {
                  setEndDate(e.target.value);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
              required
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
              required
            />
          </div>

          {/* Travelers Counter */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Travelers</label>
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                disabled={travelers <= 1}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm text-white flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                {travelers}
              </span>
              <button
                type="button"
                onClick={() => setTravelers(Math.min(10, travelers + 1))}
                disabled={travelers >= 10}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Total Travel Budget Section */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-amber-400" />
            <span>Total Travel Budget</span>
          </label>
          <span className="text-xs text-slate-400">
            Est. <span className="font-semibold text-amber-300">{formatCurrency(dailyPerPersonBudget, currency)}</span> / day / traveler
          </span>
        </div>

        {/* Input Box */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-amber-400">
            ₦
          </span>
          <input
            type="number"
            value={budgetNgn}
            step={5000}
            min={20000}
            onChange={(e) => setBudgetNgn(Number(e.target.value))}
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-lg font-bold text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
            placeholder="e.g. 250000"
            required
          />
        </div>

        {/* Budget Quick Preset Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Quick Budget Presets
          </span>
          <div className="grid grid-cols-5 gap-2">
            {BUDGET_PRESETS_NGN.map(preset => {
              const isSelected = budgetNgn === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setBudgetNgn(preset.value)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div>{preset.label}</div>
                  <div className="text-[9px] text-slate-500">{preset.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 4. Travel Style & Interests */}
      <Card className="p-4 sm:p-6 space-y-3">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-amber-400" />
          <span>Interests & Activities (Optional)</span>
        </label>
        <p className="text-xs text-slate-400">
          Select what you enjoy most so BudgetTrip can score and match the best spots.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {TRIP_INTERESTS.map(interest => {
            const Icon = INTEREST_ICONS[interest.id] || Sparkles;
            const isSelected = selectedInterests.includes(interest.id);

            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-semibold ring-1 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{interest.label}</span>
                {isSelected && <Check className="w-3 h-3 text-amber-400 ml-0.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 5. Accommodation Preference */}
      <Card className="p-4 sm:p-6 space-y-3">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <BedDouble className="w-4 h-4 text-amber-400" />
          <span>Stay Preference</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ACCOMMODATION_TIERS.map(tier => {
            const isSelected = accommodationPreference === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setAccommodationPreference(tier.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 ring-1 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-white">{tier.label}</span>
                  <span className="text-[10px] text-amber-400 font-medium">{tier.priceRange}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{tier.description}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="gold"
          size="lg"
          fullWidth
          loading={loading}
          icon={Sparkles}
          className="shadow-xl shadow-amber-950/30 text-base"
        >
          Generate Trip Plan
        </Button>
        <p className="text-center text-[11px] text-slate-500 mt-2.5">
          Guaranteed budget calculations • Real Nigerian spots • Instant optimization
        </p>
      </div>
    </form>
  );
}
