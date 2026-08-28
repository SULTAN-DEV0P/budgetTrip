-- ==========================================================
-- BudgetTrip — Supabase / PostgreSQL Database Schema
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  destination_id TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  city TEXT,
  country TEXT NOT NULL,
  continent TEXT,
  flag TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL DEFAULT 3,
  travelers INTEGER NOT NULL DEFAULT 1,
  total_budget NUMERIC NOT NULL,
  interests TEXT[],
  accommodation_preference TEXT DEFAULT 'budget',
  selected_hotel JSONB,
  days JSONB NOT NULL DEFAULT '[]'::jsonb,
  breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Index for fast user trips lookup
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination_id ON trips(destination_id);

-- 3. Saved Places (Bookmarks) Table
CREATE TABLE IF NOT EXISTS saved_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  place_id TEXT NOT NULL,
  place_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_saved_places_user_id ON saved_places(user_id);

-- 4. Cached Destinations (Google Places & Curated spots cache)
CREATE TABLE IF NOT EXISTS cached_destinations (
  destination_id TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'all',
  places_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  expires_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_destinations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to cached destinations
CREATE POLICY "Public read cached destinations" ON cached_destinations FOR SELECT USING (true);

-- Allow public read to public trips
CREATE POLICY "Public read public trips" ON trips FOR SELECT USING (is_public = true);
