import { Trip, TripDay, TripSlot, Place, BudgetBreakdown } from '../types/index.js';
import { WORLD_DESTINATIONS } from './destinationsData.js';
import { googlePlacesService } from './googlePlacesService.js';
import { scoringService } from './scoringService.js';
import { estimatorService } from './estimatorService.js';

export const tripGeneratorService = {
  async generateTrip({
    destinationId,
    startDate,
    endDate,
    travelers = 1,
    totalBudget = 150000,
    currency = 'USD',
    interests = [],
    accommodationPreference = 'budget',
  }: {
    destinationId: string;
    startDate: string;
    endDate: string;
    travelers?: number;
    totalBudget?: number;
    currency?: string;
    interests?: string[];
    accommodationPreference?: 'cheapest' | 'budget' | 'comfortable' | 'luxury';
  }): Promise<Trip> {
    const dest =
      WORLD_DESTINATIONS.find((d) => d.id === destinationId) ||
      WORLD_DESTINATIONS[0];

    const totalDays = calculateDays(startDate, endDate);

    // Fetch places
    const allPlaces = await googlePlacesService.searchPlaces({
      destinationId: dest.id,
      targetCurrency: currency,
    });

    const hotels = allPlaces.filter((p) => p.type === 'hotel');
    const restaurants = allPlaces.filter((p) => p.type === 'restaurant');
    const activities = allPlaces.filter((p) => p.type === 'activity');

    // 1. Pick Hotel
    const selectedHotel = selectHotel(hotels, accommodationPreference);

    // 2. Score Dining & Activities
    const scoredRestaurants = scoringService.scorePlaces(restaurants, interests);
    const scoredActivities = scoringService.scorePlaces(activities, interests);

    // 3. Build Multi-Day Schedule
    const days: TripDay[] = [];
    let rIdx = 0;
    let aIdx = 0;

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const slots: TripSlot[] = [];

      // Morning Slot (Sightseeing / Activity)
      if (scoredActivities.length > 0) {
        const act = scoredActivities[aIdx % scoredActivities.length];
        slots.push({
          slotId: `day-${dayNum}-morning-${Date.now()}-${act.id}`,
          timeOfDay: 'morning',
          timeLabel: dayNum === 1 ? '10:00 AM' : '9:30 AM',
          place: act,
          cost: act.estimatedPrice * travelers,
          notes: dayNum === 1 ? 'Morning arrival & neighborhood exploration' : 'Morning landmark visit',
        });
        aIdx++;
      }

      // Afternoon Slot (Dining)
      if (scoredRestaurants.length > 0) {
        const rest = scoredRestaurants[rIdx % scoredRestaurants.length];
        slots.push({
          slotId: `day-${dayNum}-afternoon-${Date.now()}-${rest.id}`,
          timeOfDay: 'afternoon',
          timeLabel: '1:30 PM',
          place: rest,
          cost: rest.estimatedPrice * travelers,
          notes: 'Afternoon lunch & local specialties',
        });
        rIdx++;
      }

      // Evening Slot (Dinner / Sunset Activity)
      if (dayNum % 2 === 0 && scoredActivities.length > aIdx) {
        const eveningAct = scoredActivities[aIdx % scoredActivities.length];
        slots.push({
          slotId: `day-${dayNum}-evening-${Date.now()}-${eveningAct.id}`,
          timeOfDay: 'evening',
          timeLabel: '5:30 PM',
          place: eveningAct,
          cost: eveningAct.estimatedPrice * travelers,
          notes: 'Sunset promenade & evening arts',
        });
        aIdx++;
      } else if (scoredRestaurants.length > rIdx) {
        const dinner = scoredRestaurants[rIdx % scoredRestaurants.length];
        slots.push({
          slotId: `day-${dayNum}-evening-${Date.now()}-${dinner.id}`,
          timeOfDay: 'evening',
          timeLabel: '7:30 PM',
          place: dinner,
          cost: dinner.estimatedPrice * travelers,
          notes: 'Dinner & evening relaxation',
        });
        rIdx++;
      }

      const dateStr = addDays(startDate, dayNum - 1);
      const dailyCost = slots.reduce((sum, s) => sum + (s.cost || 0), 0);

      days.push({
        dayNumber: dayNum,
        date: dateStr,
        dailyEstimatedCost: dailyCost,
        slots,
      });
    }

    const trip: Trip = {
      id: `trip-${Date.now()}`,
      destinationId: dest.id,
      destinationName: dest.name,
      city: dest.city,
      country: dest.country,
      continent: dest.continent,
      flag: dest.flag,
      currency,
      startDate,
      endDate,
      totalDays,
      travelers,
      totalBudget,
      interests,
      accommodationPreference,
      selectedHotel,
      days,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    trip.breakdown = this.calculateBudgetBreakdown(trip);
    return trip;
  },

  calculateBudgetBreakdown(trip: Trip): BudgetBreakdown {
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

    // 3. Transportation allowance
    const transportationCost = estimatorService.calculateTransitAllowance(numDays, travelers, cur, 1.0);

    if (trip.days && Array.isArray(trip.days)) {
      trip.days.forEach((day) => {
        let dayCost = 0;
        day.slots.forEach((slot) => {
          const cost = slot.customCost !== undefined ? slot.customCost : (slot.place.estimatedPrice || 0) * travelers;
          if (slot.place.type === 'restaurant') foodCost += cost;
          if (slot.place.type === 'activity') activitiesCost += cost;
          if (slot.place.type === 'transport') dayCost += cost;
          dayCost += cost;
        });
        day.dailyEstimatedCost = dayCost;
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
  },
};

function selectHotel(hotels: Place[], preference: string): Place | undefined {
  if (!hotels || hotels.length === 0) return undefined;

  if (preference === 'cheapest') {
    return [...hotels].sort((a, b) => a.estimatedPrice - b.estimatedPrice)[0];
  }
  if (preference === 'luxury' || preference === 'comfortable') {
    const upscale = hotels.filter((h) => (h.priceLevel || 2) >= 3);
    if (upscale.length > 0) return upscale[0];
  }
  // Budget / mid-range default
  return hotels[0];
}

function calculateDays(start: string, end: string): number {
  try {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  } catch {
    return 3;
  }
}

function addDays(dateStr: string, days: number): string {
  try {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    return dateStr;
  }
}
