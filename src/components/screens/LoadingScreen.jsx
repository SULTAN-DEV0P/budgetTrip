import React, { useState, useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';

const STEPS = [
  'Checking accommodation',
  'Finding affordable food',
  'Finding things to do',
  'Optimizing your budget',
];

export function LoadingScreen({ setScreen }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, index) =>
      setTimeout(() => setCurrentStep(index + 1), (index + 1) * 700)
    );

    const finishTimer = setTimeout(() => {
      setScreen('results');
    }, (STEPS.length + 1) * 700);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [setScreen]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f2ed] items-center justify-center px-8">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#e8f0ec] flex items-center justify-center mb-8 shadow-sm animate-pulse">
        <Sparkles size={28} className="text-[#1f4a35]" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-800 text-[#111110] mb-2 text-center">Building your trip</h1>
      <p className="text-sm text-[#8a8680] font-500 text-center mb-10">
        Finding places that fit your budget...
      </p>

      {/* Steps List */}
      <div className="w-full max-w-xs space-y-4">
        {STEPS.map((step, index) => {
          const isDone = currentStep > index;
          const isCurrent = currentStep === index;

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isDone
                    ? 'bg-[#1f4a35]'
                    : isCurrent
                    ? 'border-2 border-[#1f4a35] animate-pulse'
                    : 'border-2 border-[#e4e1db]'
                }`}
              >
                {isDone && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
              <span
                className={`text-sm font-600 transition-colors ${
                  isDone
                    ? 'text-[#1f4a35]'
                    : isCurrent
                    ? 'text-[#111110]'
                    : 'text-[#8a8680]'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
