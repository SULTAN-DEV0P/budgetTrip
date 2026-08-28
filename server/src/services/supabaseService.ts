import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Trip, Place } from '../types/index.js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

export const supabaseService = {
  async saveTrip(trip: Trip, userId?: string): Promise<any> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('trips')
        .upsert({
          id: trip.id,
          user_id: userId || null,
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
      console.warn('Backend Supabase saveTrip error:', err);
      return null;
    }
  },

  async cacheDestinationPlaces(destinationId: string, category = 'all', places: Place[]): Promise<void> {
    if (!supabase) return;
    try {
      await supabase.from('cached_destinations').upsert({
        destination_id: destinationId,
        category,
        places_data: places,
        expires_at: new Date(Date.now() + 86400 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Backend Supabase cacheDestination error:', err);
    }
  },

  async getCachedDestinationPlaces(destinationId: string, category = 'all'): Promise<Place[] | null> {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('cached_destinations')
        .select('places_data, expires_at')
        .eq('destination_id', destinationId)
        .eq('category', category)
        .single();

      if (error || !data) return null;
      if (new Date(data.expires_at) < new Date()) return null; // Expired

      return data.places_data as Place[];
    } catch {
      return null;
    }
  },
};
