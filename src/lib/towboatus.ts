import "server-only";

import { createClient } from "@supabase/supabase-js";
import {
  coverageMapImages as fallbackCoverageMapImages,
  fleetImages as fallbackFleetImages,
  heroImages as fallbackHeroImages,
  heroImagesMobile as fallbackHeroImagesMobile,
  locations as fallbackLocations,
  operators as fallbackOperators,
  type ImageRecord,
} from "@/components/towboatus-ntx/exact/data";
import type {
  GroupedOperators,
  Location,
  NetworkOperator,
  SiteConfigKey,
} from "@/components/towboatus-ntx/exact/types";

const DEFAULT_CONFIG: Record<SiteConfigKey, string> = {
  dispatch_url: "https://tide.towboatuslaketexoma.com/request",
  national_dispatch_phone: "800-391-4869",
  national_vhf: "16",
  boatus_join_url: "https://www.boatus.com/towing/membership?sourcecode=WT13014A",
  boatus_towing_url: "https://www.boatus.com/towing/membership?sourcecode=WT13014A",
};

export type TowBoatUSData = {
  locations: Location[];
  operators: GroupedOperators;
  config: Record<SiteConfigKey, string>;
  heroImages: ImageRecord[];
  heroImagesMobile: ImageRecord[];
  coverageMapImages: ImageRecord[];
  fleetImages: ImageRecord[];
};

function groupOperators(rows: NetworkOperator[]): GroupedOperators {
  const grouped: GroupedOperators = {
    "big-water-cowboys": [],
    "north-texas": [],
    oklahoma: [],
  };
  for (const operator of rows) grouped[operator.region]?.push(operator);
  return grouped;
}

function fallbackData(): TowBoatUSData {
  return {
    locations: fallbackLocations,
    operators: fallbackOperators,
    config: DEFAULT_CONFIG,
    heroImages: fallbackHeroImages,
    heroImagesMobile: fallbackHeroImagesMobile,
    coverageMapImages: fallbackCoverageMapImages,
    fleetImages: fallbackFleetImages,
  };
}

/**
 * Load the live TowBoatUS content from the shared TIDE Supabase project.
 * Each collection falls back independently so a missing table, row, or image
 * never takes the emergency site offline.
 */
export async function getTowBoatUSData(): Promise<TowBoatUSData> {
  const url = process.env.TBUS_SUPABASE_URL;
  const key = process.env.TBUS_SUPABASE_ANON_KEY;
  const sb = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  if (!sb) return fallbackData();

  const [locationsResult, operatorsResult, configResult, imagesResult] = await Promise.all([
    sb.from("tbus_locations").select("*").eq("active", true).order("sort_order", { ascending: true }),
    sb.from("tbus_network_operators").select("*").eq("active", true).order("sort_order", { ascending: true }),
    sb.from("tbus_site_config").select("key,value"),
    sb.from("tbus_images").select("*").eq("active", true).order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
  ]);

  const locations = (locationsResult.data ?? []) as Location[];
  const operatorRows = (operatorsResult.data ?? []) as NetworkOperator[];
  const config = { ...DEFAULT_CONFIG };
  for (const row of configResult.data ?? []) {
    if (row.key in config && row.value) config[row.key as SiteConfigKey] = row.value;
  }

  const images = (imagesResult.data ?? []) as ImageRecord[];
  const featured = (category: string, fallback: ImageRecord[]) => {
    const categoryImages = images.filter((image) => image.category === category);
    if (!categoryImages.length) return fallback;
    const featuredImages = categoryImages.filter((image) => image.is_featured);
    return featuredImages.length ? featuredImages : categoryImages.slice(0, 1);
  };

  return {
    locations: locations.length ? locations : fallbackLocations,
    operators: operatorRows.length ? groupOperators(operatorRows) : fallbackOperators,
    config,
    heroImages: featured("hero", fallbackHeroImages),
    heroImagesMobile: featured("hero-mobile", fallbackHeroImagesMobile),
    coverageMapImages: featured("coverage-map", fallbackCoverageMapImages),
    fleetImages: featured("team", fallbackFleetImages),
  };
}
