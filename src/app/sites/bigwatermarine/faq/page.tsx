import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, faqPage, pageMeta, type Faq } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import { cms, fill } from "@/bigwatermarine/lib/cms";

const P = cms.pages.faq;
const PHONE = { phone: config.phone, email: config.email };

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: "/faq/",
  image: abs(P.images.hero.src),
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
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">FAQ</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="faq-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            <Rich text={P.hero.lede} />
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
          <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.closing.kicker}</p>
          <h2 id="faq-more" className="bwm-h2"><Rich text={P.closing.title} /></h2>
          <p className="bwm-lede">
            <Rich text={P.closing.lede} values={PHONE} />
          </p>
          <div className="bwm-actions bwm-actions--center">
            <a href={smsHref(P.closing.textMessage)} className="bwm-btnTeal">{fill(P.closing.textButton, PHONE)}</a>
            <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineDark">{fill(P.closing.callButton, PHONE)}</a>
          </div>
        </div>
      </section>
    </>
  );
}
