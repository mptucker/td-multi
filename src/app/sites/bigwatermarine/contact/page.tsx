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

// Page copy and photos are edited in /admin (content/bigwatermarine.json → pages.contact).
const P = cms.pages.contact;
const V = { phone: config.phone, phoneE164: config.phoneE164, email: config.email };

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: "/contact/",
  image: abs(P.images.hero.src),
});

const SALES_MAP = P.locations.sales.mapHref;
const SERVICE_MAP = P.locations.service.mapHref;

// The old contact form's "Interested in" choices, each routed to the fastest
// channel instead of a form. Labels and text are edited in /admin
// (pages.contact.topics.items); where each topic goes stays here, by topic.
const TOPIC_HREFS: Record<string, string> = {
  sales: smsHref("Hi! I'm interested in a boat: "),
  service: config.windlassIntakeUrl,
  club: "/boatclub/",
  parts: smsHref("Hi! I'm looking for a part: "),
  other: smsHref("Hi Big Water Marine! "),
};
const TOPICS = P.topics.items.map((t) => ({ ...t, href: TOPIC_HREFS[t.topic] ?? TOPIC_HREFS.other }));

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.contact).
const FAQS = pageFaqs("contact");

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "@id": abs("/contact/#page"),
          url: abs("/contact/"),
          name: "Contact Big Water Marine",
          about: { "@id": ORG_ID },
          mainEntity: { "@id": ORG_ID },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Contact" }]),
        faqPage(FAQS, "/contact/"),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="contact-title">
        <div className="bwm-heroMedia">
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Contact</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="contact-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            <Rich text={P.hero.lede} values={V} />
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <a href={smsHref("Hi Big Water Marine! ")} className="bwm-btnTeal">{fill(P.hero.textButton, V)}</a>
            <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineLight">{fill(P.hero.callButton, V)}</a>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="contact-help">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.topics.kicker}</p>
            <h2 id="contact-help" className="bwm-h2"><Rich text={P.topics.title} /></h2>
            <p className="bwm-lede"><Rich text={P.topics.lede} /></p>
          </header>
          <ul className="bwm-topics" role="list">
            {TOPICS.map((t) => (
              <li key={t.topic}>
                <h3>{t.title}</h3>
                <p><Rich text={t.text} /></p>
                {t.href.startsWith("/") ? (
                  <Link href={t.href} className="bwm-textLink">{t.button} <Arrow /></Link>
                ) : (
                  <a href={t.href} className="bwm-textLink">{t.button} <Arrow /></a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="locations" className="bwm-section bwm-foam" aria-labelledby="contact-where">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.locations.kicker}</p>
            <h2 id="contact-where" className="bwm-h2"><Rich text={P.locations.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.locations.lede} />
            </p>
          </header>
          <div className="bwm-twoUp">
            <article className="bwm-mapCard">
              <a href={SALES_MAP} className="bwm-mapImg" aria-label="Open Big Water Marine Sales in Google Maps">
                <CmsImage image={P.images.salesMap} fill sizes="(min-width: 900px) 45vw, 100vw" className="object-cover" />
              </a>
              <div className="bwm-mapBody">
                <h3>{P.locations.sales.title}</h3>
                <address>{P.locations.sales.address[0]}<br />{P.locations.sales.address[1]}</address>
                <p className="bwm-optionMeta"><Rich text={P.locations.sales.hours} /></p>
                <p className="bwm-optionMeta"><Rich text={P.locations.sales.email} values={V} /></p>
                <div className="bwm-actions">
                  <a href={SALES_MAP} className="bwm-btnTeal">{P.locations.sales.directionsButton}</a>
                  <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineDark">{fill(P.locations.sales.callButton, V)}</a>
                </div>
              </div>
            </article>
            <article className="bwm-mapCard">
              <a href={SERVICE_MAP} className="bwm-mapImg" aria-label="Open Big Water Marine Service in Google Maps">
                <CmsImage image={P.images.serviceMap} fill sizes="(min-width: 900px) 45vw, 100vw" className="object-cover" />
              </a>
              <div className="bwm-mapBody">
                <h3>{P.locations.service.title}</h3>
                <address>{P.locations.service.address[0]}<br />{P.locations.service.address[1]}</address>
                <p className="bwm-optionMeta"><Rich text={P.locations.service.hours} /></p>
                <p className="bwm-optionMeta"><Rich text={P.locations.service.email} values={V} /></p>
                <div className="bwm-actions">
                  <a href={SERVICE_MAP} className="bwm-btnTeal">{P.locations.service.directionsButton}</a>
                  <a href={config.windlassIntakeUrl} className="bwm-btnOutlineDark">{P.locations.service.bookButton}</a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="contact-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.faq.kicker}</p>
            <h2 id="contact-faq" className="bwm-h2"><Rich text={P.faq.title} /></h2>
            <p className="bwm-lede">
              {/* Text links (sms:) are not supported in Rich, so the link sits between two editable parts. */}
              <Rich text={P.faq.ledeBeforeLink} />{" "}
              <a href={smsHref("Hi Big Water Marine! ")} className="bwm-inlineLink">{config.phone}</a>
              <Rich text={P.faq.ledeAfterLink} values={V} />
            </p>
            <div className="bwm-actions">
              <Link href="/faq/" className="bwm-textLink">{P.faq.faqLink} <Arrow /></Link>
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
