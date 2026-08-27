import { DESTINATIONS_DATA } from '../data/mockDestinations';
import { calculateDaysBetween, addDaysToDate } from '../utils/date';
import { convertToNgn } from '../utils/currency';

/**
 * Trip Generator, Mutation & Budget Optimization Engine
 */

export const tripService = {
  /**
   * Generates a complete trip itinerary based on user budget and preferences
   */
  async generateTrip({
    destinationId,
    startDate,
    endDate,
    travelers = 1,
    totalBudget = 150000,
    currency = 'NGN',
    interests = [],
    accommodationPreference = 'budget',
  }) {
    const dest = DESTINATIONS_DATA[destinationId.toLowerCase()] || DESTINATIONS_DATA.lagos;
    const totalDays = calculateDaysBetween(startDate, endDate);
    const nights = Math.max(1, totalDays - 1);
    const totalBudgetInNgn = convertToNgn(totalBudget, currency);

    // Target hotel budget per night
    const targetHotelBudgetPerNight = (totalBudgetInNgn * 0.42) / nights;

    // 1. Select Accommodation
    const selectedHotel = selectBestHotel(dest.hotels, accommodationPreference, targetHotelBudgetPerNight);

    // 2. Score and pick restaurants & activities
    const scoredRestaurants = scorePlaces(dest.restaurants, interests);
    const scoredActivities = scorePlaces(dest.activities, interests);

    // 3. Build Day-by-Day schedule
    const days = [];
    let restIndex = 0;
    let actIndex = 0;

    for (let i = 0; i < totalDays; i++) {
      const dayDate = addDaysToDate(startDate, i);
      const slots = [];

      // Morning slot
      if (scoredActivities.length > 0) {
        const act = scoredActivities[actIndex % scoredActivities.length];
        slots.push({
          slotId: `day-${i + 1}-morning-${Date.now()}-${act.id}`,
          timeOfDay: 'morning',
          timeLabel: i === 0 ? '10:00 AM' : '9:30 AM',
          place: act,
          cost: act.estimatedPrice * Number(travelers),
          notes: i === 0 ? 'Morning check-in & city discovery' : 'Morning adventure and sightseeing',
        });
        actIndex++;
      }

      // Afternoon slot
      if (scoredRestaurants.length > 0) {
        const rest = scoredRestaurants[restIndex % scoredRestaurants.length];
        slots.push({
          slotId: `day-${i + 1}-afternoon-${Date.now()}-${rest.id}`,
          timeOfDay: 'afternoon',
          timeLabel: '1:30 PM',
          place: rest,
          cost: rest.estimatedPrice * Number(travelers),
          notes: 'Afternoon lunch & local delicacies',
        });
        restIndex++;
      }

      // Evening slot
      if (i % 2 === 0 && scoredActivities.length > actIndex) {
        const eveningAct = scoredActivities[actIndex % scoredActivities.length];
        slots.push({
          slotId: `day-${i + 1}-evening-${Date.now()}-${eveningAct.id}`,
          timeOfDay: 'evening',
          timeLabel: '5:30 PM',
          place: eveningAct,
          cost: eveningAct.estimatedPrice * Number(travelers),
          notes: 'Sunset coastal walk or gallery visit',
        });
        actIndex++;
      } else if (scoredRestaurants.length > restIndex) {
        const dinner = scoredRestaurants[restIndex % scoredRestaurants.length];
        slots.push({
          slotId: `day-${i + 1}-evening-${Date.now()}-${dinner.id}`,
          timeOfDay: 'evening',
          timeLabel: '7:30 PM',
          place: dinner,
          cost: dinner.estimatedPrice * Number(travelers),
          notes: 'Dinner & evening relaxation',
        });
        restIndex++;
      }

      days.push({
        dayNumber: i + 1,
        date: dayDate,
        slots,
        dailyEstimatedCost: 0,
      });
    }

    const trip = {
      id: `trip-${Date.now()}`,
      destinationId: dest.id,
      destinationName: dest.name,
      state: dest.state,
      country: dest.country,
      currency,
      startDate,
      endDate,
      totalDays,
      travelers: Number(travelers) || 1,
      totalBudget: totalBudgetInNgn,
      interests,
      accommodationPreference,
      selectedHotel,
      days,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate initial budget breakdown
    const breakdown = this.calculateBudget(trip);
    trip.breakdown = breakdown;

    return trip;
  },

  /**
   * Pure Budget Calculation Formula
   */
  calculateBudget(trip) {
    if (!trip) return null;
    const numDays = trip.totalDays || 1;
    const nights = Math.max(1, numDays - 1);
    const travelers = trip.travelers || 1;

    // 1. Accommodation
    const accommodationCost = trip.selectedHotel
      ? trip.selectedHotel.estimatedPrice * nights
      : 0;

    // 2. Food & Activities
    let foodCost = 0;
    let activitiesCost = 0;
    
    // 3. Local Transportation: ₦4,000 per traveler per day
    let transportationCost = numDays * travelers * 4000;

    trip.days.forEach(day => {
      let dayCost = 0;
      day.slots.forEach(slot => {
        const cost = slot.cost ?? (slot.place.estimatedPrice * travelers);
        if (slot.place.type === 'restaurant') {
          foodCost += cost;
          dayCost += cost;
        } else if (slot.place.type === 'activity') {
          activitiesCost += cost;
          dayCost += cost;
        } else if (slot.place.type === 'transport') {
          transportationCost += cost;
          dayCost += cost;
        }
      });
      day.dailyEstimatedCost = dayCost;
    });

    const totalEstimated = accommodationCost + foodCost + activitiesCost + transportationCost;
    const remaining = trip.totalBudget - totalEstimated;
    const isOverBudget = remaining < 0;
    const overAmount = isOverBudget ? Math.abs(remaining) : 0;

    return {
      accommodation: accommodationCost,
      food: foodCost,
      activities: activitiesCost,
      transportation: transportationCost,
      totalEstimated,
      totalBudget: trip.totalBudget,
      remaining,
      isOverBudget,
      overAmount,
      percentageUsed: trip.totalBudget > 0 ? (totalEstimated / trip.totalBudget) * 100 : 0,
      nights,
      travelers,
      categoryPercentages: {
        accommodation: totalEstimated > 0 ? (accommodationCost / totalEstimated) * 100 : 0,
        food: totalEstimated > 0 ? (foodCost / totalEstimated) * 100 : 0,
        activities: totalEstimated > 0 ? (activitiesCost / totalEstimated) * 100 : 0,
        transportation: totalEstimated > 0 ? (transportationCost / totalEstimated) * 100 : 0,
      },
    };
  },

  /**
   * Add a place to a specific day in the trip
   */
  addPlaceToDay(trip, place, dayNumber, timeOfDay = 'afternoon') {
    const travelers = trip.travelers || 1;
    const timeLabels = {
      morning: '9:30 AM',
      afternoon: '2:00 PM',
      evening: '7:30 PM',
    };

    const newSlot = {
      slotId: `slot-${Date.now()}-${place.id}`,
      timeOfDay,
      timeLabel: timeLabels[timeOfDay] || '2:00 PM',
      place,
      cost: place.type === 'hotel' ? place.estimatedPrice : place.estimatedPrice * travelers,
      notes: `Added ${place.name}`,
    };

    const updatedDays = trip.days.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          slots: [...day.slots, newSlot],
        };
      }
      return day;
    });

    const updatedTrip = {
      ...trip,
      selectedHotel: place.type === 'hotel' ? place : trip.selectedHotel,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
    };

    updatedTrip.breakdown = this.calculateBudget(updatedTrip);
    return updatedTrip;
  },

  /**
   * Remove a slot from the trip
   */
  removeSlot(trip, slotId) {
    const updatedDays = trip.days.map(day => ({
      ...day,
      slots: day.slots.filter(s => s.slotId !== slotId),
    }));

    const updatedTrip = {
      ...trip,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
    };

    updatedTrip.breakdown = this.calculateBudget(updatedTrip);
    return updatedTrip;
  },

  /**
   * Reorder slots within a day
   */
  reorderSlots(trip, dayNumber, fromIndex, toIndex) {
    const updatedDays = trip.days.map(day => {
      if (day.dayNumber === dayNumber) {
        const slots = [...day.slots];
        const [moved] = slots.splice(fromIndex, 1);
        slots.splice(toIndex, 0, moved);
        return { ...day, slots };
      }
      return day;
    });

    return {
      ...trip,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Smart Budget Optimizer: Finds high-cost items and suggests cheaper alternatives
   */
  optimizeTripBudget(trip) {
    if (!trip) return null;
    const dest = DESTINATIONS_DATA[trip.destinationId.toLowerCase()] || DESTINATIONS_DATA.lagos;
    const nights = Math.max(1, (trip.totalDays || 3) - 1);
    const travelers = trip.travelers || 1;
    const suggestions = [];

    let potentialOptimizedHotel = trip.selectedHotel;

    // 1. Hotel Optimization: If current hotel is expensive, find a lower tier option
    if (trip.selectedHotel) {
      const cheaperHotels = dest.hotels
        .filter(h => h.id !== trip.selectedHotel.id && h.estimatedPrice < trip.selectedHotel.estimatedPrice)
        .sort((a, b) => b.rating - a.rating);

      if (cheaperHotels.length > 0) {
        const bestAltHotel = cheaperHotels[0];
        const savingsPerNight = trip.selectedHotel.estimatedPrice - bestAltHotel.estimatedPrice;
        const totalStaySavings = savingsPerNight * nights;

        suggestions.push({
          type: 'hotel',
          currentName: trip.selectedHotel.name,
          currentPrice: trip.selectedHotel.estimatedPrice,
          suggestedPlace: bestAltHotel,
          suggestedPrice: bestAltHotel.estimatedPrice,
          savings: totalStaySavings,
          savingsLabel: `Save ₦${totalStaySavings.toLocaleString()} on accommodation`,
        });

        potentialOptimizedHotel = bestAltHotel;
      }
    }

    // 2. Dining Optimization: Suggest switching a high-end restaurant to local gourmet bukka
    const allSlots = trip.days.flatMap(d => d.slots);
    const expensiveFoodSlots = allSlots.filter(
      s => s.place.type === 'restaurant' && s.place.estimatedPrice > 10000
    );

    if (expensiveFoodSlots.length > 0) {
      const foodSlotToOptimize = expensiveFoodSlots[0];
      const cheaperRestaurants = dest.restaurants
        .filter(r => r.estimatedPrice < foodSlotToOptimize.place.estimatedPrice)
        .sort((a, b) => b.rating - a.rating);

      if (cheaperRestaurants.length > 0) {
        const bestAltRest = cheaperRestaurants[0];
        const foodSavings = (foodSlotToOptimize.place.estimatedPrice - bestAltRest.estimatedPrice) * travelers;

        suggestions.push({
          type: 'restaurant',
          slotId: foodSlotToOptimize.slotId,
          currentName: foodSlotToOptimize.place.name,
          currentPrice: foodSlotToOptimize.place.estimatedPrice,
          suggestedPlace: bestAltRest,
          suggestedPrice: bestAltRest.estimatedPrice,
          savings: foodSavings,
          savingsLabel: `Save ₦${foodSavings.toLocaleString()} on dining`,
        });
      }
    }

    const totalPotentialSavings = suggestions.reduce((sum, s) => sum + s.savings, 0);

    return {
      suggestions,
      totalPotentialSavings,
      canOptimize: suggestions.length > 0,
      potentialOptimizedHotel,
    };
  },

  /**
   * Apply suggested optimizations to a trip
   */
  applyOptimizations(trip, suggestions) {
    let updatedTrip = { ...trip };

    suggestions.forEach(s => {
      if (s.type === 'hotel') {
        updatedTrip.selectedHotel = s.suggestedPlace;
      } else if (s.type === 'restaurant' && s.slotId) {
        updatedTrip.days = updatedTrip.days.map(day => ({
          ...day,
          slots: day.slots.map(slot =>
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

    updatedTrip.breakdown = this.calculateBudget(updatedTrip);
    return updatedTrip;
  },
};

function selectBestHotel(hotels, preference, targetBudgetPerNight) {
  if (!hotels || hotels.length === 0) return null;
  let candidates = [...hotels];

  if (preference === 'cheapest' || preference === 'budget') {
    candidates = candidates.filter(h => h.priceLevel <= 2);
  } else if (preference === 'comfortable' || preference === 'luxury') {
    candidates = candidates.filter(h => h.priceLevel >= 2);
  }

  if (candidates.length === 0) candidates = [...hotels];

  candidates.sort((a, b) => {
    const diffA = Math.abs(a.estimatedPrice - targetBudgetPerNight);
    const diffB = Math.abs(b.estimatedPrice - targetBudgetPerNight);
    return diffA - diffB;
  });

  return candidates[0];
}

function scorePlaces(places, userInterests = []) {
  return [...places].sort((a, b) => {
    const scoreA = calculatePlaceScore(a, userInterests);
    const scoreB = calculatePlaceScore(b, userInterests);
    return scoreB - scoreA;
  });
}

function calculatePlaceScore(place, userInterests = []) {
  let score = place.rating * 10;
  if (userInterests.length > 0 && place.tags) {
    const lowerTags = place.tags.map(t => t.toLowerCase());
    userInterests.forEach(interest => {
      if (lowerTags.some(t => t.includes(interest.toLowerCase()))) {
        score += 25;
      }
    });
  }
  return score;
}
