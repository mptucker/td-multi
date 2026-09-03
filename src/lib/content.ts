/**
 * CONTENT LAYER
 * ---------------------------------------------------------------------------
 * Brand page copy   → content/<brand>.json  (versioned in git; the CMS may override later)
 * Events / packages / alerts / facts → Supabase tables when configured, else content/*.json.
 *
 * Everything is fetched on the server with `cache: "force-cache"` semantics via Next's
 * request memoization + ISR (`revalidate` on each page), so a Supabase edit shows up within
 * a minute without a redeploy and without a database round-trip on every request.
 */
import "server-only";
import { BRANDS } from "@/config/brands";
import type {
  AlertItem,
  BrandConfig,
  BrandContent,
  BrandSlug,
  EventItem,
  FactItem,
  PackageItem,
} from "@/config/types";
import { supabaseAnon } from "./supabase";

import lighthouse from "@content/lighthouse.json";
import paradise from "@content/paradise.json";
import sundance from "@content/sundance.json";
import islandView from "@content/island-view.json";
import fastrac from "@content/fastrac.json";
import tackleBox from "@content/tackle-box.json";
import boaterwise from "@content/boaterwise.json";
import waterTaxi from "@content/water-taxi.json";
import eventsJson from "@content/events.json";
import packagesJson from "@content/packages.json";
import alertsJson from "@content/alerts.json";
import factsJson from "@content/facts.json";

const CONTENT: Record<BrandSlug, BrandContent> = {
  lighthouse: lighthouse as unknown as BrandContent,
  paradise: paradise as unknown as BrandContent,
  sundance: sundance as unknown as BrandContent,
  "island-view": islandView as unknown as BrandContent,
  fastrac: fastrac as unknown as BrandContent,
  "tackle-box": tackleBox as unknown as BrandContent,
  boaterwise: boaterwise as unknown as BrandContent,
  "water-taxi": waterTaxi as unknown as BrandContent,
};

export function getBrand(slug: BrandSlug): BrandConfig {
  return BRANDS[slug];
}

export async function getContent(slug: BrandSlug): Promise<BrandContent> {
  const sb = supabaseAnon();
  if (sb) {
    const { data } = await sb.from("brand_content").select("content").eq("brand", slug).maybeSingle();
    if (data?.content) return data.content as BrandContent;
  }
  return CONTENT[slug];
}

const nowIso = () => new Date().toISOString();

function visibleTo<T extends { show_on_sites: BrandSlug[]; published: boolean }>(rows: T[], slug: BrandSlug) {
  return rows.filter((r) => r.published && r.show_on_sites.includes(slug));
}

export async function getEvents(slug: BrandSlug, limit = 6): Promise<EventItem[]> {
  const sb = supabaseAnon();
  let rows: EventItem[];
  if (sb) {
    const { data } = await sb
      .from("events")
      .select("*")
      .eq("published", true)
      .contains("show_on_sites", [slug])
      .gte("starts_at", new Date(Date.now() - 86400000).toISOString())
      .order("starts_at", { ascending: true })
      .limit(limit);
    rows = (data ?? []) as EventItem[];
  } else {
    rows = visibleTo(eventsJson as EventItem[], slug)
      .filter((e) => (e.ends_at ?? e.starts_at) >= new Date(Date.now() - 86400000).toISOString())
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
      .slice(0, limit);
  }
  return rows;
}

export async function getPackages(slug: BrandSlug): Promise<PackageItem[]> {
  const sb = supabaseAnon();
  let rows: PackageItem[];
  if (sb) {
    const { data } = await sb
      .from("packages")
      .select("*")
      .eq("published", true)
      .contains("show_on_sites", [slug])
      .order("sort_order", { ascending: true });
    rows = (data ?? []) as PackageItem[];
  } else {
    rows = visibleTo(packagesJson as PackageItem[], slug).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }
  const t = nowIso();
  return rows.filter((p) => (!p.valid_from || p.valid_from <= t) && (!p.valid_to || p.valid_to >= t));
}

export async function getAlert(slug: BrandSlug): Promise<AlertItem | null> {
  const sb = supabaseAnon();
  let rows: AlertItem[];
  if (sb) {
    const { data } = await sb.from("alerts").select("*").eq("published", true).contains("show_on_sites", [slug]);
    rows = (data ?? []) as AlertItem[];
  } else {
    rows = visibleTo(alertsJson as AlertItem[], slug);
  }
  const t = nowIso();
  return rows.find((a) => (!a.starts_at || a.starts_at <= t) && (!a.ends_at || a.ends_at >= t)) ?? null;
}

export async function getFacts(slug: BrandSlug): Promise<Record<string, FactItem>> {
  const sb = supabaseAnon();
  let rows: FactItem[];
  if (sb) {
    const { data } = await sb.from("facts").select("*").in("brand", [slug, "hub"]);
    rows = (data ?? []) as FactItem[];
  } else {
    rows = (factsJson as FactItem[]).filter((f) => f.brand === slug || f.brand === "hub");
  }
  return Object.fromEntries(rows.map((f) => [f.key, f]));
}
