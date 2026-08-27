import { CURRENCIES } from '../types';

/**
 * Format an amount in NGN or convert to target currency
 * @param {number} amountInNgn - Amount in Nigerian Naira
 * @param {string} [targetCurrency='NGN'] - Currency code ('NGN', 'USD', 'EUR', 'GBP')
 * @returns {string} Formatted string, e.g. "₦25,000" or "$16.67"
 */
export function formatCurrency(amountInNgn, targetCurrency = 'NGN') {
  if (typeof amountInNgn !== 'number' || isNaN(amountInNgn)) {
    amountInNgn = 0;
  }

  const currencyObj = CURRENCIES[targetCurrency] || CURRENCIES.NGN;
  const converted = amountInNgn / currencyObj.rateToNgn;

  if (targetCurrency === 'NGN') {
    return `₦${Math.round(converted).toLocaleString('en-NG')}`;
  } else if (targetCurrency === 'USD') {
    return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  } else if (targetCurrency === 'EUR') {
    return `€${converted.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  } else if (targetCurrency === 'GBP') {
    return `£${converted.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  return `${currencyObj.symbol}${Math.round(converted).toLocaleString()}`;
}

/**
 * Convert an amount from a given currency back to NGN base currency
 * @param {number} amount
 * @param {string} fromCurrency
 * @returns {number} Amount in NGN
 */
export function convertToNgn(amount, fromCurrency = 'NGN') {
  const currencyObj = CURRENCIES[fromCurrency] || CURRENCIES.NGN;
  return amount * currencyObj.rateToNgn;
}
