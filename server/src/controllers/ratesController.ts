import { Request, Response } from 'express';
import { currencyService } from '../services/currencyService.js';

export const ratesController = {
  async getRates(req: Request, res: Response) {
    try {
      const rates = await currencyService.getExchangeRates();
      res.json({ success: true, base: 'USD', rates });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Rates lookup failed' });
    }
  },

  async convertCurrency(req: Request, res: Response) {
    try {
      const { amount, from = 'USD', to = 'USD' } = req.query;
      const converted = await currencyService.convert(
        Number(amount) || 0,
        String(from),
        String(to)
      );
      res.json({ success: true, from, to, amount: Number(amount) || 0, converted });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Conversion failed' });
    }
  },
};
