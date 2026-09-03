import { NextRequest, NextResponse } from "next/server";
import { BRANDS, brandFromHost, isBrandSlug } from "@/config/brands";
import { REDIRECTS, PREFIX_REDIRECTS } from "@/config/redirects";
import type { BrandSlug } from "@/config/types";

/**
 * Host → brand routing.
 *   paradisetexoma.com/stay  →  /sites/paradise/stay   (internal rewrite)
 * Preview / local:
 *   ?brand=paradise            →  sets a cookie, then routes
 *   paradise.localhost:3000    →  matched by brandFromHost()
 *   /sites/paradise/...       →  always allowed (Vercel preview URLs, QA)
 * /admin and /api are never rewritten.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/admin") ||
    path.startsWith("/brands/") ||
    path.startsWith("/sites/") ||
    /\.(png|jpg|jpeg|svg|ico|webp|txt|xml|json|webmanifest)$/.test(path)
  ) {
    return NextResponse.next();
  }

  // 1. resolve brand
  const qsBrand = url.searchParams.get("brand");
  const cookieBrand = req.cookies.get("brand")?.value;
  const hostBrand = brandFromHost(req.headers.get("host"));
  const envBrand = process.env.NEXT_PUBLIC_DEFAULT_BRAND;

  let slug: BrandSlug | null = null;
  if (qsBrand && isBrandSlug(qsBrand)) slug = qsBrand;
  else if (hostBrand) slug = hostBrand.slug;
  else if (cookieBrand && isBrandSlug(cookieBrand)) slug = cookieBrand;
  else if (envBrand && isBrandSlug(envBrand)) slug = envBrand;

  if (!slug) {
    // Unknown host and no hint → show the brand directory.
    url.pathname = `/sites/directory`;
    return NextResponse.rewrite(url);
  }

  // 2. legacy redirects (only when serving a real brand host)
  const clean = path.replace(/\/+$/, "") || "/";
  const exact = REDIRECTS[slug]?.[clean];
  const prefix = PREFIX_REDIRECTS[slug]?.find((p) => clean.startsWith(p.from));
  const target = exact ?? prefix?.to;
  if (target && clean !== "/") {
    const dest = target.startsWith("http") ? new URL(target) : new URL(target, url.origin);
    if (!target.startsWith("http")) dest.search = url.search;
    return NextResponse.redirect(dest, 308);
  }

  // 3. rewrite into the brand's route tree
  url.pathname = `/sites/${slug}${path === "/" ? "" : path}`;
  url.searchParams.delete("brand");
  const res = NextResponse.rewrite(url);
  res.headers.set("x-brand", slug);
  if (qsBrand && qsBrand !== cookieBrand) {
    res.cookies.set("brand", slug, { path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// Referenced so tree-shaking keeps BRANDS available to edge runtime if needed.
void BRANDS;
