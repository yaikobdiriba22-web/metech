import { createClient } from "@supabase/supabase-js";

const metaEnv = (import.meta as any).env || {};

const supabaseUrl =
  metaEnv.VITE_SUPABASE_URL ||
  (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_URL : "") ||
  "";

const supabasePublishableKey =
  metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== "undefined"
    ? process.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
      process.env?.VITE_SUPABASE_ANON_KEY
    : "") ||
  "";

/**
 * True only when the app has been configured with a real Supabase project URL
 * and a publishable/legacy anon key. These values are public client config;
 * never place a service-role key in VITE_* variables.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl.trim() && supabasePublishableKey.trim(),
);

/**
 * Keep the UI bootable in local preview when environment variables are missing,
 * but do not silently point it at a stale project or pretend persistence works.
 * Auth/data requests will fail until the correct Vercel environment variables
 * are configured.
 */
export const supabase = createClient(
  supabaseUrl || "http://127.0.0.1:54321",
  supabasePublishableKey || "missing-supabase-publishable-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
