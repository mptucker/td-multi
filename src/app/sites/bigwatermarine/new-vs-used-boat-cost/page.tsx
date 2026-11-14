import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { LABOR, WINTER_PACKAGES } from "@/bigwatermarine/lib/service";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/winter-shrinkwrap-row.webp";
import { faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

const PATH = "/new-vs-used-boat-cost/";
const UPDATED = "2026-09-10";

// Published rates used throughout this page.
const WRAP_PER_FT = 25;
const STORAGE_PER_FT_MONTH = 2;
const STORAGE_MONTHS = 6;
const FREEZEGUARD = WINTER_PACKAGES.find((p) => p.name === "FreezeGuard")?.onsite ?? 335;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

const SEASON = [20, 22, 24, 26].map((ft) => {
  const wrap = ft * WRAP_PER_FT;
  const storage = ft * STORAGE_PER_FT_MONTH * STORAGE_MONTHS;
  return { ft, wrap, storage, total: wrap + storage + FREEZEGUARD };
});

export const metadata: Metadata = pageMeta({
  title: "New vs Used Boat on Lake Texoma | Cost of Ownership",
  description:
    "What a boat really costs to own on Lake Texoma, new or used, using Big Water Marine's published pricing: shrink wrap $25/ft, outdoor storage $2/ft per month, winterization from $335, service $165/hr.",
  path: PATH,
  image: abs("/bigwatermarine/media/winter-shrinkwrap-row.webp"),
});

// From the current New vs Used page (verbatim).
const STATS = [
  [`$${WRAP_PER_FT}/ft`, "shrink wrap"],
  [`$${STORAGE_PER_FT_MONTH}/ft`, "outdoor storage, per month"],
  [`$${FREEZEGUARD}+`, "winterization, onsite"],
  [`$${LABOR.onsite}/hr`, "onsite service labor"],
];

const DIFFER: [string, string, string][] = [
  ["Purchase price", "Highest", "Lower — often dramatically"],
  ["Depreciation", "Steepest in the first seasons", "Already absorbed by someone else"],
  ["Warranty", "Factory coverage on boat and engine", "Varies; may be expired"],
  ["Unplanned repairs", "Rare early on", `Budget for them — billed at $${LABOR.onsite}/hr onsite`],
  ["Winterization & storage", "Effectively identical — driven by length, not age", ""],
  ["Detailing", "$8/ft exterior, $10/ft interior either way", ""],
  ["Insurance, fuel, registration", "Varies by value, use and carrier — get a quote before you commit", ""],
];

const NEW_CASE = [
  ["Predictability", "Nothing surprises you", "A new Berkshire, Veranda, Scout or Highfield comes with factory warranty on hull and engine. For the first several seasons your costs are the planned ones — fuel, winterization, storage."],
  ["Specification", "You get the boat you wanted", "Tritoon or two-tube, the performance package, the engine, the layout. On a lake this windy, being able to specify for the conditions is worth real money later."],
  ["Support", "Warranty work stays local", "We are factory-authorized for Mercury, Yamaha, Suzuki and BRP. Warranty repairs happen here, or at your dock, instead of being shipped somewhere."],
];

const USED_CASE = [
  ["Value", "Someone else took the hit", "The steepest depreciation happens early. A well-kept boat a few seasons old can deliver most of the experience for a good deal less money."],
  ["Known history", "Ex-fleet boats are a quiet bargain", "Our used inventory often includes gently used rental and fleet boats — maintained on a commercial schedule by factory-authorized technicians, which is better documented than most private-owner histories."],
  ["More boat", "Length for the same money", "Used often lets you move up two feet. On Texoma, two feet is the difference between coming in early and staying out."],
];

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.newVsUsed).
const FAQS = pageFaqs("newVsUsed");

function CaseCards({ items }: { items: string[][] }) {
  return (
    <ul className="bwm-services" role="list">
      {items.map(([tag, h, p]) => (
        <li key={h}>
          <span className="bwm-serviceTag">{tag}</span>
          <h3>{h}</h3>
          <p>{p}</p>
        </li>
      ))}
    </ul>
  );
}

export default function NewVsUsedPage() {
  const ex = SEASON.find((s) => s.ft === 22)!;
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": abs(`${PATH}#article`),
          headline: "New vs used on Lake Texoma: what it actually costs to own",
          description: "An honest cost-of-ownership comparison for new and used boats on Lake Texoma, using Big Water Marine's published service, winterization and storage pricing.",
          url: abs(PATH),
          image: abs("/bigwatermarine/media/winter-shrinkwrap-row.webp"),
          dateModified: UPDATED,
          author: { "@id": ORG_ID },
          publisher: { "@id": ORG_ID },
          about: { "@type": "Place", name: "Lake Texoma" },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Boats", path: "/inventory/" }, { name: "New vs used boat cost" }]),
        faqPage(FAQS, PATH),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="nvu-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="Shrink-wrapped boats in outdoor winter storage" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li><Link href="/inventory/">Boats</Link></li><li aria-current="page">New vs used</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Cost of ownership on Lake Texoma</p>
          <h1 id="nvu-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>New vs used:</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>what it actually costs to own.</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            The purchase price is the part everyone compares. The season is the part that decides whether you enjoy the boat. Winterization, storage, wrap
            and service are real, recurring numbers — and on a lake that freezes some winters and blows most afternoons, they are not optional.
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-label="About these numbers">
        <div className="bwm-wrap">
          <p className="bwm-lede bwm-guideIntro">
            Below is an honest breakdown using our <strong>actual published service pricing</strong>, not industry averages. Where a number depends on you
            — insurance, fuel, slip fees — we have said so rather than inventing one.
          </p>
          <ul className="bwm-statRow" role="list">
            {STATS.map(([n, l]) => <li key={l}><strong>{n}</strong><span>{l}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="nvu-season">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Driven by length, not age</p>
            <h2 id="nvu-season" className="bwm-h2">The off-season is <em>the real difference.</em></h2>
            <p className="bwm-lede">
              A boat on Texoma works hard for roughly half the year and sits for the other half. What you spend during the sitting half is largely the same
              whether the boat is new or ten years old — it is driven by length, not age.
            </p>
          </header>
          <h3 className="bwm-h3">What a season off the water costs, by length</h3>
          <p className="bwm-lede">
            Using our published rates: shrink wrap at ${WRAP_PER_FT}/ft, secure outdoor storage at ${STORAGE_PER_FT_MONTH}/ft per month for shrinkwrapped
            boats, and FreezeGuard winterization at ${FREEZEGUARD} onsite.
          </p>
          <div className="bwm-tableWrap">
            <table className="bwm-compare">
              <thead><tr><th scope="col">Boat length</th><th scope="col">Shrink wrap</th><th scope="col">Storage, 6 months</th><th scope="col">FreezeGuard</th><th scope="col">Season total</th></tr></thead>
              <tbody>
                {SEASON.map((s) => (
                  <tr key={s.ft}>
                    <th scope="row">{s.ft} ft</th>
                    <td>{usd(s.wrap)}</td>
                    <td>{usd(s.storage)}</td>
                    <td>{usd(FREEZEGUARD)}</td>
                    <td className="bwm-us">{usd(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="bwm-callout">
            <h3>Read this before you budget</h3>
            <p>
              These figures are labor for single-engine boats; materials are additional, and mobile service is priced separately. Our{" "}
              <Link href="/winterize/" className="bwm-inlineLink">SecurePro package</Link> at $1,750 bundles winterization, wrap up to 25 feet, six months
              of storage and spring startup — which for most boats in that range lands close to buying the pieces individually.
            </p>
          </aside>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="nvu-differ">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Line by line</p>
            <h2 id="nvu-differ" className="bwm-h2">Where new and used <em>genuinely differ.</em></h2>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare">
              <thead><tr><th scope="col">Cost</th><th scope="col">New boat</th><th scope="col">Used boat</th></tr></thead>
              <tbody>
                {DIFFER.map(([k, n, u]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    {u ? <><td>{n}</td><td>{u}</td></> : <td colSpan={2} className="bwm-same">{n}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <blockquote className="bwm-pull">
            Buy new for the warranty and the years of trouble-free use. Buy used to let someone else pay the depreciation. Neither saves you a winter.
          </blockquote>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="nvu-new">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Certainty</p>
            <h2 id="nvu-new" className="bwm-h2">The case <em>for new.</em></h2>
          </header>
          <CaseCards items={NEW_CASE} />
          <div className="bwm-actions">
            <Link href="/brands/" className="bwm-textLink">Our four new brands <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="nvu-used">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Flexibility</p>
            <h2 id="nvu-used" className="bwm-h2">The case <em>for used.</em></h2>
          </header>
          <CaseCards items={USED_CASE} />
          <div className="bwm-actions">
            <Link href="/fleet-sales/#used-rental" className="bwm-textLink">Used rental and fleet boats <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="nvu-example">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />A worked example</p>
            <h2 id="nvu-example" className="bwm-h2">A 22-foot tritoon, <em>new or used.</em></h2>
            <p className="bwm-lede">
              Say you are choosing between a new 22-foot tritoon and a well-kept used one. Both live outdoors, both get wrapped, both get winterized. Over
              the first winter:
            </p>
            <ul className="bwm-checks" role="list">
              <li><strong>Identical:</strong> wrap {usd(ex.wrap)}, storage {usd(ex.storage)}, winterization from {usd(FREEZEGUARD)}. Roughly {usd(ex.total)} either way.</li>
              <li><strong>Different:</strong> the new boat’s repairs are under warranty; the used boat’s are billed at ${LABOR.onsite}/hr onsite plus parts.</li>
              <li><strong>Also different:</strong> the used boat cost less up front and will lose less value over the next three seasons.</li>
            </ul>
            <p className="bwm-lede">
              So the question is not really new versus used. It is whether you would rather pay for certainty or pay for flexibility.
            </p>
          </div>
          <div className="bwm-callout bwm-callout--side">
            <h3>Still choosing a boat?</h3>
            <p>
              If you have not settled on a type yet, start with{" "}
              <Link href="/lake-texoma-boat-buying-guide/" className="bwm-inlineLink">what boat actually fits Lake Texoma</Link> — it covers hull type,
              size and how the wind here should shape the decision.
            </p>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="nvu-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Frequently asked</p>
            <h2 id="nvu-faq" className="bwm-h2">Run the numbers <em>with us.</em></h2>
            <p className="bwm-lede">
              Bring the boat you are considering, new or used, and we will price out a realistic season on it before you buy. No obligation, and no
              surprises in April.
            </p>
            <div className="bwm-actions">
              <Link href="/inventory/" className="bwm-btnTeal">Browse inventory</Link>
              <Link href="/winterize/" className="bwm-btnOutlineDark">See service pricing</Link>
            </div>
            <p className="bwm-fine bwm-fine--dark">
              Questions? <a href={smsHref("Hi! Can you price out a season on a boat I'm considering? ")} className="bwm-inlineLink">Text {config.phone}</a>.
              Last updated 10 September 2026. Service pricing shown is onsite labor for single-engine boats; materials additional.
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
