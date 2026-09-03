import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { brandFromHost, BRANDS, PAGE_PATHS } from "@/config/brands";

export const dynamic = "force-dynamic";

/** Per-host sitemap: paradisetexoma.com/sitemap.xml lists only Paradise pages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host");
  const brand = brandFromHost(host) ?? BRANDS[(process.env.NEXT_PUBLIC_DEFAULT_BRAND as keyof typeof BRANDS) ?? "paradise"];
  const base = `https://${brand.canonicalDomain}`;
  const now = new Date();
  return brand.pages.map((p) => ({
    url: `${base}${PAGE_PATHS[p]}`,
    lastModified: now,
    changeFrequency: p === "home" || p === "packages" ? "weekly" : "monthly",
    priority: p === "home" ? 1 : p === "stay" ? 0.9 : 0.7,
  }));
}
