import { PlaceType } from '../types/index.js';

export const estimatorService = {
  estimatePlacePrice(
    type: PlaceType,
    priceIndexUSD: number,
    priceLevel?: number
  ): number {
    const level = priceLevel || 2; // Default to mid-range

    if (type === 'hotel') {
      const hotelBaseByLevel: Record<number, number> = {
        1: 0.45,  // Budget / hostel / basic
        2: 0.85,  // Boutique / mid-range
        3: 1.45,  // 4-star / upscale
        4: 2.50,  // 5-star / luxury resort
      };
      const factor = hotelBaseByLevel[level] || 0.85;
      return Math.round(priceIndexUSD * factor);
    }

    if (type === 'restaurant') {
      const restBaseByLevel: Record<number, number> = {
        1: 0.15,  // Street food / quick bite
        2: 0.28,  // Casual sit-down / cafe
        3: 0.55,  // Upscale dining
        4: 1.10,  // Fine dining / gourmet
      };
      const factor = restBaseByLevel[level] || 0.28;
      return Math.round(priceIndexUSD * factor);
    }

    // Activities
    const actBaseByLevel: Record<number, number> = {
      1: 0.08,  // Free/token entry museum / park
      2: 0.18,  // Gallery / landmark ticket
      3: 0.35,  // Guided tour / day pass
      4: 0.80,  // Exclusive boat cruise / private safari
    };
    const factor = actBaseByLevel[level] || 0.18;
    return Math.round(priceIndexUSD * factor);
  },

  calculateTransitAllowance(days: number, travelers: number, targetCurrency: string, rate: number): number {
    const baseDailyTransitUSD = 5; // $5 USD per traveler per day
    const totalTransitUSD = days * travelers * baseDailyTransitUSD;
    return Math.round(totalTransitUSD * rate);
  },
};
