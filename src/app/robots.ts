import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { brandFromHost } from "@/config/brands";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");
  const brand = brandFromHost(host);
  // Preview hosts (vercel.app, localhost) are never indexed.
  if (!brand) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/sites/"] }],
    sitemap: `https://${brand.canonicalDomain}/sitemap.xml`,
    host: `https://${brand.canonicalDomain}`,
  };
}
