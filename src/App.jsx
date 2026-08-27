import React, { useState } from 'react';
import { HomeScreen } from './components/screens/HomeScreen';
import { SetupScreen } from './components/screens/SetupScreen';
import { PlaceholderScreen } from './components/screens/PlaceholderScreen';
import { BottomNav } from './components/layout/BottomNav';
import { storageService } from './services/storageService';
import {
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Users,
  Wallet,
  Palette,
  BedDouble,
  RotateCcw,
  Bookmark,
} from 'lucide-react';

export function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'explore' | 'mytrip' | 'budget' | 'saved' | 'ready'
  const [currentTrip, setCurrentTrip] = useState(() => {
    const saved = storageService.getCurrentTrip();
    return (
      saved || {
        destinationId: 'lagos',
        destinationName: 'Lagos',
        state: 'Lagos State',
        totalDays: 3,
        travelers: 2,
        totalBudget: 150000,
        currency: 'NGN',
        startDate: '2026-08-28',
        endDate: '2026-08-30',
        interests: ['Art', 'Food'],
        accommodationPreference: 'budget',
      }
    );
  });

  const handleGenerateTrip = (params) => {
    const updated = {
      ...currentTrip,
      ...params,
      destinationName:
        params.destinationId === 'abuja'
          ? 'Abuja'
          : params.destinationId === 'abeokuta'
          ? 'Abeokuta'
          : 'Lagos',
      state:
        params.destinationId === 'abuja'
          ? 'FCT'
          : params.destinationId === 'abeokuta'
          ? 'Ogun State'
          : 'Lagos State',
    };
    setCurrentTrip(updated);
    storageService.saveCurrentTrip(updated);
    setScreen('ready');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#f5f2ed] flex justify-center selection:bg-[#1f4a35] selection:text-white">
      {/* Mobile-first App Container */}
      <div className="w-full max-w-md min-h-[100dvh] bg-[#f5f2ed] relative flex flex-col sm:shadow-xl sm:border-x sm:border-[#e4e1db]">
        <main className="flex-1 flex flex-col pb-16">
          {screen === 'home' && (
            <HomeScreen
              setScreen={(s) => setScreen(s === 'setup' ? 'explore' : s)}
              setSelectedDestination={(destId) =>
                setCurrentTrip((prev) => ({ ...prev, destinationId: destId }))
              }
            />
          )}

          {screen === 'explore' && (
            <SetupScreen
              setScreen={setScreen}
              tripParams={currentTrip}
              setTripParams={setCurrentTrip}
              onGenerateTrip={handleGenerateTrip}
            />
          )}

          {screen === 'mytrip' && (
            <PlaceholderScreen
              title="My Trip page"
              subtitle="This screen is reserved for your collaborator to build the day-by-day itinerary schedule."
              icon={Calendar}
            />
          )}

          {screen === 'budget' && (
            <PlaceholderScreen
              title="Budget page"
              subtitle="This screen is reserved for your collaborator to build the category budget breakdown and optimizer."
              icon={Wallet}
            />
          )}

          {screen === 'saved' && (
            <PlaceholderScreen
              title="Saved page"
              subtitle="This screen is reserved for your collaborator to build the saved bookmarks catalog."
              icon={Bookmark}
            />
          )}

          {screen === 'ready' && (
            <div className="flex flex-col min-h-full bg-[#f5f2ed] p-5 pt-12 space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setScreen('explore')}
                  className="flex items-center gap-2 text-[#8a8680] hover:text-[#111110] transition-colors cursor-pointer"
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm font-600">Edit Setup</span>
                </button>
                <button
                  onClick={() => setScreen('home')}
                  className="flex items-center gap-1.5 text-xs text-[#8a8680] hover:text-[#111110] transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Start Over</span>
                </button>
              </div>

              <div className="text-center space-y-2 pt-2">
                <div className="w-14 h-14 rounded-2xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={28} />
                </div>
                <h1 className="text-2xl font-800 text-[#111110]">Trip Parameters Ready</h1>
                <p className="text-xs text-[#8a8680] font-500 max-w-xs mx-auto">
                  Step 1 (Mock Data & Models) and Step 2 (Trip Setup Wizard) are complete and saved.
                </p>
              </div>

              {/* Selected Summary Card */}
              <div className="bg-white rounded-[16px] border border-[#e4e1db] p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#e4e1db]">
                  <div>
                    <h2 className="font-800 text-lg text-[#111110]">
                      {currentTrip.destinationName}
                    </h2>
                    <p className="text-xs text-[#8a8680]">{currentTrip.state}, Nigeria</p>
                  </div>
                  <span className="text-xs font-700 bg-[#e8f0ec] text-[#1f4a35] px-3 py-1 rounded-full">
                    Configured
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8a8680] flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#1f4a35]" />
                      <span>Travel Dates:</span>
                    </span>
                    <span className="font-700 text-[#111110]">
                      {currentTrip.startDate} → {currentTrip.endDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#8a8680] flex items-center gap-1.5">
                      <Users size={14} className="text-[#1f4a35]" />
                      <span>Travelers:</span>
                    </span>
                    <span className="font-700 text-[#111110]">
                      {currentTrip.travelers} {currentTrip.travelers > 1 ? 'Travelers' : 'Traveler'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#8a8680] flex items-center gap-1.5">
                      <Wallet size={14} className="text-[#1f4a35]" />
                      <span>Total Budget:</span>
                    </span>
                    <span className="font-800 text-sm text-[#1f4a35]">
                      ₦{currentTrip.totalBudget?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#8a8680] flex items-center gap-1.5">
                      <BedDouble size={14} className="text-[#1f4a35]" />
                      <span>Stay Style:</span>
                    </span>
                    <span className="font-700 text-[#111110] capitalize">
                      {currentTrip.accommodationPreference}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#e4e1db]">
                    <span className="text-[#8a8680] flex items-center gap-1.5 mb-1.5">
                      <Palette size={14} className="text-[#1f4a35]" />
                      <span>Selected Interests:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentTrip.interests?.map((interest) => (
                        <span
                          key={interest}
                          className="text-[11px] font-600 px-2.5 py-0.5 rounded-full bg-[#f0ece6] text-[#111110]"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setScreen('explore')}
                  className="w-full bg-[#1f4a35] text-white rounded-xl py-3.5 font-700 text-sm shadow-md active:opacity-90 transition-opacity cursor-pointer"
                >
                  Modify Trip Parameters
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation (Always accessible) */}
        <BottomNav
          screen={screen === 'ready' ? 'explore' : screen}
          setScreen={setScreen}
        />
      </div>
    </div>
  );
}

export default App;
