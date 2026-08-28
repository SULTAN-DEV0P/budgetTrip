import { Router } from 'express';
import { destinationsController } from '../controllers/destinationsController.js';
import { placesController } from '../controllers/placesController.js';
import { tripsController } from '../controllers/tripsController.js';
import { ratesController } from '../controllers/ratesController.js';

export const apiRouter = Router();

// Destinations
apiRouter.get('/destinations', destinationsController.getAllDestinations);
apiRouter.get('/destinations/:id', destinationsController.getDestinationById);
apiRouter.get('/destinations/:countryName/essentials', destinationsController.getCountryEssentials);

// Places
apiRouter.get('/places/search', placesController.searchPlaces);

// Trips & Optimizer
apiRouter.post('/trips/generate', tripsController.generateTrip);
apiRouter.post('/trips/optimize', tripsController.optimizeTrip);
apiRouter.post('/trips/apply-optimization', tripsController.applyOptimization);

// Currency Exchange Rates
apiRouter.get('/rates', ratesController.getRates);
apiRouter.get('/rates/convert', ratesController.convertCurrency);
