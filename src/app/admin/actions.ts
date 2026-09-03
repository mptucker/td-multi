"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseService } from "@/lib/supabase";
import { BRAND_SLUGS } from "@/config/brands";
import { isAdmin, login, logout } from "./_auth";

export type Table = "events" | "packages" | "alerts" | "facts";

async function guard() {
  if (!(await isAdmin())) redirect("/admin");
}

export async function loginAction(formData: FormData) {
  const ok = await login(String(formData.get("password") ?? ""));
  redirect(ok ? "/admin/events" : "/admin?error=1");
}

export async function logoutAction() {
  await logout();
  redirect("/admin");
}

/** Convert a flat <form> into a row for the given table. */
function rowFromForm(table: Table, fd: FormData): Record<string, unknown> {
  const get = (k: string) => {
    const v = fd.get(k);
    return v === null || v === "" ? null : String(v);
  };
  const show_on_sites = BRAND_SLUGS.filter((s) => fd.get(`site_${s}`) === "on");
  const published = fd.get("published") === "on";
  const base: Record<string, unknown> = { id: get("id") ?? undefined };
  switch (table) {
    case "events":
      return { ...base, slug: get("slug"), title: get("title"), starts_at: get("starts_at"), ends_at: get("ends_at"), location: get("location"), summary: get("summary"), image: get("image"), price_text: get("price_text"), cta_label: get("cta_label"), cta_url: get("cta_url"), show_on_sites, published };
    case "packages":
      return { ...base, slug: get("slug"), title: get("title"), summary: get("summary"), details: get("details")?.split("\n").map((s) => s.trim()).filter(Boolean) ?? null, price_text: get("price_text"), image: get("image"), cta_label: get("cta_label"), cta_url: get("cta_url"), cta_intent: get("cta_intent"), valid_from: get("valid_from"), valid_to: get("valid_to"), sort_order: Number(get("sort_order") ?? 0), show_on_sites, published };
    case "alerts":
      return { ...base, text: get("text"), cta_label: get("cta_label"), cta_url: get("cta_url"), starts_at: get("starts_at"), ends_at: get("ends_at"), show_on_sites, published };
    case "facts":
      return { key: get("key"), brand: get("brand"), label: get("label"), value: get("value"), owner: get("owner"), last_verified: get("last_verified"), source_url: get("source_url"), notes: get("notes") };
  }
}

export async function saveRow(table: Table, formData: FormData) {
  await guard();
  const sb = supabaseService();
  if (!sb) throw new Error("Supabase is not configured (SUPABASE_SERVICE_ROLE_KEY missing).");
  const row = rowFromForm(table, formData);
  if (table !== "facts" && !row.id) delete row.id; // let Postgres generate
  const conflict = table === "facts" ? "key" : "id";
  const { error } = await sb.from(table).upsert(row, { onConflict: conflict });
  if (error) throw new Error(error.message);
  revalidatePath("/sites", "layout");
  redirect(`/admin/${table}`);
}

export async function deleteRow(table: Table, id: string) {
  await guard();
  const sb = supabaseService();
  if (!sb) throw new Error("Supabase is not configured.");
  const col = table === "facts" ? "key" : "id";
  const { error } = await sb.from(table).delete().eq(col, id);
  if (error) throw new Error(error.message);
  revalidatePath("/sites", "layout");
  redirect(`/admin/${table}`);
}
