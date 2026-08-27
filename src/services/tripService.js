import { DESTINATIONS_DATA } from '../data/mockDestinations';
import { calculateDaysBetween, addDaysToDate } from '../utils/date';
import { convertToNgn } from '../utils/currency';

/**
 * Trip Generator & Calculation Engine
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
    accommodationPreference = 'any',
  }) {
    const dest = DESTINATIONS_DATA[destinationId.toLowerCase()] || DESTINATIONS_DATA.lagos;
    const totalDays = calculateDaysBetween(startDate, endDate);
    const nights = Math.max(1, totalDays - 1);
    const totalBudgetInNgn = convertToNgn(totalBudget, currency);

    // Target allocations based on typical Nigerian travel spending
    // Accommodation: ~40-45%, Food: ~25%, Activities: ~15-20%, Local Transport: ~10-15%
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

      // Morning slot (Activity or Light Sightseeing)
      if (scoredActivities.length > 0) {
        const act = scoredActivities[actIndex % scoredActivities.length];
        slots.push({
          slotId: `day-${i + 1}-morning`,
          timeOfDay: 'morning',
          place: act,
          notes: i === 0 ? 'Arrival, check-in and morning exploration' : 'Morning adventure and sightseeing',
        });
        actIndex++;
      }

      // Afternoon slot (Lunch / Restaurant)
      if (scoredRestaurants.length > 0) {
        const rest = scoredRestaurants[restIndex % scoredRestaurants.length];
        slots.push({
          slotId: `day-${i + 1}-afternoon`,
          timeOfDay: 'afternoon',
          place: rest,
          notes: 'Afternoon dining and local culinary experience',
        });
        restIndex++;
      }

      // Evening slot (Evening Cultural spot or Dinner)
      if (i % 2 === 0 && scoredActivities.length > actIndex) {
        const eveningAct = scoredActivities[actIndex % scoredActivities.length];
        slots.push({
          slotId: `day-${i + 1}-evening`,
          timeOfDay: 'evening',
          place: eveningAct,
          notes: 'Sunset views, boardwalk or cultural evening',
        });
        actIndex++;
      } else if (scoredRestaurants.length > restIndex) {
        const dinner = scoredRestaurants[restIndex % scoredRestaurants.length];
        slots.push({
          slotId: `day-${i + 1}-evening`,
          timeOfDay: 'evening',
          place: dinner,
          notes: 'Dinner and relaxing evening atmosphere',
        });
        restIndex++;
      }

      days.push({
        dayNumber: i + 1,
        date: dayDate,
        slots,
        dailyEstimatedCost: 0, // Will be computed by calculateBudget
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

    // 2. Food & Activities from scheduled slots
    let foodCost = 0;
    let activitiesCost = 0;
    
    // 3. Local Transportation: estimated ₦4,000 per traveler per day in Nigeria
    let transportationCost = numDays * travelers * 4000;

    trip.days.forEach(day => {
      let dayCost = 0;
      day.slots.forEach(slot => {
        const cost = slot.customCost ?? (slot.place.estimatedPrice * travelers);
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
};

/**
 * Select best matching hotel based on user preference and budget allocation
 */
function selectBestHotel(hotels, preference, targetBudgetPerNight) {
  if (!hotels || hotels.length === 0) return null;

  let candidates = [...hotels];

  if (preference === 'budget') {
    candidates = candidates.filter(h => h.priceLevel <= 2);
  } else if (preference === 'luxury') {
    candidates = candidates.filter(h => h.priceLevel >= 3);
  } else if (preference === 'mid-range') {
    candidates = candidates.filter(h => h.priceLevel === 2 || h.priceLevel === 3);
  }

  if (candidates.length === 0) candidates = [...hotels];

  // Pick the closest to target budget without drastically exceeding
  candidates.sort((a, b) => {
    const diffA = Math.abs(a.estimatedPrice - targetBudgetPerNight);
    const diffB = Math.abs(b.estimatedPrice - targetBudgetPerNight);
    return diffA - diffB;
  });

  return candidates[0];
}

/**
 * Score places for user's selected interests
 */
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
