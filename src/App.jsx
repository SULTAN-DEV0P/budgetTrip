import React, { useState, useMemo } from 'react';
import { HomeScreen } from './components/screens/HomeScreen';
import { SetupScreen } from './components/screens/SetupScreen';
import { ItineraryScreen } from './components/screens/ItineraryScreen';
import { BudgetScreen } from './components/screens/BudgetScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { BottomNav } from './components/layout/BottomNav';
import { DestinationPickerModal } from './components/common/DestinationPickerModal';
import { PlaceDetailModal } from './components/common/PlaceDetailModal';
import { storageService } from './services/storageService';
import {
  WORLD_DESTINATIONS,
  generatePlacesForDestination,
  generateDefaultTripForDestination,
} from './services/destinationService';
import { getCurrencyForCountry } from './utils/currency';

export function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'explore' | 'mytrip' | 'budget' | 'saved'

  // Initialize Destination & Trip
  const [currentTrip, setCurrentTrip] = useState(() => {
    const saved = storageService.getCurrentTrip();
    if (saved && saved.destinationId) {
      return saved;
    }
    const initialDest = WORLD_DESTINATIONS[0];
    return generateDefaultTripForDestination(initialDest, 3, 2);
  });

  const [activeCurrency, setActiveCurrency] = useState(
    () => currentTrip.currency || getCurrencyForCountry(currentTrip.country) || 'USD'
  );

  const [savedPlaces, setSavedPlaces] = useState(() => storageService.getSavedPlaces());
  const [isDestinationPickerOpen, setIsDestinationPickerOpen] = useState(false);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);

  // Dynamic places catalog based on active destination
  const activeDestMeta =
    WORLD_DESTINATIONS.find((d) => d.id === currentTrip.destinationId) ||
    WORLD_DESTINATIONS.find((d) => d.country.toLowerCase() === (currentTrip.country || '').toLowerCase()) ||
    WORLD_DESTINATIONS[0];

  const placesCatalog = useMemo(() => {
    return generatePlacesForDestination(activeDestMeta);
  }, [activeDestMeta]);

  const handleSelectDestination = (destination) => {
    const localCur = destination.currency || getCurrencyForCountry(destination.country);
    const newTrip = generateDefaultTripForDestination(
      destination,
      currentTrip.totalDays || 3,
      currentTrip.travelers || 2
    );
    setCurrentTrip(newTrip);
    setActiveCurrency(localCur);
    storageService.saveCurrentTrip(newTrip);
  };

  const handleUpdateTrip = (updated) => {
    setCurrentTrip(updated);
    storageService.saveCurrentTrip(updated);
  };

  const handleToggleSavePlace = (place) => {
    const updated = storageService.toggleSavePlace(place);
    setSavedPlaces(updated);
  };

  const handleCurrencyChange = (newCur) => {
    setActiveCurrency(newCur);
    const updated = {
      ...currentTrip,
      currency: newCur,
    };
    setCurrentTrip(updated);
    storageService.saveCurrentTrip(updated);
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#f5f2ed] flex justify-center selection:bg-[#1f4a35] selection:text-white antialiased font-sans">
      {/* Mobile-first App Shell */}
      <div className="w-full max-w-md min-h-[100dvh] bg-[#f5f2ed] relative flex flex-col sm:shadow-xl sm:border-x sm:border-[#e4e1db]">
        <main className="flex-1 flex flex-col pb-16">
          {screen === 'home' && (
            <HomeScreen
              setScreen={setScreen}
              currentTrip={currentTrip}
              onSelectDestination={(dest) => {
                handleSelectDestination(dest);
                setScreen('mytrip');
              }}
              onOpenDestinationPicker={() => setIsDestinationPickerOpen(true)}
            />
          )}

          {(screen === 'explore' || screen === 'setup') && (
            <SetupScreen
              setScreen={setScreen}
              tripParams={currentTrip}
              setTripParams={setCurrentTrip}
              onGenerateTrip={(params) => {
                const dest = WORLD_DESTINATIONS.find((d) => d.id === params.destinationId) || activeDestMeta;
                const newTrip = generateDefaultTripForDestination(dest, params.totalDays || 3, params.travelers || 2);
                newTrip.totalBudget = params.totalBudget;
                newTrip.interests = params.interests;
                newTrip.accommodationPreference = params.accommodationPreference;
                handleUpdateTrip(newTrip);
                setScreen('mytrip');
              }}
              onOpenDestinationPicker={() => setIsDestinationPickerOpen(true)}
            />
          )}

          {screen === 'mytrip' && (
            <ItineraryScreen
              trip={currentTrip}
              onUpdateTrip={handleUpdateTrip}
              placesCatalog={placesCatalog}
              onOpenPlaceDetail={(place) => setSelectedPlaceDetail(place)}
              onOpenOptimizer={() => setScreen('budget')}
            />
          )}

          {screen === 'budget' && (
            <BudgetScreen
              trip={currentTrip}
              onUpdateTrip={handleUpdateTrip}
              placesCatalog={placesCatalog}
              currency={activeCurrency}
              onCurrencyChange={handleCurrencyChange}
            />
          )}

          {screen === 'saved' && (
            <SavedScreen
              savedPlaces={savedPlaces}
              onToggleSave={handleToggleSavePlace}
              onOpenPlaceDetail={(place) => setSelectedPlaceDetail(place)}
              trip={currentTrip}
              onUpdateTrip={handleUpdateTrip}
              currency={activeCurrency}
            />
          )}
        </main>

        {/* Global Bottom Navigation */}
        <BottomNav
          screen={screen}
          setScreen={setScreen}
          savedCount={savedPlaces.length}
        />

        {/* Global Destination Picker Modal */}
        <DestinationPickerModal
          isOpen={isDestinationPickerOpen}
          onClose={() => setIsDestinationPickerOpen(false)}
          onSelectDestination={handleSelectDestination}
          currentDestinationId={currentTrip.destinationId}
        />

        {/* Global Place Detail Modal */}
        <PlaceDetailModal
          place={selectedPlaceDetail}
          isOpen={!!selectedPlaceDetail}
          onClose={() => setSelectedPlaceDetail(null)}
          onToggleSave={handleToggleSavePlace}
          isSaved={selectedPlaceDetail ? savedPlaces.some((p) => p.id === selectedPlaceDetail.id) : false}
          onAddToTrip={(place) => {
            if (place.type === 'hotel') {
              handleUpdateTrip({ ...currentTrip, selectedHotel: place });
            } else {
              const updatedDays = currentTrip.days.map((d) =>
                d.dayNumber === 1
                  ? {
                      ...d,
                      slots: [
                        ...(d.slots || []),
                        {
                          slotId: `slot-${Date.now()}`,
                          timeOfDay: 'afternoon',
                          place,
                          notes: '',
                        },
                      ],
                    }
                  : d
              );
              handleUpdateTrip({ ...currentTrip, days: updatedDays });
            }
            setSelectedPlaceDetail(null);
            setScreen('mytrip');
          }}
          currency={activeCurrency}
        />
      </div>
    </div>
  );
}

export default App;
