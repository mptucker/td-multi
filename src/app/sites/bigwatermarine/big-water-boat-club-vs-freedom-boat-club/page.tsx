import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/club-couple.webp";
import vs from "@public/media/club-vs-freedom.webp";
import berkshireCutout from "@public/media/club-berkshire-cutout.webp";
import tanCutout from "@public/media/club-tan-pontoon-cutout.webp";
import redFramed from "@public/media/club-red-pontoon-framed.webp";
import pontoonCutout from "@public/media/club-pontoon-cutout.webp";

const PATH = "/big-water-boat-club-vs-freedom-boat-club/";

export const metadata: Metadata = pageMeta({
  title: "Big Water vs Freedom Boat Club | Lake Texoma Comparison",
  description:
    "Big Water Boat Club vs Freedom Boat Club on Lake Texoma: initiation and monthly fees, reservation limits, blackout dates, commitment and fleet size, side by side.",
  path: PATH,
  image: abs("/bigwatermarine/media/club-couple.webp"),
});

// From the current comparison page (verbatim).
const COST = "Let’s start with cost. While Freedom Boat Club does not publicly disclose their membership prices, online sources suggest that they may be approximately over two times higher than those of Big Water Boat Club. In contrast, Big Water Boat Club offers significantly lower initiation fees and quarterly payments, making boating far more accessible and affordable.";
const LOCAL = "Freedom Boat Club is based in Florida, whereas Big Water Boat Club is conveniently located right here on Lake Texoma. By becoming a member of Big Water Boat Club, you are joining Texoma’s premier and most seasoned boating operations company. Supporting local Texas businesses ensures a thriving community and a remarkable boating experience for you.";
const AVAIL = [
  "At Big Water Boat Club, you enjoy unparalleled flexibility with no restrictions or blackout days. You have unrestricted access to our fleet of boats at any time, be it for a half day, full day, weekends, or even holidays.",
  "On the other hand, Freedom Boat Club operates with a different approach, and their members face certain limitations. They are allowed to have only 4 active reservations at a time and can book just 2 weekend reservations simultaneously. Additionally, a full-day outing or a weekend excursion requires two reservation slots, which can be quite restrictive.",
  "Moreover, numerous Freedom Boat Club members have expressed their frustrations during peak seasons due to the lack of available boats. The club’s boat inventory doesn’t seem to adequately meet the demands of its membership, making it challenging for members to secure boats for their desired outings.",
  "In contrast, at Big Water Boat Club, we prioritize providing an abundance of boats and maximum flexibility, ensuring that you can fully enjoy your boating experiences without unnecessary constraints.",
];

const TABLE: [string, string, string][] = [
  ["Initiation Fee", "$500 (normally $1,000)", "$5,000"],
  ["Monthly Fee", "$50", "$450"],
  ["Reservation Limit", "None", "4"],
  ["Restrictions", "No", "Yes"],
  ["Black out dates", "No", "Yes"],
  ["Long-term commitment", "No", "Yes"],
  ["Rent half days - back-to-back", "Yes", "No"],
  ["Rent full days - weekends", "Yes", "No"],
  ["Large Texoma Fleet", "Yes", "No"],
  ["Free Boater’s Training", "Yes", "Yes"],
  ["Discounts on Cabins & Camping", "Yes", "No"],
  ["Discounts on RV stays & Camping", "Yes", "No"],
  ["Membership-to-Ownership Program", "Yes", "No"],
];

// The old form's "Your knowledge about Boat Clubs" choices, as one-tap texts.
const ASK = [
  "I know nothing and ready to learn more!",
  "I have seen other clubs and curious how yours is better.",
  "I’m ready to sign up, just have a few questions.",
];

const FAQS = [
  { q: "Is Big Water Boat Club cheaper than Freedom Boat Club?", a: COST },
  { q: "Is Big Water Boat Club locally owned?", a: LOCAL },
  { q: "Does Big Water Boat Club have reservation limits or blackout dates?", a: `${AVAIL[0]} ${AVAIL[1]}` },
];

const JUMP = [["#cost", "Cost"], ["#local", "Locally Owned"], ["#availability", "Availability"], ["#comparison", "Comparison"]];

// Rows where "No" is the good answer.
const NO_IS_GOOD = new Set(["Restrictions", "Black out dates", "Long-term commitment"]);

function Mark({ v, row }: { v: string; row: string }) {
  if (v !== "Yes" && v !== "No") return <>{v}</>;
  const good = (v === "Yes") !== NO_IS_GOOD.has(row);
  return <><span aria-hidden className={good ? "bwm-yes" : "bwm-no"}>{good ? "✓" : "✕"}</span> {v}</>;
}

export default function ClubVsFreedomPage() {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": abs(`${PATH}#article`),
          headline: "Big Water Boat Club vs Freedom Boat Club",
          description: "A Lake Texoma comparison of Big Water Boat Club and Freedom Boat Club: cost, local ownership, availability and membership terms.",
          url: abs(PATH),
          image: abs("/bigwatermarine/media/club-couple.webp"),
          author: { "@id": ORG_ID },
          publisher: { "@id": ORG_ID },
          about: [{ "@type": "Organization", name: "Big Water Boat Club" }, { "@type": "Organization", name: "Freedom Boat Club" }],
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Boat Club", path: "/boatclub/" }, { name: "Big Water vs Freedom Boat Club" }]),
        faqPage(FAQS, PATH),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="vs-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="A couple relaxing on a pontoon on Lake Texoma" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li><Link href="/boatclub/">Boat Club</Link></li><li aria-current="page">vs Freedom Boat Club</li></ol></nav>
          <Image src={vs} alt="Big Water Boat Club versus Freedom Boat Club" className="bwm-vsMark bwm-in" style={{ ["--d" as string]: "60ms" }} sizes="320px" />
          <h1 id="vs-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Navigating</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>the waters.</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            As an avid boating enthusiast, you want the best option when it comes to boat clubs. You seek nothing but the best. To ensure you make the right
            choice, it’s crucial to carefully consider and compare the offerings of two leading contenders: Big Water Boat Club and Freedom Boat Club. Only
            by exploring their differences can you truly discover the perfect match for your boat rental needs.
          </p>
          <nav aria-label="On this page" className="bwm-jump bwm-in" style={{ ["--d" as string]: "600ms" }}>
            {JUMP.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          </nav>
        </div>
      </section>

      <section id="cost" className="bwm-section bwm-white" aria-labelledby="vs-cost">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Cost</p>
            <h2 id="vs-cost" className="bwm-h2">Cost <em>comparison.</em></h2>
            <p className="bwm-lede">{COST}</p>
            <Image src={berkshireCutout} alt="Friends relaxing aboard a Berkshire pontoon" className="bwm-cutout" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          <figure className="bwm-priceChart" aria-labelledby="vs-chart-cap">
            <p className="bwm-priceChartBig"><span>Over</span> 3X <small>the cost of Big Water Boat Club</small></p>
            <div className="bwm-priceBars" role="img" aria-label="Big Water Boat Club about $3,100 a year versus Freedom Boat Club about $10,400 a year, based on eight half-day rentals">
              <div className="bwm-priceBar bwm-priceBar--us" style={{ ["--h" as string]: `${(3100 / 10400) * 100}%` }}>
                <strong>$3,100</strong><span>Big Water Boat Club</span>
              </div>
              <div className="bwm-priceBar bwm-priceBar--them" style={{ ["--h" as string]: "100%" }}>
                <strong>$10,400</strong><span>Freedom Boat Club</span>
              </div>
            </div>
            <figcaption id="vs-chart-cap">Based off 8x 1/2 day rentals in a year</figcaption>
          </figure>
        </div>
      </section>

      <section id="local" className="bwm-section bwm-foam" aria-labelledby="vs-local">
        <div className="bwm-wrap bwm-splitGrid">
          <Image src={tanCutout} alt="A family cruising Lake Texoma on a pontoon" className="bwm-cutout" sizes="(min-width: 1024px) 45vw, 100vw" />
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Right here on Texoma</p>
            <h2 id="vs-local" className="bwm-h2">Locally <em>owned.</em></h2>
            <p className="bwm-lede">{LOCAL}</p>
          </div>
        </div>
      </section>

      <section id="comparison" className="bwm-section bwm-white" aria-labelledby="vs-table">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Side by side</p>
            <h2 id="vs-table" className="bwm-h2">Big Water <em>vs Freedom.</em></h2>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare bwm-compare--vs">
              <thead>
                <tr><th scope="col"><span className="bwm-srOnly">Feature</span></th><th scope="col" className="bwm-us">Big Water Boat Club</th><th scope="col">Freedom Boat Club*</th></tr>
              </thead>
              <tbody>
                {TABLE.map(([k, us, them]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td className="bwm-us"><Mark v={us} row={k} /></td>
                    <td><Mark v={them} row={k} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bwm-fine bwm-fine--dark">
            *Freedom Boat Club does not publicly disclose membership prices; its figures are based on online sources.
          </p>
          <div className="bwm-actions">
            <a href={config.boatClubJoinUrl} className="bwm-btnTeal">Join Big Water Boat Club</a>
            <Link href="/boatclub/" className="bwm-textLink">Learn more about the club <Arrow /></Link>
          </div>
        </div>
      </section>

      <section id="availability" className="bwm-section bwm-foam" aria-labelledby="vs-avail">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />No blackout days</p>
            <h2 id="vs-avail" className="bwm-h2"><em>Availability.</em></h2>
            {AVAIL.map((p) => <p key={p.slice(0, 20)} className="bwm-lede">{p}</p>)}
          </div>
          <Image src={redFramed} alt="A family boarding a red pontoon at the dock" className="bwm-cutout bwm-cutout--tall" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="vs-ask">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Questions?</p>
            <h2 id="vs-ask" className="bwm-h2">Have more questions about <em>joining a boat club?</em></h2>
            <p className="bwm-lede">
              Call <a href={`tel:${config.phoneE164}`} className="bwm-inlineLink">903.419.1019</a> or text us. Call Tuesday thru Saturday 9am to 5pm.
            </p>
            <p className="bwm-optionMeta"><strong>Your knowledge about Boat Clubs</strong> &mdash; tap the one that fits and we&rsquo;ll pick it up from there:</p>
            <ul className="bwm-askList" role="list">
              {ASK.map((a) => (
                <li key={a}><a href={smsHref(`Hi! About Big Water Boat Club: ${a}`)} className="bwm-btnOutlineDark">{a}</a></li>
              ))}
            </ul>
            <p className="bwm-fine bwm-fine--dark">Your information will not be shared or sold.</p>
          </div>
          <Image src={pontoonCutout} alt="A black Berkshire pontoon carrying passengers on Lake Texoma" className="bwm-cutout" sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>
      </section>
    </>
  );
}
