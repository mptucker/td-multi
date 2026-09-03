/**
 * LEGACY URL REDIRECTS (per brand host).
 * Every indexed URL on the old WordPress sites maps either to a page on the new brand site
 * or to the closest hub page. Keep this list in sync with docs/url-inventory.md.
 * Matching is exact on pathname (trailing slash ignored). `to` may be relative (same host)
 * or absolute (hub). All redirects are 308 (permanent) so link equity transfers.
 */
import type { BrandSlug } from "./types";

const HUB = "https://texomadestinations.com";

export const REDIRECTS: Record<BrandSlug, Record<string, string>> = {
  lighthouse: {
    "/cabins": "/stay#cabins",
    "/camping": "/stay#rv",
    "/boat-rentals": `${HUB}/things-to-do/boat-rentals`,
    "/marina": "/stay#marina",
    "/boat-slips": "/stay#slips",
    "/fuel-dock-general-store": "/stay#fuel-dock",
    "/amenities": "/stay",
    "/experiences": `${HUB}/things-to-do`,
    "/property-map": "/plan-your-visit#map",
    "/contact": "/plan-your-visit#contact",
    "/about-us": "/#story",
    "/lake-texoma-events": "/packages",
    "/event-space": "/groups-and-events",
    "/lighthouse-lodge": "/groups-and-events#lodge",
    "/recreation": "/stay#recreation",
    "/fishing": "/stay#fishing",
    "/professional-guide-service": `${HUB}/things-to-do#/fishing`,
    "/activity/pontoon-boat-rental": `${HUB}/things-to-do/boat-rentals`,
    "/activity/kayak-rental": `${HUB}/things-to-do#/kayaks-sups`,
    "/activity/paddleboard-rental": `${HUB}/things-to-do#/kayaks-sups`,
    "/activity/sunset-cruise": `${HUB}/things-to-do#/charters-cruises`,
    "/activity/dinner-cruise": `${HUB}/things-to-do#/charters-cruises`,
    "/activity/lake-tour": `${HUB}/things-to-do#/charters-cruises`,
    "/activity/lake-day": `${HUB}/things-to-do#/charters-cruises`,
    "/activity/island-view": "https://islandviewtexoma.com/",
    "/reserve": `${HUB}/where-to-stay/cabins#/lighthouse`,
    "/reserve/cart": `${HUB}/reserve/cart`,
    "/reserve/cart/add/pontoon": `${HUB}/reserve/a/boat-rental/at/lighthouse/cart/add/tritoon`,
    "/reserve/cart/add/smallboat": `${HUB}/things-to-do#/kayaks-sups`,
    "/reserve/account/profile": `${HUB}/reserve/account/profile`,
  },
  paradise: {
    "/things-to-do": "/stay#things-to-do",
    "/location": "/plan-your-visit",
    "/property-map": "/plan-your-visit#map",
    "/contact": "/plan-your-visit#contact",
    "/stay/primitive-camping": "/stay#primitive",
    "/search": `${HUB}/where-to-stay/cabins#/paradise`,
    "/reserve": `${HUB}/where-to-stay/cabins#/paradise`,
    "/reserve/cart": `${HUB}/reserve/cart`,
    "/reserve/account/profile": `${HUB}/reserve/account/profile`,
    "/luau": "/packages",
    "/vintage": "/packages",
    "/test-page": "/",
    // 65 unit pages (/stay/kima-1 …) are matched by prefix in middleware → /stay#glamping
  },
  sundance: {
    "/property": "/stay",
    "/property-map": "/plan-your-visit#map",
    "/siesta": "/",
    "/reserve": `${HUB}/where-to-stay/cabins#/sundance`,
    "/reserve/cart": `${HUB}/reserve/cart`,
    "/reserve/account/profile": `${HUB}/reserve/account/profile`,
    // /cabin-1 … /cabin-7 handled by prefix → /stay#cabins
  },
  "island-view": {
    "/property-map": "/plan-your-visit#map",
    "/reserve": `${HUB}/things-to-do#/beach-access`,
    "/reserve/cart": `${HUB}/reserve/cart`,
    "/reserve/cart/add/islandview-day-pass": `${HUB}/reserve/cart/add/islandview-day-pass`,
    "/reserve/account/profile": `${HUB}/reserve/account/profile`,
  },
  fastrac: {
    "/public-cruises": "/stay#public",
    "/private-charters": "/groups-and-events",
    "/experiences": "/stay",
    "/themed-cruises": "/stay#themed",
    "/events": "/packages",
    "/contact": "/plan-your-visit#contact",
    "/water-taxi": "https://texomawatertaxi.com/",
    "/cruises/water-taxi": "https://texomawatertaxi.com/",
    "/search": "/stay",
    "/shop": `${HUB}/things-to-do#/charters-cruises`,
    "/cart": `${HUB}/reserve/cart`,
    "/checkout": `${HUB}/reserve/cart`,
    "/my-account": `${HUB}/reserve/account/profile`,
    "/reserve": `${HUB}/things-to-do#/charters-cruises`,
    "/reserve/cart": `${HUB}/reserve/cart`,
    "/reserve/account/profile": `${HUB}/reserve/account/profile`,
    // /cruises/* individual posts and /product/* handled by prefix → /stay
    // /booking/ is KEPT LIVE on fastrac.com until the hub exposes a water-taxi booking route.
  },
  "tackle-box": {
    "/2015/03/03/hello-world-2": "/",
  },
  boaterwise: {},
  "water-taxi": {
    "/map": "/plan-your-visit#map",
  },
};

/** Prefix redirects: any path starting with `from` goes to `to`. */
export const PREFIX_REDIRECTS: Partial<Record<BrandSlug, { from: string; to: string }[]>> = {
  paradise: [{ from: "/stay/", to: "/stay#glamping" }],
  sundance: [{ from: "/cabin-", to: "/stay#cabins" }],
  fastrac: [
    { from: "/cruises/", to: "/stay" },
    { from: "/product/", to: "/stay" },
  ],
};
