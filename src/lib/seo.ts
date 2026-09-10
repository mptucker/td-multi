import type { Metadata } from "next";
import type { BrandConfig, BrandSlug, PageKey } from "@/config/types";

export const BRAND_UPDATED: Record<BrandSlug, string> = {
  lighthouse: "2026-09-03",
  paradise: "2026-09-03",
  sundance: "2026-09-10",
  "island-view": "2026-09-10",
  fastrac: "2026-09-03",
  "tackle-box": "2026-09-10",
  boaterwise: "2026-09-10",
  "water-taxi": "2026-09-07",
};

export const BRAND_TOPICS: Record<BrandSlug, string[]> = {
  lighthouse: ["Lake Texoma resort", "Lake Texoma cabins", "Lake Texoma boat rentals", "Lake Texoma marina", "Pottsboro RV sites"],
  paradise: ["Lake Texoma glamping", "Lake Texoma cabins", "Lake Texoma RV sites", "primitive camping Lake Texoma", "Pottsboro camping"],
  sundance: ["Lake Texoma tiny cabins", "Lake Texoma group camping", "Lake Texoma retreats", "Pottsboro glamping", "waterfront camping"],
  "island-view": ["Lake Texoma beach", "Lake Texoma day pass", "kayak rentals Lake Texoma", "paddleboard rentals Lake Texoma", "Pottsboro day trip"],
  fastrac: ["Lake Texoma cruises", "Lake Texoma private charters", "Lake Texoma dinner cruise", "Lake Texoma sunset cruise", "Pottsboro boat tours"],
  "tackle-box": ["Lake Texoma bait shop", "Lake Texoma tackle shop", "ethanol-free fuel Pottsboro", "live bait Pottsboro", "Lake Texoma fishing license"],
  boaterwise: ["Lake Texoma boating lessons", "hands-on boat training", "pontoon boat training", "private boating instruction", "NSBC on-water course"],
  "water-taxi": ["Lake Texoma water taxi", "Lake Texoma island transportation", "dock-to-dock boat service", "Highport Marina water taxi", "private boat ride Lake Texoma"],
};

export const PAGE_LABELS: Record<PageKey, string> = {
  home: "Home",
  stay: "Stay & Experience",
  plan: "Plan Your Visit",
  groups: "Groups & Events",
  rules: "Rules & Policies",
  packages: "Packages & Events",
};

export function isPreviewHost(host: string | null | undefined, productionDomains: string[]): boolean {
  const hostname = host?.toLowerCase().split(":")[0] ?? "";
  return !productionDomains.includes(hostname);
}

export function absoluteBrandAsset(domain: string, asset: string): string {
  return asset.startsWith("http") ? asset : `https://${domain}${asset.startsWith("/") ? asset : `/${asset}`}`;
}

export function subpageMetadata(brand: BrandConfig, title: string, description: string, path: string, image: string): Metadata {
  const imageUrl = absoluteBrandAsset(brand.canonicalDomain, image);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [{ url: imageUrl, alt: brand.nap.displayName }], siteName: brand.nap.displayName, locale: "en_US", type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}
