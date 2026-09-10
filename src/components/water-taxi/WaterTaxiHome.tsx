import Image from "next/image";
import type { BrandConfig, BrandContent } from "@/config/types";
import { HubLink } from "@/components/HubLink";
import { FAQJsonLd } from "@/components/Sections";

const destinations = [
  "Highport Marina", "North Island", "Treasure Island", "Wood Island",
  "Pelican’s Landing", "Marina Del Rey", "Flowing Wells", "Grandpappy Point",
  "Lighthouse Marina", "Island View", "Buncombe Creek", "Alberta Creek", "Catfish Bay", "Burns Run",
];

const extras = [
  { number: "01", title: "Find your boat", body: "Drop-off or pickup at your boat, slip, ramp or private dock inside our service area." },
  { number: "02", title: "Camp overnight", body: "Ride out with your gear, sleep on an island and schedule the captain to bring you back." },
  { number: "03", title: "Restock the cooler", body: "Beverages, ice and essentials delivered from shore when the island day runs long." },
  { number: "04", title: "Make it your boat", body: "Sightseeing is $180 an hour for up to six. Larger celebrations can become a private Fastrac charter." },
];

export function WaterTaxiHome({ brand, content }: { brand: BrandConfig; content: BrandContent }) {
  const faqs = content.plan?.faqs ?? [];
  return <>
    <FAQJsonLd faqs={faqs} />
    <section className="wt-hero">
      <div className="wt-hero-copy">
        <p className="wt-kicker"><span /> Lake Texoma’s on-demand ride</p>
        <h1>The easiest way<br />to get <em>around</em><br />on the lake.</h1>
        <p>Marina to island. Dock to dinner. Boat to shore. Tell the captain where you are and where you want to go.</p>
        <div className="wt-actions">
          <a className="btn btn-primary" href={`sms:${brand.nap.phoneE164}`}>Text the captain <span>→</span></a>
          <HubLink brand={brand} cta={{ label: "Book ahead", intent: "water-taxi-book", variant: "ghost" }} campaign="water-taxi-hero" />
        </div>
      </div>
      <div className="wt-hero-photo">
        <Image src="/water-taxi/jolt.webp" alt="The Jolt Texoma Water Taxi tied up at the dock" fill priority sizes="(min-width: 800px) 55vw, 100vw" className="object-cover" />
        <div className="wt-fare-card"><span>Island shuttle</span><strong>$25</strong><p>per person · each way<br />Highport ↔ islands</p></div>
      </div>
      <p className="wt-scroll">Scroll to catch a ride ↓</p>
    </section>

    <section className="wt-booking-strip" aria-label="Three ways to book">
      <p><span>01</span><a href={`sms:${brand.nap.phoneE164}`}>Text <strong>{brand.nap.phone}</strong></a></p>
      <p><span>02</span><a href={`tel:${brand.nap.phoneE164}`}>Call <strong>{brand.nap.phone}</strong></a></p>
      <p><span>03</span><HubLink brand={brand} cta={{ label: "Book online", intent: "water-taxi-book" }} campaign="water-taxi-strip" /></p>
    </section>

    <section className="wt-route" id="how-it-works">
      <div className="wt-route-intro">
        <p className="wt-kicker"><span /> On-demand water taxi</p>
        <h2>Your ride,<br />in three stops.</h2>
      </div>
      <ol>
        <li><span>1</span><div><small>Send the pin</small><h3>Tell us where you are.</h3><p>A marina, private dock, island, restaurant or boat on the hook—inside the service area.</p></div></li>
        <li><span>2</span><div><small>Pick the destination</small><h3>Tell us where you’re headed.</h3><p>For right now, text or call. For a set pickup time or holiday weekend, book ahead.</p></div></li>
        <li><span>3</span><div><small>Watch for the Jolt</small><h3>Step aboard.</h3><p>Most on-demand waits are 15–30 minutes. Timing depends on where the boat and captain are.</p></div></li>
      </ol>
    </section>

    <section className="wt-destinations">
      <div className="wt-destination-photo"><Image src="/water-taxi/party.webp" alt="Friends arriving by water taxi for a Lake Texoma island day" fill sizes="(min-width: 900px) 46vw, 100vw" className="object-cover" /><p>Party Island is better when nobody has to drive.</p></div>
      <div className="wt-destination-list">
        <p className="wt-kicker"><span /> Where can we take you?</p>
        <h2>Pretty much<br />anywhere.</h2>
        <div>{destinations.map((place, i) => <span key={place}>{String(i + 1).padStart(2, "0")} · {place}</span>)}</div>
      </div>
    </section>

    <section className="wt-private">
      <div className="wt-private-title"><p>Need the whole boat?</p><h2>$150<small>/ hour</small></h2><span>Private dock-to-dock service for up to six—from the time we leave our dock until we return.</span></div>
      <div className="wt-private-photo"><Image src="/water-taxi/family.webp" alt="A family enjoying a private Texoma Water Taxi ride" fill sizes="(min-width: 800px) 48vw, 100vw" className="object-cover" /></div>
    </section>

    <section className="wt-extras container">
      <header><p className="wt-kicker"><span /> Also in our wheelhouse</p><h2>Not just<br />point A to B.</h2></header>
      <div>{extras.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
    </section>

    <section className="wt-map">
      <div className="wt-map-copy"><p className="wt-kicker"><span /> Service area</p><h2>The busy side<br />of Texoma.</h2><p>We run sunrise to sunset across the marinas, islands and docks around the Preston Peninsula. Night trips may be arranged with a surcharge.</p><a href={brand.nap.googleMapsUrl}>Open the service-area map →</a></div>
      <div className="wt-map-image"><Image src="/water-taxi/service-area.webp" alt="Texoma Water Taxi service area map" fill sizes="(min-width: 800px) 55vw, 100vw" className="object-contain" /></div>
    </section>

    <section className="wt-party">
      <Image src="/water-taxi/crew.webp" alt="A group celebrating aboard Texoma Water Taxi" fill sizes="100vw" className="object-cover" />
      <div className="wt-party-shade" />
      <div><p>Birthdays · bachelor parties · wedding shuttles</p><h2>Bring the crew.<br />Leave the car.</h2><HubLink brand={brand} cta={{ label: "See private charters", intent: "cruises", variant: "primary" }} campaign="water-taxi-parties" /></div>
    </section>

    <section className="wt-faq container">
      <header><p className="wt-kicker"><span /> Before you text</p><h2>Good to know.</h2></header>
      <div>{faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span>+</span></summary><p>{faq.a}</p></details>)}</div>
    </section>

    <section className="wt-final">
      <p>Ready when you are.</p><h2>Where to?</h2><a href={`sms:${brand.nap.phoneE164}`}>Text {brand.nap.phone} →</a>
    </section>
  </>;
}
