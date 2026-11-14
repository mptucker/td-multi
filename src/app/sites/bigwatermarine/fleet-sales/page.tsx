import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { getInventory } from "@/bigwatermarine/lib/boats";
import { abs, breadcrumbs, faqPage, inventoryList, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import BoatGrid from "../_components/BoatGrid";
import { Arrow } from "../_components/Finder";

import { cms, faqs as pageFaqs, fill } from "@/bigwatermarine/lib/cms";

const P = cms.pages.fleetSales;
const PHONE = { phone: config.phone };

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: "/fleet-sales/",
  image: abs(P.images.hero.src),
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.fleetSales).
const FAQS = pageFaqs("fleetSales");

export default async function FleetSalesPage() {
  const all = await getInventory();
  const forSale = all.filter((b) => b.status !== "sold");
  const isPontoon = (b: (typeof all)[number]) => /pontoon/i.test(`${b.boatClass ?? ""} ${b.category ?? ""}`);
  const newFleet = forSale.filter((b) => b.condition === "New" && b.make === "Berkshire");
  const usedRental = forSale.filter((b) => b.condition === "Used" && isPontoon(b));

  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": abs("/fleet-sales/#service"),
          name: "Fleet and rental boat sales",
          serviceType: "Commercial fleet boat sales",
          provider: { "@id": ORG_ID },
          areaServed: [{ "@type": "Place", name: "Lake Texoma" }, { "@type": "Place", name: "North Texas" }],
          audience: { "@type": "BusinessAudience", audienceType: P.supply.items.join(", ") },
          url: abs("/fleet-sales/"),
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Fleet Sales" }]),
        faqPage(FAQS, "/fleet-sales/"),
        ...(usedRental.length ? [inventoryList(usedRental, "/fleet-sales/")] : []),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="fleet-title">
        <div className="bwm-heroMedia">
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Fleet Sales</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="fleet-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            <Rich text={P.hero.lede} />
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <a href={smsHref(P.textMessages.fleetQuote)} className="bwm-btnTeal">{P.hero.textButton}</a>
            <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineLight">{fill(P.hero.callButton, PHONE)}</a>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="fleet-ops">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.operators.kicker}</p>
            <h2 id="fleet-ops" className="bwm-h2"><Rich text={P.operators.title} /></h2>
          </header>
          <ul className="bwm-tiers" role="list" aria-label="Fleet pricing tiers">
            {P.operators.tiers.map((t) => (
              <li key={t.number}><strong>{t.number}</strong><span>{t.unit}</span><em>{t.label}</em></li>
            ))}
          </ul>
          <ul className="bwm-services bwm-services--2" role="list">
            {P.operators.items.map((o) => (
              <li key={o.title}><h3><Rich text={o.title} /></h3><p><Rich text={o.text} /></p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="fleet-new">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--row">
            <div>
              <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.newFleet.kicker}</p>
              <h2 id="fleet-new" className="bwm-h2"><Rich text={P.newFleet.title} /></h2>
            </div>
            <Link href="/berkshire/" className="bwm-textLink">{P.newFleet.link} <Arrow /></Link>
          </header>
          {newFleet.length ? (
            <BoatGrid boats={newFleet} />
          ) : (
            <p className="bwm-lede"><Rich text={P.newFleet.empty} /></p>
          )}
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="fleet-cycle">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.cycle.kicker}</p>
            <h2 id="fleet-cycle" className="bwm-h2"><Rich text={P.cycle.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.cycle.lede} />
            </p>
            <ol className="bwm-steps" role="list">
              {P.cycle.steps.map((step, i) => (
                <li key={step.title}><span className="bwm-stepNum">{i + 1}</span><span><strong>{step.title}</strong> <Rich text={step.text} /></span></li>
              ))}
            </ol>
            <h3 className="bwm-h3"><Rich text={P.cycle.retailTitle} /></h3>
            {P.cycle.retailText.map((t) => (
              <p key={t} className="bwm-lede">
                <Rich text={t} />
              </p>
            ))}
          </div>
          <figure className="bwm-tallFigure">
            <CmsImage image={P.images.pontoon} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <figcaption><Rich text={P.cycle.caption} /></figcaption>
          </figure>
        </div>
      </section>

      <section id="used-rental" className="bwm-section bwm-foam" aria-labelledby="fleet-used">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.usedRental.kicker}</p>
            <h2 id="fleet-used" className="bwm-h2"><Rich text={P.usedRental.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.usedRental.lede} />
            </p>
          </header>
          {usedRental.length ? (
            <BoatGrid boats={usedRental} />
          ) : (
            <p className="bwm-lede"><Rich text={P.usedRental.empty} /></p>
          )}
          <div className="bwm-actions">
            <a href={smsHref(P.textMessages.rentalBoat)} className="bwm-btnTeal">{P.usedRental.textButton}</a>
            <Link href="/inventory/" className="bwm-textLink">{P.usedRental.link} <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="fleet-who">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.supply.kicker}</p>
            <h2 id="fleet-who" className="bwm-h2"><Rich text={P.supply.title} /></h2>
          </header>
          <ul className="bwm-chips" role="list">
            {P.supply.items.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="fleet-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.faq.kicker}</p>
            <h2 id="fleet-faq" className="bwm-h2"><Rich text={P.faq.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.faq.lede} />
            </p>
            <div className="bwm-actions">
              <a href={smsHref(P.textMessages.fleetQuote)} className="bwm-btnTeal">{P.faq.textButton}</a>
              <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineDark">{fill(P.faq.callButton, PHONE)}</a>
            </div>
            <p className="bwm-fine bwm-fine--dark"><Rich text={P.faq.fine} /></p>
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
