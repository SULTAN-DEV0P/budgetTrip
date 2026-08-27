import React, { useState } from 'react';
import {
  BedDouble,
  Utensils,
  Compass,
  Navigation,
  Check,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { OptimizerModal } from '../modals/OptimizerModal';
import { tripService } from '../../services/tripService';

export function BudgetScreen({
  setScreen,
  currentTrip,
  onApplyOptimizations,
}) {
  const [isOptimizerModalOpen, setIsOptimizerModalOpen] = useState(false);

  const breakdown = currentTrip?.breakdown || tripService.calculateBudget(currentTrip) || {
    totalBudget: 150000,
    totalEstimated: 127500,
    remaining: 22500,
    isOverBudget: false,
    overAmount: 0,
    accommodation: 60000,
    food: 34000,
    activities: 16000,
    transportation: 17500,
    categoryPercentages: { accommodation: 47, food: 27, activities: 12, transportation: 14 },
  };

  const totalBudget = currentTrip?.totalBudget || 150000;
  const estimatedSpending = breakdown.totalEstimated;
  const remaining = breakdown.remaining;
  const isOverBudget = breakdown.isOverBudget;

  const categories = [
    { icon: BedDouble, label: 'Accommodation', amount: breakdown.accommodation, color: '#1f4a35' },
    { icon: Utensils, label: 'Food & Dining', amount: breakdown.food, color: '#3a6b52' },
    { icon: Compass, label: 'Activities', amount: breakdown.activities, color: '#5e8c75' },
    { icon: Navigation, label: 'Transportation', amount: breakdown.transportation, color: '#8aad9e' },
  ];

  // Compute optimization opportunities
  const optimizationData = tripService.optimizeTripBudget(currentTrip);

  const handleOpenOptimizer = () => {
    setIsOptimizerModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed]">
      {/* Top Header & Total Budget Hero */}
      <div className="bg-white border-b border-[#e4e1db] px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-800 text-[#111110]">Your Budget</h1>
          <span className="text-xs font-700 bg-[#e8f0ec] text-[#1f4a35] px-2.5 py-1 rounded-full">
            Real-Time
          </span>
        </div>
        <p className="text-xs text-[#8a8680] font-500">
          {currentTrip?.destinationName || 'Lagos'} · {currentTrip?.totalDays || 3} Days ({currentTrip?.travelers || 2} Travelers)
        </p>

        <div className="mt-5 text-center">
          <p className="text-4xl font-800 text-[#111110] tracking-tight">
            ₦{totalBudget.toLocaleString()}
          </p>
          <p className="text-xs text-[#8a8680] font-500 mt-1">Total budget set</p>
        </div>
      </div>

      {/* Main Budget Analysis Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-28 space-y-5">
        {/* Estimated Spending Status Box */}
        <div
          className={`rounded-[16px] p-5 transition-colors ${
            isOverBudget ? 'bg-[#fdf0eb]' : 'bg-[#e8f0ec]'
          }`}
        >
          <p className={`text-3xl font-800 ${isOverBudget ? 'text-[#c24a1e]' : 'text-[#111110]'}`}>
            ₦{estimatedSpending.toLocaleString()}
          </p>
          <p className="text-sm text-[#8a8680] font-500 mt-1">Total estimated spending</p>

          {isOverBudget ? (
            <div className="flex items-center gap-2 mt-3">
              <AlertTriangle size={15} className="text-[#c24a1e]" />
              <span className="text-sm font-700 text-[#c24a1e]">
                ₦{Math.abs(remaining).toLocaleString()} over budget
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-3">
              <Check size={15} className="text-[#1f4a35]" strokeWidth={3} />
              <span className="text-sm font-700 text-[#1f4a35]">
                ₦{remaining.toLocaleString()} remaining
              </span>
            </div>
          )}
        </div>

        {/* Budget Breakdown Progress Bars */}
        <div className="bg-white rounded-[16px] border border-[#e4e1db] p-5 shadow-sm">
          <h2 className="text-sm font-700 text-[#111110] mb-4">Budget breakdown</h2>

          <div className="space-y-4">
            {categories.map(({ icon: Icon, label, amount, color }) => {
              const pct = totalBudget > 0 ? Math.min((amount / totalBudget) * 100, 100) : 0;

              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#f0ece6] flex items-center justify-center">
                        <Icon size={14} style={{ color }} />
                      </div>
                      <span className="text-sm font-600 text-[#111110]">{label}</span>
                    </div>
                    <span className="text-sm font-700 text-[#111110]">
                      ₦{amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-2 bg-[#f0ece6] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optimization / On-Track Status Card */}
        {isOverBudget ? (
          <div className="bg-white rounded-[16px] border border-[#e4e1db] p-5 space-y-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf0eb] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-[#c24a1e]" />
              </div>
              <div>
                <p className="font-700 text-[#111110]">
                  You're over budget by ₦{Math.abs(remaining).toLocaleString()}.
                </p>
                <p className="text-sm text-[#8a8680] font-500 mt-1 leading-relaxed">
                  BudgetTrip found cheaper high-rated alternatives that could bring your trip back within budget.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenOptimizer}
              className="w-full bg-[#c24a1e] text-white rounded-xl py-3.5 font-700 text-sm cursor-pointer active:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles size={16} />
              <span>Find cheaper options</span>
            </button>
            <button
              onClick={() => setScreen('mytrip')}
              className="w-full border border-[#e4e1db] text-[#111110] rounded-xl py-3 font-600 text-sm hover:bg-[#f5f2ed] transition-colors cursor-pointer"
            >
              Review my trip
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-[#e4e1db] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f0ec] flex items-center justify-center flex-shrink-0">
                <Check size={20} className="text-[#1f4a35]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-700 text-[#111110]">You're on track</p>
                <p className="text-xs text-[#8a8680]">Spending fits comfortably within your set budget.</p>
              </div>
            </div>

            <div className="bg-[#f5f2ed] p-3 rounded-xl border border-[#e4e1db]">
              <p className="text-xs text-[#8a8680] font-500">Available balance</p>
              <p className="text-2xl font-800 text-[#1f4a35]">
                ₦{remaining.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleOpenOptimizer}
                className="flex-1 py-3 rounded-xl border border-[#e4e1db] text-xs font-700 text-[#111110] hover:bg-[#f5f2ed] transition-colors cursor-pointer"
              >
                Optimize Stays
              </button>
              <button
                onClick={() => setScreen('results')}
                className="flex-1 bg-[#1f4a35] text-white rounded-xl py-3 text-xs font-700 active:opacity-90 transition-opacity cursor-pointer"
              >
                Add More Places
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Optimizer Modal */}
      <OptimizerModal
        isOpen={isOptimizerModalOpen}
        onClose={() => setIsOptimizerModalOpen(false)}
        optimizationData={optimizationData}
        onApply={(suggestions) => {
          if (onApplyOptimizations) onApplyOptimizations(suggestions);
        }}
      />
    </div>
  );
}
