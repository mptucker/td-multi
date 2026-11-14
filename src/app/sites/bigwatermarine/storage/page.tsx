import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, faqPage, pageMeta, SERVICE_ID } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import { cms, fill, n, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

// Page copy and photos are edited in /admin (content/bigwatermarine.json → pages.storage).
const P = cms.pages.storage;
// The SecurePro price comes from the winterization menu (service.winterPackages).
const SECUREPRO_PRICE = n(cms.service.winterPackages.find((p) => p.key === "securepro")?.onsite, 1750);
const V = {
  phone: config.phone,
  phoneE164: config.phoneE164,
  email: config.email,
  "securePro.price": SECUREPRO_PRICE.toLocaleString("en-US"),
};

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: fill(P.meta.description, V),
  path: "/storage/",
  image: abs(P.images.hero.src),
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.storage).
const FAQS = pageFaqs("storage");

export default function StoragePage() {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": abs("/storage/#service"),
          name: "Outdoor boat storage",
          serviceType: "Boat storage",
          provider: { "@id": SERVICE_ID },
          areaServed: { "@type": "Place", name: "Lake Texoma" },
          url: abs("/storage/"),
          offers: {
            "@type": "Offer",
            name: "SecurePro winterization with 6 months of outdoor storage",
            price: String(SECUREPRO_PRICE),
            priceCurrency: "USD",
            url: abs("/winterize/"),
          },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Service", path: "/service/" }, { name: "Storage" }]),
        faqPage(FAQS, "/storage/"),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="sto-title">
        <div className="bwm-heroMedia">
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li><Link href="/service/">Service</Link></li><li aria-current="page">Storage</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="sto-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            <Rich text={P.hero.lede} values={V} />
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <a href={`tel:${config.phoneE164}`} className="bwm-btnTeal">{fill(P.hero.callButton, V)}</a>
            <a href={smsHref("Hi! I'd like to check storage availability.")} className="bwm-btnOutlineLight">{P.hero.textButton}</a>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="sto-incl">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.includes.kicker}</p>
            <h2 id="sto-incl" className="bwm-h2"><Rich text={P.includes.title} /></h2>
            <ul className="bwm-checks" role="list">
              {P.includes.items.map((item) => <li key={item.label}><strong>{item.label}</strong> {item.text}</li>)}
            </ul>
            <p className="bwm-lede">
              <Rich text={P.includes.note} />
            </p>
          </div>
          <figure className="bwm-tallFigure">
            <CmsImage image={P.images.shrinkWrap} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <figcaption><Rich text={P.includes.caption} /></figcaption>
          </figure>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="sto-pro">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.securePro.kicker}</p>
            <h2 id="sto-pro" className="bwm-h2"><Rich text={P.securePro.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.securePro.lede} />
            </p>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare bwm-compare--2">
              <thead><tr><th scope="col">{P.securePro.tableHeadings[0]}</th><th scope="col">{P.securePro.tableHeadings[1]}</th></tr></thead>
              <tbody>{P.securePro.rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.detail}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="bwm-lede">
            <Rich text={P.securePro.pricing} values={V} />
          </p>
          <div className="bwm-actions">
            <a href={config.windlassIntakeUrl} className="bwm-btnTeal">{P.securePro.bookButton}</a>
            <Link href="/winterize/" className="bwm-textLink">{P.securePro.packagesLink} <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="sto-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.faq.kicker}</p>
            <h2 id="sto-faq" className="bwm-h2"><Rich text={P.faq.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.faq.lede} values={V} />
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
