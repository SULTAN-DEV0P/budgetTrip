import React from 'react';
import { Home, Search, Compass, Wallet, Bookmark } from 'lucide-react';

export function BottomNav({ screen, setScreen, savedCount = 0 }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'mytrip', label: 'My Trip', icon: Compass, isCenter: true },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedCount },
  ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-[#e4e1db] shadow-2xl rounded-full px-2 py-1.5 flex items-center justify-around pointer-events-auto ring-1 ring-black/5">
        {tabs.map(({ id, label, icon: Icon, isCenter, badge }) => {
          const isActive = screen === id;

          if (isCenter) {
            return (
              <button
                key={id}
                type="button"
                onClick={() => setScreen(id)}
                className="relative -top-2 flex flex-col items-center group cursor-pointer focus:outline-none select-none active:scale-90 transition-transform"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                    isActive
                      ? 'bg-[#1f4a35] text-white ring-4 ring-[#e8f0ec] scale-105'
                      : 'bg-[#121212] text-white group-hover:bg-[#1f4a35]'
                  }`}
                >
                  <Icon size={22} className={isActive ? 'rotate-12 transition-transform' : ''} />
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight font-800 ${isActive ? 'text-[#1f4a35]' : 'text-[#8a8680]'}`}>
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={id}
              type="button"
              onClick={() => setScreen(id)}
              className={`relative flex-1 py-1.5 px-1 rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                isActive ? 'text-[#1f4a35] font-800' : 'text-[#8a8680] hover:text-[#111110] font-600'
              }`}
            >
              <div className="relative">
                <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#c24a1e] text-white text-[9px] font-800 w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
