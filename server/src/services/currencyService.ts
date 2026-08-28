import axios from 'axios';
import { cache } from '../config/cache.js';

export const BASE_EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  NGN: 1580.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155.0,
  AED: 3.67,
  ZAR: 18.2,
  GHS: 15.5,
  EGP: 48.5,
  CAD: 1.38,
  AUD: 1.52,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  NGN: '₦',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AED: 'AED ',
  ZAR: 'R ',
  GHS: 'GH₵ ',
  EGP: 'E£ ',
  CAD: 'CA$',
  AUD: 'A$',
};

export const currencyService = {
  async getExchangeRates(): Promise<Record<string, number>> {
    const cachedRates = cache.get<Record<string, number>>('exchange_rates');
    if (cachedRates) {
      return cachedRates;
    }

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (apiKey) {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
          { timeout: 5000 }
        );
        if (response.data && response.data.conversion_rates) {
          const rates = response.data.conversion_rates;
          cache.set('exchange_rates', rates, 86400); // 24 hours
          return rates;
        }
      } catch (err) {
        console.warn('Live exchange rate API unavailable, using fallback rates:', err);
      }
    }

    cache.set('exchange_rates', BASE_EXCHANGE_RATES, 86400);
    return BASE_EXCHANGE_RATES;
  },

  async convert(amount: number, fromCurrency = 'USD', toCurrency = 'USD'): Promise<number> {
    if (fromCurrency === toCurrency || !amount) return amount;
    const rates = await this.getExchangeRates();
    const fromRate = rates[fromCurrency] || BASE_EXCHANGE_RATES[fromCurrency] || 1.0;
    const toRate = rates[toCurrency] || BASE_EXCHANGE_RATES[toCurrency] || 1.0;

    const amountInUSD = amount / fromRate;
    return Math.round(amountInUSD * toRate);
  },

  format(amount: number, currency = 'USD'): string {
    const symbol = CURRENCY_SYMBOLS[currency] || `${currency} `;
    const formatted = Math.round(amount).toLocaleString();
    return `${symbol}${formatted}`;
  },
};
