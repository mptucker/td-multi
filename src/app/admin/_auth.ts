import "server-only";
import { supabaseAuthenticated } from "@/lib/supabase";
import type { BrandSlug } from "@/config/types";

export type CmsRole = "admin" | "director" | "site_manager" | "editor" | "viewer";
export type CmsUser = { userId: string; phone?: string; displayName: string; role: CmsRole; sites: BrandSlug[] };

export async function cmsUserFromRequest(request: Request): Promise<CmsUser | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const sb = token ? supabaseAuthenticated(token) : null;
  if (!token || !sb) return null;
  const { data: auth, error } = await sb.auth.getUser(token);
  if (error || !auth.user) return null;
  const { data: profile } = await sb.from("cms_users").select("user_id,display_name,phone,role,active").eq("user_id", auth.user.id).maybeSingle();
  if (!profile?.active) return null;
  const { data: assignments } = await sb.from("cms_user_sites").select("brand").eq("user_id", auth.user.id);
  return { userId: auth.user.id, phone: profile.phone ?? auth.user.phone, displayName: profile.display_name || auth.user.phone || "Staff member", role: profile.role as CmsRole, sites: (assignments ?? []).map((row) => row.brand as BrandSlug) };
}

export function canWrite(user: CmsUser) { return user.role !== "viewer"; }
export function canManageUsers(user: CmsUser) { return user.role === "admin"; }
export function canAccessBrand(user: CmsUser, brand?: string | null) { return !brand || user.role === "admin" || user.role === "director" || user.sites.includes(brand as BrandSlug); }
