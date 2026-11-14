import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { getInventory, brandOf, money } from "@/bigwatermarine/lib/boats";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { breadcrumbs, faqPage, inventoryList, pageMeta } from "@/bigwatermarine/lib/seo";
import Finder, { Arrow } from "../_components/Finder";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import Rich from "@/bigwatermarine/components/Rich";
import { cms, fill, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

export const revalidate = 300;

const P = cms.pages.inventory;

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: "/inventory/",
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.inventory).
const FAQS = pageFaqs("inventory");

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
  const values = {
    "boats.count": boats.length,
    "boats.new": newCount,
    "boats.used": boats.length - newCount,
    "prices.min": min ? money(min) : "",
    "prices.max": max ? money(max) : "",
    updated: asOf,
  };

  return (
    <>
      <JsonLd data={[
        inventoryList(boats),
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Inventory" }]),
        faqPage(FAQS, "/inventory/"),
      ]} />

      <section className="bwm-subHero" aria-labelledby="inv-title">
        <CmsImage image={P.images.hero} fill sizes="100vw" className="bwm-subHeroImg"  priority />
        <div className="bwm-subHeroShade" aria-hidden />
        <div className="bwm-wrap bwm-subHeroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light">
            <ol><li><Link href="/">Home</Link></li><li aria-current="page">Inventory</li></ol>
          </nav>
          <h1 id="inv-title" className="bwm-subHeroTitle"><Rich text={P.hero.title} /></h1>
          {/* Plain-language summary for search and AI answers. */}
          <p className="bwm-subHeroLede">
            <Rich text={P.hero.lede} values={values} />
            {min && max ? <Rich text={P.hero.ledePrices} values={values} /> : null}
            <Rich text={P.hero.ledeEnd} values={values} />
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
          <Finder boats={boats} variant="full" title={fill(P.finderTitle, values)} />
          <div className="bwm-buyStrip">
            <p><Rich text={P.buyStrip.text} /></p>
            <a href={smsHref(P.buyStrip.textMessage)} className="bwm-textLink">{P.buyStrip.link} <Arrow /></a>
          </div>
        </div>
      </div>

      <section className="bwm-section bwm-foam" aria-labelledby="inv-help">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.help.kicker}</p>
            <h2 id="inv-help" className="bwm-h2"><Rich text={P.help.title} /></h2>
            <p className="bwm-lede">{P.help.lede}</p>
            <div className="bwm-actions">
              <a href={config.financingUrl} className="bwm-btnTeal">{P.help.primaryButton}</a>
              <a href={config.tradeValueUrl} className="bwm-btnOutlineDark">{P.help.secondaryButton}</a>
            </div>
            <ul className="bwm-linkList" role="list">
              <li><Link href="/lake-texoma-boat-buying-guide/" className="bwm-textLink">{P.help.links[0]} <Arrow /></Link></li>
              <li><Link href="/new-vs-used-boat-cost/" className="bwm-textLink">{P.help.links[1]} <Arrow /></Link></li>
              <li><Link href="/fleet-sales/" className="bwm-textLink">{P.help.links[2]} <Arrow /></Link></li>
            </ul>
          </div>
          <div className="bwm-faq">
            <h3 className="bwm-faqTitle">{P.help.faqTitle}</h3>
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
