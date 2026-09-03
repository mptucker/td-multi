import Image from "next/image";
import type {
  BrandConfig,
  CTA,
  EventItem,
  FactItem,
  FAQ,
  Feature,
  GalleryImage,
  PackageItem,
  Review,
  RuleGroup,
  Stat,
} from "@/config/types";
import { HubLink } from "./HubLink";
import { hubUrl } from "@/config/hub-links";

/* ------------------------------------------------------------------ Hero */
export function Hero({
  brand,
  image,
  kicker,
  title,
  subtitle,
  ctas,
  compact,
}: {
  brand: BrandConfig;
  image: GalleryImage;
  kicker?: string;
  title: string;
  subtitle?: string;
  ctas?: CTA[];
  compact?: boolean;
}) {
  return (
    <section className={`relative ${compact ? "min-h-[46vh]" : "min-h-[78vh]"} flex items-end text-white`}>
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
      <div className="hero-shade absolute inset-0" />
      <div className="container relative pb-14 pt-32">
        {kicker && <p className="eyebrow !text-white/85">{kicker}</p>}
        <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">{subtitle}</p>}
        {ctas && ctas.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-3">
            {ctas.map((c, i) => (
              <HubLink key={i} brand={brand} cta={c} campaign="hero" onDark />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Stats */
export function StatsBar({ stats, facts }: { stats: Stat[]; facts?: Record<string, FactItem> }) {
  return (
    <section className="bg-primary text-white">
      <div className="container grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {stats.map((s) => {
          const f = s.factKey ? facts?.[s.factKey] : undefined;
          return (
            <div key={s.label} title={f?.last_verified ? `Verified ${f.last_verified}${f.owner ? ` · ${f.owner}` : ""}` : undefined}>
              <div className="display text-3xl font-bold md:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-white/80">{s.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Intro */
export function Intro({ eyebrow, title, body, id }: { eyebrow?: string; title: string; body: string[]; id?: string }) {
  return (
    <section id={id} className="container grid gap-8 py-16 md:grid-cols-12 md:py-20">
      <div className="md:col-span-5">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">{title}</h2>
      </div>
      <div className="prose-brand text-lg leading-relaxed text-muted md:col-span-7">
        {body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Features */
export function FeatureGrid({ brand, features, title, eyebrow, id }: { brand: BrandConfig; features: Feature[]; title?: string; eyebrow?: string; id?: string }) {
  return (
    <section id={id} className="container py-6 md:py-10">
      {(eyebrow || title) && (
        <div className="mb-8 max-w-2xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article key={f.title} className="card overflow-hidden flex flex-col">
            {f.image && (
              <div className="relative aspect-[4/3]">
                <Image src={f.image} alt={f.title} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold">{f.icon && <span className="mr-2" aria-hidden>{f.icon}</span>}{f.title}</h3>
              <p className="mt-2 flex-1 text-muted leading-relaxed">{f.body}</p>
              {f.cta && (
                <div className="mt-5">
                  <HubLink brand={brand} cta={{ ...f.cta, variant: f.cta.variant ?? "ghost" }} campaign="feature" className="!py-2 !px-4 text-sm" />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Gallery */
export function Gallery({ images }: { images: GalleryImage[] }) {
  if (!images.length) return null;
  return (
    <section className="container py-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((im, i) => (
          <div key={im.src} className={`relative overflow-hidden rounded-[var(--radius)] ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"}`}>
            <Image src={im.src} alt={im.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Reviews */
export function Reviews({ reviews, brand }: { reviews: Review[]; brand: BrandConfig }) {
  if (!reviews.length) return null;
  return (
    <section className="bg-surface py-16">
      <div className="container">
        <p className="eyebrow">What guests say</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <blockquote key={i} className="card p-6">
              <p className="text-lg leading-relaxed">“{r.quote}”</p>
              <footer className="mt-4 text-sm font-semibold text-muted">— {r.author}{r.source ? `, ${r.source}` : ""}</footer>
            </blockquote>
          ))}
        </div>
        {brand.nap.googlePlaceId && (
          <a
            href={`https://search.google.com/local/reviews?placeid=${brand.nap.googlePlaceId}`}
            className="mt-6 inline-block text-sm font-semibold underline underline-offset-4"
          >
            Read more reviews on Google →
          </a>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Handoff */
export function HubHandoff({ brand, title, body, ctas }: { brand: BrandConfig; title: string; body: string; ctas: CTA[] }) {
  return (
    <section className="container py-16">
      <div className="card overflow-hidden md:grid md:grid-cols-5">
        <div className="bg-primary p-8 text-white md:col-span-3 md:p-12">
          <p className="eyebrow !text-white/80">Book with confidence</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="mt-4 text-white/85 leading-relaxed">{body}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {ctas.map((c, i) => (
              <HubLink key={i} brand={brand} cta={{ ...c, variant: i === 0 ? "primary" : "ghost" }} campaign="handoff" onDark />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 md:col-span-2 md:p-10">
          <Image src="/brands/texoma-destinations.png" alt="Texoma Destinations" width={400} height={129} className="h-10 w-auto self-start" />
          <ul className="checklist space-y-2 text-sm text-muted">
            <li>Live availability and pricing for every property</li>
            <li>“Pay Now & Save” rates and TAP member discounts</li>
            <li>One account for cabins, RV sites, boats, cruises and day passes</li>
            <li>Text-message check-in and digital concierge</li>
          </ul>
          <a href={hubUrl("tap", brand, { campaign: "handoff-tap" })} className="text-sm font-bold underline underline-offset-4">
            TAP members save on stays, rentals & cruises →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ */
export function FAQList({ faqs }: { faqs: FAQ[] }) {
  if (!faqs.length) return null;
  return (
    <section className="container py-12">
      <h2 className="text-3xl font-bold">Frequently asked</h2>
      <div className="mt-6 divide-y divide-black/10 card">
        {faqs.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="cursor-pointer list-none font-bold flex justify-between gap-4">
              {f.q}
              <span className="text-accent transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-3 text-muted leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Rules */
export function RuleGroups({ groups, facts }: { groups: RuleGroup[]; facts?: Record<string, FactItem> }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {groups.map((g) => {
        const f = g.factKey ? facts?.[g.factKey] : undefined;
        return (
          <section key={g.title} className="card p-6">
            <h3 className="text-xl font-bold">{g.title}</h3>
            <ul className="checklist mt-4 space-y-2 text-muted leading-relaxed">
              {g.items.map((it) => <li key={it}>{it}</li>)}
            </ul>
            {f?.last_verified && <p className="mt-4 text-xs text-muted/70">Last verified {f.last_verified}{f.owner ? ` · ${f.owner}` : ""}</p>}
          </section>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- Events */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Chicago" });

export function EventsList({ events, brand }: { events: EventItem[]; brand: BrandConfig }) {
  return (
    <section id="events" className="container py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">What's up, Texoma?</p>
          <h2 className="mt-2 text-3xl font-bold">Upcoming events & cruises</h2>
        </div>
        <a href={hubUrl("events", brand, { campaign: "events-list" })} className="text-sm font-bold underline underline-offset-4">Plan your own event →</a>
      </div>
      {events.length === 0 ? (
        <p className="card mt-6 p-6 text-muted">New dates are posted about a month ahead. Check back soon or follow us on social.</p>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <article key={e.id} className="card overflow-hidden flex flex-col">
              {e.image && (
                <div className="relative aspect-[16/9]">
                  <Image src={e.image} alt={e.title} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-bold text-accent">{fmtDate(e.starts_at)}{e.ends_at && e.ends_at.slice(0, 10) !== e.starts_at.slice(0, 10) ? ` – ${fmtDate(e.ends_at)}` : ""}</p>
                <h3 className="mt-1 text-xl font-bold">{e.title}</h3>
                <p className="text-sm text-muted">{e.location}</p>
                <p className="mt-3 flex-1 text-muted leading-relaxed">{e.summary}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  {e.price_text && <span className="font-bold">{e.price_text}</span>}
                  {e.cta_url && <a href={e.cta_url} className="btn btn-primary !py-2 !px-4 text-sm">{e.cta_label ?? "Get tickets"}</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------- Packages */
export function PackagesList({ packages, brand }: { packages: PackageItem[]; brand: BrandConfig }) {
  return (
    <section id="packages" className="container py-12">
      <p className="eyebrow">Packages & add-ons</p>
      <h2 className="mt-2 text-3xl font-bold">Make it a whole trip</h2>
      {packages.length === 0 ? (
        <p className="card mt-6 p-6 text-muted">Seasonal packages are announced on texomadestinations.com.</p>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {packages.map((p) => {
            const href = p.cta_url ?? (p.cta_intent ? hubUrl(p.cta_intent, brand, { campaign: `package-${p.slug}` }) : hubUrl("reserve", brand));
            return (
              <article key={p.id} className="card overflow-hidden md:flex">
                {p.image && (
                  <div className="relative aspect-[4/3] md:w-2/5 md:aspect-auto">
                    <Image src={p.image} alt={p.title} fill sizes="(min-width:768px) 20vw, 100vw" className="object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  {p.price_text && <p className="mt-1 font-bold text-accent">{p.price_text}</p>}
                  <p className="mt-2 flex-1 text-muted leading-relaxed">{p.summary}</p>
                  {p.details && p.details.length > 0 && (
                    <ul className="checklist mt-3 space-y-1 text-sm text-muted">
                      {p.details.map((d) => <li key={d}>{d}</li>)}
                    </ul>
                  )}
                  <div className="mt-5">
                    <a href={href} className="btn btn-secondary !py-2 !px-4 text-sm">{p.cta_label ?? "Book this"}</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ----------------------------------------------------------- Contact/Map */
export function ContactMap({ brand, directions }: { brand: BrandConfig; directions: string[] }) {
  const n = brand.nap;
  const q = encodeURIComponent(`${n.displayName}, ${n.streetAddress}, ${n.city}, ${n.region} ${n.postalCode}`);
  return (
    <section id="map" className="container grid gap-8 py-12 md:grid-cols-2">
      <div id="contact" className="card p-8">
        <p className="eyebrow">Getting here</p>
        <h2 className="mt-2 text-3xl font-bold">{n.displayName}</h2>
        <address className="mt-4 not-italic leading-relaxed">
          {n.streetAddress}<br />{n.city}, {n.region} {n.postalCode}
        </address>
        <div className="mt-4 space-y-1 text-sm">
          <p><a href={`tel:${n.phoneE164}`} className="font-bold underline underline-offset-4">{n.phone}</a></p>
          {n.altPhones?.map((p) => <p key={p.phone}>{p.label}: <a href={`tel:${p.phoneE164}`} className="underline underline-offset-4">{p.phone}</a></p>)}
          {n.smsLine && <p>{n.smsLine.label}: <a href={`sms:${n.smsLine.phoneE164}`} className="underline underline-offset-4">{n.smsLine.phone}</a></p>}
          {n.email && <p><a href={`mailto:${n.email}`} className="underline underline-offset-4">{n.email}</a></p>}
        </div>
        {n.hours && <ul className="mt-5 space-y-1 text-sm text-muted">{n.hours.map((h) => <li key={h}>{h}</li>)}</ul>}
        <ul className="checklist mt-6 space-y-2 text-muted">{directions.map((d) => <li key={d}>{d}</li>)}</ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} className="btn btn-secondary !py-2 !px-4 text-sm">Open in Google Maps</a>
          <a href={`https://maps.apple.com/?daddr=${q}`} className="btn btn-ghost !py-2 !px-4 text-sm">Apple Maps</a>
        </div>
      </div>
      <div className="card overflow-hidden min-h-[360px]">
        <iframe
          title={`Map to ${n.displayName}`}
          className="h-full w-full min-h-[360px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${n.geo.lat},${n.geo.lng}&z=13&output=embed`}
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- JSON-LD */
export function LocalBusinessJsonLd({ brand, description, image }: { brand: BrandConfig; description: string; image: string }) {
  const n = brand.nap;
  const data = {
    "@context": "https://schema.org",
    "@type": brand.schemaType,
    name: n.displayName,
    legalName: n.legalName,
    description,
    image,
    url: `https://${brand.canonicalDomain}/`,
    telephone: n.phoneE164,
    email: n.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: n.streetAddress,
      addressLocality: n.city,
      addressRegion: n.region,
      postalCode: n.postalCode,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: n.geo.lat, longitude: n.geo.lng },
    hasMap: n.googleMapsUrl,
    sameAs: [n.facebook, n.instagram, `https://texomadestinations.com${brand.hubPropertySlug ? `/properties/${brand.hubPropertySlug}` : ""}`].filter(Boolean),
    parentOrganization: { "@type": "Organization", name: "Texoma Destinations, LLC", url: "https://texomadestinations.com" },
    potentialAction: { "@type": "ReserveAction", target: hubUrl(brand.primaryIntent, brand, { campaign: "schema" }) },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function PageTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="container pt-14 pb-4">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-2 text-4xl font-bold md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-lg text-muted">{subtitle}</p>}
    </div>
  );
}
