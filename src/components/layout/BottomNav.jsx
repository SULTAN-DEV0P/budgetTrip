import React from 'react';
import { Home, Search, Compass, Wallet, Bookmark } from 'lucide-react';

export function BottomNav({ screen, setScreen, savedCount = 0 }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, isCenter: false },
    { id: 'explore', label: 'Explore', icon: Search, isCenter: false },
    { id: 'mytrip', label: 'My Trip', icon: Compass, isCenter: true },
    { id: 'budget', label: 'Budget', icon: Wallet, isCenter: false },
    { id: 'saved', label: 'Saved', icon: Bookmark, isCenter: false, badge: savedCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e4e1db] pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map(({ id, label, icon: Icon, isCenter, badge }) => {
          const isActive = screen === id;

          if (isCenter) {
            return (
              <button
                key={id}
                onClick={() => setScreen(id)}
                className="flex flex-col items-center justify-center -mt-3 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                    isActive
                      ? 'bg-[#1f4a35] text-white ring-4 ring-[#e8f0ec]'
                      : 'bg-[#111110] text-white group-hover:bg-[#1f4a35]'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'rotate-12 transition-transform' : ''} />
                </div>
                <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-[#1f4a35] font-800' : 'text-[#8a8680] font-600'}`}>
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-2 transition-colors cursor-pointer select-none ${
                isActive ? 'text-[#1f4a35]' : 'text-[#8a8680] hover:text-[#111110]'
              }`}
            >
              <div className="relative">
                <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#1f4a35] text-white text-[9px] font-800 w-4 h-4 rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-800' : 'font-600'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
