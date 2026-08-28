import { Request, Response } from 'express';
import { googlePlacesService } from '../services/googlePlacesService.js';
import { scoringService } from '../services/scoringService.js';

export const placesController = {
  async searchPlaces(req: Request, res: Response) {
    try {
      const {
        destinationId = 'lagos',
        category,
        query,
        minRating,
        maxPrice,
        sortBy = 'recommended',
        currency = 'USD',
      } = req.query;

      let places = await googlePlacesService.searchPlaces({
        destinationId: String(destinationId),
        category: category ? String(category) : undefined,
        query: query ? String(query) : undefined,
        targetCurrency: String(currency),
      });

      // Filter by min rating
      if (minRating) {
        const min = Number(minRating);
        places = places.filter((p) => p.rating >= min);
      }

      // Filter by max price
      if (maxPrice) {
        const max = Number(maxPrice);
        places = places.filter((p) => p.estimatedPrice <= max);
      }

      // Sort
      if (sortBy === 'price_low') {
        places.sort((a, b) => a.estimatedPrice - b.estimatedPrice);
      } else if (sortBy === 'price_high') {
        places.sort((a, b) => b.estimatedPrice - a.estimatedPrice);
      } else if (sortBy === 'rating') {
        places.sort((a, b) => b.rating - a.rating);
      } else {
        places = scoringService.scorePlaces(places);
      }

      res.json({ success: true, count: places.length, data: places });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Places search failed' });
    }
  },
};
