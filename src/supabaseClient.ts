import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Simple validation to verify if keys are configured and are not placeholders
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseAnonKey.includes('your-anon-key');

// Initialize client if configured, otherwise expose null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    '🏛️ CivicPulse Alert: Supabase URL and Anon Key are missing or set to default placeholders in .env.local. Using in-memory client-side fallback database.'
  );
}
