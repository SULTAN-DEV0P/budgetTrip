const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  async getDestinations(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.continent) params.append('continent', filters.continent);
      if (filters.category) params.append('category', filters.category);
      if (filters.query) params.append('query', filters.query);

      const res = await fetch(`${API_BASE_URL}/destinations?${params.toString()}`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async searchPlaces(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.destinationId) queryParams.append('destinationId', params.destinationId);
      if (params.category) queryParams.append('category', params.category);
      if (params.query) queryParams.append('query', params.query);
      if (params.minRating) queryParams.append('minRating', params.minRating);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.currency) queryParams.append('currency', params.currency);

      const res = await fetch(`${API_BASE_URL}/places/search?${queryParams.toString()}`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async generateTrip(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/trips/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Trip generation API failed');
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async optimizeTrip(trip) {
    try {
      const res = await fetch(`${API_BASE_URL}/trips/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip }),
      });
      if (!res.ok) throw new Error('Optimization API failed');
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async getExchangeRates() {
    try {
      const res = await fetch(`${API_BASE_URL}/rates`);
      if (!res.ok) throw new Error('Rates API failed');
      const data = await res.json();
      return data.rates;
    } catch {
      return null;
    }
  },
};
