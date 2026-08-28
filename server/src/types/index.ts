export type PlaceType = 'hotel' | 'restaurant' | 'activity' | 'transport';

export interface Location {
  address: string;
  neighborhood?: string;
  lat?: number;
  lng?: number;
}

export interface Place {
  id: string;
  googlePlaceId?: string;
  name: string;
  category: string;
  type: PlaceType;
  rating: number;
  userRatingCount?: number;
  priceLevel?: number;
  estimatedPrice: number;
  priceUnit: 'night' | 'person' | 'ticket' | 'trip';
  currency: string;
  imageUrl: string;
  location: Location;
  distanceKm?: number;
  tags?: string[];
  description?: string;
  budgetFitReason?: string;
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  flag: string;
  currency: string;
  priceIndexUSD: number;
  tag: string;
  category: string;
  img: string;
  bestTimeToVisit?: string;
  visaInfo?: string;
  plugType?: string;
  language?: string;
  emergencyNumber?: string;
  tippingCustom?: string;
  description?: string;
}

export interface TripSlot {
  slotId: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  timeLabel?: string;
  place: Place;
  cost?: number;
  customCost?: number;
  notes?: string;
}

export interface TripDay {
  dayNumber: number;
  date: string;
  dailyEstimatedCost?: number;
  slots: TripSlot[];
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  activities: number;
  transportation: number;
  totalEstimated: number;
  totalBudget: number;
  remaining: number;
  isOverBudget: boolean;
  overAmount: number;
  percentageUsed: number;
  categoryPercentages: {
    accommodation: number;
    food: number;
    activities: number;
    transportation: number;
  };
}

export interface Trip {
  id: string;
  destinationId: string;
  destinationName: string;
  city: string;
  country: string;
  continent: string;
  flag: string;
  currency: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  travelers: number;
  totalBudget: number;
  interests?: string[];
  accommodationPreference?: 'cheapest' | 'budget' | 'comfortable' | 'luxury';
  selectedHotel?: Place;
  days: TripDay[];
  breakdown?: BudgetBreakdown;
  createdAt?: string;
  updatedAt?: string;
}

export interface OptimizationSuggestion {
  type: 'hotel' | 'restaurant' | 'activity';
  slotId?: string;
  currentName: string;
  currentPrice: number;
  suggestedPlace: Place;
  suggestedPrice: number;
  savings: number;
  savingsLabel: string;
}

export interface OptimizationResult {
  isOverBudget: boolean;
  overAmount: number;
  totalPotentialSavings: number;
  suggestions: OptimizationSuggestion[];
}
