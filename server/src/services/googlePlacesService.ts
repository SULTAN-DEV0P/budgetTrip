import axios from 'axios';
import { Place, PlaceType } from '../types/index.js';
import { cache } from '../config/cache.js';
import { estimatorService } from './estimatorService.js';
import { WORLD_DESTINATIONS } from './destinationsData.js';

const GOOGLE_PLACES_BASE_URL = 'https://places.googleapis.com/v1';

export const googlePlacesService = {
  async searchPlaces({
    destinationId,
    category,
    query,
    targetCurrency = 'USD',
  }: {
    destinationId: string;
    category?: string;
    query?: string;
    targetCurrency?: string;
  }): Promise<Place[]> {
    const cacheKey = `places_${destinationId}_${category || 'all'}_${query || ''}_${targetCurrency}`;
    const cached = cache.get<Place[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const destMeta =
      WORLD_DESTINATIONS.find((d) => d.id === destinationId) ||
      WORLD_DESTINATIONS[0];

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (apiKey && apiKey.trim() !== '') {
      try {
        const textQuery = query
          ? `${query} in ${destMeta.city}, ${destMeta.country}`
          : category === 'stay'
          ? `best hotels and boutique stays in ${destMeta.city}`
          : category === 'eat'
          ? `top restaurants and cafes in ${destMeta.city}`
          : `famous landmarks and things to do in ${destMeta.city}`;

        const response = await axios.post(
          `${GOOGLE_PLACES_BASE_URL}/places:searchText`,
          { textQuery, maxResultCount: 15 },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': apiKey,
              'X-Goog-FieldMask':
                'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.photos,places.location,places.types',
            },
            timeout: 6000,
          }
        );

        if (response.data && response.data.places && response.data.places.length > 0) {
          const normalized = response.data.places.map((p: any, idx: number) => {
            const detectedType: PlaceType =
              category === 'stay' || p.types?.includes('lodging')
                ? 'hotel'
                : category === 'eat' || p.types?.includes('restaurant') || p.types?.includes('cafe')
                ? 'restaurant'
                : 'activity';

            const photoUrl = p.photos?.[0]?.name
              ? `${GOOGLE_PLACES_BASE_URL}/${p.photos[0].name}/media?key=${apiKey}&maxHeightPx=600`
              : destMeta.img;

            const numericPriceUSD = estimatorService.estimatePlacePrice(
              detectedType,
              destMeta.priceIndexUSD,
              p.priceLevel ? mapPriceLevel(p.priceLevel) : 2
            );

            return {
              id: `gplace-${p.id || idx}`,
              googlePlaceId: p.id,
              name: p.displayName?.text || 'Local Venue',
              category: detectedType === 'hotel' ? 'Hotel & Stay' : detectedType === 'restaurant' ? 'Dining & Flavors' : 'Sightseeing & Culture',
              type: detectedType,
              rating: p.rating || 4.5,
              userRatingCount: p.userRatingCount || 100,
              priceLevel: p.priceLevel ? mapPriceLevel(p.priceLevel) : 2,
              estimatedPrice: numericPriceUSD,
              priceUnit: detectedType === 'hotel' ? 'night' : 'person',
              currency: 'USD',
              imageUrl: photoUrl,
              location: {
                address: p.formattedAddress || `${destMeta.city}, ${destMeta.country}`,
                lat: p.location?.latitude,
                lng: p.location?.longitude,
              },
              tags: p.types?.slice(0, 4) || ['Popular'],
              description: `Iconic ${detectedType} in the heart of ${destMeta.city}.`,
              budgetFitReason: 'Recommended spot offering great value for money.',
            };
          });

          cache.set(cacheKey, normalized, 86400); // 24 hours
          return normalized;
        }
      } catch (err) {
        console.warn('Google Places API call error, falling back to curated places:', err);
      }
    }

    // Fallback Curated Places
    const fallbackPlaces = generateFallbackPlaces(destMeta);
    cache.set(cacheKey, fallbackPlaces, 86400);
    return fallbackPlaces;
  },
};

function mapPriceLevel(level: string): number {
  if (level === 'PRICE_LEVEL_INEXPENSIVE') return 1;
  if (level === 'PRICE_LEVEL_MODERATE') return 2;
  if (level === 'PRICE_LEVEL_EXPENSIVE') return 3;
  if (level === 'PRICE_LEVEL_VERY_EXPENSIVE') return 4;
  return 2;
}

function generateFallbackPlaces(dest: any): Place[] {
  const baseUSD = dest.priceIndexUSD || 80;

  return [
    {
      id: `${dest.id}-hotel-1`,
      name: `${dest.city} Horizon Suites`,
      category: 'Boutique Hotel',
      type: 'hotel',
      rating: 4.8,
      userRatingCount: 340,
      priceLevel: 2,
      estimatedPrice: Math.round(baseUSD * 0.8),
      priceUnit: 'night',
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format',
      location: { address: `Central District, ${dest.city}`, neighborhood: 'Downtown' },
      distanceKm: 1.2,
      tags: ['Pool', 'City View', 'Breakfast Included'],
      description: `Boutique luxury accommodation with scenic views of ${dest.city}.`,
      budgetFitReason: 'Great balance of comfort and nightly cost.',
    },
    {
      id: `${dest.id}-hotel-2`,
      name: `Grand ${dest.city} Heritage Hotel`,
      category: 'Luxury Resort',
      type: 'hotel',
      rating: 4.9,
      userRatingCount: 890,
      priceLevel: 4,
      estimatedPrice: Math.round(baseUSD * 1.6),
      priceUnit: 'night',
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=600&h=400&fit=crop&auto=format',
      location: { address: `Panorama Boulevard, ${dest.city}`, neighborhood: 'Uptown' },
      distanceKm: 3.5,
      tags: ['Spa', 'Infinity Pool', 'Fine Dining'],
      description: 'Exclusive 5-star experience with bespoke concierge and panoramic horizons.',
    },
    {
      id: `${dest.id}-rest-1`,
      name: `${dest.city} Artisan Bistro`,
      category: 'Local Gourmet & Wine',
      type: 'restaurant',
      rating: 4.7,
      userRatingCount: 420,
      priceLevel: 2,
      estimatedPrice: Math.round(baseUSD * 0.28),
      priceUnit: 'person',
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format',
      location: { address: `Market Square, ${dest.city}`, neighborhood: 'Old Town' },
      distanceKm: 1.8,
      tags: ['Local Flavors', 'Outdoor Patio', 'Vegetarian Friendly'],
      description: 'Celebrated culinary spot highlighting seasonal produce and authentic regional delicacies.',
    },
    {
      id: `${dest.id}-act-1`,
      name: `${dest.name} National Landmark & Heritage Tour`,
      category: 'Culture & Sightseeing',
      type: 'activity',
      rating: 4.8,
      userRatingCount: 1200,
      priceLevel: 1,
      estimatedPrice: Math.round(baseUSD * 0.15),
      priceUnit: 'ticket',
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&h=400&fit=crop&auto=format',
      location: { address: `Cultural Promenade, ${dest.city}`, neighborhood: 'Museum Quarter' },
      distanceKm: 2.1,
      tags: ['Guided Tour', 'Photography', 'Historic'],
      description: `The premier iconic attraction of ${dest.name}, providing an unforgettable cultural journey.`,
      budgetFitReason: 'Affordable entry with exceptional visitor reviews.',
    },
  ];
}
