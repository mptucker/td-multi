import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { cmsUserFromRequest } from "@/app/admin/_auth";
import { BRAND_SLUGS } from "@/config/brands";

export async function POST(request: Request) {
  const user = await cmsUserFromRequest(request);
  if (!user || user.role === "viewer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { brand } = await request.json() as { brand?: string };
  if (brand && !BRAND_SLUGS.includes(brand as never)) return NextResponse.json({ error: "Invalid brand" }, { status: 400 });
  if (brand && user.role !== "admin" && user.role !== "director" && !user.sites.includes(brand as never)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (brand) revalidatePath("/sites/" + brand, "layout");
  else revalidatePath("/sites", "layout");
  return NextResponse.json({ ok: true });
}
