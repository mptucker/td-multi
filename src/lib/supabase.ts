import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let anon: SupabaseClient | null = null;
let service: SupabaseClient | null = null;

export function supabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

export function supabaseKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  );
}

export function hasSupabase(): boolean {
  return /^https:\/\//.test(supabaseUrl()) && Boolean(supabaseKey());
}

/** Read-only client (RLS: anon can select published rows). */
export function supabaseAnon(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  anon ??= createClient(supabaseUrl(), supabaseKey(), {
    auth: { persistSession: false },
  });
  return anon;
}

let fresh: SupabaseClient | null = null;

/**
 * Read-only client that skips Next's fetch cache. Used for small shared
 * settings (global_settings) so a CMS change shows on every site right away;
 * the cached client kept serving a missing "dockline_widget" row long after
 * it was saved.
 */
export function supabaseAnonFresh(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  fresh ??= createClient(supabaseUrl(), supabaseKey(), {
    auth: { persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return fresh;
}

/** Server-only client for the admin UI and seed script. Never import from a client component. */
export function supabaseService(): SupabaseClient | null {
  if (!/^https:\/\//.test(supabaseUrl()) || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  service ??= createClient(supabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  return service;
}

/** Browser client for Supabase Phone OTP and CMS operations protected by RLS. */
export function supabaseBrowser(url?: string, key?: string): SupabaseClient | null {
  const resolvedUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const resolvedKey = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!resolvedUrl || !resolvedKey) return null;
  return createClient(resolvedUrl, resolvedKey);
}

/** Server client scoped to a staff member's JWT; all reads remain subject to RLS. */
export function supabaseAuthenticated(accessToken: string): SupabaseClient | null {
  if (!hasSupabase()) return null;
  return createClient(supabaseUrl(), supabaseKey(), {
    global: { headers: { Authorization: "Bearer " + accessToken } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
