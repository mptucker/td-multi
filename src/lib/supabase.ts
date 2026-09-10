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
