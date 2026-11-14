// Content for the four builder pages (/scout/, /veranda/, /highfield/, /berkshire/).
// The words live in content/bigwatermarine.json (brands.*), editable in /admin;
// photos and logos stay here.

import type { StaticImageData } from "next/image";
import { cms } from "./cms";

import scoutHero from "@public/media/scout-xsf-running.webp";
import scoutA from "@public/media/scout-offshore.webp";
import scoutB from "@public/media/scout-sport-dorado.webp";
import scoutC from "@public/media/scout-bay.webp";
import scoutD from "@public/media/scout-dorado.webp";

import verandaHero from "@public/media/veranda-vr265.webp";
import verandaA from "@public/media/veranda-vx27-twin.webp";
import verandaB from "@public/media/veranda-family.webp";
import verandaC from "@public/media/veranda-vone.webp";
import verandaD from "@public/media/veranda-vx27.webp";

import highfieldHero from "@public/media/highfield-family.webp";
import highfieldA from "@public/media/highfield-tender-beach.webp";
import highfieldB from "@public/media/highfield-aerial.webp";
import highfieldC from "@public/media/highfield-sunset.webp";
import highfieldD from "@public/media/highfield-open-water.webp";

import berkshireHero from "@public/media/berkshire-cruise.webp";
import berkshireA from "@public/media/berkshire-sts-night.webp";
import berkshireB from "@public/media/berkshire-le.webp";
import berkshireC from "@public/media/berkshire-margaritaville.webp";
import berkshireD from "@public/media/berkshire-sport.webp";

export type BrandKey = "scout" | "veranda" | "highfield" | "berkshire";
type Faq = { q: string; a: string };

export type BrandContent = {
  key: BrandKey;
  name: "Scout" | "Veranda" | "Highfield" | "Berkshire";
  path: string;
  logo: { src: string; width: number; height: number };
  /** What they build, in plain words. Used in titles and answers. */
  kind: string;
  kindPlural: string;
  metaTitle: string;
  metaDescription: string;
  /** Small line above the headline, e.g. "Heritage. Elegance. Performance. Innovation." */
  eyebrow: string;
  headline: [string, string];
  lede: string;
  hero: StaticImageData;
  heroAlt: string;
  differenceKicker: string;
  differenceTitle: [string, string];
  differenceIntro: string;
  points: { title: string; body: string }[];
  videoTitle: string;
  videoBody: string;
  fleetIntro: string;
  series: { name: string; range?: string; body: string; href: string }[];
  gallery: { src: StaticImageData; alt: string }[];
  site: string;
  youtube?: string;
  youtubeLabel?: string;
  whyIntro: string;
  whyUs: { title: string; body: string }[];
  faqs: Faq[];
};

type Media = { logo: BrandContent["logo"]; hero: StaticImageData; gallery: StaticImageData[] };

const MEDIA: Record<BrandKey, Media> = {
  scout: { logo: { src: "/bigwatermarine/brands/scout-logo.png", width: 1200, height: 434 }, hero: scoutHero, gallery: [scoutA, scoutB, scoutC, scoutD] },
  veranda: { logo: { src: "/bigwatermarine/brands/veranda-logo.png", width: 1133, height: 190 }, hero: verandaHero, gallery: [verandaA, verandaB, verandaC, verandaD] },
  highfield: { logo: { src: "/bigwatermarine/brands/highfield-logo.png", width: 1200, height: 207 }, hero: highfieldHero, gallery: [highfieldA, highfieldB, highfieldC, highfieldD] },
  berkshire: { logo: { src: "/bigwatermarine/brands/berkshire-logo.png", width: 1200, height: 115 }, hero: berkshireHero, gallery: [berkshireA, berkshireB, berkshireC, berkshireD] },
};

type BrandText = Omit<BrandContent, "key" | "logo" | "hero" | "gallery"> & { galleryAlt: string[] };

function build(key: BrandKey): BrandContent {
  const { galleryAlt, ...text } = (cms.brands as unknown as Record<BrandKey, BrandText>)[key];
  const m = MEDIA[key];
  return {
    ...text,
    key,
    logo: m.logo,
    hero: m.hero,
    headline: text.headline as [string, string],
    differenceTitle: text.differenceTitle as [string, string],
    youtube: text.youtube || undefined,
    youtubeLabel: text.youtubeLabel || undefined,
    gallery: m.gallery.map((src, i) => ({ src, alt: galleryAlt[i] ?? "" })),
  };
}

export const BRANDS: Record<BrandKey, BrandContent> = {
  scout: build("scout"),
  veranda: build("veranda"),
  highfield: build("highfield"),
  berkshire: build("berkshire"),
};

export const BRAND_KEYS = Object.keys(BRANDS) as BrandKey[];

/** Customer reviews shown on the brand pages. */
export const BRAND_REVIEWS: { name: string; text: string }[] = cms.brandReviews;

/** Financing and trade-in details shown on the brand and financing pages. */
export const FINANCING: { financing: string[]; trade: string[] } = cms.financing;
