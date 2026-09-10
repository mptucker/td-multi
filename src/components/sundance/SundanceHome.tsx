import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { BrandConfig, BrandContent } from "@/config/types";
import { HubLink } from "@/components/HubLink";
import { RichText } from "@/components/RichText";

const elements = [
  { name: "Nature", icon: "/sundance/herbal-spa-treatment-leaves.png", color: "#a8c2ce" },
  { name: "Fresh air", icon: "/sundance/wind-sign.png", color: "#adaf53" },
  { name: "Campfires", icon: "/sundance/fire.png", color: "#c66750" },
  { name: "Lake", icon: "/sundance/water-drop.png", color: "#4e7484" },
];

const cabins = [
  { name: "Pecos", image: "/sundance/pecos.webp", sleep: "King · sleeps 2", color: "#bb5b49" },
  { name: "Glorietta", image: "/sundance/glorietta.webp", sleep: "King · sleeps 2", color: "#91a79b" },
  { name: "Rosa Linda", image: "/sundance/rosa-linda.webp", sleep: "King · sleeps 2", color: "#d99d9a" },
  { name: "Arroyo", image: "/sundance/arroyo.webp", sleep: "Two full beds · sleeps 4", color: "#4d7280" },
  { name: "Pinion House", image: "/sundance/pinion.webp", sleep: "Queen · sleeps 2", color: "#d59b68" },
  { name: "Ponderosa", image: "/sundance/ponderosa.webp", sleep: "Four twins · sleeps 4", color: "#9aa250" },
  { name: "Cottonwood", image: "/sundance/cottonwood.webp", sleep: "Full + twin · sleeps 3", color: "#6d8178" },
];

export function SundanceHome({ brand, content }: { brand: BrandConfig; content: BrandContent }) {
  const plan = content.plan!;
  return <>
    <section className="sd3-intro">
      <Image src="/sundance/village.webp" alt="Colorful tiny cabins tucked among the trees at Sundance Camp" fill priority sizes="100vw" className="sd3-intro-image" />
      <div className="sd3-intro-shade" />
      <div className="sd3-intro-copy">
        <p className="sd3-overline">A secluded camp on Lake Texoma</p>
        <h1>Come get<em>a little lost.</em></h1>
        <p className="sd3-lede">A colorful tiny-cabin village, six wooded RV sites, primitive camping and eighty waterfront acres at the end of the road.</p>
        <div className="sd3-intro-actions"><HubLink brand={brand} cta={{ label: "Find your stay", intent: "cabins", variant: "primary" }} campaign="sundance-intro" /><a href="#stays">Explore Sundance ↓</a></div>
      </div>
    </section>

    <figure className="sd3-reveal">
      <div><Image src="/sundance/hero.webp" alt="The gate at Sundance Camp on Lake Texoma" fill priority sizes="100vw" className="object-cover" /></div>
      <figcaption><span>The most peaceful</span><p>Behind this gate: trees, water and plenty of room to breathe.</p></figcaption>
    </figure>

    <section className="sd3-elements container">
      <div className="sd3-element-list">{elements.map((element) => <div key={element.name} style={{ "--element-color": element.color } as CSSProperties}><span><Image src={element.icon} alt="" width={128} height={128} /></span><strong>{element.name}</strong></div>)}</div>
      <div className="sd3-elements-copy"><p className="eyebrow">Experience the elements</p><h2>Simple things.<br />Plenty of them.</h2><p>Swim. Wander. Build a fire. Watch the sky change. Sundance has enough space to be together—and enough quiet to disappear for a while.</p></div>
    </section>

    <section className="sd3-cabins" id="stays">
      <header className="container sd3-section-head"><div><p className="eyebrow">The tiny cabin village</p><h2>Every cabin.<br />Its own personality.</h2></div><div><p>Climate controlled, fully furnished and intentionally different. A modern bathhouse with hot showers is only a few steps away. Check live availability for the cabins currently open.</p><HubLink brand={brand} cta={{ label: "Check cabin availability", intent: "cabins", variant: "primary" }} campaign="sundance-cabins" /></div></header>
      <div className="sd3-cabin-rail" aria-label="Sundance Camp tiny cabins">{cabins.map((cabin) => <article key={cabin.name} style={{ "--cabin-color": cabin.color } as CSSProperties}><div><Image src={cabin.image} alt={`${cabin.name} tiny cabin interior at Sundance Camp`} fill sizes="(min-width: 900px) 32vw, (min-width: 600px) 52vw, 82vw" className="object-cover" /></div><footer><h3>{cabin.name}</h3><p>{cabin.sleep}</p></footer></article>)}</div>
    </section>

    <figure className="sd3-quiet-break"><Image src="/sundance/shoreline.webp" alt="Quiet shoreline and woods at Sundance Camp" fill sizes="100vw" className="object-cover" /><figcaption>Do everything.<br /><strong>Or nothing at all.</strong></figcaption></figure>

    <section className="sd3-compare container">
      <header><p className="eyebrow">Choose your version of outside</p><h2>Our place.<br />Or yours.</h2></header>
      <div className="sd3-compare-row"><div className="sd3-compare-photo"><Image src="/sundance/rv.webp" alt="Wooded RV site at Sundance Camp" fill sizes="(min-width: 800px) 38vw, 100vw" className="object-cover" /></div><div className="sd3-compare-copy"><span>RV sites</span><h3>Camping, minus the rows.</h3><p>Six shaded gravel sites with 30-amp power, water, picnic tables and fire rings. Close to the bathhouse. Tucked into the woods.</p><HubLink brand={brand} cta={{ label: "Reserve an RV site", intent: "rv", variant: "ghost" }} campaign="sundance-rv" /></div></div>
      <div className="sd3-compare-row reverse"><div className="sd3-compare-photo"><Image src="/sundance/camping.webp" alt="Primitive tent camping beneath the trees at Sundance Camp" fill sizes="(min-width: 800px) 38vw, 100vw" className="object-cover" /></div><div className="sd3-compare-copy"><span>Primitive camping</span><h3>We provide the earth.</h3><p>Come with one tent or a whole troop. You&apos;ll have lake views, fire rings, picnic tables and real restroom facilities nearby.</p><HubLink brand={brand} cta={{ label: "Explore tent camping", intent: "tents", variant: "ghost" }} campaign="sundance-tents" /></div></div>
    </section>

    <section className="sd3-weekend">
      <div className="container"><header><p className="eyebrow">A weekend, if you want one</p><h2>Leave room<br />for no plans.</h2><p>Texoma Destinations can add a sunset cruise, fishing guide, paddling, picnic or group dinner. You decide how full—or empty—the days should feel.</p></header>
      <ol><li><span>Friday</span><h3>Arrive. Exhale.</h3><p>Check in after three. Find your cabin. Light the fire.</p></li><li><span>Saturday</span><h3>Follow the weather.</h3><p>Lake day, long lunch, a swim—or nowhere at all.</p></li><li><span>Sunday</span><h3>Stay slow.</h3><p>Coffee beneath the trees before the road home.</p></li></ol>
      <div className="sd3-weekend-actions"><HubLink brand={brand} cta={{ label: "Browse things to do", intent: "cruises", variant: "primary" }} campaign="sundance-weekend" /><HubLink brand={brand} cta={{ label: "Plan a group retreat", intent: "events", variant: "ghost" }} campaign="sundance-retreat" /></div></div>
    </section>

    <section className="sd3-practical container">
      <div><p className="eyebrow">Before you disappear</p><h2>Good things<br />to know.</h2><p>Gated. Quiet. Registered overnight guests only. Check-in begins at 3pm, check-out is at 11am, and there is no Wi-Fi by design.</p><nav><Link href="/plan-your-visit">Plan your arrival →</Link><Link href="/rules">Read the simple rules →</Link><a href={brand.nap.googleMapsUrl}>Get directions →</a></nav></div>
      <div className="sd3-faq">{plan.faqs.slice(0, 4).map((faq) => <details key={faq.q}><summary>{faq.q}<span>+</span></summary><p><RichText>{faq.a}</RichText></p></details>)}</div>
    </section>
  </>;
}
