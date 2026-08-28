import { ALL_WORLD_DESTINATIONS } from '../data/allWorldDestinations';

export const worldCatalogService = {
  /**
   * Search all destinations locally first, and fallback to live REST Countries / OSM search
   */
  async searchDestinations(query, continent = 'All') {
    const q = (query || '').trim().toLowerCase();

    // 1. Local filter across our pre-loaded catalog
    const localMatches = ALL_WORLD_DESTINATIONS.filter((d) => {
      const matchesContinent =
        continent === 'All' || d.continent.toLowerCase() === continent.toLowerCase();
      if (!matchesContinent) return false;
      if (!q) return true;

      return (
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q)
      );
    });

    if (localMatches.length > 0 || !q || q.length < 2) {
      return localMatches;
    }

    // 2. If no local matches, do a live online lookup via REST Countries API
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fullText=false`
      );

      if (response.ok) {
        const countries = await response.json();
        if (Array.isArray(countries) && countries.length > 0) {
          const liveDestinations = countries.slice(0, 4).map((c) => {
            const countryName = c.name?.common || q;
            const capital = c.capital?.[0] || countryName;
            const flag = c.flag || '🌍';
            const curCode = c.currencies ? Object.keys(c.currencies)[0] : 'USD';
            const region = c.region || 'World';

            return {
              id: `${countryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${capital.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              name: `${capital}, ${countryName}`,
              city: capital,
              country: countryName,
              continent: mapRegionToContinent(region),
              flag,
              currency: curCode,
              priceIndexUSD: 70,
              tag: `Explore ${countryName}`,
              category: 'Popular',
              img: c.flags?.svg || c.flags?.png || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&auto=format',
              description: `Discover authentic travel experiences, culture, and dining in ${capital}, ${countryName}.`,
            };
          });

          return liveDestinations;
        }
      }
    } catch {
      // Fallback
    }

    return [];
  },
};

function mapRegionToContinent(region) {
  if (region === 'Africa') return 'Africa';
  if (region === 'Europe') return 'Europe';
  if (region === 'Asia') return 'Asia';
  if (region === 'Americas') return 'Americas';
  if (region === 'Oceania') return 'Asia';
  return 'Africa';
}
