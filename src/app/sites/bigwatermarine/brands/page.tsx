import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import { config } from "@/bigwatermarine/lib/config";
import { getInventory, brandOf } from "@/bigwatermarine/lib/boats";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import berkshireLogo from "@public/brands/berkshire-logo.png";
import verandaLogo from "@public/brands/veranda-logo.png";
import scoutLogo from "@public/brands/scout-logo.png";
import highfieldLogo from "@public/brands/highfield-logo.png";
import { cms, faqs as pageFaqs, fill } from "@/bigwatermarine/lib/cms";

const P = cms.pages.brands;

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: "/brands/",
  image: abs(P.images.hero.src),
});

// Brand copy and photos are edited in /admin (content/bigwatermarine.json →
// pages.brands.brands); the logos are brand assets and stay in code.
const LOGOS: Record<string, StaticImageData> = {
  Berkshire: berkshireLogo,
  Veranda: verandaLogo,
  Scout: scoutLogo,
  Highfield: highfieldLogo,
};

const BRANDS = P.brands;

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.brands).
const FAQS = pageFaqs("brands");

export default async function BrandsPage() {
  const boats = (await getInventory()).filter((b) => b.status !== "sold");
  const count = (name: string) => boats.filter((b) => brandOf(b.make) === name).length;

  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": abs("/brands/#page"),
          url: abs("/brands/"),
          name: "Boat brands we sell",
          about: { "@id": ORG_ID },
          hasPart: BRANDS.map((b) => ({ "@type": "WebPage", name: `${b.name} boats`, url: abs(b.path) })),
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": ORG_ID,
          brand: BRANDS.map((b) => ({ "@type": "Brand", name: b.name })),
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Brands" }]),
        faqPage(FAQS, "/brands/"),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="brands-title">
        <div className="bwm-heroMedia">
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Brands</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="brands-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            <Rich text={P.hero.lede} />
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="brands-compare">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.compare.kicker}</p>
            <h2 id="brands-compare" className="bwm-h2"><Rich text={P.compare.title} /></h2>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare bwm-compare--brands">
              <thead><tr>{P.compare.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {BRANDS.map((b) => (
                  <tr key={b.name}>
                    <th scope="row"><Link href={b.path} className="bwm-inlineLink">{b.name}</Link></th>
                    <td><Rich text={b.type} /></td>
                    <td><Rich text={b.builtFor} /></td>
                    <td><Rich text={b.signature} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="brands-why">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.why.kicker}</p>
            <h2 id="brands-why" className="bwm-h2"><Rich text={P.why.title} /></h2>
          </header>
          <ul className="bwm-brandCards" role="list">
            {BRANDS.map((b) => {
              const n = count(b.name);
              return (
                <li key={b.name}>
                  <Link href={b.path} className="bwm-brandCardImg" tabIndex={-1} aria-hidden>
                    <CmsImage image={b.image} alt="" fill sizes="(min-width: 1100px) 45vw, 100vw" className="object-cover" />
                  </Link>
                  <div className="bwm-brandCardBody">
                    <h3 className="bwm-brandCardLogo">{LOGOS[b.name] ? <Image src={LOGOS[b.name]} alt={b.name} sizes="200px" /> : b.name}</h3>
                    <p className="bwm-brandCardType"><Rich text={b.type} /></p>
                    <p><Rich text={P.why.cardText} values={{ name: b.name, why: b.why }} /></p>
                    <div className="bwm-actions">
                      <Link href={b.path} className="bwm-btnTeal">
                        {fill(n ? (n === 1 ? P.why.shopOneButton : P.why.shopManyButton) : P.why.exploreButton, { count: n, name: b.name })}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="bwm-lede bwm-brandNote">
            <Rich text={P.why.note} />
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="brands-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.faq.kicker}</p>
            <h2 id="brands-faq" className="bwm-h2"><Rich text={P.faq.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.faq.lede} values={{ phone: config.phone, phoneE164: config.phoneE164 }} />
            </p>
            <div className="bwm-actions">
              <Link href="/inventory/" className="bwm-btnTeal">{P.faq.primaryButton}</Link>
              <Link href="/lake-texoma-boat-buying-guide/" className="bwm-textLink">{P.faq.guideLink} <Arrow /></Link>
            </div>
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
