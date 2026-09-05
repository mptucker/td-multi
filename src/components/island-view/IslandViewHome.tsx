import Image from "next/image";
import type { BrandConfig, BrandContent, EventItem, FactItem, PackageItem } from "@/config/types";
import { HubLink } from "@/components/HubLink";
import { EventsList, Gallery, HubHandoff, PackagesList, Reviews } from "@/components/Sections";

export function IslandViewHome({
  brand,
  content,
  facts,
  events,
  packages,
}: {
  brand: BrandConfig;
  content: BrandContent;
  facts: Record<string, FactItem>;
  events: EventItem[];
  packages: PackageItem[];
}) {
  const h = content.home;
  const dayPass = facts["islandview.day_pass"]?.value ?? h.stats[0]?.value;

  return (
    <>
      <section className="iv-hero">
        <div className="iv-hero-photo">
          <Image src={h.heroImage.src} alt={h.heroImage.alt} fill priority sizes="(min-width: 960px) 62vw, 100vw" className="object-cover" />
          <div className="iv-hero-photo-shade" />
          <div className="iv-hero-copy">
            <p className="iv-kicker">{h.heroKicker}</p>
            <h1>{h.heroTitle}</h1>
            <p>{h.heroSubtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <HubLink brand={brand} cta={{ label: "Buy a day pass", intent: "day-pass-cart", variant: "primary" }} campaign="iv-hero" onDark />
              <a href="#make-a-day-of-it" className="btn iv-hero-ghost">See what’s here ↓</a>
            </div>
          </div>
        </div>

        <aside className="iv-day-card" aria-label="Plan your Island View beach day">
          <p className="eyebrow">Beach-day essentials</p>
          <h2>Pack the cooler.<br />We’ve got the lake.</h2>
          <dl>
            {h.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <HubLink brand={brand} cta={{ label: `Get your ${dayPass ?? "$7"} pass`, intent: "day-pass-cart", variant: "secondary" }} campaign="iv-plan-card" />
          <p className="iv-card-note">Buy online, show your phone at the gate, and head for the sand.</p>
        </aside>
      </section>

      <section className="iv-intro" id="story">
        <div className="container grid gap-8 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <p className="eyebrow">90 minutes from Dallas</p>
            <h2>{h.intro.title}</h2>
          </div>
          <div className="prose-brand text-lg leading-relaxed md:col-span-7">
            {h.intro.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      <section id="make-a-day-of-it" className="iv-experiences container py-14 md:py-20">
        <div className="iv-section-heading">
          <div>
            <p className="eyebrow">Pick your kind of fun</p>
            <h2>Make a day of it.</h2>
          </div>
          <p>Swim and sun, claim a shady shelter, or get out on the water. Everything can be ready before you arrive.</p>
        </div>
        <div className="iv-experience-grid">
          {h.features.map((feature, i) => (
            <article key={feature.title} className={`iv-experience-card iv-experience-${i + 1}`}>
              {feature.image && <Image src={feature.image} alt="" fill sizes="(min-width: 960px) 40vw, 100vw" className="object-cover" />}
              <div className="iv-experience-shade" />
              <div className="iv-experience-copy">
                <span aria-hidden>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
                {feature.cta && <HubLink brand={brand} cta={{ ...feature.cta, variant: "ghost" }} campaign={`iv-feature-${i + 1}`} onDark />}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="iv-gallery-wrap">
        <div className="container pt-16 text-center">
          <p className="eyebrow">Your view for the day</p>
          <h2 className="mt-2 text-3xl font-bold md:text-5xl">This is what out of office looks like.</h2>
        </div>
        <Gallery images={h.gallery} />
      </section>

      {events.length > 0 && <EventsList events={events} brand={brand} />}
      {packages.length > 0 && <PackagesList packages={packages.slice(0, 2)} brand={brand} />}
      <Reviews reviews={h.reviews} brand={brand} />
      <HubHandoff brand={brand} {...h.hubHandoff} />
    </>
  );
}
