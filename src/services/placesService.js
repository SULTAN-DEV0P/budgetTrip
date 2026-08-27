import { DESTINATIONS_DATA } from '../data/mockDestinations';

/**
 * Service to discover, search and filter places (Hotels, Restaurants, Activities)
 */

export const placesService = {
  /**
   * Get all places for a destination, optionally filtered by category
   * @param {string} destinationId 
   * @param {'all' | 'hotel' | 'restaurant' | 'activity'} [category='all']
   * @returns {Promise<Array>}
   */
  async getPlaces(destinationId, category = 'all') {
    const key = destinationId.toLowerCase();
    const dest = DESTINATIONS_DATA[key];
    if (!dest) return [];

    let places = [];
    if (category === 'all' || category === 'hotel') {
      places = places.concat(dest.hotels);
    }
    if (category === 'all' || category === 'restaurant') {
      places = places.concat(dest.restaurants);
    }
    if (category === 'all' || category === 'activity') {
      places = places.concat(dest.activities);
    }

    return places;
  },

  /**
   * Get specific place by ID
   * @param {string} placeId 
   * @returns {Promise<Object|null>}
   */
  async getPlaceById(placeId) {
    for (const dest of Object.values(DESTINATIONS_DATA)) {
      const all = [...dest.hotels, ...dest.restaurants, ...dest.activities];
      const match = all.find(p => p.id === placeId);
      if (match) return { ...match };
    }
    return null;
  },

  /**
   * Filter and sort places by budget and user interests
   * @param {Object} params
   * @param {string} params.destinationId
   * @param {string} [params.category]
   * @param {number} [params.maxPrice]
   * @param {number} [params.minRating]
   * @param {string[]} [params.interests]
   * @param {string} [params.sortBy] - 'recommended' | 'price_low' | 'price_high' | 'rating'
   */
  async filterPlaces({
    destinationId,
    category = 'all',
    maxPrice = Infinity,
    minRating = 0,
    interests = [],
    sortBy = 'recommended',
  }) {
    let places = await this.getPlaces(destinationId, category);

    // Apply rating filter
    if (minRating > 0) {
      places = places.filter(p => p.rating >= minRating);
    }

    // Apply price filter
    if (maxPrice < Infinity) {
      places = places.filter(p => p.estimatedPrice <= maxPrice);
    }

    // Scoring & Sorting
    if (sortBy === 'price_low') {
      places.sort((a, b) => a.estimatedPrice - b.estimatedPrice);
    } else if (sortBy === 'price_high') {
      places.sort((a, b) => b.estimatedPrice - a.estimatedPrice);
    } else if (sortBy === 'rating') {
      places.sort((a, b) => b.rating - a.rating);
    } else {
      // 'recommended' composite scoring
      places.sort((a, b) => {
        const scoreA = computeRecommendationScore(a, interests);
        const scoreB = computeRecommendationScore(b, interests);
        return scoreB - scoreA;
      });
    }

    return places;
  },
};

/**
 * 4-Factor Recommendation Scoring Formula
 * Score = (Rating * 0.40) + (InterestMatch * 0.35) + (ReviewWeight * 0.25)
 */
function computeRecommendationScore(place, userInterests = []) {
  const ratingScore = (place.rating / 5.0) * 100;
  
  let interestMatches = 0;
  if (userInterests.length > 0 && place.tags) {
    const lowerTags = place.tags.map(t => t.toLowerCase());
    userInterests.forEach(interest => {
      if (lowerTags.some(t => t.includes(interest.toLowerCase()))) {
        interestMatches++;
      }
    });
  }
  const interestScore = userInterests.length > 0 ? (interestMatches / userInterests.length) * 100 : 50;
  const reviewScore = Math.min(100, (place.reviewCount || 100) / 15);

  return (ratingScore * 0.40) + (interestScore * 0.35) + (reviewScore * 0.25);
}
