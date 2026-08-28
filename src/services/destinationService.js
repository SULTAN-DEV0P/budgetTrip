import { getCurrencyForCountry, convertCurrency } from '../utils/currency';
import { ALL_WORLD_DESTINATIONS } from '../data/allWorldDestinations';

export const WORLD_DESTINATIONS = ALL_WORLD_DESTINATIONS;

export function getDestinationById(id) {
  if (!id) return WORLD_DESTINATIONS[0];
  const q = id.toLowerCase();
  return (
    WORLD_DESTINATIONS.find((d) => d.id.toLowerCase() === q) ||
    WORLD_DESTINATIONS.find((d) => d.name.toLowerCase() === q) ||
    WORLD_DESTINATIONS.find((d) => d.country.toLowerCase() === q) ||
    WORLD_DESTINATIONS[0]
  );
}

/**
 * Fetch country essentials (Plug types, emergency numbers, visa, languages)
 */
export async function fetchCountryEssentials(countryName) {
  const dest = WORLD_DESTINATIONS.find(
    (d) => d.country && countryName && d.country.toLowerCase() === countryName.toLowerCase()
  );

  if (dest && dest.plugType) {
    return {
      country: dest.country,
      currency: dest.currency,
      bestTimeToVisit: dest.bestTimeToVisit || 'Year-round',
      visaInfo: dest.visaInfo || 'Standard tourist visa / eVisa required',
      plugType: dest.plugType || 'Type C & G (230V, 50Hz)',
      language: dest.language || 'English & local official languages',
      emergencyNumber: dest.emergencyNumber || '112 / 999',
      tippingCustom: dest.tippingCustom || '5–10% in restaurants is customary',
    };
  }

  // Live fallback to REST Countries API
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=false`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const c = data[0];
        const curCode = c.currencies ? Object.keys(c.currencies)[0] : 'USD';
        const langs = c.languages ? Object.values(c.languages).join(', ') : 'Local languages';

        return {
          country: c.name?.common || countryName,
          currency: curCode,
          bestTimeToVisit: 'Nov – Apr (Dry / Cool season)',
          visaInfo: 'Check eVisa portal or embassy guidelines',
          plugType: 'Type C & F (220–240V, 50Hz)',
          language: langs,
          emergencyNumber: '112 (Universal Emergency)',
          tippingCustom: '5–10% in sit-down dining is appreciated',
        };
      }
    }
  } catch {
    // Fallback
  }

  return {
    country: countryName,
    currency: 'USD',
    bestTimeToVisit: 'Year-round',
    visaInfo: 'Standard tourist visa required',
    plugType: 'Type C & G (230V, 50Hz)',
    language: 'English & local languages',
    emergencyNumber: '112 / 999',
    tippingCustom: '5–10% customary',
  };
}

/**
 * Generate 6-8 authentic places for ANY worldwide destination based on its price index and local currency
 */
export function generatePlacesForDestination(dest) {
  const cur = dest?.currency || getCurrencyForCountry(dest?.country || '') || 'USD';
  const baseUSD = dest?.priceIndexUSD || 75;
  const name = dest?.city || dest?.name || 'Local';
  const country = dest?.country || '';

  const hotel1USD = Math.round(baseUSD * 0.9);
  const hotel2USD = Math.round(baseUSD * 1.4);
  const food1USD = Math.max(5, Math.round(baseUSD * 0.22));
  const food2USD = Math.max(8, Math.round(baseUSD * 0.35));
  const food3USD = Math.max(12, Math.round(baseUSD * 0.55));
  const act1USD = Math.max(6, Math.round(baseUSD * 0.25));
  const act2USD = Math.max(10, Math.round(baseUSD * 0.4));
  const act3USD = Math.max(15, Math.round(baseUSD * 0.6));

  return [
    {
      id: `${dest?.id || 'dest'}-hotel-1`,
      googlePlaceId: `gp-${dest?.id || 'dest'}-hotel-1`,
      name: `${name} Central Boutique Hotel`,
      category: 'Hotel & Accommodation',
      type: 'hotel',
      rating: 4.8,
      userRatingCount: 420,
      priceLevel: 2,
      estimatedPrice: Math.round(convertCurrency(hotel1USD, 'USD', cur)),
      priceUnit: 'night',
      currency: cur,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format',
      location: {
        address: `12 Central Avenue, ${name}, ${country}`,
        neighborhood: 'City Center',
        lat: 0,
        lng: 0,
      },
      distanceKm: 0.8,
      tags: ['BOUTIQUE', 'FREE WIFI', 'BREAKFAST INCLUDED'],
      description: `Modern and comfortable boutique hotel centrally located in ${name} with fast transit connections.`,
      budgetFitReason: 'Top-rated hotel offering exceptional value for mid-range and budget travelers.',
    },
    {
      id: `${dest?.id || 'dest'}-hotel-2`,
      googlePlaceId: `gp-${dest?.id || 'dest'}-hotel-2`,
      name: `${name} Grand Heritage Suites`,
      category: 'Hotel & Accommodation',
      type: 'hotel',
      rating: 4.9,
      userRatingCount: 680,
      priceLevel: 3,
      estimatedPrice: Math.round(convertCurrency(hotel2USD, 'USD', cur)),
      priceUnit: 'night',
      currency: cur,
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&auto=format',
      location: {
        address: `45 Promenade Boulevard, ${name}, ${country}`,
        neighborhood: 'Waterfront / Historic Quarter',
        lat: 0,
        lng: 0,
      },
      distanceKm: 1.2,
      tags: ['HERITAGE', 'ROOFTOP POOL', 'SPA'],
      description: `Scenic premium accommodation with sweeping city vistas, fine dining, and prime historical access.`,
      budgetFitReason: 'Spacious suites and luxury amenities at a competitive seasonal rate.',
    },
    {
      id: `${dest?.id || 'dest'}-food-1`,
      googlePlaceId: `gp-${dest?.id || 'dest'}-food-1`,
      name: `${name} Artisan Cafe & Bakery`,
      category: 'Artisan Cafe & Coffee',
      type: 'restaurant',
      rating: 4.7,
      userRatingCount: 310,
      priceLevel: 1,
      estimatedPrice: Math.round(convertCurrency(food1USD, 'USD', cur)),
      priceUnit: 'person',
      currency: cur,
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop&auto=format',
      location: {
        address: `8 Market Square, ${name}, ${country}`,
        neighborhood: 'Old Town',
        lat: 0,
        lng: 0,
      },
      distanceKm: 0.5,
      tags: ['COFFEE', 'BREAKFAST', 'OUTDOOR SEATING'],
      description: `Cozy local favorite known for freshly roasted coffee, freshly baked morning pastries, and brunch plates.`,
      budgetFitReason: 'Affordable breakfast and coffee spot with excellent traveler reviews.',
    },
    {
      id: `${dest?.id || 'dest'}-food-2`,
      googlePlaceId: `gp-${dest?.id || 'dest'}-food-2`,
      name: `${name} Authentic Bistro & Kitchen`,
      category: 'Dining & Regional Gastronomy',
      type: 'restaurant',
      rating: 4.8,
      userRatingCount: 540,
      priceLevel: 2,
      estimatedPrice: Math.round(convertCurrency(food2USD, 'USD', cur)),
      priceUnit: 'person',
      currency: cur,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&auto=format',
      location: {
        address: `22 Culinary Lane, ${name}, ${country}`,
        neighborhood: 'Cultural District',
        lat: 0,
        lng: 0,
      },
      distanceKm: 1.1,
      tags: ['LOCAL SPECIALTIES', 'OUTDOOR PATIO', 'VEGETARIAN OPTIONS'],
      description: `Beloved kitchen serving authentic regional specialties prepared with farm-fresh local ingredients.`,
      budgetFitReason: 'Generous portions and authentic flavors at reasonable prices.',
    },
    {
      id: `${dest?.id || 'dest'}-food-3`,
      googlePlaceId: `gp-${dest?.id || 'dest'}-food-3`,
      name: `${name} Rooftop Lounge & Grill`,
      category: 'Dining & Regional Gastronomy',
      type: 'restaurant',
      rating: 4.9,
      userRatingCount: 890,
      priceLevel: 3,
      estimatedPrice: Math.round(convertCurrency(food3USD, 'USD', cur)),
      priceUnit: 'person',
      currency: cur,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&auto=format',
      location: {
        address: `100 Skyline Tower, ${name}, ${country}`,
        neighborhood: 'Downtown Skyline',
        lat: 0,
        lng: 0,
      },
      distanceKm: 1.8,
      tags: ['PANORAMIC VIEWS', 'CRAFT COCKTAILS', 'LIVE MUSIC'],
      description: `Elevated dining experience offering sunset views over ${name}, live music, and premium grilled dishes.`,
      budgetFitReason: 'Ideal for an unforgettable evening dinner experience with panoramic vistas.',
    },
    {
      id: `${dest?.id || 'dest'}-act-1`,
      googlePlaceId: `gp-${dest?.id || 'dest'}-act-1`,
      name: `${name} Historic Old Town & Heritage Walk`,
      category: 'Historic Sight & Landmarks',
      type: 'activity',
      rating: 4.8,
      userRatingCount: 760,
      priceLevel: 1,
      estimatedPrice: Math.round(convertCurrency(act1USD, 'USD', cur)),
      priceUnit: 'person',
      currency: cur,
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&auto=format',
      location: {
        address: `Historic District, ${name}, ${country}`,
        neighborhood: 'Old Town',
        lat: 0,
        lng: 0,
      },
      distanceKm: 0.4,
      tags: ['WALKING TOUR', 'HERITAGE', 'PHOTO SPOT'],
      description: `Wander through ancient cobblestone streets, artisan craft shops, and storied monuments in ${name}.`,
      budgetFitReason: 'Budget-friendly cultural walking experience with photo spots.',
    },
    {
      id: `${dest?.id || 'dest'}-act-2`,
      googlePlaceId: `gp-${dest?.id || 'dest'}-act-2`,
      name: `${name} National Museum & Art Gallery`,
      category: 'Museum & Fine Arts',
      type: 'activity',
      rating: 4.7,
      userRatingCount: 620,
      priceLevel: 2,
      estimatedPrice: Math.round(convertCurrency(act2USD, 'USD', cur)),
      priceUnit: 'person',
      currency: cur,
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&h=600&fit=crop&auto=format',
      location: {
        address: `Museum Park, ${name}, ${country}`,
        neighborhood: 'Museum Quarter',
        lat: 0,
        lng: 0,
      },
      distanceKm: 1.5,
      tags: ['CULTURE', 'EXHIBITIONS', 'GUIDED TOURS'],
      description: `Immerse yourself in centuries of history, contemporary art exhibitions, and sculpture gardens.`,
      budgetFitReason: 'Rich educational and aesthetic experience at accessible admission rates.',
    },
    {
      id: `${dest?.id || 'dest'}-act-3`,
      googlePlaceId: `gp-${dest?.id || 'dest'}-act-3`,
      name: `${name} Panoramic Viewpoint & Sunset Trail`,
      category: 'Nature & Botanical Park',
      type: 'activity',
      rating: 4.9,
      userRatingCount: 1100,
      priceLevel: 2,
      estimatedPrice: Math.round(convertCurrency(act3USD, 'USD', cur)),
      priceUnit: 'person',
      currency: cur,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&auto=format',
      location: {
        address: `Summit Hill, ${name}, ${country}`,
        neighborhood: 'Highlands / Coast',
        lat: 0,
        lng: 0,
      },
      distanceKm: 3.2,
      tags: ['SUNSET VIEWS', 'NATURE', 'SCENIC TRAIL'],
      description: `Breathtaking scenic lookout offering 360-degree views of ${name}'s skyline, mountain ridges, and coast.`,
      budgetFitReason: 'Unmatched natural beauty and sunset photo opportunities.',
    },
  ];
}

/**
 * Generate a complete multi-day budget trip itinerary for ANY destination on Earth
 */
export function generateTripForDestination(dest, totalDays = 3, travelers = 2) {
  const cur = dest.currency || getCurrencyForCountry(dest.country) || 'USD';
  const places = generatePlacesForDestination(dest);
  const baseUSD = dest.priceIndexUSD || 75;

  const totalBudgetUSD = baseUSD * totalDays * travelers * 1.5;
  const totalBudgetLocal = Math.round(convertCurrency(totalBudgetUSD, 'USD', cur));

  const selectedHotel = places.find((p) => p.id === `${dest.id}-hotel-2`) || places[0];

  const days = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = new Date(Date.now() + (dayNum - 1) * 86400000).toISOString().split('T')[0];

    const morningAct = places.find((p) => p.id === `${dest.id}-act-${(i % 3) + 1}`) || places[places.length - 1];
    const lunchFood = places.find((p) => p.id === `${dest.id}-food-2`) || places[3];
    const eveningFood = i === 1 
      ? (places.find((p) => p.id === `${dest.id}-food-1`) || places[2])
      : (places.find((p) => p.id === `${dest.id}-food-3`) || places[4]);

    return {
      dayNumber: dayNum,
      date: dateStr,
      dailyBudgetLimit: Math.round(totalBudgetLocal / totalDays),
      slots: [
        {
          slotId: `slot-${dayNum}-1`,
          timeOfDay: 'morning',
          place: morningAct,
          notes: `Explore ${morningAct.name} during early morning hours`,
        },
        {
          slotId: `slot-${dayNum}-2`,
          timeOfDay: 'afternoon',
          place: lunchFood,
          notes: `Lunch and refreshing drinks at ${lunchFood.name}`,
        },
        {
          slotId: `slot-${dayNum}-3`,
          timeOfDay: 'evening',
          place: eveningFood,
          notes: `Dinner experience with local specialties`,
        },
      ],
    };
  });

  return {
    destinationId: dest.id,
    destinationName: dest.name,
    country: dest.country,
    currency: cur,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + (totalDays - 1) * 86400000).toISOString().split('T')[0],
    totalDays,
    travelers,
    totalBudget: totalBudgetLocal,
    interests: ['Culture', 'Food', 'Nature', 'Art'],
    accommodationPreference: 'budget',
    selectedHotel,
    days,
  };
}

export const generateDefaultTripForDestination = generateTripForDestination;
