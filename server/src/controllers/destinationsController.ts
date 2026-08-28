import { Request, Response } from 'express';
import { WORLD_DESTINATIONS } from '../services/destinationsData.js';
import axios from 'axios';
import { cache } from '../config/cache.js';

export const destinationsController = {
  getAllDestinations(req: Request, res: Response) {
    const { continent, category, query } = req.query;

    let results = [...WORLD_DESTINATIONS];

    if (continent && continent !== 'All') {
      results = results.filter(
        (d) => d.continent.toLowerCase() === String(continent).toLowerCase()
      );
    }

    if (category && category !== 'All') {
      results = results.filter(
        (d) => d.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    if (query && String(query).trim() !== '') {
      const q = String(query).toLowerCase().trim();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.tag.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: results.length, data: results });
  },

  getDestinationById(req: Request, res: Response) {
    const id = String(req.params.id);
    const dest = WORLD_DESTINATIONS.find(
      (d) => d.id === id || d.country.toLowerCase() === id.toLowerCase()
    );

    if (!dest) {
      return res.status(404).json({ success: false, error: 'Destination not found' });
    }

    res.json({ success: true, data: dest });
  },

  async getCountryEssentials(req: Request, res: Response) {
    const countryName = String(req.params.countryName);
    const cacheKey = `essentials_${countryName.toLowerCase()}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=false`,
        { timeout: 4000 }
      );

      if (response.data && response.data.length > 0) {
        const country = response.data[0];

        const essentials = {
          commonName: country.name?.common || countryName,
          officialName: country.name?.official,
          flagEmoji: country.flag,
          flagUrl: country.flags?.svg || country.flags?.png,
          capital: country.capital?.[0] || 'Unknown',
          currencies: country.currencies
            ? Object.values(country.currencies).map((c: any) => `${c.name} (${c.symbol})`)
            : [],
          languages: country.languages ? Object.values(country.languages) : ['English'],
          timezone: country.timezones?.[0] || 'UTC',
          callingCode: country.idd?.root
            ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}`
            : '+1',
          carSide: country.car?.side || 'right',
        };

        cache.set(cacheKey, essentials, 86400); // 24 hours
        return res.json({ success: true, data: essentials });
      }
    } catch (err) {
      console.warn('REST Countries API lookup failed, returning fallback:', err);
    }

    const fallback = {
      commonName: countryName,
      capital: 'Capital City',
      languages: ['English'],
      callingCode: '+1',
    };
    res.json({ success: true, data: fallback });
  },
};
