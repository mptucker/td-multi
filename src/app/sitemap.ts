import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { brandFromHost, PAGE_PATHS } from "@/config/brands";
import { BRAND_UPDATED } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Per-host sitemap: paradisetexoma.com/sitemap.xml lists only Paradise pages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host");
  const brand = brandFromHost(host);
  if (!brand) return [];
  const base = `https://${brand.canonicalDomain}`;
  return brand.pages.map((p) => ({
    url: `${base}${PAGE_PATHS[p]}`,
    lastModified: new Date(`${BRAND_UPDATED[brand.slug]}T12:00:00Z`),
    changeFrequency: p === "home" || p === "packages" ? "weekly" : "monthly",
    priority: p === "home" ? 1 : p === "stay" ? 0.9 : 0.7,
  }));
}
