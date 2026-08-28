export const CURRENCY_SYMBOLS = {
  NGN: '₦',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AED: 'AED ',
  CAD: 'CA$',
  AUD: 'AU$',
  CHF: 'CHF ',
  CNY: '¥',
  INR: '₹',
  BRL: 'R$',
  ZAR: 'R ',
  EGP: 'E£',
  KES: 'KSh ',
  GHS: 'GH₵',
  THB: '฿',
  IDR: 'Rp ',
  SGD: 'S$',
  TRY: '₺',
  SAR: 'SAR ',
  MXN: 'MX$',
  KRW: '₩',
  MAD: 'MAD ',
  NZD: 'NZ$',
  QAR: 'QAR ',
  TZS: 'TSh ',
  SEK: 'kr ',
  NOK: 'kr ',
  DKK: 'kr ',
};

export const USD_EXCHANGE_RATES = {
  USD: 1,
  NGN: 1550,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 154.5,
  AED: 3.67,
  CAD: 1.38,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.24,
  INR: 84.2,
  BRL: 5.65,
  ZAR: 18.2,
  EGP: 48.6,
  KES: 129.5,
  GHS: 15.8,
  THB: 36.4,
  IDR: 15800,
  SGD: 1.34,
  TRY: 34.2,
  SAR: 3.75,
  MXN: 19.8,
  KRW: 1375,
  MAD: 9.85,
  NZD: 1.66,
  QAR: 3.64,
  TZS: 2650,
  SEK: 10.5,
  NOK: 10.8,
  DKK: 6.85,
};

export const COUNTRY_CURRENCY_MAP = {
  Nigeria: 'NGN',
  'United States': 'USD',
  USA: 'USD',
  France: 'EUR',
  Italy: 'EUR',
  Spain: 'EUR',
  Germany: 'EUR',
  Greece: 'EUR',
  Netherlands: 'EUR',
  Portugal: 'EUR',
  'United Kingdom': 'GBP',
  UK: 'GBP',
  England: 'GBP',
  Japan: 'JPY',
  'United Arab Emirates': 'AED',
  UAE: 'AED',
  Dubai: 'AED',
  Canada: 'CAD',
  Australia: 'AUD',
  Switzerland: 'CHF',
  China: 'CNY',
  India: 'INR',
  Brazil: 'BRL',
  'South Africa': 'ZAR',
  Egypt: 'EGP',
  Kenya: 'KES',
  Ghana: 'GHS',
  Thailand: 'THB',
  Indonesia: 'IDR',
  Bali: 'IDR',
  Singapore: 'SGD',
  Turkey: 'TRY',
  'Saudi Arabia': 'SAR',
  Mexico: 'MXN',
  'South Korea': 'KRW',
  Korea: 'KRW',
  Morocco: 'MAD',
  'New Zealand': 'NZD',
  Qatar: 'QAR',
  Tanzania: 'TZS',
  Zanzibar: 'TZS',
};

export function getCurrencyForCountry(countryName = '') {
  const match = Object.keys(COUNTRY_CURRENCY_MAP).find(
    (c) =>
      countryName.toLowerCase().includes(c.toLowerCase()) ||
      c.toLowerCase().includes(countryName.toLowerCase())
  );
  return match ? COUNTRY_CURRENCY_MAP[match] : 'USD';
}

export function formatCurrency(amount, currency = 'USD', compact = false) {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  if (compact && Math.abs(amount) >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `${symbol}${(amount / 1_000).toFixed(0)}k`;
  }

  return `${symbol}${Math.round(amount || 0).toLocaleString('en-US')}`;
}

export function convertCurrency(amount, from = 'USD', to = 'USD') {
  if (from === to) return amount || 0;
  const inUSD = (amount || 0) / (USD_EXCHANGE_RATES[from] || 1);
  return inUSD * (USD_EXCHANGE_RATES[to] || 1);
}
