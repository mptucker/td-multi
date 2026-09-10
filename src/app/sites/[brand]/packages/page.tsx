import type { Metadata } from "next";
import { loadPage } from "../_shared";
import { getEvents, getPackages } from "@/lib/content";
import { BreadcrumbJsonLd, EventsList, HubHandoff, PackagesList, PageTitle } from "@/components/Sections";
import { subpageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { brand, content } = await loadPage(params, "packages");
  return subpageMetadata(brand, content.packages!.title, content.packages!.subtitle, "/packages", content.seo.ogImage);
}

export default async function PackagesPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand, content } = await loadPage(params, "packages");
  const pk = content.packages!;
  const [events, packages] = await Promise.all([getEvents(brand.slug, 12), getPackages(brand.slug)]);
  return (
    <>
      <BreadcrumbJsonLd brand={brand} page="packages" path="/packages" />
      <PageTitle eyebrow="Packages & events" title={pk.title} subtitle={pk.subtitle} />
      <p className="container max-w-3xl text-lg text-muted leading-relaxed">{pk.intro}</p>
      <EventsList events={events} brand={brand} />
      <PackagesList packages={packages} brand={brand} />
      <HubHandoff brand={brand} {...content.home.hubHandoff} />
    </>
  );
}
