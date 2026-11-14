import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { LABOR } from "@/bigwatermarine/lib/service";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/texoma-dusk-cruise.webp";
import chop from "@public/media/scout-offshore.webp";

const PATH = "/lake-texoma-boat-buying-guide/";
const UPDATED = "2026-09-10";

export const metadata: Metadata = pageMeta({
  title: "What Boat Fits Lake Texoma | Buying Guide",
  description:
    "A Lake Texoma boat buying guide from Big Water Marine in Pottsboro: how the wind should drive your choice, which hull and size fit how you use the lake, and what to do before you buy.",
  path: PATH,
  image: abs("/bigwatermarine/media/texoma-dusk-cruise.webp"),
});

// From the current buying guide (verbatim).
const STATS = [
  ["~89,000", "acres of open water"],
  ["2 states", "Texas and Oklahoma shoreline"],
  ["4 brands", "new at our Pottsboro lot"],
  [`$${LABOR.onsite}/hr`, "onsite service labor"],
];

const USES = [
  ["Family, friends, coolers, swimming, sandbar", "Tritoon, 22′–25′", "Deck space and stability; the third tube handles chop and carries the crowd without wallowing"],
  ["Serious striper and sand bass fishing", "Center console, 21′–24′", "Deep-V entry cuts wind chop; open deck lets you fight fish around the boat"],
  ["Both — fish early, entertain later", "Fish-and-cruise pontoon", "Livewell and rod storage without giving up the seating your family wants"],
  ["Tender to a big boat or a lake house", "Aluminum-hull RIB", "Takes dock rash and beach landings that would wreck a fiberglass tender"],
  ["Skiing, boarding, tubing", "Runabout or sport tritoon", "Needs to get on plane fast and track straight in wind"],
];

const BRANDS = [
  { type: "Pontoon", name: "Berkshire", path: "/berkshire/", body: "Heavy-gauge aluminum with full-length under-deck performance packages, and optional triple-toon and lifting strakes. That combination is exactly what makes a pontoon behave in Texoma chop rather than pound through it.", best: "big family days where nobody wants to come in early." },
  { type: "Luxury pontoon", name: "Veranda", path: "/veranda/", body: "A patented all-aluminum interlocking deck — no plywood anywhere, so nothing rots when a wet season follows a wet season. The deck system is also why the ride is noticeably quiet and solid underfoot.", best: "boats that live at the lake and need to last." },
  { type: "Center console", name: "Scout", path: "/scout/", body: "Offshore-bred hulls with tournament-grade fishability, built by a company that has spent 25 years refining the same promise. On a lake that behaves like a small sea, that pedigree is not marketing — it is ride quality.", best: "anglers who still want the family aboard." },
  { type: "RIB / tender", name: "Highfield", path: "/highfield/", body: "America’s best-selling RIB, on an aluminum hull that shrugs off the abuse that destroys fiberglass tenders — rock, gravel, dock edges, trailer bunks.", best: "tenders, quick runs, and anyone who beaches a boat." },
];

const BEFORE = [
  ["Sea trial on a windy afternoon.", "Anyone can sell you a boat on a glass-calm morning. Ask to run it when the lake is working."],
  ["Ask who services it.", "A boat is only as good as the shop behind it. Ours is factory-authorized for Mercury, Yamaha, Suzuki and BRP, and our technicians will come to your dock."],
  ["Price the whole season, not the boat.", "Winterization, storage and wrap are real numbers. They are all published on our site rather than quoted after the fact."],
];

const FAQS = [
  { q: "What size boat is best for Lake Texoma?", a: "For most families, 22 to 25 feet. That range carries a crowd, handles afternoon chop, and still trailers and stores easily. Smaller boats are fine for calm mornings but get uncomfortable when the wind comes up." },
  { q: "Are pontoons safe on a lake this big?", a: "Yes, when they are specified for it. A tritoon with a performance package handles Texoma chop well. A basic two-tube boat is better suited to sheltered water and calm mornings." },
  { q: "Tritoon or two-tube pontoon?", a: "On Texoma, tritoon. The third tube adds buoyancy, stability and the ability to carry more power, which together make the difference on a windy afternoon." },
  { q: "What is the best boat for striper fishing here?", a: "A 21 to 24 foot center console. The deep-V entry softens wind chop, and the open deck lets you follow a fish around the boat instead of over the furniture." },
  { q: "Can I see a boat on the water before buying?", a: "Yes, by appointment. Call 903-419-1019 and we will schedule a demo. We would rather you find out on our time than after delivery." },
];

export default function BuyingGuidePage() {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": abs(`${PATH}#article`),
          headline: "What boat actually fits Lake Texoma?",
          description: "How the wind, the way you use the lake, and the shop behind the boat should shape a Lake Texoma boat purchase.",
          url: abs(PATH),
          image: abs("/bigwatermarine/media/texoma-dusk-cruise.webp"),
          dateModified: UPDATED,
          author: { "@id": ORG_ID },
          publisher: { "@id": ORG_ID },
          about: { "@type": "Place", name: "Lake Texoma" },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Boats", path: "/inventory/" }, { name: "Lake Texoma boat buying guide" }]),
        faqPage(FAQS, PATH),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="guide-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="A boat cruising Lake Texoma at dusk" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li><Link href="/inventory/">Boats</Link></li><li aria-current="page">Buying guide</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Lake Texoma boat buying guide</p>
          <h1 id="guide-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>What boat actually</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>fits Lake Texoma?</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            Texoma is big, open and famously windy. At roughly 89,000 acres straddling the Texas–Oklahoma border, it has enough fetch for a calm morning to
            turn into a two-foot chop by mid-afternoon. That single fact should drive most of your boat-buying decision.
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-label="About this guide">
        <div className="bwm-wrap">
          <p className="bwm-lede bwm-guideIntro">
            This guide walks through how people actually use this lake, what that means for hull type and size, and which boats hold up to a full Texoma
            season. Written by the team at Big Water Marine in Pottsboro, who sell, service and store boats here year-round.
          </p>
          <ul className="bwm-statRow" role="list">
            {STATS.map(([n, l]) => <li key={l}><strong>{n}</strong><span>{l}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="guide-wind">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Rule one</p>
            <h2 id="guide-wind" className="bwm-h2">Start with the wind, <em>not the boat.</em></h2>
            <p className="bwm-lede">
              Most first-time Texoma buyers shop on layout and upholstery. Then they take delivery in June, head out at 2pm on a Saturday, and discover the
              lake has other ideas. Wind is the defining characteristic here — it is why sailors love Texoma and why an undersized boat gets old fast.
            </p>
            <blockquote className="bwm-pull">If a boat is comfortable in Texoma afternoon chop, it will be comfortable almost anywhere you take it.</blockquote>
            <p className="bwm-lede">
              Three things make a boat handle that chop well: <strong>length, weight and hull design</strong>. A longer, heavier boat bridges waves instead
              of slapping into them. On pontoons, that means the difference between two tubes and three, and whether there is a performance package under
              the deck. On V-hulls, it means deadrise — the sharper the entry, the softer the ride.
            </p>
          </div>
          <figure className="bwm-tallFigure">
            <Image src={chop} alt="A Scout center console running through open water" fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
          </figure>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="guide-use">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Be honest about this part</p>
            <h2 id="guide-use" className="bwm-h2">How do you actually <em>use the lake?</em></h2>
            <p className="bwm-lede">The boat that wins is the one matched to your real weekends, not your aspirational ones.</p>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare">
              <thead><tr><th scope="col">If your day looks like this</th><th scope="col">You want</th><th scope="col">Why on Texoma</th></tr></thead>
              <tbody>{USES.map(([a, b, c]) => <tr key={a}><th scope="row">{a}</th><td className="bwm-us">{b}</td><td>{c}</td></tr>)}</tbody>
            </table>
          </div>
          <aside className="bwm-callout">
            <h3>The size mistake</h3>
            <p>
              People almost never regret going two feet longer. They regret going two feet shorter almost every windy Saturday. If you are between sizes
              on Texoma, size up.
            </p>
          </aside>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="guide-brands">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Not picked at random</p>
            <h2 id="guide-brands" className="bwm-h2">Which of our brands <em>fits which day?</em></h2>
            <p className="bwm-lede">We carry four lines, and we did not pick them at random. Each one answers a different version of the question above.</p>
          </header>
          <ul className="bwm-services bwm-services--2" role="list">
            {BRANDS.map((b) => (
              <li key={b.name}>
                <span className="bwm-serviceTag">{b.type}</span>
                <h3>{b.name}</h3>
                <p>{b.body}</p>
                <p><strong>Best for:</strong> {b.best}</p>
                <Link href={b.path} className="bwm-textLink">Explore {b.name} <Arrow /></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="guide-before">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />New or used?</p>
            <h2 className="bwm-h3">Both work on Texoma.</h2>
            <p className="bwm-lede">
              The honest answer depends more on how long you plan to keep the boat than on the sticker. We wrote a separate breakdown using our real
              service pricing: <Link href="/new-vs-used-boat-cost/" className="bwm-inlineLink">New vs used on Lake Texoma: what it actually costs to own</Link>.
            </p>
          </div>
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Checklist</p>
            <h2 id="guide-before" className="bwm-h2">Three things to do <em>before you buy.</em></h2>
            <ol className="bwm-steps" role="list">
              {BEFORE.map(([k, v], i) => (
                <li key={k}><span className="bwm-stepNum">{i + 1}</span><span><strong>{k}</strong> {v}</span></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="guide-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Frequently asked</p>
            <h2 id="guide-faq" className="bwm-h2">Come tell us how <em>you use the lake.</em></h2>
            <p className="bwm-lede">
              We will point you at the right boat, even when that means a smaller sale. Sales at 50055 N State Hwy 289, Pottsboro, Tuesday–Saturday
              9am–5pm.
            </p>
            <div className="bwm-actions">
              <Link href="/inventory/" className="bwm-btnTeal">See current inventory</Link>
              <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineDark">Call {config.phone}</a>
            </div>
            <p className="bwm-fine bwm-fine--dark">
              Rather text? <a href={smsHref("Hi! Here's how we use the lake: ")} className="bwm-inlineLink">Text {config.phone}</a>. Last updated 10 September 2026.
            </p>
          </div>
          <div className="bwm-faq">
            {FAQS.map((f) => (
              <details key={f.q} className="bwm-faqItem"><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
