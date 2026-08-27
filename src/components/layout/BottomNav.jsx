import React from 'react';
import { Home, Compass, Calendar, Wallet, Bookmark } from 'lucide-react';

export function BottomNav({ screen, setScreen }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'results', label: 'Explore', icon: Compass },
    { id: 'mytrip', label: 'My Trip', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#e4e1db] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = screen === id || (id === 'results' && screen === 'detail');

          return (
            <button
              key={id}
              onClick={() => setScreen(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors cursor-pointer select-none active:scale-95 duration-150 ${
                isActive ? 'text-[#1f4a35]' : 'text-[#8a8680]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] ${isActive ? 'font-700' : 'font-500'}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
