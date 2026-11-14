import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { FINANCING } from "@/bigwatermarine/lib/brands";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import LoanCalculator from "../inventory/_components/LoanCalculator";
import { Arrow } from "../_components/Finder";

import { cms, fill, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

// Page copy and photos are edited in /admin (content/bigwatermarine.json → pages.financing).
const P = cms.pages.financing;
const V = { phone: config.phone, phoneE164: config.phoneE164 };

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: "/financing/",
  image: abs(P.images.hero.src),
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.financing).
const FAQS = pageFaqs("financing");

export default function FinancingPage() {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": abs("/financing/#service"),
          name: "Boat financing",
          serviceType: "Marine financing for new boats, used boats and repowers",
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "Place", name: "Lake Texoma" },
          url: abs("/financing/"),
          potentialAction: { "@type": "ApplyAction", target: config.financingUrl, name: "Apply for financing" },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Financing" }]),
        faqPage(FAQS, "/financing/"),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="fin-title">
        <div className="bwm-heroMedia">
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Financing</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="fin-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            <Rich text={P.hero.lede} />
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <a href={config.financingUrl} className="bwm-btnTeal">{P.hero.applyButton}</a>
            <a href={smsHref("Hi! I have a question about boat financing.")} className="bwm-btnOutlineLight">{fill(P.hero.textButton, V)}</a>
          </div>
          <ul className="bwm-heroChecks bwm-in" style={{ ["--d" as string]: "720ms" }} role="list">
            {FINANCING.financing.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="fin-how">
        <div className="bwm-wrap bwm-howGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.steps.kicker}</p>
            <h2 id="fin-how" className="bwm-h2"><Rich text={P.steps.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.steps.lede} />
            </p>
            <div className="bwm-actions">
              <a href={config.financingUrl} className="bwm-btnTeal">{P.steps.applyButton}</a>
              <Link href="/inventory/" className="bwm-textLink">{P.steps.inventoryLink} <Arrow /></Link>
            </div>
          </div>
          <ol className="bwm-howSteps" role="list">
            {P.steps.items.map((step, i) => (
              <li key={step.title}><span className="bwm-stepNum">{i + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="fin-calc">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.calculator.kicker}</p>
            <h2 id="fin-calc" className="bwm-h2"><Rich text={P.calculator.title} /></h2>
            <p className="bwm-lede"><Rich text={P.calculator.lede} /></p>
          </header>
          <div className="bwm-panel">
            <LoanCalculator price={60000} downPercent={config.loan.downPercent} apr={config.loan.apr} termYears={config.loan.termYears} financingUrl={config.financingUrl} />
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="fin-trade">
        <div className="bwm-wrap">
          <div className="bwm-twoUp">
            <div className="bwm-option bwm-option--hi">
              <h3>{P.options.financingTitle}</h3>
              <p className="bwm-optionMeta"><Rich text={P.options.financingText} /></p>
              <ul className="bwm-checks" role="list">{FINANCING.financing.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="bwm-actions"><a href={config.financingUrl} className="bwm-btnTeal">{P.options.financingButton}</a></div>
            </div>
            <div className="bwm-option">
              <h3 id="fin-trade">{P.options.tradeTitle}</h3>
              <p className="bwm-optionMeta"><Rich text={P.options.tradeText} /></p>
              <ul className="bwm-checks" role="list">{FINANCING.trade.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="bwm-actions"><a href={config.tradeValueUrl} className="bwm-btnOutlineDark">{P.options.tradeButton}</a></div>
            </div>
          </div>
          <p className="bwm-fine">{P.options.fine}</p>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="fin-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.faq.kicker}</p>
            <h2 id="fin-faq" className="bwm-h2"><Rich text={P.faq.title} /></h2>
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
