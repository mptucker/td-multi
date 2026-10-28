import Link from "next/link";
import type { BrandConfig, BrandContent } from "@/config/types";
import { BreadcrumbJsonLd } from "@/components/Sections";
import { LighthouseMotion } from "./LighthouseInteractions";
import { LighthouseNext, LighthousePhoto } from "./LighthouseShared";
import { lighthouseImage } from "./data";
import { LighthouseInquiryForm } from "./LighthouseInquiryForm";

type Props = { brand: BrandConfig; content: BrandContent };

const AMENITIES = [
  ["50 seated", "Designed to seat 50, with room for up to 70 comfortably depending on layout."],
  ["Furnished", "Tables, chairs, and red, black, or white tablecloths are included."],
  ["Kitchen", "Four-burner stove and oven, two refrigerators, and ample counter space."],
  ["Open vendor", "Choose the caterer and event vendors that fit your gathering."],
  ["BYOB", "Bring the beverages that belong at your celebration."],
  ["All-season", "Air conditioning and heating keep the indoor space comfortable."],
  ["Accessible", "Wheelchair accessible, with two restrooms on site."],
  ["Covered deck", "Room for games, live music, dancing, or a ceremony above the water."],
] as const;

export function LighthouseLodgePage({ brand, content }: Props) {
  const eventsPhone = content.groups?.contactPhone || brand.nap.phone;
  const eventsPhoneHref = `+1${eventsPhone.replace(/\D/g, "")}`;
  const hero = lighthouseImage(content, "lodgeHero", { src: "/lighthouse/events/lodge-hero.webp", alt: "A group gathering on the covered deck at the Lighthouse Lodge" });
  const exterior = lighthouseImage(content, "lodgeExterior", { src: "/lighthouse/events/lodge-exterior.webp", alt: "The red-roofed Lighthouse Lodge among oak trees" });
  const interior = lighthouseImage(content, "lodgeInterior", { src: "/lighthouse/events/lodge-interior.webp", alt: "The wood-lined Lodge interior arranged with tables and chairs" });
  const deck = lighthouseImage(content, "lodgeDeck", { src: "/lighthouse/events/lodge-deck-view.webp", alt: "The covered Lodge deck overlooking Lake Texoma" });
  const gathering = lighthouseImage(content, "lodgeGathering", { src: "/lighthouse/events/lodge-deck-gathering.webp", alt: "Guests enjoying a company gathering on the Lodge deck" });
  const covePoint = content.groups?.venues.find((venue) => venue.name === "Cove Point")?.image;
  const schema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "The Lodge at Lighthouse Resort & Marina",
    url: `https://${brand.canonicalDomain}/lodge`,
    image: [hero.src, exterior.src, interior.src].map((src) => src.startsWith("http") ? src : `https://${brand.canonicalDomain}${src}`),
    description: "A flexible Lake Texoma event venue for company parties, family gatherings, celebrations, baby showers, and weddings.",
    maximumAttendeeCapacity: 70,
    address: { "@type": "PostalAddress", streetAddress: brand.nap.streetAddress, addressLocality: brand.nap.city, addressRegion: brand.nap.region, postalCode: brand.nap.postalCode, addressCountry: "US" },
    telephone: brand.nap.phoneE164,
  };

  return <div className="lh-site lh-lodge-page">
    <LighthouseMotion />
    <BreadcrumbJsonLd brand={brand} page="lodge" path="/lodge" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="lh-lodge-hero">
      <LighthousePhoto src={hero.src} alt={hero.alt} priority />
      <div className="lh-lodge-hero-shade" />
      <div className="lh-lodge-hero-copy">
        <Link className="lh-breadcrumb" href="/">Lighthouse <span aria-hidden>/</span> The Lodge</Link>
        <p className="lh-eyebrow">The Lodge at Lighthouse</p>
        <h1>Bring everyone<br />to the lake.</h1>
        <p>Company celebrations, family gatherings, and a lakefront “I do.” Make room for your people at the Lodge at Lighthouse Resort & Marina.</p>
        <div className="lh-actions"><a className="lh-button lh-button-red" href="#lodge-inquiry">Ask about your date <span aria-hidden>↗</span></a><a className="lh-button lh-button-white" href="#explore-the-space">Explore the space <span aria-hidden>↓</span></a></div>
      </div>
      <div className="lh-lodge-hero-note"><strong>50</strong><span>designed to seat</span><strong>70</strong><span>comfortable maximum</span></div>
    </section>

    <section className="lh-lodge-intro lh-container lh-reveal">
      <div><p className="lh-eyebrow">A place for your kind of gathering</p><h2>Big moments.<br /><em>Easy company.</em></h2></div>
      <div><p>Company parties. Reunions. Birthdays and anniversaries. Baby showers. Weddings. The Lodge gives your people a relaxed place to celebrate, reconnect, and look out over Lake Texoma together.</p><p>Bring the plan you already have—or start with a date and let our events team help you explore the possibilities.</p></div>
    </section>

    <section id="explore-the-space" className="lh-lodge-space">
      <div className="lh-lodge-space-copy lh-reveal"><p className="lh-eyebrow">Inside, outside, together</p><h2>One gathering.<br /><em>Two ways to enjoy it.</em></h2><p>Set the tables indoors, then open the day onto the covered deck. The lake stays in view while guests move between a climate-controlled room and space for conversation, music, games, dancing, or a ceremony.</p><Link className="lh-text-link" href="#lodge-inquiry">Talk through your setup <span aria-hidden>↗</span></Link></div>
      <figure className="lh-lodge-interior lh-reveal"><LighthousePhoto src={interior.src} alt={interior.alt} /><figcaption>Inside · tables, chairs, linens, kitchen and bar area</figcaption></figure>
      <figure className="lh-lodge-deck lh-reveal"><LighthousePhoto src={deck.src} alt={deck.alt} /><figcaption>Outside · covered deck, water views and lake access</figcaption></figure>
    </section>

    <section className="lh-lodge-amenities lh-container">
      <header className="lh-reveal"><div><p className="lh-eyebrow">The essentials are already here</p><h2>More room for<br /><em>the good part.</em></h2></div><p>Choose your vendors, bring your beverages, and shape the space around the reason everyone came.</p></header>
      <div className="lh-lodge-amenity-grid">{AMENITIES.map(([title, body], index) => <article className="lh-reveal" key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>

    <section className="lh-lodge-cove">
      <div className="lh-lodge-cove-photo">{covePoint ? <LighthousePhoto src={covePoint.src} alt={covePoint.alt} /> : <LighthousePhoto src={exterior.src} alt={exterior.alt} />}</div>
      <div className="lh-lodge-cove-copy lh-reveal"><p className="lh-eyebrow">Add a ceremony at Cove Point</p><h2>A little closer<br /><em>to the water.</em></h2><p>Directly in front of the Lodge, Cove Point can be added to your rental. Its gazebo and lakeside setting create a natural place for a ceremony before everyone gathers inside or on the deck.</p><a className="lh-button lh-button-red" href="#lodge-inquiry">Ask about the Lodge + Cove Point <span aria-hidden>↗</span></a></div>
    </section>

    <section className="lh-lodge-moment lh-container lh-reveal"><LighthousePhoto src={gathering.src} alt={gathering.alt} /><blockquote><span aria-hidden>“</span><p>The best events leave room for the moment nobody planned.</p><small>The Lodge · Lake Texoma</small></blockquote></section>

    <section id="lodge-inquiry" className="lh-lodge-inquiry">
      <div className="lh-lodge-inquiry-intro"><p className="lh-eyebrow">Your date. Your people. Your plan.</p><h2>Let’s make room<br /><em>for all of it.</em></h2><p>Tell us what you are celebrating and what the day needs to feel like. The events team will follow up about the Lodge, Cove Point, and availability.</p><a className="lh-text-link" href={`tel:${eventsPhoneHref}`}>Prefer to call? {eventsPhone} <span aria-hidden>↗</span></a></div>
      <LighthouseInquiryForm variant="lodge" />
    </section>

    <div className="lh-container lh-next-pair"><LighthouseNext href="/groups-and-events" label="Make a weekend of it" title="Groups & getaways" /><LighthouseNext href="/cabins" label="Keep everyone close" title="Cabins at Lighthouse" /></div>
  </div>;
}
