import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const supabaseTripService = {
  async saveTrip(trip, userId) {
    if (!supabase || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('trips')
        .upsert({
          id: trip.id,
          user_id: userId,
          destination_id: trip.destinationId,
          destination_name: trip.destinationName,
          country: trip.country,
          currency: trip.currency,
          start_date: trip.startDate,
          end_date: trip.endDate,
          total_days: trip.totalDays,
          travelers: trip.travelers,
          total_budget: trip.totalBudget,
          selected_hotel: trip.selectedHotel,
          days: trip.days,
          breakdown: trip.breakdown,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Could not sync trip to Supabase:', err);
      return null;
    }
  },

  async getUserTrips(userId) {
    if (!supabase || !userId) return [];
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Could not fetch user trips from Supabase:', err);
      return [];
    }
  },

  async syncSavedPlaces(places, userId) {
    if (!supabase || !userId) return;
    try {
      const rows = places.map((place) => ({
        user_id: userId,
        place_id: place.id,
        place_data: place,
      }));

      await supabase.from('saved_places').upsert(rows, { onConflict: 'user_id,place_id' });
    } catch (err) {
      console.warn('Could not sync saved places to Supabase:', err);
    }
  },
};
