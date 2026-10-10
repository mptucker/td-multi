import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { canAccessBrand, canWrite, cmsUserFromRequest } from "@/app/admin/_auth";

const TABLES = ["tbus_locations", "tbus_network_operators", "tbus_site_config", "tbus_images"] as const;
type TableName = typeof TABLES[number];

function tideAdmin() {
  const url = process.env.TBUS_SUPABASE_URL;
  const key = process.env.TBUS_SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

async function authorized(request: Request, write = false) {
  const user = await cmsUserFromRequest(request);
  if (!user || !canAccessBrand(user, "towboatus-ntx") || (write && !canWrite(user))) return null;
  return user;
}

export async function GET(request: Request) {
  const user = await authorized(request);
  const sb = tideAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!sb) return NextResponse.json({ error: "TIDE is not configured" }, { status: 503 });

  const results = await Promise.all([
    sb.from("tbus_locations").select("*").order("sort_order"),
    sb.from("tbus_network_operators").select("*").order("sort_order"),
    sb.from("tbus_site_config").select("*").order("key"),
    sb.from("tbus_images").select("*").order("category").order("sort_order"),
  ]);
  const failure = results.find((result) => result.error)?.error;
  if (failure) return NextResponse.json({ error: failure.message }, { status: 500 });
  return NextResponse.json({ locations: results[0].data, operators: results[1].data, config: results[2].data, images: results[3].data });
}

export async function PATCH(request: Request) {
  const user = await authorized(request, true);
  const sb = tideAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!sb) return NextResponse.json({ error: "TIDE is not configured" }, { status: 503 });
  const body = await request.json() as { table?: TableName; key?: string; keyName?: string; row?: Record<string, unknown> };
  if (!body.table || !TABLES.includes(body.table) || !body.key || !body.row) return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  const keyName = body.keyName === "key" ? "key" : "id";
  const { data, error } = await sb.from(body.table).update(body.row).eq(keyName, body.key).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const user = await authorized(request, true);
  const sb = tideAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!sb) return NextResponse.json({ error: "TIDE is not configured" }, { status: 503 });

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    const category = String(form.get("category") ?? "");
    const title = String(form.get("title") ?? "").trim();
    const altText = String(form.get("alt") ?? "").trim();
    if (!(file instanceof File) || !category || !title || !altText) return NextResponse.json({ error: "Image, category, title, and alt text are required" }, { status: 400 });
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${category}/${Date.now()}-${safe}`;
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await sb.storage.from("tbus-assets").upload(path, bytes, { contentType: file.type, upsert: false });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
    const publicUrl = sb.storage.from("tbus-assets").getPublicUrl(path).data.publicUrl;
    const { data, error } = await sb.from("tbus_images").insert({ category, title, alt_text: altText, file_name: file.name, storage_path: path, public_url: publicUrl, file_size: file.size, mime_type: file.type, location_id: String(form.get("locationId") ?? "") || null, is_featured: form.get("featured") === "true", active: true }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  const body = await request.json() as { entity?: string; row?: Record<string, unknown> };
  if (body.entity !== "operator" || !body.row) return NextResponse.json({ error: "Invalid create request" }, { status: 400 });
  const { data, error } = await sb.from("tbus_network_operators").insert(body.row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
