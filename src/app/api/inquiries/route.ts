import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

const attempts = new Map<string, { count: number; resetAt: number }>();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  if (limited(request)) return NextResponse.json({ error: "Please wait a few minutes before trying again." }, { status: 429 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "The inquiry could not be read." }, { status: 400 });
  if (String(body.website || "").trim()) return NextResponse.json({ ok: true });

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
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  const supabase = supabaseService();
  if (!supabase) return NextResponse.json({ error: "Inquiry intake is not configured on this preview." }, { status: 503 });
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
    return NextResponse.json({ error: `We could not save your inquiry. Please call ${brand === "lighthouse" ? "903.361.5070" : "903.200.1408"}.` }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
