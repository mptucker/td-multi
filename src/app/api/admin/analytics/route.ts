import { NextResponse } from "next/server";
import { cmsUserFromRequest, canAccessBrand } from "@/app/admin/_auth";
import { isBrandSlug } from "@/config/brands";
import { ga4SetupStatus, getAnalyticsReport } from "@/lib/ga4";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await cmsUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const url = new URL(request.url);
  const brand = url.searchParams.get("brand") ?? "";
  const requestedDays = Number(url.searchParams.get("days") ?? 30);
  const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;
  if (!isBrandSlug(brand) || !canAccessBrand(user, brand)) return NextResponse.json({ error: "Brand access is not available" }, { status: 403 });

  const setup = ga4SetupStatus(brand);
  if (!setup.configured) return NextResponse.json({ error: "Analytics setup is incomplete", code: "GA4_NOT_CONFIGURED", missing: setup.missing }, { status: 503 });
  try {
    const report = await getAnalyticsReport(brand, days);
    return NextResponse.json(report, { headers: { "cache-control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analytics could not be loaded";
    const status = /permission|forbidden|access/i.test(message) ? 403 : 502;
    return NextResponse.json({ error: message, code: "GA4_REQUEST_FAILED" }, { status });
  }
}
