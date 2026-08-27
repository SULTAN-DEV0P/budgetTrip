import React from 'react';
import { Compass, Wallet, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { CURRENCIES } from '../../types';

export function Header({
  activeTrip,
  currentCurrency,
  onCurrencyChange,
  onResetTrip,
}) {
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={onResetTrip}>
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">BudgetTrip</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/25">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Smart travel on your exact budget</p>
          </div>
        </div>

        {/* Center: Current Trip Indicator */}
        {activeTrip && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-white">{activeTrip.destinationName}</span>
            <span className="text-slate-500">•</span>
            <span>{activeTrip.totalDays} Days ({activeTrip.travelers} {activeTrip.travelers > 1 ? 'Travelers' : 'Traveler'})</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Currency Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>{CURRENCIES[currentCurrency]?.symbol || '₦'}</span>
              <span className="text-slate-400">{currentCurrency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {currencyOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-xl shadow-black/40 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                  Select Currency
                </div>
                {Object.values(CURRENCIES).map(curr => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      onCurrencyChange(curr.code);
                      setCurrencyOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-amber-400 w-4">{curr.symbol}</span>
                      <span>{curr.code}</span>
                    </span>
                    {currentCurrency === curr.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset / New Trip Button */}
          {activeTrip && (
            <button
              type="button"
              onClick={onResetTrip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 transition-colors cursor-pointer"
              title="Start New Plan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">New Trip</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
