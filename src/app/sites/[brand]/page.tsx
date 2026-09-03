import { loadPage } from "./_shared";
import { getEvents, getPackages } from "@/lib/content";
import { FeatureGrid, Gallery, Hero, HubHandoff, Intro, Reviews, StatsBar, EventsList, PackagesList } from "@/components/Sections";

export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand, content, facts } = await loadPage(params, "home");
  const h = content.home;
  const [events, packages] = await Promise.all([getEvents(brand.slug, 3), getPackages(brand.slug)]);
  const showPackages = brand.pages.includes("packages");

  return (
    <>
      <Hero
        brand={brand}
        image={h.heroImage}
        kicker={h.heroKicker ?? brand.mostTag}
        title={h.heroTitle}
        subtitle={h.heroSubtitle}
        ctas={[
          { label: brand.primaryLabel, intent: brand.primaryIntent, variant: "primary" },
          ...(brand.secondaryIntent ? [{ label: brand.secondaryLabel ?? "Learn more", intent: brand.secondaryIntent, variant: "ghost" as const }] : []),
        ]}
      />
      <StatsBar stats={h.stats} facts={facts} />
      <Intro id="story" title={h.intro.title} body={h.intro.body} eyebrow={brand.tagline} />
      <FeatureGrid brand={brand} features={h.features} />
      <Gallery images={h.gallery} />
      {showPackages && (events.length > 0 || packages.length > 0) && (
        <>
          {events.length > 0 && <EventsList events={events} brand={brand} />}
          {packages.length > 0 && <PackagesList packages={packages.slice(0, 2)} brand={brand} />}
        </>
      )}
      <Reviews reviews={h.reviews} brand={brand} />
      <HubHandoff brand={brand} {...h.hubHandoff} />
    </>
  );
}
