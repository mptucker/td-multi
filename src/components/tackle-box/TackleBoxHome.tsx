import Image from "next/image";
import type { BrandConfig, BrandContent } from "@/config/types";
import { HubLink } from "@/components/HubLink";

const departments = [
  { title: "Hook, line & sinker", note: "A huge selection of rods, reels, terminal tackle, striper lures, soft plastics, nets and filet knives—plus local advice on what to throw.", image: "/tackle-box/tackle.webp", alt: "Fishing tackle stocked at Tackle Box Outfitters" },
  { title: "Fuel & boat parts", note: "Unleaded and ethanol-free fuel at the pump, marine oils and fluids, life jackets, and the boat and trailer parts that can save the weekend.", image: "/tackle-box/supplies.webp", alt: "Boat and trailer supplies at Tackle Box Outfitters" },
  { title: "Lake-day goods", note: "Souvenirs, shirts, water shoes, inflatables, tubes and water toys—along with snacks, cold drinks and coffee that is always hot.", image: "/tackle-box/interior.webp", alt: "Lake-day goods inside Tackle Box Outfitters" },
];

const inventoryGroups = [
  { type: "wear", items: ["Souvenirs", "T-shirts", "Water shoes"] },
  { type: "refresh", items: ["Ice", "Snacks", "Cold drinks", "Hot coffee"] },
  { type: "marine", items: ["Marine oil", "Boat parts", "Trailer parts"] },
  { type: "water", items: ["Water toys", "Inflatables", "Towable tubes", "Life jackets"] },
  { type: "camp", items: ["Firewood", "Propane", "Camping supplies"] },
];

export function TackleBoxHome({ brand, content }: { brand: BrandConfig; content: BrandContent }) {
  const plan = content.plan!;

  return (
    <>
      <section className="tb-hero">
        <div className="tb-hero-planks" aria-hidden />
        <div className="tb-hero-grid">
          <div className="tb-hero-copy">
            <p className="tb-signline">83924 N State Hwy 289 · Pottsboro, Texas</p>
            <p className="tb-hero-kicker">Lake Texoma&apos;s fishing &amp; outdoor headquarters</p>
            <h1>We&apos;ve got you<br /><em>hook, line</em><br />&amp; sinker.</h1>
            <p>Fuel at the pump. The best selection of tackle on the lake. Hot coffee and everything between the highway and the water.</p>
            <div className="flex flex-wrap gap-3">
              <a className="btn btn-primary" href={brand.nap.googleMapsUrl}>Get directions <span aria-hidden>→</span></a>
              <a className="tb-call" href={`tel:${brand.nap.phoneE164}`}>Call {brand.nap.phone}</a>
            </div>
          </div>
          <div className="tb-hero-photo"><Image src="/tackle-box/hero.webp" alt="A father and son choosing fishing tackle inside Tackle Box Outfitters" fill priority sizes="(min-width: 800px) 54vw, 100vw" className="object-cover" /><span className="tb-photo-label">Local knowledge included.</span></div>
        </div>
        <div className="tb-pump-strip"><div><strong>Fuel at the pump</strong><i aria-hidden>+</i><strong>Live bait</strong><i aria-hidden>+</i><strong>Lake supplies</strong><i aria-hidden>+</i><strong>Snacks</strong></div></div>
      </section>

      <section className="tb-story" id="local-knowledge">
        <div className="container tb-story-grid">
          <div className="tb-stamp" aria-hidden><span>Pottsboro</span><strong>Lake<br />Texoma</strong><span>Outfitter</span></div>
          <div className="tb-story-copy">
            <p className="eyebrow">A proper lake outfitter</p>
            <h2>Stocked with what works.<br />Staffed by people who know why.</h2>
            <p>Every good lake town has a shop like this—the place where the shelves are packed, the advice is practical, and somebody usually knows what&apos;s biting. Tackle Box Outfitters sits on Highway 289 on the way to Lighthouse Resort, Island View and the Preston Peninsula.</p>
            <p>Come for live bait, a Texoma license, fuel at the pump or an RV propane fill. Stay for the wall of mounts, a visit with Bob Jr., and the sort of local knowledge that does not come printed on the package.</p>
          </div>
          <div className="tb-story-photo"><Image src="/tackle-box/storefront.webp" alt="A parent helping a young angler prepare a lure beside Lake Texoma" fill sizes="(min-width: 900px) 38vw, 100vw" className="object-cover" /><span>Pass it down.</span></div>
        </div>
      </section>

      <section id="counter" className="tb-counter container">
        <div className="tb-section-head"><p className="eyebrow">What you came for</p><h2>One counter.<br />A whole day covered.</h2><p>From first cast to campfire, the shop is built around the realities of a day on Texoma.</p></div>
        <div className="tb-bait-banner"><div><span>Live bait</span><strong>Shiners. Year round. No need to call ahead.</strong></div><p>Also stocking minnows, black salties, worms, glow worms, frozen bait and livers.</p></div>
        <div className="tb-departments">
          {departments.map((item, index) => <article key={item.title}>
            <div className="tb-dept-photo"><Image src={item.image} alt={item.alt} fill sizes="(min-width: 900px) 33vw, 100vw" className="object-cover" /></div>
            <div className="tb-dept-copy"><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.note}</p></div>
          </article>)}
        </div>
      </section>

      <section className="tb-inventory" aria-label="More available at Tackle Box Outfitters"><div className="container">
        <p className="eyebrow">And plenty more on the shelves</p>
        <div className="tb-inventory-groups">{inventoryGroups.map((group) => <div className={`tb-inventory-group tb-group-${group.type}`} key={group.type}>{group.items.map((item) => <span key={item}>{item}</span>)}</div>)}</div>
      </div></section>

      <section className="tb-bob">
        <div className="container tb-bob-grid">
          <div className="tb-bob-photo"><Image src="/tackle-box/bait.webp" alt="Bob Jr. the bass at Tackle Box Outfitters" fill sizes="(min-width: 768px) 46vw, 100vw" className="object-cover" /></div>
          <div className="tb-bob-copy"><p className="eyebrow">The unofficial shop host</p><h2>Meet Bob Jr.</h2><p>The tackle, bait and lake licenses may be why you stop. Bob Jr. is why the kids ask to come back. He shares the shop with a wall of fish and wildlife mounts that has become part of the Tackle Box ritual.</p><p className="tb-hand-note">Bait run. License stop. Fish visit. Now you&apos;re ready.</p></div>
        </div>
      </section>

      <section className="tb-flywheel">
        <div className="container">
          <p className="eyebrow">Make a lake day of it</p>
          <h2>Stock up here.<br />Plan the whole lake from here.</h2>
          <p className="tb-flywheel-intro">Tackle Box Outfitters and Texoma Destinations share the same building. While we help fill the cooler and tackle box, the team next door can help fill your itinerary—with activities, experiences, boat rentals and lodging across Lake Texoma.</p>
          <div className="tb-route">
            <div><span>01</span><strong>Stock up &amp; fuel up</strong><p>Grab bait, tackle, fuel and your Lake Texoma license here.</p></div>
            <div><span>02</span><strong>Ask a local</strong><p>Get the fishing report, then find a trusted guide or boat rental.</p></div>
            <div><span>03</span><strong>Stay awhile</strong><p>Plan lodging, activities and experiences with Texoma Destinations.</p></div>
          </div>
          <div className="flex flex-wrap gap-3">
            <HubLink brand={brand} cta={{ label: "Find a fishing guide", intent: "fishing", variant: "primary" }} campaign="tackle-box-route" />
            <HubLink brand={brand} cta={{ label: "Find a place to stay", intent: "cabins", variant: "ghost" }} campaign="tackle-box-stay" />
          </div>
        </div>
      </section>

      <section id="visit" className="tb-visit container">
        <div className="tb-visit-board">
          <p className="eyebrow">Pull in on your way north</p><h2>Visit the shop</h2>
          <address>{brand.nap.streetAddress}<br />{brand.nap.city}, {brand.nap.region} {brand.nap.postalCode}</address>
          <p>On Highway 289, two minutes before Lighthouse Resort &amp; Marina, in the same building as Texoma Destinations. Store hours vary by season. Call ahead only for large bait orders or RV propane fills.</p>
          <div className="flex flex-wrap gap-3"><a className="btn btn-primary" href={brand.nap.googleMapsUrl}>Open in Maps <span aria-hidden>→</span></a><a className="tb-call" href={`tel:${brand.nap.phoneE164}`}>{brand.nap.phone}</a></div>
        </div>
        <div className="tb-faq">
          <p className="eyebrow">Good to know</p>
          {plan.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span aria-hidden>+</span></summary><p>{faq.a}</p></details>)}
        </div>
      </section>
    </>
  );
}
