import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/texoma-pontoon-dusk.webp";
import mapSales from "@public/media/map-sales.webp";
import mapService from "@public/media/map-service.webp";
import { faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

export const metadata: Metadata = pageMeta({
  title: "Contact Big Water Marine | Pottsboro, TX on Lake Texoma",
  description:
    "Call or text Big Water Marine at 903-419-1019. Boat sales at 50055 N State Hwy 289 (Tue–Sat 9am–5pm) and service at 33 Tackle Box Dr (Tue–Fri 8am–5pm, Sat 8am–3pm) in Pottsboro, Texas, on Lake Texoma.",
  path: "/contact/",
  image: abs("/bigwatermarine/media/texoma-pontoon-dusk.webp"),
});

const SALES_MAP = "https://maps.app.goo.gl/utZa4T7ZvSxJU2Cv5";
const SERVICE_MAP = "https://maps.app.goo.gl/beVpzPSHNJf7u7aU6";

// The old contact form's "Interested in" choices, each routed to the fastest
// channel instead of a form.
const TOPICS = [
  { k: "New boat sales", v: "Ask about a boat, a price or a sea trial.", href: smsHref("Hi! I'm interested in a boat: "), cta: "Text sales" },
  { k: "Boat service", v: "Repairs, maintenance, winterization or mobile service.", href: config.windlassIntakeUrl, cta: "Book service" },
  { k: "Boat Club", v: "Half-price rentals at Lighthouse Resort & Marina.", href: "/boatclub/", cta: "See the club" },
  { k: "Parts", v: "Genuine OEM parts and accessories.", href: smsHref("Hi! I'm looking for a part: "), cta: "Text parts" },
  { k: "Something else", v: "Anything else on your mind.", href: smsHref("Hi Big Water Marine! "), cta: "Text us" },
];

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
          <Image src={hero} alt="A pontoon boat cruising Lake Texoma at sunset" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Contact</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Plan your next adventure</p>
          <h1 id="contact-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Visit Big Water Marine</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>in Pottsboro, TX.</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            Big Water Marine has two locations in Pottsboro, Texas, on Lake Texoma. Boat sales are at 50055 N State Hwy 289, open Tuesday–Saturday
            9am–5pm. The service centre is at 33 Tackle Box Dr, open Tuesday–Friday 8am–5pm and Saturday 8am–3pm. Both are reached on {config.phone}, and
            service can be emailed at {config.email}.
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <a href={smsHref("Hi Big Water Marine! ")} className="bwm-btnTeal">Text {config.phone}</a>
            <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineLight">Call {config.phone}</a>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="contact-help">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />How can we help?</p>
            <h2 id="contact-help" className="bwm-h2">Pick a topic. <em>Get a real person.</em></h2>
            <p className="bwm-lede">Texts go straight to our team. Sales is open Tuesday–Saturday, 9am–5pm; service Tuesday–Friday 8am–5pm and Saturday 8am–3pm.</p>
          </header>
          <ul className="bwm-topics" role="list">
            {TOPICS.map((t) => (
              <li key={t.k}>
                <h3>{t.k}</h3>
                <p>{t.v}</p>
                {t.href.startsWith("/") ? (
                  <Link href={t.href} className="bwm-textLink">{t.cta} <Arrow /></Link>
                ) : (
                  <a href={t.href} className="bwm-textLink">{t.cta} <Arrow /></a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="locations" className="bwm-section bwm-foam" aria-labelledby="contact-where">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Located on Lake Texoma</p>
            <h2 id="contact-where" className="bwm-h2">Visit us <em>in Pottsboro.</em></h2>
            <p className="bwm-lede">
              We are roughly 75 miles north of Dallas via US-75, near Denison and Sherman, and about 160 miles south of Oklahoma City.
            </p>
          </header>
          <div className="bwm-twoUp">
            <article className="bwm-mapCard">
              <a href={SALES_MAP} className="bwm-mapImg" aria-label="Open Big Water Marine Sales in Google Maps">
                <Image src={mapSales} alt="Map showing Big Water Marine sales at 50055 N State Hwy 289, Pottsboro, Texas" fill sizes="(min-width: 900px) 45vw, 100vw" placeholder="blur" className="object-cover" />
              </a>
              <div className="bwm-mapBody">
                <h3>Big Water Marine &ndash; Sales</h3>
                <address>50055 N State Hwy 289<br />Pottsboro, TX 75076</address>
                <p className="bwm-optionMeta"><strong>Sales:</strong> Tuesday thru Saturday 9am – 5pm</p>
                <p className="bwm-optionMeta">Email: <a href="mailto:sales@bigwatermarine.com" className="bwm-inlineLink">sales@bigwatermarine.com</a></p>
                <div className="bwm-actions">
                  <a href={SALES_MAP} className="bwm-btnTeal">Get directions</a>
                  <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineDark">Call {config.phone}</a>
                </div>
              </div>
            </article>
            <article className="bwm-mapCard">
              <a href={SERVICE_MAP} className="bwm-mapImg" aria-label="Open Big Water Marine Service in Google Maps">
                <Image src={mapService} alt="Map of Big Water Marine on N Hwy 289 in Pottsboro, Texas, near Highport Marina" fill sizes="(min-width: 900px) 45vw, 100vw" placeholder="blur" className="object-cover" />
              </a>
              <div className="bwm-mapBody">
                <h3>Big Water Marine &ndash; Service</h3>
                <address>33 Tackle Box Dr<br />Pottsboro, TX 75076</address>
                <p className="bwm-optionMeta"><strong>Service:</strong> Tuesday thru Friday 8am – 5pm, Saturday 8am – 3pm</p>
                <p className="bwm-optionMeta">Email: <a href={`mailto:${config.email}`} className="bwm-inlineLink">{config.email}</a></p>
                <div className="bwm-actions">
                  <a href={SERVICE_MAP} className="bwm-btnTeal">Get directions</a>
                  <a href={config.windlassIntakeUrl} className="bwm-btnOutlineDark">Book service</a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="contact-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Before you visit</p>
            <h2 id="contact-faq" className="bwm-h2">Good to <em>know.</em></h2>
            <p className="bwm-lede">
              Prefer to write? Text <a href={smsHref("Hi Big Water Marine! ")} className="bwm-inlineLink">{config.phone}</a>, or email{" "}
              <a href={`mailto:${config.email}`} className="bwm-inlineLink">{config.email}</a> for service enquiries.
            </p>
            <div className="bwm-actions">
              <Link href="/faq/" className="bwm-textLink">More answers in our FAQ <Arrow /></Link>
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
