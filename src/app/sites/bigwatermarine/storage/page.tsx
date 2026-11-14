import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, faqPage, pageMeta, SERVICE_ID } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/winter-shrinkwrap-row.webp";
import heatWrap from "@public/media/winter-shrinkwrap-heat.webp";
import { faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

export const metadata: Metadata = pageMeta({
  title: "Boat Storage on Lake Texoma | Secure Outdoor Storage in Pottsboro, TX",
  description:
    "Secure outdoor boat storage at Big Water Marine in Pottsboro, Texas, on Lake Texoma. Six months of storage, shrink wrap and spring startup included in our $1,750 SecurePro winterization package.",
  path: "/storage/",
  image: abs("/bigwatermarine/media/winter-shrinkwrap-row.webp"),
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.storage).
const FAQS = pageFaqs("storage");

const INCLUDES = [
  ["Secure onsite storage", "at our Pottsboro facility."],
  ["Shrink wrap", "for boats up to 25 feet, protecting against weather and debris."],
  ["Winterization", "so nothing freezes while the boat sits."],
  ["Spring dewinterization", "so it starts when you want it back."],
  ["Pickup and delivery", "options if you can’t bring it yourself."],
];

const SECUREPRO = [
  ["Outdoor storage", "6 months, onsite and secure"],
  ["Shrink wrap", "Boats up to 25′"],
  ["Full winterization", "Engine, drive and vessel protection"],
  ["20-point inspection", "Full vessel check"],
  ["Dewinterization", "Spring startup included"],
];

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
            price: "1750",
            priceCurrency: "USD",
            url: abs("/winterize/"),
          },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Service", path: "/service/" }, { name: "Storage" }]),
        faqPage(FAQS, "/storage/"),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="sto-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="A row of shrink-wrapped boats on trailers in outdoor winter storage" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li><Link href="/service/">Service</Link></li><li aria-current="page">Storage</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Pottsboro, Texas · Lake Texoma</p>
          <h1 id="sto-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Boat storage</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>on Lake Texoma.</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            Big Water Marine offers secure <strong>outdoor</strong> boat storage at our Pottsboro, Texas location on Lake Texoma. We do not offer indoor or
            covered storage. Six months of storage is included in our SecurePro winterization package, along with shrink wrap for boats up to 25 feet and
            spring startup. Space is seasonal &mdash; call {config.phone} to check availability.
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <a href={`tel:${config.phoneE164}`} className="bwm-btnTeal">Call {config.phone}</a>
            <a href={smsHref("Hi! I'd like to check storage availability.")} className="bwm-btnOutlineLight">Text to check availability</a>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="sto-incl">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />What outdoor storage includes</p>
            <h2 id="sto-incl" className="bwm-h2">Wrapped, winterized, <em>ready in spring.</em></h2>
            <ul className="bwm-checks" role="list">
              {INCLUDES.map(([k, v]) => <li key={k}><strong>{k}</strong> {v}</li>)}
            </ul>
            <p className="bwm-lede">
              Because storage is outdoors, we strongly recommend shrink wrap for any boat left through the winter. A wrapped hull outdoors weathers the
              season far better than an uncovered one.
            </p>
          </div>
          <figure className="bwm-tallFigure">
            <Image src={heatWrap} alt="A technician heat-shrinking white wrap over a boat for winter storage" fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
            <figcaption>Shrink wrap at $25/ft, with vents and supports.</figcaption>
          </figure>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="sto-pro">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Storage and winterization together</p>
            <h2 id="sto-pro" className="bwm-h2">The simplest way: <em>SecurePro.</em></h2>
            <p className="bwm-lede">
              The simplest way to get storage is the <Link href="/winterize/" className="bwm-inlineLink">SecurePro winterization package</Link>, which bundles it
              with everything the boat needs for the off-season:
            </p>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare bwm-compare--2">
              <thead><tr><th scope="col">Included in SecurePro</th><th scope="col">Detail</th></tr></thead>
              <tbody>{SECUREPRO.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="bwm-lede">
            Pricing is <strong>$1,750 onsite</strong>, labor for single-engine boats; materials are additional. See the{" "}
            <Link href="/winterize/" className="bwm-inlineLink">winterization page</Link> for all package tiers.
          </p>
          <div className="bwm-actions">
            <a href={config.windlassIntakeUrl} className="bwm-btnTeal">Book SecurePro</a>
            <Link href="/winterize/" className="bwm-textLink">All winterization packages <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="sto-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Storage questions</p>
            <h2 id="sto-faq" className="bwm-h2">Straight <em>answers.</em></h2>
            <p className="bwm-lede">
              Storage slots are limited and seasonal. Call <a href={`tel:${config.phoneE164}`} className="bwm-inlineLink">{config.phone}</a> or email{" "}
              <a href={`mailto:${config.email}`} className="bwm-inlineLink">{config.email}</a> to reserve a space.
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
