import { headers } from "next/headers";
import { brandFromHost } from "@/config/brands";
import { bigWaterMarineLlms } from "@/bigwatermarine/routes/llms";

export const dynamic = "force-dynamic";

/** llms.txt per host (https://llmstxt.org). Only bigwatermarine.com publishes one today. */
export async function GET() {
  const brand = brandFromHost((await headers()).get("host"));
  if (brand?.slug === "bigwatermarine") return bigWaterMarineLlms();
  return new Response("Not found", { status: 404 });
}
