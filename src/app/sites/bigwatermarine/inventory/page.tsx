import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { getInventory, brandOf, money } from "@/bigwatermarine/lib/boats";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { breadcrumbs, faqPage, inventoryList, pageMeta } from "@/bigwatermarine/lib/seo";
import Finder, { Arrow } from "../_components/Finder";
import heroImg from "@public/media/highfield-aerial.webp";

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: "Boats for Sale on Lake Texoma | New & Used Boats in Pottsboro, TX",
  description:
    "Shop new and pre-owned boats for sale at Big Water Marine on Lake Texoma: Scout center consoles, Veranda and Berkshire pontoons, Highfield RIBs and more. Live inventory, real prices, financing and trade-ins.",
  path: "/inventory/",
});

const FAQS = [
  { q: "Do your boat prices include the trailer?", a: "Yes. All of our boat packages include the trailer unless the listing says otherwise. If you don’t need one, we can remove it from your estimate." },
  { q: "What isn’t included in the listed price?", a: "Tax, title and license (TTL), freight, prep and doc fees are not reflected in the posted price. We’ll give you a complete out-the-door number before you commit." },
  { q: "Do you take trade-ins?", a: "Yes. Get a quick estimate with our online trade tool; the final value is set after we see the boat in person." },
  { q: "Can you deliver a boat outside Lake Texoma?", a: "Yes. We offer reasonable delivery anywhere in the U.S., and every boat we sell gets a lake-ready orientation." },
  { q: "What does “On order” mean on a listing?", a: "The boat is built or being built and on its way to us. You can reserve it now so it’s yours when it arrives." },
  { q: "Can I finance a boat with you?", a: "Yes. Apply online for fast, secure pre-approval. Each listing has a loan calculator so you can estimate a monthly payment first." },
];

export default async function InventoryPage() {
  const boats = await getInventory();
  const priced = boats.filter((b) => b.price).map((b) => b.price!) ;
  const min = priced.length ? Math.min(...priced) : null;
  const max = priced.length ? Math.max(...priced) : null;
  const newCount = boats.filter((b) => b.condition === "New").length;
  const byBrand = ["Scout", "Veranda", "Highfield", "Berkshire"].map((name) => ({
    name,
    n: boats.filter((b) => brandOf(b.make) === name).length,
  }));
  const asOf = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" });

  return (
    <>
      <JsonLd data={[
        inventoryList(boats),
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Inventory" }]),
        faqPage(FAQS, "/inventory/"),
      ]} />

      <section className="bwm-subHero" aria-labelledby="inv-title">
        <Image src={heroImg} alt="" fill sizes="100vw" placeholder="blur" className="bwm-subHeroImg"  priority />
        <div className="bwm-subHeroShade" aria-hidden />
        <div className="bwm-wrap bwm-subHeroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light">
            <ol><li><Link href="/">Home</Link></li><li aria-current="page">Inventory</li></ol>
          </nav>
          <h1 id="inv-title" className="bwm-subHeroTitle">Boats for sale <em>on Lake Texoma</em></h1>
          {/* Plain-language summary for search and AI answers. */}
          <p className="bwm-subHeroLede">
            Big Water Marine has <strong>{boats.length} boats</strong> in stock in Pottsboro, Texas ({newCount} new, {boats.length - newCount} pre-owned)
            {min && max ? <>, priced from <strong>{money(min)}</strong> to <strong>{money(max)}</strong></> : null}.
            Every one is backed by our factory-certified service team. Updated {asOf}.
          </p>
          <ul className="bwm-brandJump" role="list">
            {byBrand.map((b) => (
              <li key={b.name}><a href={`/inventory/?make=${b.name.toLowerCase()}`}>{b.name} <span>{b.n}</span></a></li>
            ))}
          </ul>
        </div>
      </section>

      <div className="bwm-lotField">
        <div className="bwm-wrap">
          <Finder boats={boats} variant="full" title={`Shop all ${boats.length} boats`} />
          <div className="bwm-buyStrip">
            <p><strong>Don&rsquo;t see the one?</strong> New arrivals land every week, and we can order the exact boat you want.</p>
            <a href={smsHref("Hi! I'm looking for a boat you don't have listed right now.")} className="bwm-textLink">Text us what you&rsquo;re after <Arrow /></a>
          </div>
        </div>
      </div>

      <section className="bwm-section bwm-foam" aria-labelledby="inv-help">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Buying with Big Water</p>
            <h2 id="inv-help" className="bwm-h2">Straight answers <em>before you buy.</em></h2>
            <p className="bwm-lede">Real prices, the trailer included, financing in-house, and a team that keeps the boat running after you take it home.</p>
            <div className="bwm-actions">
              <a href={config.financingUrl} className="bwm-btnTeal">Apply for financing</a>
              <a href={config.tradeValueUrl} className="bwm-btnOutlineDark">Value your trade</a>
            </div>
            <ul className="bwm-linkList" role="list">
              <li><Link href="/lake-texoma-boat-buying-guide/" className="bwm-textLink">Lake Texoma boat buying guide <Arrow /></Link></li>
              <li><Link href="/new-vs-used-boat-cost/" className="bwm-textLink">New vs. used: what a boat really costs <Arrow /></Link></li>
              <li><Link href="/fleet-sales/" className="bwm-textLink">Fleet sales <Arrow /></Link></li>
            </ul>
          </div>
          <div className="bwm-faq">
            <h3 className="bwm-faqTitle">Common questions</h3>
            {FAQS.map((f) => (
              <details key={f.q} className="bwm-faqItem">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
