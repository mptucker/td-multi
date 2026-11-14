import { apiDiagnostics } from "@/bigwatermarine/lib/boats/api";
import { getInventory, getInventorySource } from "@/bigwatermarine/lib/boats";

// Health check for the Boats Group feed: whether the site is reading live data
// and how many listings each status returned. Counts only; no listing data,
// contact details or API key.
export const dynamic = "force-dynamic";

export async function GET() {
  const [source, boats, api] = await Promise.all([getInventorySource(), getInventory(), apiDiagnostics()]);
  return Response.json(
    { source, boatsShown: boats.length, checkedAt: new Date().toISOString(), api },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
