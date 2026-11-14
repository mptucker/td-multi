import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { FINANCING } from "@/bigwatermarine/lib/brands";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import LoanCalculator from "../inventory/_components/LoanCalculator";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/helm.webp";

export const metadata: Metadata = pageMeta({
  title: "Boat Financing on Lake Texoma | New, Used & Repower Loans",
  description:
    "Big Water Marine offers financing on new and used boat purchases and on repowers through marine lending partners, with a secure online application. Rates as low as 5.99% APR, terms up to 20 years. Pottsboro, TX.",
  path: "/financing/",
  image: abs("/bigwatermarine/media/helm.webp"),
});

// From the current Financing page (verbatim).
const FAQS = [
  { q: "What do I need to apply?", a: "The standard information any marine lender asks for: identification, income, and details of the boat you’re buying. The application is online and secure, and you’ll usually hear back quickly." },
  { q: "Can I finance a repower?", a: "Yes. Repowering an existing boat can be financed the same way as a purchase, which often makes a new engine cheaper per month than continuing to repair an old one." },
  { q: "Do you finance used boats?", a: "Yes. Terms vary by the age and value of the boat, so the best step is to apply and let us match you to the right lender." },
  { q: "What about commercial or fleet purchases?", a: "Fleet and commercial purchases don’t go through our retail lenders. Tell us how the deal is structured and we’ll help you find the right banking partner for it." },
  { q: "Does applying affect my credit?", a: "Lender policies differ on whether an application triggers a soft or hard inquiry. Ask us before you apply and we’ll tell you what to expect from the lender we’d send you to." },
];

const STEPS = [
  ["Apply online.", "The secure application takes a few minutes."],
  ["We match you to a lender.", "We work with marine lenders who understand boats, not just cars."],
  ["Review your terms.", "We walk through the out-the-door number, including TTL, freight, prep and doc fee."],
  ["Take delivery.", "We rig, prep and hand over the boat water-ready."],
];

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
          <Image src={hero} alt="Hands on the helm of a boat underway on Lake Texoma" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Financing</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Flexible financing &amp; trade-ins welcome</p>
          <h1 id="fin-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Boat financing</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>on Lake Texoma.</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            Big Water Marine offers financing on new and used boat purchases and on repowers, through marine lending partners, with a secure online
            application. Commercial and fleet purchases are handled separately &mdash; we&rsquo;ll point you to the right banking partner rather than run
            those through retail lenders.
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <a href={config.financingUrl} className="bwm-btnTeal">Apply for financing online</a>
            <a href={smsHref("Hi! I have a question about boat financing.")} className="bwm-btnOutlineLight">Text {config.phone}</a>
          </div>
          <ul className="bwm-heroChecks bwm-in" style={{ ["--d" as string]: "720ms" }} role="list">
            {FINANCING.financing.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="fin-how">
        <div className="bwm-wrap bwm-howGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />How it works</p>
            <h2 id="fin-how" className="bwm-h2">Four steps <em>to the water.</em></h2>
            <p className="bwm-lede">
              Make your dream boat a reality with competitive financing options tailored to your budget. Low rates, flexible terms, quick approvals.
            </p>
            <div className="bwm-actions">
              <a href={config.financingUrl} className="bwm-btnTeal">Apply for financing online</a>
              <Link href="/inventory/" className="bwm-textLink">See current inventory <Arrow /></Link>
            </div>
          </div>
          <ol className="bwm-howSteps" role="list">
            {STEPS.map(([k, v], i) => (
              <li key={k}><span className="bwm-stepNum">{i + 1}</span><div><h3>{k}</h3><p>{v}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="fin-calc">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Estimate your payment</p>
            <h2 id="fin-calc" className="bwm-h2">Run the numbers <em>before you apply.</em></h2>
            <p className="bwm-lede">Change the price, down payment, rate and term to see an estimated monthly payment. Every boat listing has this calculator too.</p>
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
              <h3>Financing options</h3>
              <p className="bwm-optionMeta">Competitive financing options tailored to your budget. Low rates, flexible terms, quick approvals.</p>
              <ul className="bwm-checks" role="list">{FINANCING.financing.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="bwm-actions"><a href={config.financingUrl} className="bwm-btnTeal">Get pre-approved</a></div>
            </div>
            <div className="bwm-option">
              <h3 id="fin-trade">Trade-in value</h3>
              <p className="bwm-optionMeta">Upgrade and get top dollar for your current boat. We make the transition seamless with fair valuations and easy paperwork.</p>
              <ul className="bwm-checks" role="list">{FINANCING.trade.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="bwm-actions"><a href={config.tradeValueUrl} className="bwm-btnOutlineDark">Get your trade value</a></div>
            </div>
          </div>
          <p className="bwm-fine">*For qualified buyers, on approved credit.</p>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="fin-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Financing questions</p>
            <h2 id="fin-faq" className="bwm-h2">Straight <em>answers.</em></h2>
            <p className="bwm-lede">
              Questions before you apply? Call <a href={`tel:${config.phoneE164}`} className="bwm-inlineLink">{config.phone}</a> and ask for sales, or see{" "}
              <Link href="/inventory/" className="bwm-inlineLink">current inventory</Link>.
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
