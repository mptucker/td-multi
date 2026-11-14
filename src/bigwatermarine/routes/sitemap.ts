import type { MetadataRoute } from "next";
import { getInventory, boatPath } from "@/bigwatermarine/lib/boats";
import { abs } from "@/bigwatermarine/lib/seo";


// Every page, then every boat in stock.
const BUILT = [
  { path: "/", priority: 1, changeFrequency: "daily" as const },
  { path: "/inventory/", priority: 0.95, changeFrequency: "hourly" as const },
  { path: "/service/", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/winterize/", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/boatclub/", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/scout/", priority: 0.85, changeFrequency: "daily" as const },
  { path: "/veranda/", priority: 0.85, changeFrequency: "daily" as const },
  { path: "/highfield/", priority: 0.85, changeFrequency: "daily" as const },
  { path: "/berkshire/", priority: 0.85, changeFrequency: "daily" as const },
  { path: "/financing/", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/keepboating/", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/storage/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/about/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/fleet-sales/", priority: 0.75, changeFrequency: "daily" as const },
  { path: "/contact/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/faq/", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/brands/", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/lake-texoma-boat-buying-guide/", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/new-vs-used-boat-cost/", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/big-water-boat-club-vs-freedom-boat-club/", priority: 0.7, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const boats = await getInventory();
  return [
    ...BUILT.map((p) => ({ url: abs(p.path), lastModified: now, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...boats.map((b) => ({
      url: abs(boatPath(b)),
      lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
      changeFrequency: "daily" as const,
      priority: 0.8,
      images: b.images.slice(0, 5),
    })),
  ];
}
