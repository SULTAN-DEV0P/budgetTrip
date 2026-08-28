import { Trip, Place, OptimizationResult, OptimizationSuggestion } from '../types/index.js';
import { currencyService } from './currencyService.js';

export const optimizerService = {
  analyzeBudgetOptimization(trip: Trip, placesCatalog: Place[] = []): OptimizationResult {
    const breakdown = trip.breakdown;
    const isOverBudget = breakdown ? breakdown.isOverBudget : false;
    const overAmount = breakdown ? breakdown.overAmount : 0;
    const nights = Math.max(1, trip.totalDays - 1);
    const travelers = trip.travelers || 1;
    const cur = trip.currency || 'USD';

    const suggestions: OptimizationSuggestion[] = [];

    // 1. Hotel Swap: If current hotel is high-cost, find top-rated cheaper alternative
    if (trip.selectedHotel) {
      const hotels = placesCatalog.filter((p) => p.type === 'hotel');
      const cheaperHotels = hotels
        .filter((h) => h.id !== trip.selectedHotel?.id && h.estimatedPrice < (trip.selectedHotel?.estimatedPrice || 0))
        .sort((a, b) => b.rating - a.rating);

      if (cheaperHotels.length > 0) {
        const bestAltHotel = cheaperHotels[0];
        const staySavings = ((trip.selectedHotel.estimatedPrice || 0) - bestAltHotel.estimatedPrice) * nights;

        if (staySavings > 0) {
          suggestions.push({
            type: 'hotel',
            currentName: trip.selectedHotel.name,
            currentPrice: trip.selectedHotel.estimatedPrice,
            suggestedPlace: bestAltHotel,
            suggestedPrice: bestAltHotel.estimatedPrice,
            savings: staySavings,
            savingsLabel: `Save ${currencyService.format(staySavings, cur)} on accommodation over ${nights} nights`,
          });
        }
      }
    }

    // 2. Dining Swap: Detect expensive restaurant slots
    if (trip.days && Array.isArray(trip.days)) {
      const allSlots = trip.days.flatMap((d) => d.slots || []);
      const restaurants = placesCatalog.filter((p) => p.type === 'restaurant');

      const expensiveDiningSlots = allSlots.filter(
        (s) => s.place && s.place.type === 'restaurant' && (s.place.priceLevel || 2) >= 3
      );

      if (expensiveDiningSlots.length > 0 && restaurants.length > 0) {
        const slotToOptimize = expensiveDiningSlots[0];
        const cheaperDining = restaurants
          .filter((r) => r.estimatedPrice < (slotToOptimize.place.estimatedPrice || 0))
          .sort((a, b) => b.rating - a.rating);

        if (cheaperDining.length > 0) {
          const altRest = cheaperDining[0];
          const foodSavings = ((slotToOptimize.place.estimatedPrice || 0) - altRest.estimatedPrice) * travelers;

          if (foodSavings > 0) {
            suggestions.push({
              type: 'restaurant',
              slotId: slotToOptimize.slotId,
              currentName: slotToOptimize.place.name,
              currentPrice: slotToOptimize.place.estimatedPrice,
              suggestedPlace: altRest,
              suggestedPrice: altRest.estimatedPrice,
              savings: foodSavings,
              savingsLabel: `Save ${currencyService.format(foodSavings, cur)} on dining for ${travelers} travelers`,
            });
          }
        }
      }
    }

    const totalPotentialSavings = suggestions.reduce((sum, s) => sum + s.savings, 0);

    return {
      isOverBudget,
      overAmount,
      totalPotentialSavings,
      suggestions,
    };
  },

  applyOptimizations(trip: Trip, suggestions: OptimizationSuggestion[]): Trip {
    let updatedTrip = { ...trip };

    suggestions.forEach((s) => {
      if (s.type === 'hotel') {
        updatedTrip.selectedHotel = s.suggestedPlace;
      } else if (s.type === 'restaurant' && s.slotId) {
        updatedTrip.days = updatedTrip.days.map((day) => ({
          ...day,
          slots: day.slots.map((slot) =>
            slot.slotId === s.slotId
              ? {
                  ...slot,
                  place: s.suggestedPlace,
                  cost: s.suggestedPlace.estimatedPrice * (updatedTrip.travelers || 1),
                }
              : slot
          ),
        }));
      }
    });

    return updatedTrip;
  },
};
