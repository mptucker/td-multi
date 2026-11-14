import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, faqPage, pageMeta, type Faq } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/texoma-open-water.webp";
import { cms, fill } from "@/bigwatermarine/lib/cms";

export const metadata: Metadata = pageMeta({
  title: "Frequently Asked Questions | Boats, Service & Boat Club on Lake Texoma",
  description:
    "Answers to the questions Big Water Marine is asked most: locations and hours, brands, used boats, trade-ins, financing, service, winterization, storage, Big Water Boat Club, fleet sales, fees and sea trials.",
  path: "/faq/",
  image: abs("/bigwatermarine/media/texoma-open-water.webp"),
});

type Group = { id: string; title: string; em: string; links: [string, string][]; faqs: Faq[] };

// Page links stay in code; the questions and answers are edited in /admin
// (content/bigwatermarine.json → faqs.faqPage).
const LINKS: Record<string, [string, string][]> = {
  buying: [["/inventory/", "Boats for sale"], ["/financing/", "Financing"]],
  service: [["/service/", "Marine service"], ["/winterize/", "Winterization"], ["/storage/", "Storage"]],
  club: [["/boatclub/", "Big Water Boat Club"], ["/fleet-sales/", "Fleet sales"]],
};

const GROUPS: Group[] = (cms.faqs.faqPage as { id: string; title: string; em: string; faqs: Faq[] }[]).map((g) => ({
  ...g,
  links: LINKS[g.id] ?? [],
  faqs: g.faqs.map((f) => ({ q: fill(f.q), a: fill(f.a) })),
}));

export default function FaqPage() {
  return (
    <>
      <JsonLd data={[
        faqPage(GROUPS.flatMap((g) => g.faqs), "/faq/"),
        breadcrumbs([{ name: "Home", path: "/" }, { name: "FAQ" }]),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="faq-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="Open water on Lake Texoma" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">FAQ</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Straight answers</p>
          <h1 id="faq-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Frequently asked</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>questions.</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            Big Water Marine is a boat dealer and full-service marine center on Lake Texoma in Pottsboro, Texas, with sales at 50055 N State Hwy 289 and
            service at 33 Tackle Box Dr. We sell Berkshire, Veranda, Scout and Highfield boats, service Mercury, Yamaha, Suzuki and BRP engines, and run Big
            Water Boat Club. Below are the questions we are asked most.
          </p>
          <nav aria-label="FAQ topics" className="bwm-jump bwm-in" style={{ ["--d" as string]: "600ms" }}>
            {GROUPS.map((g) => <a key={g.id} href={`#${g.id}`}>{g.title} {g.em}</a>)}
          </nav>
        </div>
      </section>

      {GROUPS.map((g, i) => (
        <section key={g.id} id={g.id} className={`bwm-section ${i % 2 ? "bwm-foam" : "bwm-white"}`} aria-labelledby={`${g.id}-h`}>
          <div className="bwm-wrap bwm-helpGrid">
            <div>
              <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{String(i + 1).padStart(2, "0")} / {String(GROUPS.length).padStart(2, "0")}</p>
              <h2 id={`${g.id}-h`} className="bwm-h2">{g.title} <em>{g.em}.</em></h2>
              <ul className="bwm-faqLinks" role="list">
                {g.links.map(([href, label]) => <li key={href}><Link href={href} className="bwm-textLink">{label} <Arrow /></Link></li>)}
              </ul>
            </div>
            <div className="bwm-faq">
              {g.faqs.map((f) => (
                <details key={f.q} className="bwm-faqItem"><summary>{f.q}</summary><p>{f.a}</p></details>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bwm-section bwm-white" aria-labelledby="faq-more">
        <div className="bwm-wrap bwm-sectionHead bwm-sectionHead--center">
          <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Still have a question?</p>
          <h2 id="faq-more" className="bwm-h2">Ask a <em>real person.</em></h2>
          <p className="bwm-lede">
            Call or text {config.phone}, email <a href={`mailto:${config.email}`} className="bwm-inlineLink">{config.email}</a> for service, or see all the
            ways to <Link href="/contact/" className="bwm-inlineLink">reach us</Link>.
          </p>
          <div className="bwm-actions bwm-actions--center">
            <a href={smsHref("Hi! I have a question: ")} className="bwm-btnTeal">Text {config.phone}</a>
            <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineDark">Call {config.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
