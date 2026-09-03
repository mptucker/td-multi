import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Supabase Database Webhook → POST /api/revalidate?secret=...
 * Purges every brand's ISR cache so CMS edits are live immediately (otherwise ≤60s).
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/sites", "layout");
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
