import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPage } from "../_shared";
import { subpageMetadata } from "@/lib/seo";
import { LIGHTHOUSE_JOURNEYS } from "@/components/lighthouse/data";
import { LighthouseJourneyPage } from "@/components/lighthouse/LighthouseJourneyPage";

export const revalidate = 60;
type Params = { params: Promise<{ brand: string; journey: string }> };

async function resolve(params: Params["params"]) {
  const route = await params;
  if (route.brand !== "lighthouse") notFound();
  const journey = LIGHTHOUSE_JOURNEYS.find((item) => item.path === `/${route.journey}`);
  if (!journey || journey.key === "rules") notFound();
  return { ...await loadPage(params, journey.key), journey };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { brand, journey } = await resolve(params);
  return subpageMetadata(brand, `${journey.label} at Lighthouse Resort`, journey.description, journey.path, journey.image);
}

export default async function JourneyPage({ params }: Params) {
  const { brand, content, journey } = await resolve(params);
  return <LighthouseJourneyPage brand={brand} content={content} journey={journey} />;
}
