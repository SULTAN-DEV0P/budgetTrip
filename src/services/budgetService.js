import { convertCurrency } from '../utils/currency';

export function calculateTripBudget(trip) {
  const numDays = trip.totalDays || 1;
  const travelers = trip.travelers || 1;
  const nights = Math.max(1, numDays - 1);
  const cur = trip.currency || 'USD';

  // 1. Accommodation
  const accommodationCost = trip.selectedHotel
    ? (trip.selectedHotel.estimatedPrice || 0) * nights
    : 0;

  // 2. Scheduled slots
  let foodCost = 0;
  let activitiesCost = 0;
  let transportationCost = Math.round(convertCurrency(numDays * travelers * 5, 'USD', cur)); // Default local transit allowance

  if (trip.days && Array.isArray(trip.days)) {
    trip.days.forEach((day) => {
      if (day.slots && Array.isArray(day.slots)) {
        day.slots.forEach((slot) => {
          if (!slot.place) return;
          const cost = slot.customCost !== undefined 
            ? slot.customCost 
            : (slot.place.estimatedPrice || 0) * travelers;

          if (slot.place.type === 'restaurant') foodCost += cost;
          if (slot.place.type === 'activity') activitiesCost += cost;
          if (slot.place.type === 'transport') transportationCost += cost;
        });
      }
    });
  }

  const totalEstimated = accommodationCost + foodCost + activitiesCost + transportationCost;
  const totalBudget = trip.totalBudget || 0;
  const remaining = totalBudget - totalEstimated;

  return {
    accommodation: accommodationCost,
    food: foodCost,
    activities: activitiesCost,
    transportation: transportationCost,
    totalEstimated,
    totalBudget,
    remaining,
    isOverBudget: remaining < 0,
    overAmount: remaining < 0 ? Math.abs(remaining) : 0,
    percentageUsed: totalBudget > 0 ? (totalEstimated / totalBudget) * 100 : 0,
    categoryPercentages: {
      accommodation: totalEstimated > 0 ? (accommodationCost / totalEstimated) * 100 : 0,
      food: totalEstimated > 0 ? (foodCost / totalEstimated) * 100 : 0,
      activities: totalEstimated > 0 ? (activitiesCost / totalEstimated) * 100 : 0,
      transportation: totalEstimated > 0 ? (transportationCost / totalEstimated) * 100 : 0,
    },
  };
}

export function generateOptimizationSuggestions(trip, placesCatalog = []) {
  if (!trip) return [];
  const suggestions = [];
  const cur = trip.currency || 'USD';
  const travelers = trip.travelers || 1;
  const numDays = trip.totalDays || 1;
  const nights = Math.max(1, numDays - 1);

  // Normalize all catalog places to trip's target currency and filter to current destination
  const normalizedCatalog = (placesCatalog || []).map((p) => {
    const placeCur = p.currency || cur;
    const priceInTripCur =
      placeCur === cur ? p.estimatedPrice : Math.round(convertCurrency(p.estimatedPrice, placeCur, cur));
    return {
      ...p,
      currency: cur,
      estimatedPrice: priceInTripCur,
    };
  });

  // 1. Hotel Swap if Hotel is expensive
  if (trip.selectedHotel && trip.selectedHotel.priceLevel >= 2) {
    const hotelOrigPrice = trip.selectedHotel.currency === cur
      ? trip.selectedHotel.estimatedPrice
      : Math.round(convertCurrency(trip.selectedHotel.estimatedPrice, trip.selectedHotel.currency || 'USD', cur));

    const alternativeHotels = normalizedCatalog.filter(
      (p) =>
        p.type === 'hotel' &&
        p.id !== trip.selectedHotel?.id &&
        p.estimatedPrice < hotelOrigPrice &&
        p.rating >= 4.2
    ).sort((a, b) => a.estimatedPrice - b.estimatedPrice);

    if (alternativeHotels.length > 0) {
      const topAlt = alternativeHotels[0];
      const origTotal = (hotelOrigPrice || 0) * nights;
      const suggTotal = (topAlt.estimatedPrice || 0) * nights;
      const savings = origTotal - suggTotal;

      if (savings > 0 && savings < origTotal * 0.95) {
        suggestions.push({
          id: `opt-hotel-${topAlt.id}`,
          type: 'hotel',
          originalPlace: { ...trip.selectedHotel, estimatedPrice: hotelOrigPrice, currency: cur },
          suggestedPlace: topAlt,
          originalCost: origTotal,
          suggestedCost: suggTotal,
          savings,
          reason: `Switch to highly rated boutique stay "${topAlt.name}" (${topAlt.rating}★) to lower accommodation cost.`,
        });
      }
    }
  }

  // 2. High-cost slot swaps
  if (trip.days && Array.isArray(trip.days)) {
    trip.days.forEach((day) => {
      if (day.slots && Array.isArray(day.slots)) {
        day.slots.forEach((slot) => {
          if (slot.place && slot.place.type === 'restaurant' && slot.place.priceLevel >= 2) {
            const slotPlacePrice = slot.place.currency === cur
              ? slot.place.estimatedPrice
              : Math.round(convertCurrency(slot.place.estimatedPrice, slot.place.currency || 'USD', cur));

            const altRest = normalizedCatalog.filter(
              (p) =>
                p.type === 'restaurant' &&
                p.id !== slot.place.id &&
                p.estimatedPrice < slotPlacePrice &&
                p.rating >= 4.2
            ).sort((a, b) => a.estimatedPrice - b.estimatedPrice)[0];

            if (altRest) {
              const origCost = slot.customCost !== undefined
                ? slot.customCost
                : (slotPlacePrice || 0) * travelers;
              const suggCost = (altRest.estimatedPrice || 0) * travelers;
              const savings = origCost - suggCost;

              if (savings > 0 && savings < origCost * 0.95) {
                suggestions.push({
                  id: `opt-slot-${day.dayNumber}-${slot.slotId}`,
                  slotId: slot.slotId,
                  dayNumber: day.dayNumber,
                  type: 'slot',
                  originalPlace: { ...slot.place, estimatedPrice: slotPlacePrice, currency: cur },
                  suggestedPlace: altRest,
                  originalCost: origCost,
                  suggestedCost: suggCost,
                  savings,
                  reason: `Replace dining at ${slot.place.name} on Day ${day.dayNumber} with authentic ${altRest.name}.`,
                });
              }
            }
          }
        });
      }
    });
  }

  return suggestions;
}

export function applyOptimization(trip, suggestion) {
  if (suggestion.type === 'hotel') {
    return {
      ...trip,
      selectedHotel: suggestion.suggestedPlace,
      updatedAt: new Date().toISOString(),
    };
  }

  if (suggestion.type === 'slot' && suggestion.slotId && suggestion.dayNumber) {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== suggestion.dayNumber) return day;
      const updatedSlots = day.slots.map((slot) => {
        if (slot.slotId !== suggestion.slotId) return slot;
        return {
          ...slot,
          place: suggestion.suggestedPlace,
          customCost: undefined,
          notes: `Optimized: Swapped from ${suggestion.originalPlace.name}`,
        };
      });
      return { ...day, slots: updatedSlots };
    });

    return {
      ...trip,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
    };
  }

  return trip;
}
