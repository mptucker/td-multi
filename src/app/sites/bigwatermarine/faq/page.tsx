import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, faqPage, pageMeta, type Faq } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/texoma-open-water.webp";

export const metadata: Metadata = pageMeta({
  title: "Frequently Asked Questions | Boats, Service & Boat Club on Lake Texoma",
  description:
    "Answers to the questions Big Water Marine is asked most: locations and hours, brands, used boats, trade-ins, financing, service, winterization, storage, Big Water Boat Club, fleet sales, fees and sea trials.",
  path: "/faq/",
  image: abs("/bigwatermarine/media/texoma-open-water.webp"),
});

type Group = { id: string; title: string; em: string; links: [string, string][]; faqs: Faq[] };

// From the current FAQ page (verbatim; one typo fixed).
const GROUPS: Group[] = [
  {
    id: "buying",
    title: "Sales, brands",
    em: "and buying",
    links: [["/inventory/", "Boats for sale"], ["/financing/", "Financing"]],
    faqs: [
      { q: "Where is Big Water Marine located?", a: "Two locations in Pottsboro, Texas on Lake Texoma. Boat sales are at 50055 N State Hwy 289, open Tuesday through Saturday, 9am–5pm. Service is at 33 Tackle Box Dr, open Tuesday through Friday 8am–5pm and Saturday 8am–3pm. Both reach us at 903-419-1019." },
      { q: "What boat brands do you sell?", a: "Four new brands: Berkshire and Veranda pontoons, Scout center consoles, and Highfield aluminum-hull RIBs and tenders. Boats are rigged with Suzuki, Yamaha, Mercury and Rotax power. Used inventory rotates and has included Trifecta, Carolina Skiff, Monterey and Sea Ray." },
      { q: "Do you sell used boats?", a: "Yes. Used and brokerage boats are listed alongside new inventory, including gently used fleet and rental boats that have been maintained on a commercial service schedule. Current stock is on our inventory page with prices, photos and specs." },
      { q: "Do you take trade-ins?", a: "Yes. We’ll appraise your boat, and final value is confirmed after an in-person inspection. If you’re replacing several boats at once, we’ll also tell you honestly whether trading or retailing them puts more money back in your pocket." },
      { q: "Do you offer financing?", a: "Yes, for retail boat purchases and for repowers, through our lending partners. Applications are handled online. Commercial and fleet purchases don’t run through our retail lenders — for those we’ll help you find the right banking partner." },
    ],
  },
  {
    id: "service",
    title: "Service and",
    em: "winterization",
    links: [["/service/", "Marine service"], ["/winterize/", "Winterization"], ["/storage/", "Storage"]],
    faqs: [
      { q: "Will you service an engine you didn’t sell me?", a: "Yes. We service all major outboard brands plus sterndrive and inboard/outboard setups, regardless of where the boat was bought. We’re a factory-authorized service center for Mercury, Yamaha, Suzuki and BRP, so warranty-approved work stays intact." },
      { q: "Do you come to my dock?", a: "Yes. Mobile service brings a certified technician to your dock or marina, which is often the difference between losing a weekend and keeping it. Same-day service is available for routine maintenance. Call 903-419-1019 to schedule." },
      { q: "How much does winterization cost?", a: "Onsite packages start at $335 for FreezeGuard, our essential freeze-protection service, and run to $1,750 for SecurePro, which adds shrink wrap, six months of storage and spring startup. All quotes are labor for single-engine boats; materials are additional, and mobile service is quoted separately." },
      { q: "What is Guaranteed Winterization?", a: "If your engine doesn’t start in spring because of our winterization process, we make it right at no charge. It’s the reason we’d rather do the job properly in autumn than argue about it in April." },
      { q: "Do you offer boat storage?", a: "Yes. Storage is available and is included for six months in our SecurePro winterization package, along with shrink wrap for boats up to 25 feet. Pickup and delivery options are available. Call for current availability, which is seasonal." },
    ],
  },
  {
    id: "club",
    title: "Boat club, fleets",
    em: "and the fine print",
    links: [["/boatclub/", "Big Water Boat Club"], ["/fleet-sales/", "Fleet sales"]],
    faqs: [
      { q: "What is Big Water Boat Club?", a: "A membership that gives you access to boats on Lake Texoma without owning one — no maintenance, storage or winterizing. Members book the boat they want and we handle the rest." },
      { q: "Do you sell boats to marinas and rental operators?", a: "Yes. Fleet pricing starts at two boats, gets deeper at four, and reaches wholesale at eight. Delivery anywhere on Lake Texoma is included. We also service fleets at your dock, whether or not you bought the boats from us." },
      { q: "Is the trailer included in the price?", a: "All of our boat packages include the trailer unless otherwise specified. If you don’t need one, we can remove it from the estimate." },
      { q: "What fees are not included in the listed price?", a: "Tax, title and license (TTL), freight, prep and doc fee are not reflected in the posted price. We’ll walk you through the full out-the-door number before you commit to anything." },
      { q: "Can I sea trial a boat before buying?", a: "Yes, by appointment. Contact sales to schedule an on-water demo so you can feel how the boat handles Texoma chop before you decide." },
    ],
  },
];

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
