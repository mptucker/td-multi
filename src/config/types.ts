/**
 * Shared types for the multi-brand gateway sites.
 *
 * A "brand" = one front door (domain) — Lighthouse, Paradise, Sundance, Island View,
 * Fastrac, Tackle Box, BoaterWise, Texoma Water Taxi.
 * The hub (texomadestinations.com) owns inventory, pricing, policies, events, packages
 * and booking. Brand sites describe, differentiate, and hand off — they never re-implement
 * booking or duplicate the hub's inventory database.
 */

export type BrandSlug =
  | "lighthouse"
  | "paradise"
  | "sundance"
  | "island-view"
  | "fastrac"
  | "tackle-box"
  | "boaterwise"
  | "water-taxi";

/** Pages a brand may enable. Order here = nav order. */
export type PageKey = "home" | "stay" | "plan" | "groups" | "rules" | "packages";

/** Hub CTA intents. Each resolves to an exact texomadestinations.com URL in hub-links.ts. */
export type HubIntent =
  | "reserve" // generic reservation app entry
  | "cabins" // cabins filtered to this property
  | "rv" // RV sites filtered to this property
  | "tents" // primitive/tent camping (paradise, sundance)
  | "boats" // tritoon / boat rentals at Lighthouse
  | "boats-cart-tritoon" // add-to-cart tritoon at Lighthouse
  | "kayaks" // kayak / SUP rentals
  | "cruises" // charters & cruises section
  | "fishing" // guide list
  | "beach" // Island View day pass section
  | "day-pass-cart" // add Island View day pass to cart
  | "picnics" // picnic packages
  | "events" // plan-an-event sales page
  | "tap" // TAP membership page
  | "tap-cart" // add TAP pass to cart
  | "marina" // Lighthouse marina page (slips, fuel dock)
  | "property" // this brand's hub property page
  | "map" // properties map, marker preselected
  | "companies" // directory
  | "legal-privacy"
  | "legal-terms"
  | "my-reservations"
  | "water-taxi-book" // fastrac.com booking form (chbs)
  | "boaterwise-book" // Square classes
  | "boaterwise-private"; // Square appointments

export interface BrandTheme {
  /** CSS color tokens (hex). */
  primary: string;
  primaryDark: string;
  accent: string;
  accent2?: string;
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  /** Google Fonts family names. */
  fontDisplay: string;
  fontBody: string;
  /** Google Fonts CSS2 URL (loaded via <link>). */
  fontHref: string;
  /** Corner radius scale: "sharp" | "soft" | "round" */
  radius: "sharp" | "soft" | "round";
  /** Header treatment */
  header: "light" | "dark" | "transparent";
}

export interface NAP {
  legalName: string;
  displayName: string;
  shortName: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string; // display format 903.361.5070
  phoneE164: string; // +19033615070
  altPhones?: { label: string; phone: string; phoneE164: string }[];
  email?: string;
  smsLine?: { label: string; phone: string; phoneE164: string };
  geo: { lat: number; lng: number };
  googleMapsUrl: string;
  googlePlaceId?: string;
  facebook?: string;
  instagram?: string;
  hours?: string[];
}

export interface BrandConfig {
  slug: BrandSlug;
  domains: string[]; // production + preview hosts that map to this brand
  canonicalDomain: string;
  tagline: string;
  /** The "The Most ___" hub descriptor — hub campaign system. */
  mostTag: string;
  theme: BrandTheme;
  logo: { src: string; width: number; height: number; onDark?: string };
  nap: NAP;
  pages: PageKey[];
  /** Slug used by the hub reservation app / property pages (lighthouse, paradise, sundance, islandview, fastrac, tacklebox). */
  hubPropertySlug?: "lighthouse" | "paradise" | "sundance" | "island-view" | "fastrac" | "the-tackle-box";
  hubLocationSlug?: "lighthouse" | "paradise" | "sundance" | "islandview" | "fastrac" | "tacklebox";
  /** Primary CTA intent for the hero button. */
  primaryIntent: HubIntent;
  primaryLabel: string;
  secondaryIntent?: HubIntent;
  secondaryLabel?: string;
  /** schema.org type for LocalBusiness JSON-LD. */
  schemaType: string;
  /** GTM container — one container for all brands is recommended; override per brand only if required. */
  gtmId?: string;
}

/* ---------- Content (what the CMS / JSON provides) ---------- */

export interface CTA {
  label: string;
  intent?: HubIntent;
  href?: string; // internal or external override
  variant?: "primary" | "secondary" | "ghost";
}

export interface Stat {
  value: string;
  label: string;
  /** Facts registry key so "last verified" + owner can be surfaced/tracked. */
  factKey?: string;
}

export interface Feature {
  title: string;
  body: string;
  icon?: string; // emoji or icon key
  image?: string;
  cta?: CTA;
}

export interface Review {
  quote: string;
  author: string;
  source?: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface RuleGroup {
  title: string;
  items: string[];
  factKey?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  w?: number;
  h?: number;
}

export interface HomeContent {
  heroImage: GalleryImage;
  heroKicker?: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: { title: string; body: string[] };
  stats: Stat[];
  features: Feature[];
  gallery: GalleryImage[];
  reviews: Review[];
  hubHandoff: { title: string; body: string; ctas: CTA[] };
}

export interface StayContent {
  title: string;
  subtitle: string;
  sections: {
    title: string;
    body: string[];
    bullets?: string[];
    image?: GalleryImage;
    cta?: CTA;
    factKey?: string;
  }[];
  note?: string;
}

export interface PlanContent {
  title: string;
  subtitle: string;
  arrival: { title: string; body: string[] };
  directions: string[];
  essentials: RuleGroup[];
  faqs: FAQ[];
  nearby?: { name: string; note: string }[];
}

export interface GroupsContent {
  title: string;
  subtitle: string;
  intro: string[];
  venues: { name: string; capacity: string; details: string[]; image?: GalleryImage }[];
  eventTypes: string[];
  cta: CTA;
  contactPhone?: string;
}

export interface RulesContent {
  title: string;
  subtitle: string;
  groups: RuleGroup[];
  policyNote: string;
}

export interface PackagesContent {
  title: string;
  subtitle: string;
  intro: string;
}

export interface BrandContent {
  slug: BrandSlug;
  seo: { title: string; description: string; ogImage: string };
  alertBar?: { text: string; cta?: CTA; expires?: string } | null;
  home: HomeContent;
  stay?: StayContent;
  plan?: PlanContent;
  groups?: GroupsContent;
  rules?: RulesContent;
  packages?: PackagesContent;
  footerBlurb: string;
}

/* ---------- Centrally managed items (Supabase tables) ---------- */

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  starts_at: string; // ISO
  ends_at?: string | null;
  location: string;
  summary: string;
  image?: string | null;
  price_text?: string | null;
  cta_label?: string | null;
  cta_url?: string | null; // exact hub / fastrac URL
  show_on_sites: BrandSlug[]; // "choose which sites this displays on"
  published: boolean;
}

export interface PackageItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  details?: string[] | null;
  price_text?: string | null;
  image?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  cta_intent?: HubIntent | null;
  valid_from?: string | null;
  valid_to?: string | null;
  show_on_sites: BrandSlug[];
  published: boolean;
  sort_order?: number | null;
}

export interface AlertItem {
  id: string;
  text: string;
  cta_label?: string | null;
  cta_url?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  show_on_sites: BrandSlug[];
  published: boolean;
}

/** Facts registry — every operational number has an owner and a last-verified date. */
export interface FactItem {
  key: string; // e.g. lighthouse.cabin_count
  brand: BrandSlug | "hub";
  label: string;
  value: string;
  owner?: string | null;
  last_verified?: string | null; // ISO date
  source_url?: string | null;
  notes?: string | null;
}
