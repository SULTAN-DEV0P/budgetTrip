/**
 * @typedef {'hotel' | 'restaurant' | 'activity' | 'transport'} PlaceType
 * 
 * @typedef {Object} LocationCoordinates
 * @property {string} address
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} [neighborhood]
 * 
 * @typedef {Object} Place
 * @property {string} id
 * @property {PlaceType} type
 * @property {string} name
 * @property {number} rating
 * @property {number} [reviewCount]
 * @property {string} category - e.g. 'Art & Culture', 'Fine Dining', 'Boutique Hotel'
 * @property {LocationCoordinates} location
 * @property {number} [distanceKm]
 * @property {string} imageUrl
 * @property {1 | 2 | 3 | 4} priceLevel - 1: $, 2: $$, 3: $$$, 4: $$$$
 * @property {number} estimatedPrice - Price in local currency
 * @property {'night' | 'meal' | 'ticket' | 'trip'} priceUnit
 * @property {string} currency - e.g. 'NGN', 'USD'
 * @property {string[]} tags
 * @property {string} description
 * @property {'mock' | 'google' | 'curated'} source
 * @property {string} [googlePlaceId]
 * 
 * @typedef {Object} Destination
 * @property {string} id
 * @property {string} name
 * @property {string} state
 * @property {string} country
 * @property {string} currency
 * @property {string} tagLine
 * @property {string} description
 * @property {string} imageUrl
 * @property {LocationCoordinates} coordinates
 * @property {Place[]} hotels
 * @property {Place[]} restaurants
 * @property {Place[]} activities
 * 
 * @typedef {Object} TripSlot
 * @property {string} slotId
 * @property {'morning' | 'afternoon' | 'evening'} timeOfDay
 * @property {Place} place
 * @property {string} [notes]
 * @property {number} [customCost]
 * 
 * @typedef {Object} TripDay
 * @property {number} dayNumber
 * @property {string} date
 * @property {TripSlot[]} slots
 * @property {number} dailyEstimatedCost
 * 
 * @typedef {Object} Trip
 * @property {string} id
 * @property {string} destinationId
 * @property {string} destinationName
 * @property {string} country
 * @property {string} currency
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} totalDays
 * @property {number} travelers
 * @property {number} totalBudget
 * @property {string[]} interests
 * @property {'budget' | 'mid-range' | 'luxury' | 'any'} accommodationPreference
 * @property {Place} [selectedHotel]
 * @property {TripDay[]} days
 * @property {string} createdAt
 * @property {string} updatedAt
 * 
 * @typedef {Object} BudgetBreakdown
 * @property {number} accommodation
 * @property {number} food
 * @property {number} activities
 * @property {number} transportation
 * @property {number} totalEstimated
 * @property {number} totalBudget
 * @property {number} remaining
 * @property {boolean} isOverBudget
 * @property {number} overAmount
 * @property {number} percentageUsed
 */

export const CURRENCIES = {
  NGN: { code: 'NGN', symbol: '₦', rateToNgn: 1, label: 'Nigerian Naira (₦)' },
  USD: { code: 'USD', symbol: '$', rateToNgn: 1500, label: 'US Dollar ($)' },
  EUR: { code: 'EUR', symbol: '€', rateToNgn: 1620, label: 'Euro (€)' },
  GBP: { code: 'GBP', symbol: '£', rateToNgn: 1900, label: 'British Pound (£)' },
};

export const TRIP_INTERESTS = [
  { id: 'culture', label: 'Art & Culture', icon: 'Palette' },
  { id: 'foodie', label: 'Food & Dining', icon: 'Utensils' },
  { id: 'nature', label: 'Nature & Wildlife', icon: 'Trees' },
  { id: 'beach', label: 'Beach & Coastal', icon: 'Waves' },
  { id: 'nightlife', label: 'Nightlife & Lounges', icon: 'Moon' },
  { id: 'heritage', label: 'Heritage & History', icon: 'Landmark' },
  { id: 'budget', label: 'Budget-Conscious', icon: 'PiggyBank' },
];

export const ACCOMMODATION_TIERS = [
  { id: 'budget', label: 'Budget-Friendly', description: 'Hostels, guest houses & boutique inns', priceRange: '₦15k - ₦35k / night' },
  { id: 'mid-range', label: 'Comfort & Mid-Range', description: '3-4 star modern hotels with amenities', priceRange: '₦40k - ₦90k / night' },
  { id: 'luxury', label: 'Premium Luxury', description: '5-star resorts, private villas & luxury suites', priceRange: '₦100k+ / night' },
  { id: 'any', label: 'Best Match for Budget', description: 'Automatically select the highest value stay within budget', priceRange: 'Dynamic' },
];
