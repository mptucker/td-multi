import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPage } from "../_shared";
import { subpageMetadata } from "@/lib/seo";
import { LIGHTHOUSE_JOURNEYS } from "@/components/lighthouse/data";
import { LighthouseJourneyPage } from "@/components/lighthouse/LighthouseJourneyPage";
import { TexomaCollectivePage } from "@/components/texomaco/TexomaCollectiveSite";
import { getEvents } from "@/lib/content";

const TEXOMACO_PAGES = new Set(["about", "services", "partners", "groups-events", "events", "explore", "contact", "faq", "privacy", "terms"]);

export const revalidate = 60;
type Params = { params: Promise<{ brand: string; journey: string }> };

async function resolve(params: Params["params"]) {
  const route = await params;
  if (route.brand === "texomaco") {
    if (!TEXOMACO_PAGES.has(route.journey)) notFound();
    const loaded = await loadPage(params, route.journey as any);
    return { ...loaded, texomaPage: route.journey } as const;
  }
  if (route.brand !== "lighthouse") notFound();
  const journey = LIGHTHOUSE_JOURNEYS.find((item) => item.path === `/${route.journey}`);
  if (!journey || journey.key === "rules") notFound();
  return { ...await loadPage(params, journey.key), journey };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolved = await resolve(params);
  if ("texomaPage" in resolved) {
    const data = (resolved.content as any).pages?.[resolved.texomaPage];
    return subpageMetadata(resolved.brand, data?.title ?? resolved.texomaPage, data?.intro ?? resolved.content.seo.description, `/${resolved.texomaPage}`, resolved.content.seo.ogImage);
  }
  const { brand, journey } = resolved;
  return subpageMetadata(brand, `${journey.label} at Lighthouse Resort`, journey.description, journey.path, journey.image);
}

export default async function JourneyPage({ params }: Params) {
  const resolved = await resolve(params);
  if ("texomaPage" in resolved) return <TexomaCollectivePage page={resolved.texomaPage} content={resolved.content as any} events={await getEvents("texomaco", 24)} />;
  const { brand, content, journey } = resolved;
  return <LighthouseJourneyPage brand={brand} content={content} journey={journey} />;
}
