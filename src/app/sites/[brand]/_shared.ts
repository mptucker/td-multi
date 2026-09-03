import { notFound } from "next/navigation";
import { isBrandSlug } from "@/config/brands";
import { getBrand, getContent, getFacts } from "@/lib/content";
import type { BrandSlug, PageKey } from "@/config/types";

/** Resolve params → brand + content, 404 if the brand doesn't enable this page. */
export async function loadPage(params: Promise<{ brand: string }>, page: PageKey) {
  const { brand: slug } = await params;
  if (!isBrandSlug(slug)) notFound();
  const brand = getBrand(slug as BrandSlug);
  if (!brand.pages.includes(page)) notFound();
  const [content, facts] = await Promise.all([getContent(brand.slug), getFacts(brand.slug)]);
  return { brand, content, facts };
}
