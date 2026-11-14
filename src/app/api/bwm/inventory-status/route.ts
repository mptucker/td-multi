import { apiDiagnostics } from "@/bigwatermarine/lib/boats/api";
import { getInventory, getInventorySource } from "@/bigwatermarine/lib/boats";

// Health check for the Boats Group feed. Shows whether the site is reading live
// data, how many boats each status returned, and the shape of one record.
// The API key is never included.
export const dynamic = "force-dynamic";

export async function GET() {
  const [source, boats, api] = await Promise.all([getInventorySource(), getInventory(), apiDiagnostics()]);
  return Response.json(
    { source, boatsShown: boats.length, checkedAt: new Date().toISOString(), api },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
