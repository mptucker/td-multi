import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let anon: SupabaseClient | null = null;
let service: SupabaseClient | null = null;

export function hasSupabase(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Read-only client (RLS: anon can select published rows). */
export function supabaseAnon(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  anon ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  return anon;
}

let fresh: SupabaseClient | null = null;

/*
 * Shared settings (the Dockline "Text us" button, footer, TAP) are read with the
 * same fallbacks as /admin and /studio. In production NEXT_PUBLIC_SUPABASE_ANON_KEY
 * is a Sensitive Vercel variable the server can't read, so the button saved in
 * /admin never showed. Page content still uses supabaseAnon() and the copy in the
 * code until each site's CMS content is checked (Lighthouse's CMS copy is older
 * than its redesign).
 */
function sharedSettingsUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}
function sharedSettingsKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  );
}

/**
 * Read-only client that skips Next's fetch cache. Used for small shared
 * settings (global_settings) so a CMS change shows on every site right away;
 * the cached client kept serving a missing "dockline_widget" row long after
 * it was saved.
 */
export function supabaseAnonFresh(): SupabaseClient | null {
  const url = sharedSettingsUrl();
  const key = sharedSettingsKey();
  if (!/^https:\/\//.test(url) || !key) return null;
  fresh ??= createClient(url, key, {
    auth: { persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return fresh;
}

/** Server-only client for the admin UI and seed script. Never import from a client component. */
export function supabaseService(): SupabaseClient | null {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  service ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
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
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: "Bearer " + accessToken } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
