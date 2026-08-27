/**
 * LocalStorage Persistence Service for BudgetTrip MVP
 */

const KEYS = {
  CURRENT_TRIP: 'budgettrip_current_trip',
  SAVED_PLACES: 'budgettrip_saved_places',
  USER_PREFERENCES: 'budgettrip_user_preferences',
  RECENT_SEARCHES: 'budgettrip_recent_searches',
};

export const storageService = {
  // Current Trip
  getCurrentTrip() {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_TRIP);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn('Failed to load trip from localStorage:', err);
      return null;
    }
  },

  saveCurrentTrip(trip) {
    try {
      localStorage.setItem(KEYS.CURRENT_TRIP, JSON.stringify(trip));
    } catch (err) {
      console.warn('Failed to save trip to localStorage:', err);
    }
  },

  clearCurrentTrip() {
    try {
      localStorage.removeItem(KEYS.CURRENT_TRIP);
    } catch (err) {
      console.warn('Failed to clear trip:', err);
    }
  },

  // Saved Places / Bookmarks
  getSavedPlaces() {
    try {
      const data = localStorage.getItem(KEYS.SAVED_PLACES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleSavePlace(place) {
    const saved = this.getSavedPlaces();
    const exists = saved.some(p => p.id === place.id);
    let updated;
    if (exists) {
      updated = saved.filter(p => p.id !== place.id);
    } else {
      updated = [place, ...saved];
    }
    localStorage.setItem(KEYS.SAVED_PLACES, JSON.stringify(updated));
    return updated;
  },

  isPlaceSaved(placeId) {
    const saved = this.getSavedPlaces();
    return saved.some(p => p.id === placeId);
  },

  // User Preferences (Currency, Default Travelers, etc.)
  getPreferences() {
    try {
      const data = localStorage.getItem(KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : { currency: 'NGN', defaultTravelers: 1 };
    } catch {
      return { currency: 'NGN', defaultTravelers: 1 };
    }
  },

  savePreferences(prefs) {
    try {
      const existing = this.getPreferences();
      localStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify({ ...existing, ...prefs }));
    } catch (err) {
      console.warn('Failed to save preferences:', err);
    }
  },
};
