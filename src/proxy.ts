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
 * /admin, /studio and /api are never rewritten.
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // next.config sets skipTrailingSlashRedirect so bigwatermarine.com can keep
  // its WordPress-style trailing slashes. Every other path keeps the default
  // behaviour of dropping a trailing slash.
  const bwmTree = path.startsWith("/sites/bigwatermarine");
  if (!bwmTree && path.length > 1 && path.endsWith("/") && !isBigWaterMarineRequest(req)) {
    return NextResponse.redirect(withPath(req, path.replace(/\/+$/, "")), 308);
  }

  if (path.startsWith("/sites/")) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Texoma Explorer: a static app in public/explorer, shared by every brand host and embedded via iframe.
  if (path === "/explorer") {
    url.pathname = "/explorer/index.html";
    return NextResponse.rewrite(url);
  }
  if (path.startsWith("/explorer/")) return NextResponse.next();

  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/admin") ||
    path.startsWith("/studio") ||
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

  // bigwatermarine.com URLs all end in a slash, as they did on WordPress.
  if (slug === "bigwatermarine" && !path.endsWith("/")) {
    return NextResponse.redirect(withPath(req, `${path}/`), 308);
  }

  // 3. rewrite into the brand's route tree
  url.pathname = `/sites/${slug}${path === "/" ? "" : path}`;
  url.searchParams.delete("brand");
  const res = NextResponse.rewrite(url);
  res.headers.set("x-brand", slug);
  // bigwatermarine.com's pages are static, so previews are kept out of search here.
  if (slug === "bigwatermarine" && hostBrand?.slug !== "bigwatermarine") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  if (qsBrand && qsBrand !== cookieBrand) {
    res.cookies.set("brand", slug, { path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  return res;
}

/** Same URL with a new path. A plain URL, because NextURL re-applies Next's own trailing-slash rule. */
function withPath(req: NextRequest, pathname: string): URL {
  const dest = new URL(req.url);
  dest.pathname = pathname;
  return dest;
}

/** True when this request will be served as bigwatermarine.com (host, ?brand or cookie). */
function isBigWaterMarineRequest(req: NextRequest): boolean {
  const qs = req.nextUrl.searchParams.get("brand");
  if (qs) return qs === "bigwatermarine";
  const host = brandFromHost(req.headers.get("host"));
  if (host) return host.slug === "bigwatermarine";
  return req.cookies.get("brand")?.value === "bigwatermarine";
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// Referenced so tree-shaking keeps BRANDS available. This said "to edge
// runtime if needed" until the rename: proxy runs on nodejs and cannot be
// configured onto edge, so there is no edge here to keep it for.
void BRANDS;
