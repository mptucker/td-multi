import { NextRequest, NextResponse } from "next/server";
import { BRANDS } from "@/config/brands";
import { supabaseService } from "@/lib/supabase";

const attempts = new Map<string, { count: number; resetAt: number }>();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedOrigins = new Set([
  ...Object.values(BRANDS).flatMap((brand) => brand.domains.map((domain) => `https://${domain}`)),
  "https://td-brand-sites.vercel.app",
]);

function responseHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  return origin && allowedOrigins.has(origin)
    ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" }
    : {};
}

function json(request: Request, body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: responseHeaders(request) });
}

export function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins.has(origin)) return new NextResponse(null, { status: 403 });
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...responseHeaders(request),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function limited(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 10 * 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: NextRequest) {
  if (limited(request)) return json(request, { error: "Please wait a few minutes before trying again." }, 429);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return json(request, { error: "The inquiry could not be read." }, 400);
  if (String(body.website || "").trim()) return json(request, { ok: true });

  const clean = (key: string, max: number) => String(body[key] || "").trim().slice(0, max);
  const inquiryType = clean("inquiryType", 30);
  const name = clean("name", 100);
  const organization = clean("organization", 140);
  const email = clean("email", 160).toLowerCase();
  const phone = clean("phone", 30);
  const town = clean("town", 100);
  const region = clean("region", 2);
  const message = clean("message", 3000);
  const brand = clean("brand", 40);
  const allowedInquiry = (brand === "texomaco" && ["partner", "group_event", "general"].includes(inquiryType)) || (brand === "lighthouse" && inquiryType === "group_event");
  if (!allowedInquiry || name.length < 2 || !emailPattern.test(email) || message.length < 12 || body.consent !== "yes" || (region && !["TX", "OK"].includes(region))) {
    return json(request, { error: "Please complete the required fields." }, 400);
  }

  const supabase = supabaseService();
  if (!supabase) return json(request, { error: "Inquiry intake is not configured on this preview." }, 503);
  const { error } = await supabase.from("inquiries").insert({
    brand,
    inquiry_type: inquiryType,
    name,
    organization: organization || null,
    email,
    phone: phone || null,
    town: town || null,
    region: region || null,
    message,
    consent: true,
    source_path: clean("sourcePath", 300) || null,
  });
  if (error) {
    console.error("Inquiry insert failed", error);
    return json(request, { error: "We could not save your inquiry. Please try again in a few minutes or use the Text us widget." }, 500);
  }
  return json(request, { ok: true }, 201);
}
