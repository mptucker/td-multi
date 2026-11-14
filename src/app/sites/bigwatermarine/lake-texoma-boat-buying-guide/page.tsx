import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import { cms, fill, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

// Page copy and photos are edited in /admin (content/bigwatermarine.json → pages.buyingGuide).
const P = cms.pages.buyingGuide;

const PATH = "/lake-texoma-boat-buying-guide/";
const UPDATED = "2026-09-10";

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: PATH,
  image: abs(P.images.hero.src),
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.buyingGuide).
const FAQS = pageFaqs("buyingGuide");

export default function BuyingGuidePage() {
  const phone = { phone: config.phone };
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": abs(`${PATH}#article`),
          headline: P.article.headline,
          description: P.article.description,
          url: abs(PATH),
          image: abs(P.images.hero.src),
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
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li><Link href="/inventory/">Boats</Link></li><li aria-current="page">Buying guide</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="guide-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            <Rich text={P.hero.lede} />
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-label="About this guide">
        <div className="bwm-wrap">
          <p className="bwm-lede bwm-guideIntro">
            <Rich text={P.intro.text} />
          </p>
          <ul className="bwm-statRow" role="list">
            {P.intro.stats.map((s) => <li key={s.label}><strong>{fill(s.value)}</strong><span>{s.label}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="guide-wind">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.wind.kicker}</p>
            <h2 id="guide-wind" className="bwm-h2"><Rich text={P.wind.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.wind.lede} />
            </p>
            <blockquote className="bwm-pull"><Rich text={P.wind.pullQuote} /></blockquote>
            <p className="bwm-lede">
              <Rich text={P.wind.body} />
            </p>
          </div>
          <figure className="bwm-tallFigure">
            <CmsImage image={P.images.chop} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </figure>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="guide-use">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.use.kicker}</p>
            <h2 id="guide-use" className="bwm-h2"><Rich text={P.use.title} /></h2>
            <p className="bwm-lede"><Rich text={P.use.lede} /></p>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare">
              <thead><tr>{P.use.tableHeaders.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{P.use.rows.map((r) => <tr key={r.day}><th scope="row">{r.day}</th><td className="bwm-us">{r.want}</td><td>{r.why}</td></tr>)}</tbody>
            </table>
          </div>
          <aside className="bwm-callout">
            <h3>{P.use.callout.title}</h3>
            <p>
              <Rich text={P.use.callout.text} />
            </p>
          </aside>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="guide-brands">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.brands.kicker}</p>
            <h2 id="guide-brands" className="bwm-h2"><Rich text={P.brands.title} /></h2>
            <p className="bwm-lede"><Rich text={P.brands.lede} /></p>
          </header>
          <ul className="bwm-services bwm-services--2" role="list">
            {P.brands.items.map((b) => (
              <li key={b.name}>
                <span className="bwm-serviceTag">{b.type}</span>
                <h3>{b.name}</h3>
                <p><Rich text={b.body} /></p>
                <p><strong>{P.brands.bestForLabel}</strong> <Rich text={b.bestFor} /></p>
                <Link href={b.path} className="bwm-textLink">{fill(P.brands.linkLabel, { name: b.name })} <Arrow /></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="guide-before">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.newOrUsed.kicker}</p>
            <h2 className="bwm-h3"><Rich text={P.newOrUsed.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.newOrUsed.text} />
            </p>
          </div>
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.checklist.kicker}</p>
            <h2 id="guide-before" className="bwm-h2"><Rich text={P.checklist.title} /></h2>
            <ol className="bwm-steps" role="list">
              {P.checklist.steps.map((s, i) => (
                <li key={s.title}><span className="bwm-stepNum">{i + 1}</span><span><strong>{s.title}</strong> <Rich text={s.text} /></span></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="guide-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.contact.kicker}</p>
            <h2 id="guide-faq" className="bwm-h2"><Rich text={P.contact.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.contact.lede} />
            </p>
            <div className="bwm-actions">
              <Link href="/inventory/" className="bwm-btnTeal">{P.contact.primaryButton}</Link>
              <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineDark">{fill(P.contact.callButton, phone)}</a>
            </div>
            <p className="bwm-fine bwm-fine--dark">
              {P.contact.textPrompt} <a href={smsHref(P.contact.textMessage)} className="bwm-inlineLink">{fill(P.contact.textLink, phone)}</a><Rich text={P.contact.afterText} />
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
