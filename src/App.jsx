import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { SetupScreen } from './components/screens/SetupScreen';
import { ItineraryScreen } from './components/screens/ItineraryScreen';
import { BudgetScreen } from './components/screens/BudgetScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { BottomNav } from './components/layout/BottomNav';
import { DestinationPickerModal } from './components/common/DestinationPickerModal';
import { PlaceDetailModal } from './components/common/PlaceDetailModal';
import { storageService } from './services/storageService';
import { apiService } from './services/apiService';
import {
  WORLD_DESTINATIONS,
  generatePlacesForDestination,
  generateDefaultTripForDestination,
} from './services/destinationService';
import { getCurrencyForCountry, convertTripCurrency } from './utils/currency';

export function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'explore' | 'mytrip' | 'budget' | 'saved'

  // Initialize Destination & Trip safely with validation
  const [currentTrip, setCurrentTrip] = useState(() => {
    try {
      const saved = storageService.getCurrentTrip();
      if (saved && saved.destinationId && Array.isArray(saved.days) && saved.days.length > 0) {
        return saved;
      }
    } catch (e) {
      console.warn('Could not parse stored trip, regenerating default:', e);
    }
    const initialDest = WORLD_DESTINATIONS[0];
    const defaultTrip = generateDefaultTripForDestination(initialDest, 3, 2);
    storageService.saveCurrentTrip(defaultTrip);
    return defaultTrip;
  });

  const [activeCurrency, setActiveCurrency] = useState(
    () => currentTrip?.currency || getCurrencyForCountry(currentTrip?.country) || 'USD'
  );

  const [savedPlaces, setSavedPlaces] = useState(() => {
    try {
      return storageService.getSavedPlaces() || [];
    } catch {
      return [];
    }
  });
  const [isDestinationPickerOpen, setIsDestinationPickerOpen] = useState(false);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);

  // Dynamic places catalog based on active destination
  const activeDestMeta =
    WORLD_DESTINATIONS.find((d) => d.id === currentTrip?.destinationId) ||
    WORLD_DESTINATIONS.find((d) => d.country && currentTrip?.country && d.country.toLowerCase() === currentTrip.country.toLowerCase()) ||
    WORLD_DESTINATIONS[0];

  const [placesCatalog, setPlacesCatalog] = useState(() =>
    generatePlacesForDestination(activeDestMeta)
  );

  // Fetch live real-world places from backend (with automatic fallback)
  useEffect(() => {
    let isMounted = true;

    apiService
      .searchPlaces({
        destinationId: activeDestMeta.id,
        currency: activeCurrency,
      })
      .then((livePlaces) => {
        if (isMounted && livePlaces && Array.isArray(livePlaces) && livePlaces.length > 0) {
          setPlacesCatalog(livePlaces);
        }
      })
      .catch(() => {
        // keep curated catalog
      });

    return () => {
      isMounted = false;
    };
  }, [activeDestMeta, activeCurrency]);

  const handleSelectDestination = (destination) => {
    const localCur = destination.currency || getCurrencyForCountry(destination.country);
    const newTrip = generateDefaultTripForDestination(
      destination,
      currentTrip?.totalDays || 3,
      currentTrip?.travelers || 2
    );
    setCurrentTrip(newTrip);
    setActiveCurrency(localCur);
    storageService.saveCurrentTrip(newTrip);
    setScreen('mytrip');
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
    const updated = convertTripCurrency(currentTrip, newCur);
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

          {screen === 'explore' && (
            <ExploreScreen
              setScreen={setScreen}
              setDetailItem={(place) => setSelectedPlaceDetail(place)}
              currentTrip={currentTrip}
              placesCatalog={placesCatalog}
              savedPlaces={savedPlaces}
              onToggleSave={handleToggleSavePlace}
              onAddToTrip={(place, dayNum, slotTime) => {
                if (place.type === 'hotel') {
                  handleUpdateTrip({ ...currentTrip, selectedHotel: place });
                } else {
                  const targetDay = dayNum || 1;
                  const updatedDays = currentTrip.days.map((d) =>
                    d.dayNumber === targetDay
                      ? {
                          ...d,
                          slots: [
                            ...(d.slots || []),
                            {
                              slotId: `slot-${Date.now()}`,
                              timeOfDay: slotTime || 'afternoon',
                              place,
                              notes: '',
                            },
                          ],
                        }
                      : d
                  );
                  handleUpdateTrip({ ...currentTrip, days: updatedDays });
                }
                setScreen('mytrip');
              }}
              onOpenDestinationPicker={() => setIsDestinationPickerOpen(true)}
            />
          )}

          {screen === 'setup' && (
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
