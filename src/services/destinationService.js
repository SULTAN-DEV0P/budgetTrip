import { DESTINATIONS_DATA } from '../data/mockDestinations';

/**
 * Service to retrieve destination metadata and lists
 */

export const destinationService = {
  /**
   * Get all supported destinations
   * @returns {Promise<Array>}
   */
  async getAllDestinations() {
    // Simulated async to mirror future API integration
    return Object.values(DESTINATIONS_DATA).map(dest => ({
      id: dest.id,
      name: dest.name,
      state: dest.state,
      country: dest.country,
      tagLine: dest.tagLine,
      description: dest.description,
      imageUrl: dest.imageUrl,
      coordinates: dest.coordinates,
      popularTags: dest.popularTags,
      budgetTier: dest.budgetTier,
      totalHotels: dest.hotels.length,
      totalRestaurants: dest.restaurants.length,
      totalActivities: dest.activities.length,
    }));
  },

  /**
   * Get complete details of a specific destination including all places
   * @param {string} destinationId
   * @returns {Promise<Object|null>}
   */
  async getDestinationById(destinationId) {
    const key = destinationId.toLowerCase();
    const dest = DESTINATIONS_DATA[key];
    if (!dest) return null;
    return { ...dest };
  },

  /**
   * Search destinations by text query
   * @param {string} query
   * @returns {Promise<Array>}
   */
  async searchDestinations(query) {
    if (!query) return this.getAllDestinations();
    const q = query.toLowerCase().trim();
    const all = await this.getAllDestinations();
    return all.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.popularTags.some(t => t.toLowerCase().includes(q))
    );
  },
};
