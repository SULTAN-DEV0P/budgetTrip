import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/screens/HomeScreen';
import { SetupScreen } from './components/screens/SetupScreen';
import { LoadingScreen } from './components/screens/LoadingScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { PlaceDetailScreen } from './components/screens/PlaceDetailScreen';
import { MyTripScreen } from './components/screens/MyTripScreen';
import { BudgetScreen } from './components/screens/BudgetScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { BottomNav } from './components/layout/BottomNav';
import { tripService } from './services/tripService';
import { storageService } from './services/storageService';

export function App() {
  const [screen, setScreen] = useState('home');
  const [detailItem, setDetailItem] = useState(null);

  // Initialize or load trip from storage
  const [currentTrip, setCurrentTrip] = useState(() => {
    const saved = storageService.getCurrentTrip();
    if (saved) return saved;

    // Default 3-day Lagos trip
    const defaultParams = {
      destinationId: 'lagos',
      startDate: '2026-08-28',
      endDate: '2026-08-30',
      travelers: 2,
      totalBudget: 150000,
      currency: 'NGN',
      interests: ['Art', 'Food'],
      accommodationPreference: 'budget',
    };
    return defaultParams;
  });

  const [savedPlaces, setSavedPlaces] = useState(() => storageService.getSavedPlaces());

  // Generate initial full trip object if needed
  useEffect(() => {
    if (!currentTrip?.days) {
      tripService.generateTrip(currentTrip).then((generated) => {
        setCurrentTrip(generated);
        storageService.saveCurrentTrip(generated);
      });
    }
  }, [currentTrip]);

  // Check whether to show bottom nav
  const showBottomNav = !['setup', 'loading', 'detail'].includes(screen);

  // 1. Handle Trip Generation from Setup Wizard
  const handleGenerateTrip = async (params) => {
    const generated = await tripService.generateTrip(params);
    setCurrentTrip(generated);
    storageService.saveCurrentTrip(generated);
  };

  // 2. Add Place to Specific Day & Time Slot
  const handleAddToTrip = (place, dayNumber = 1, timeOfDay = 'afternoon') => {
    if (!currentTrip || !currentTrip.days) return;
    const updated = tripService.addPlaceToDay(currentTrip, place, dayNumber, timeOfDay);
    setCurrentTrip(updated);
    storageService.saveCurrentTrip(updated);
  };

  // 3. Remove Slot from Trip
  const handleRemoveSlot = (slotId) => {
    if (!currentTrip || !currentTrip.days) return;
    const updated = tripService.removeSlot(currentTrip, slotId);
    setCurrentTrip(updated);
    storageService.saveCurrentTrip(updated);
  };

  // 4. Reorder Slots within a Day
  const handleReorderSlots = (dayNumber, fromIdx, toIdx) => {
    if (!currentTrip || !currentTrip.days) return;
    const updated = tripService.reorderSlots(currentTrip, dayNumber, fromIdx, toIdx);
    setCurrentTrip(updated);
    storageService.saveCurrentTrip(updated);
  };

  // 5. Apply Budget Optimizations
  const handleApplyOptimizations = (suggestions) => {
    if (!currentTrip) return;
    const updated = tripService.applyOptimizations(currentTrip, suggestions);
    setCurrentTrip(updated);
    storageService.saveCurrentTrip(updated);
  };

  // 6. Save / Bookmark Place
  const handleToggleSave = (place) => {
    const updated = storageService.toggleSavePlace(place);
    setSavedPlaces(updated);
  };

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [screen]);

  return (
    <div className="w-full min-h-[100dvh] bg-[#f5f2ed] flex justify-center selection:bg-[#1f4a35] selection:text-white">
      {/* Mobile App Viewport Frame */}
      <div className="w-full max-w-md min-h-[100dvh] bg-[#f5f2ed] relative flex flex-col sm:shadow-xl sm:border-x sm:border-[#e4e1db]">
        <main className="flex-1 flex flex-col pb-[env(safe-area-inset-bottom)]">
          {screen === 'home' && (
            <HomeScreen
              setScreen={setScreen}
              setSelectedDestination={(destId) =>
                setCurrentTrip((prev) => ({ ...prev, destinationId: destId }))
              }
            />
          )}

          {screen === 'setup' && (
            <SetupScreen
              setScreen={setScreen}
              tripParams={currentTrip}
              setTripParams={setCurrentTrip}
              onGenerateTrip={handleGenerateTrip}
            />
          )}

          {screen === 'loading' && <LoadingScreen setScreen={setScreen} />}

          {screen === 'results' && (
            <ExploreScreen
              setScreen={setScreen}
              setDetailItem={setDetailItem}
              currentTrip={currentTrip}
              savedPlaces={savedPlaces}
              onToggleSave={handleToggleSave}
              onAddToTrip={handleAddToTrip}
            />
          )}

          {screen === 'detail' && (
            <PlaceDetailScreen
              setScreen={setScreen}
              item={detailItem}
              isSaved={detailItem ? savedPlaces.some((p) => p.id === detailItem.id) : false}
              totalDays={currentTrip?.totalDays || 3}
              onToggleSave={handleToggleSave}
              onAddToTrip={handleAddToTrip}
            />
          )}

          {screen === 'mytrip' && (
            <MyTripScreen
              setScreen={setScreen}
              currentTrip={currentTrip}
              onRemoveSlot={handleRemoveSlot}
              onReorderSlots={handleReorderSlots}
            />
          )}

          {screen === 'budget' && (
            <BudgetScreen
              setScreen={setScreen}
              currentTrip={currentTrip}
              onApplyOptimizations={handleApplyOptimizations}
            />
          )}

          {screen === 'saved' && (
            <SavedScreen
              setScreen={setScreen}
              setDetailItem={setDetailItem}
              savedPlaces={savedPlaces}
              totalDays={currentTrip?.totalDays || 3}
              onToggleSave={handleToggleSave}
              onAddToTrip={handleAddToTrip}
            />
          )}
        </main>

        {/* Fixed Mobile Bottom Navigation */}
        {showBottomNav && <BottomNav screen={screen} setScreen={setScreen} />}
      </div>
    </div>
  );
}

export default App;
