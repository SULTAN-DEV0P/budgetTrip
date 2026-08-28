import { Request, Response } from 'express';
import { tripGeneratorService } from '../services/tripGeneratorService.js';
import { optimizerService } from '../services/optimizerService.js';
import { googlePlacesService } from '../services/googlePlacesService.js';

export const tripsController = {
  async generateTrip(req: Request, res: Response) {
    try {
      const {
        destinationId,
        startDate,
        endDate,
        travelers,
        totalBudget,
        currency,
        interests,
        accommodationPreference,
      } = req.body;

      if (!destinationId || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'destinationId, startDate, and endDate are required fields',
        });
      }

      const trip = await tripGeneratorService.generateTrip({
        destinationId,
        startDate,
        endDate,
        travelers: Number(travelers) || 1,
        totalBudget: Number(totalBudget) || 1000,
        currency: currency || 'USD',
        interests: interests || [],
        accommodationPreference: accommodationPreference || 'budget',
      });

      res.json({ success: true, data: trip });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Trip generation failed' });
    }
  },

  async optimizeTrip(req: Request, res: Response) {
    try {
      const { trip } = req.body;
      if (!trip) {
        return res.status(400).json({ success: false, error: 'trip object is required' });
      }

      const places = await googlePlacesService.searchPlaces({
        destinationId: trip.destinationId,
        targetCurrency: trip.currency,
      });

      const analysis = optimizerService.analyzeBudgetOptimization(trip, places);
      res.json({ success: true, data: analysis });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Optimization analysis failed' });
    }
  },

  async applyOptimization(req: Request, res: Response) {
    try {
      const { trip, suggestions } = req.body;
      if (!trip || !suggestions) {
        return res.status(400).json({ success: false, error: 'trip and suggestions are required' });
      }

      const updated = optimizerService.applyOptimizations(trip, suggestions);
      updated.breakdown = tripGeneratorService.calculateBudgetBreakdown(updated);

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Applying optimizations failed' });
    }
  },
};
