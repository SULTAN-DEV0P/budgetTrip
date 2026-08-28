import React, { useState } from 'react';
import {
  Wallet,
  Sparkles,
  PieChart,
  Bed,
  Utensils,
  Compass,
  Car,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  TrendingDown,
  RotateCcw,
  Check,
} from 'lucide-react';
import { formatCurrency, convertCurrency, CURRENCY_SYMBOLS, USD_EXCHANGE_RATES } from '../../utils/currency';
import {
  calculateTripBudget,
  generateOptimizationSuggestions,
  applyOptimization,
} from '../../services/budgetService';

export function BudgetScreen({
  trip,
  onUpdateTrip,
  placesCatalog,
  currency,
  onCurrencyChange,
}) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetValue, setBudgetValue] = useState(trip.totalBudget?.toString() || '');
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);

  const numDays = trip.totalDays || 1;
  const travelers = trip.travelers || 1;
  const cur = currency || trip.currency || 'USD';

  const breakdown = calculateTripBudget(trip);
  const percent = Math.min(100, Math.round(breakdown.percentageUsed));

  let meterColor = 'bg-[#1f4a35]';
  let statusText = 'Well within budget target';

  if (breakdown.isOverBudget) {
    meterColor = 'bg-rose-500';
    statusText = `Over budget by ${formatCurrency(breakdown.overAmount, cur)}`;
  } else if (breakdown.percentageUsed >= 80) {
    meterColor = 'bg-amber-500';
    statusText = 'Approaching maximum budget limit';
  }

  const handleSaveBudget = () => {
    const parsed = Number(budgetValue);
    if (parsed > 0) {
      onUpdateTrip({ ...trip, totalBudget: parsed });
      setIsEditingBudget(false);
    }
  };

  const suggestions = generateOptimizationSuggestions(trip, placesCatalog);
  const totalPotentialSavings = suggestions.reduce((acc, s) => acc + s.savings, 0);

  const handleApplyAllOptimizations = () => {
    let updated = trip;
    suggestions.forEach((s) => {
      updated = applyOptimization(updated, s);
    });
    onUpdateTrip(updated);
    setIsOptimizerOpen(false);
  };

  const categories = [
    {
      id: 'accommodation',
      name: 'Accommodation',
      amount: breakdown.accommodation,
      percentage: breakdown.categoryPercentages.accommodation,
      icon: Bed,
      color: 'bg-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      sub: 'Hotels & boutique rooms',
    },
    {
      id: 'food',
      name: 'Food & Dining',
      amount: breakdown.food,
      percentage: breakdown.categoryPercentages.food,
      icon: Utensils,
      color: 'bg-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      sub: 'Meals, bistros & cafes',
    },
    {
      id: 'activities',
      name: 'Activities & Sights',
      amount: breakdown.activities,
      percentage: breakdown.categoryPercentages.activities,
      icon: Compass,
      color: 'bg-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      sub: 'Guided tours, entries & museums',
    },
    {
      id: 'transportation',
      name: 'Local Transit',
      amount: breakdown.transportation,
      percentage: breakdown.categoryPercentages.transportation,
      icon: Car,
      color: 'bg-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      sub: 'Taxis, rideshare & transfers',
    },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed] p-5 pt-12 pb-28 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-700 uppercase tracking-wider bg-[#e8f0ec] text-[#1f4a35] px-2.5 py-0.5 rounded-full">
              Live Budget Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-800 text-[#111110] tracking-tight">
            Trip Budget Breakdown
          </h1>
          <p className="text-xs text-[#8a8680] font-500 mt-1">
            Allocated spending across stays, dining, and activities in {trip.destinationName}
          </p>
        </div>

        {/* Currency Switcher Dropdown */}
        <select
          value={cur}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="bg-white border border-[#e4e1db] text-[#111110] text-xs font-700 py-1.5 px-2.5 rounded-xl cursor-pointer shadow-2xs focus:outline-none focus:border-[#1f4a35]"
        >
          {Object.keys(CURRENCY_SYMBOLS).map((c) => (
            <option key={c} value={c}>
              {c} ({CURRENCY_SYMBOLS[c]})
            </option>
          ))}
        </select>
      </div>

      {/* Main Budget Card */}
      <div className="bg-white rounded-2xl border border-[#e4e1db] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <div>
              <span className="text-[10px] font-700 uppercase tracking-wider text-[#8a8680] block">
                Total Budget
              </span>
              <div className="text-lg sm:text-xl font-800 text-[#111110]">
                {formatCurrency(trip.totalBudget, cur)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBudgetValue(trip.totalBudget?.toString() || '');
                setIsEditingBudget(!isEditingBudget);
              }}
              className="p-2 rounded-xl text-[#8a8680] hover:text-[#111110] hover:bg-[#f5f2ed] transition-colors cursor-pointer"
              title="Edit Budget"
            >
              <Edit2 size={16} />
            </button>

            <button
              onClick={() => setIsOptimizerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#1f4a35] text-white text-xs font-700 hover:bg-[#183a2a] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sparkles size={13} />
              <span>Optimizer</span>
            </button>
          </div>
        </div>

        {/* Inline Budget Editor */}
        {isEditingBudget && (
          <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#e4e1db] flex items-center gap-2">
            <span className="text-xs font-700 text-[#8a8680]">{cur}:</span>
            <input
              type="number"
              value={budgetValue}
              onChange={(e) => setBudgetValue(e.target.value)}
              className="flex-1 text-xs font-700 px-2.5 py-1.5 rounded-lg border border-[#e4e1db] bg-white text-[#111110] focus:outline-none focus:border-[#1f4a35]"
            />
            <button
              onClick={handleSaveBudget}
              className="px-3 py-1.5 bg-[#1f4a35] text-white text-xs font-700 rounded-lg cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingBudget(false)}
              className="text-xs text-[#8a8680] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Meter Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-700">
            <span className="text-[#8a8680]">
              Total Committed: <strong className="text-[#111110]">{formatCurrency(breakdown.totalEstimated, cur)}</strong>
            </span>
            <span className={breakdown.isOverBudget ? 'text-rose-600' : 'text-[#1f4a35]'}>
              {breakdown.percentageUsed.toFixed(0)}%
            </span>
          </div>

          <div className="h-3 w-full bg-[#f0ece6] rounded-full overflow-hidden p-0.5 border border-[#e4e1db]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${meterColor}`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8a8680] pt-0.5 font-500">
            <span className="flex items-center gap-1">
              {breakdown.isOverBudget ? (
                <span className="text-rose-600 font-700 flex items-center gap-1">
                  <AlertTriangle size={12} /> {statusText}
                </span>
              ) : (
                <span className="text-[#1f4a35] font-700 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {statusText}
                </span>
              )}
            </span>

            <span>
              {breakdown.isOverBudget ? (
                <span className="text-rose-600 font-800">-{formatCurrency(breakdown.overAmount, cur)}</span>
              ) : (
                <span className="text-[#1f4a35] font-800">+{formatCurrency(breakdown.remaining, cur)} left</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs space-y-1">
          <span className="text-[10px] font-700 uppercase tracking-wider text-[#8a8680]">
            Target Daily Allowance
          </span>
          <div className="text-base font-800 text-[#111110]">
            {formatCurrency(trip.totalBudget / numDays, cur)}
          </div>
          <p className="text-[10px] text-[#8a8680]">Across {numDays} days</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs space-y-1">
          <span className="text-[10px] font-700 uppercase tracking-wider text-[#8a8680]">
            Allowance Per Guest
          </span>
          <div className="text-base font-800 text-[#1f4a35]">
            {formatCurrency(trip.totalBudget / (numDays * travelers), cur)}
          </div>
          <p className="text-[10px] text-[#8a8680]">For {travelers} travelers</p>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-700 uppercase tracking-wider text-[#8a8680]">
            <PieChart size={14} className="text-[#1f4a35]" />
            <span>Category Spending</span>
          </div>
          <span className="text-xs text-[#8a8680] font-600">4 Categories</span>
        </div>

        {/* Multi-segment Bar */}
        <div className="h-3 w-full bg-[#f0ece6] rounded-xl overflow-hidden flex border border-[#e4e1db]">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`h-full ${cat.color}`}
              style={{ width: `${Math.max(2, cat.percentage)}%` }}
              title={`${cat.name}: ${cat.percentage.toFixed(0)}%`}
            />
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl bg-white border border-[#e4e1db] shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${cat.bg} ${cat.text} flex items-center justify-center shrink-0`}>
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-700 text-xs text-[#111110] truncate">{cat.name}</h4>
                    <p className="text-[10px] text-[#8a8680] truncate">{cat.sub}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-800 text-[#111110]">
                    {formatCurrency(cat.amount, cur)}
                  </div>
                  <span className="text-[10px] text-[#8a8680] font-600">
                    {cat.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auto-Optimizer Trigger Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#111110] text-white shadow-md flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-700">
            <Sparkles size={14} />
            <span>Intelligent Cost Optimizer</span>
          </div>
          <p className="text-xs text-white/80 max-w-xs leading-relaxed">
            Automatically discover verified 4.0+★ alternatives to lower costs while keeping experience quality high.
          </p>
        </div>

        <button
          onClick={() => setIsOptimizerOpen(true)}
          className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#111110] text-xs font-800 transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          Optimize Now
        </button>
      </div>

      {/* Auto Optimizer Modal */}
      {isOptimizerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsOptimizerOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#f5f2ed] rounded-t-3xl sm:rounded-2xl border border-[#e4e1db] shadow-2xl z-10 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-[#e4e1db] bg-white flex items-center justify-between">
              <div>
                <h3 className="font-800 text-base text-[#111110]">⚡ Budget Auto-Optimizer</h3>
                <p className="text-xs text-[#8a8680]">Smart substitutions to bring your trip under budget</p>
              </div>
              <button onClick={() => setIsOptimizerOpen(false)} className="text-[#8a8680] hover:text-[#111110]">
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              {suggestions.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-800 text-sm text-[#111110]">Itinerary is Already Optimized!</h4>
                  <p className="text-xs text-[#8a8680] max-w-xs mx-auto">
                    No expensive outliers found. You are getting the best value across your scheduled days.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-[#1f4a35] text-white flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-white/80">Total Potential Savings</span>
                      <div className="text-xl font-800 mt-0.5">
                        {formatCurrency(totalPotentialSavings, cur)}
                      </div>
                    </div>
                    <button
                      onClick={handleApplyAllOptimizations}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 text-[#111110] text-xs font-800 hover:bg-amber-300 cursor-pointer shadow-xs"
                    >
                      Apply All ({suggestions.length})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {suggestions.map((s) => (
                      <div key={s.id} className="p-3.5 rounded-xl bg-white border border-[#e4e1db] shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-700 text-[#1f4a35]">
                            Save {formatCurrency(s.savings, cur)}
                          </span>
                          <span className="text-[#8a8680] capitalize">
                            {s.type === 'hotel' ? 'Hotel Swap' : `Day ${s.dayNumber} Swap`}
                          </span>
                        </div>

                        <p className="text-xs text-[#111110] font-500">{s.reason}</p>

                        <div className="grid grid-cols-2 gap-2 text-xs p-2 rounded-lg bg-[#fbf9f6] border border-[#e4e1db]">
                          <div className="opacity-70">
                            <span className="text-[10px] font-bold text-rose-500 uppercase">Current</span>
                            <div className="font-700 truncate">{s.originalPlace.name}</div>
                            <span className="line-through text-[#8a8680]">{formatCurrency(s.originalCost, cur)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#1f4a35] uppercase">Suggested</span>
                            <div className="font-700 truncate">{s.suggestedPlace.name}</div>
                            <span className="font-800 text-[#1f4a35]">{formatCurrency(s.suggestedCost, cur)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated = applyOptimization(trip, s);
                            onUpdateTrip(updated);
                          }}
                          className="w-full py-2 bg-[#1f4a35] text-white rounded-lg text-xs font-700 hover:bg-[#183a2a] transition-colors cursor-pointer"
                        >
                          Accept Swap
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
