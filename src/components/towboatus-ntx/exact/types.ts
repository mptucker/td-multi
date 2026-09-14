// Database types for TowBoatUS NTX

export interface Location {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  state: string | null;
  county: string | null;
  phone: string;
  website_url: string | null;
  surface_acres: string | null;
  shoreline_miles: string | null;
  description: string | null;
  badge_label: string | null;
  hero_image_path: string | null;
  sort_order: number | null;
  active: boolean;
  created_at: string;
}

export interface NetworkOperator {
  id: string;
  name: string;
  region: "big-water-cowboys" | "north-texas" | "oklahoma";
  phone: string | null;
  website_url: string | null;
  facebook_url: string | null;
  is_ours: boolean;
  sort_order: number | null;
  active: boolean;
}

export interface SiteConfig {
  key: string;
  value: string;
  updated_at: string;
}

// Config keys type for type-safe access
export type SiteConfigKey =
  | "dispatch_url"
  | "national_dispatch_phone"
  | "national_vhf"
  | "boatus_join_url"
  | "boatus_towing_url";

// Grouped network operators by region
export interface GroupedOperators {
  "big-water-cowboys": NetworkOperator[];
  "north-texas": NetworkOperator[];
  oklahoma: NetworkOperator[];
}

// Static service data type
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string; // SVG path data or component name
}

// Membership plan comparison data
export interface MembershipFeature {
  feature: string;
  basic: boolean;
  freshwater: boolean;
  saltwater: boolean;
}
