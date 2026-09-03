import type { Metadata } from "next";
import { loadPage } from "../_shared";
import { getEvents, getPackages } from "@/lib/content";
import { EventsList, HubHandoff, PackagesList, PageTitle } from "@/components/Sections";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const { content } = await loadPage(params, "packages");
  return { title: content.packages!.title, description: content.packages!.subtitle, alternates: { canonical: "/packages" } };
}

export default async function PackagesPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand, content } = await loadPage(params, "packages");
  const pk = content.packages!;
  const [events, packages] = await Promise.all([getEvents(brand.slug, 12), getPackages(brand.slug)]);
  return (
    <>
      <PageTitle eyebrow="Packages & events" title={pk.title} subtitle={pk.subtitle} />
      <p className="container max-w-3xl text-lg text-muted leading-relaxed">{pk.intro}</p>
      <EventsList events={events} brand={brand} />
      <PackagesList packages={packages} brand={brand} />
      <HubHandoff brand={brand} {...content.home.hubHandoff} />
    </>
  );
}
