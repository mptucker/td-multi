// Service and winterization prices. The values live in content/bigwatermarine.json
// (service.*), editable in /admin; change a number there and every page and its
// structured data update.

import { cms, fill, n } from "./cms";

const svc = cms.service;

export const LABOR = { onsite: n(svc.labor.onsite, 165), mobile: n(svc.labor.mobile, 215) };
export const MOBILE_TRAVEL = { minimum: n(svc.mobileTravel.minimum, 75), perMile: n(svc.mobileTravel.perMile, 2.5) };

export type Package = {
  key: string;
  name: string;
  tagline: string;
  onsite: number;
  mobile: number | null; // null = onsite only
  hours: string;
  includes: string[];
  builds?: string;
  best?: boolean;
};

/** Inboard and sterndrive (I/O) winterization, single-engine, labor only. */
export const WINTER_PACKAGES: Package[] = svc.winterPackages.map((p) => ({
  key: p.key,
  name: p.name,
  tagline: p.tagline,
  onsite: n(p.onsite),
  mobile: p.mobile ? n(p.mobile) : null,
  hours: p.hours,
  includes: p.includes,
  builds: p.builds || undefined,
  best: Boolean(p.best),
}));

export type MenuItem = { name: string; hours: string; onsite: string; mobile?: string; note: string };

const menu = (items: { name: string; hours: string; onsite: string; mobile?: string; note: string }[]): MenuItem[] =>
  items.map((m) => ({ ...m, onsite: fill(m.onsite), mobile: m.mobile ? fill(m.mobile) : undefined, note: fill(m.note) }));

/** Outboard winterization / seasonal service. */
export const OUTBOARD_MENU: MenuItem[] = menu(svc.outboardMenu);
export const ADD_ONS: MenuItem[] = menu(svc.addOns);

export const WINTER_NOTES: string[] = svc.winterNotes.map((t) => fill(t));
export const INSPECTION_POINTS: string[] = svc.inspectionPoints;

/** Customer reviews from the Service page. */
export const REVIEWS: { name: string; text: string }[] = svc.reviews;

/** Why Big Water Marine for service. */
export const SERVICE_WHY: { title: string; body: string }[] = svc.why;

/** Additional services offered with service work. */
export const SERVICE_ADDONS: string[] = svc.serviceAddons;

/** Additional services offered with winterization. */
export const WINTER_DETAILING: string[] = svc.winterDetailing;

/** Shop policies from the service and winterization forms. */
export const SHOP_POLICIES: string[] = svc.shopPolicies;
