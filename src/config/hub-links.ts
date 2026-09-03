/**
 * HUB DEEP-LINK CONTRACT
 * ---------------------------------------------------------------------------
 * The single place brand sites learn how to hand a customer to texomadestinations.com.
 * Every CTA on every brand site resolves through `hubUrl()` so that:
 *   1. the destination is the exact property/detail page, never the hub homepage;
 *   2. UTM source/medium/campaign travel with the click so the originating brand is
 *      attributed inside the booking funnel (GA4 cross-domain + UTM belt-and-braces);
 *   3. when the hub developer changes a URL, it changes here once for all six+ sites.
 *
 * URL patterns below were verified against the live hub on 2026-09-03 (see docs/hub-deep-link-spec.md).
 * Location scoping today is done with hash routes (#/paradise) handled client-side by the
 * td-reservations Angular widget. The spec asks the hub developer to ALSO honour a canonical
 * query-string form (?property=paradise) so links survive if the widget changes.
 */
import type { BrandConfig, HubIntent } from "./types";

export const HUB_ORIGIN =
  process.env.NEXT_PUBLIC_HUB_ORIGIN?.replace(/\/$/, "") || "https://texomadestinations.com";

const FASTRAC_ORIGIN = "https://fastrac.com";
const SQUARE_BOATERWISE_CLASSES =
  "https://book.squareup.com/classes/1eh14qy4eggg4k/location/LQRQ7C1M2DRSR/classes";
const SQUARE_BOATERWISE_PRIVATE =
  "https://book.squareup.com/appointments/1eh14qy4eggg4k/location/LQRQ7C1M2DRSR/services";

type Resolver = (b: BrandConfig) => string;

/** Path (relative to HUB_ORIGIN) or absolute URL per intent. */
const HUB_PATHS: Record<HubIntent, Resolver> = {
  reserve: () => `/reserve`,
  cabins: (b) => `/where-to-stay/cabins#/${b.hubLocationSlug ?? ""}`,
  rv: (b) => `/where-to-stay/rv-sites#/${b.hubLocationSlug ?? ""}`,
  tents: (b) => `/where-to-stay/tents#/${b.hubLocationSlug ?? ""}`,
  boats: () => `/things-to-do/boat-rentals`,
  "boats-cart-tritoon": () => `/reserve/a/boat-rental/at/lighthouse/cart/add/tritoon`,
  kayaks: () => `/things-to-do#/kayaks-sups`,
  cruises: () => `/things-to-do#/charters-cruises`,
  fishing: () => `/things-to-do#/fishing`,
  beach: () => `/things-to-do#/beach-access`,
  "day-pass-cart": () => `/reserve/cart/add/islandview-day-pass`,
  picnics: () => `/things-to-do#/picnics`,
  events: () => `/events`,
  tap: () => `/tap`,
  "tap-cart": () => `/reserve/cart/add/tap-pass`,
  marina: () => `/lighthouse-marina`,
  property: (b) => (b.hubPropertySlug ? `/properties/${b.hubPropertySlug}` : `/`),
  map: (b) => `/properties-map?m=${b.hubLocationSlug ?? ""}`,
  companies: () => `/companies`,
  "legal-privacy": () => `/legal#tab-1687356549-1-58`,
  "legal-terms": () => `/legal#tab-1687356549-2-22`,
  "my-reservations": () => `/reserve/account/reservations`,
  "water-taxi-book": () => `${FASTRAC_ORIGIN}/booking/`,
  "boaterwise-book": () => SQUARE_BOATERWISE_CLASSES,
  "boaterwise-private": () => SQUARE_BOATERWISE_PRIVATE,
};

export interface UtmOptions {
  campaign?: string; // e.g. "hero", "stay-page", "footer"
  content?: string;
}

/**
 * Build the outbound URL for an intent, stamped with UTMs.
 * Hash fragments are preserved (query goes before #).
 */
export function hubUrl(intent: HubIntent, brand: BrandConfig, utm: UtmOptions = {}): string {
  const raw = HUB_PATHS[intent](brand);
  const abs = raw.startsWith("http") ? raw : `${HUB_ORIGIN}${raw}`;
  const [beforeHash, hash] = abs.split("#");
  const url = new URL(beforeHash);
  url.searchParams.set("utm_source", brand.canonicalDomain);
  url.searchParams.set("utm_medium", "brand-site");
  url.searchParams.set("utm_campaign", utm.campaign ?? intent);
  if (utm.content) url.searchParams.set("utm_content", utm.content);
  // Canonical property hint for the hub (see spec) — harmless if ignored today.
  if (brand.hubLocationSlug && !url.searchParams.has("property")) {
    url.searchParams.set("property", brand.hubLocationSlug);
  }
  return hash ? `${url.toString()}#${hash}` : url.toString();
}

/** Human-readable table used by docs and the admin UI. */
export function describeHubLinks(brand: BrandConfig): { intent: HubIntent; url: string }[] {
  return (Object.keys(HUB_PATHS) as HubIntent[]).map((intent) => ({
    intent,
    url: hubUrl(intent, brand),
  }));
}
