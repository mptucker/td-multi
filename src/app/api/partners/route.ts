import { NextResponse } from "next/server";
import { supabaseAnonFresh } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const sb = supabaseAnonFresh();
  if (!sb) return NextResponse.json({ organizations: [], locations: [], authoritative: false });
  const [organizations, locations, settings] = await Promise.all([
    sb.from("partner_organizations").select("id,slug,name,description,logo_url,website_url,partnership_tier,sort_order").order("sort_order"),
    sb.from("partner_locations").select("id,organization_id,slug,name,description,address,area,latitude,longitude,categories,image_url,booking_url,contact_url,map_brand_key,map_place_id,is_featured,map_x,map_y,sort_order").order("is_featured", { ascending: false }).order("sort_order"),
    sb.from("partner_map_settings").select("id,map_url,show_roads,show_geographic_labels,theme").eq("id", "texomaco").maybeSingle(),
  ]);
  if (organizations.error || locations.error) {
    const missing = /does not exist|schema cache/i.test(`${organizations.error?.message || ""} ${locations.error?.message || ""}`);
    return NextResponse.json({ organizations: [], locations: [], authoritative: false, setupRequired: missing }, { status: missing ? 200 : 500 });
  }
  return NextResponse.json({ organizations: organizations.data || [], locations: locations.data || [], settings: settings.data || null, authoritative: true }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
