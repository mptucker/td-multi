import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { money, monthlyPayment } from "@/bigwatermarine/lib/boats/format";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/hero-lifestyle.webp";
import couple from "@public/media/club-couple.webp";
import fleet from "@public/media/club-fleet.webp";
import sunset from "@public/media/highfield-sunset.webp";
import family from "@public/media/veranda-family.webp";
import dusk from "@public/media/texoma-dusk-cruise.webp";
import { cms, n, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

// Boat Club terms are edited in /admin (content/bigwatermarine.json → club.*).
const CLUB = {
  initiation: n(cms.club.initiation),
  returningInitiation: n(cms.club.returningInitiation),
  monthly: n(cms.club.monthly),
  quarterly: n(cms.club.quarterly),
  discount: n(cms.club.discount),
  deposit: n(cms.club.deposit),
  minAge: n(cms.club.minAge),
  winterHalfDay: n(cms.club.winterHalfDay),
  holidayFullDay: n(cms.club.holidayFullDay),
};

export const metadata: Metadata = pageMeta({
  title: "Big Water Boat Club | Lake Texoma Boat Club, 50% Off Every Rental",
  description: `Join Big Water Boat Club on Lake Texoma: $${CLUB.initiation} to join, $${CLUB.monthly}/month, and ${CLUB.discount}% off every boat rental at Lighthouse Resort & Marina. No blackout dates, no maintenance, no storage.`,
  path: "/boatclub/",
  image: abs("/bigwatermarine/media/club-couple.webp"),
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.boatclub).
const FAQS = pageFaqs("boatclub");

const PERKS = [
  ["No blackout dates", "Weekdays, weekends, holidays. Half day or full day. If a boat’s free, it’s yours."],
  [`${CLUB.discount}% off every rental`, "Half the posted rate at Lighthouse Resort & Marina, every single time you go out."],
  ["Book up to the day of", "Online or by phone. Woke up to a perfect lake? Grab a boat that morning (subject to availability)."],
  ["Nothing to maintain", "No boat payment, no storage, no winterizing, no repair bills. Dock it and walk away."],
  ["Free boater training", "The Intro to Boating on Lake Texoma class is free, and our team knows every cove on this lake."],
  ["A growing fleet", "Rental boats plus member-only boats, with more added as the club grows."],
  ["Member perks around the lake", "Discounts on cabin and RV stays at Lighthouse Resort, cruises with Fastrac Cruises, and more."],
  ["Concierge service", "Tell us the plan and we’ll help you pick the right boat and make the day easy."],
  ["Member-to-Owner", "When you’re ready to own, your membership becomes your on-ramp to the right boat."],
  ["Cheaper than renting or other boat clubs", "Low initiation and quarterly fees, half-price rentals, and no long-term commitment. Cancel anytime after your first quarter."],
];

const STEPS = [
  ["Join", `$${CLUB.initiation} initiation and your first quarter ($${CLUB.quarterly}). Members must be ${CLUB.minAge} or older.`],
  ["Get lake-ready", "Finish the online boater safety course and our partner BoaterWise’s free Intro to Boating on Lake Texoma."],
  ["Book your day", "Reserve online or by phone, as early or as late as you like."],
  ["Show up and go", `Bring your people. A refundable $${CLUB.deposit} deposit holds the boat; fuel is billed at the member rate.`],
];

export default function BoatClubPage() {
  const ownPrice = 60000;
  const ownPayment = monthlyPayment(ownPrice);

  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": abs("/boatclub/#service"),
          name: "Big Water Boat Club",
          serviceType: "Boat club membership",
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "Place", name: "Lake Texoma" },
          url: abs("/boatclub/"),
          description: `Boat club membership on Lake Texoma: $${CLUB.initiation} initiation, $${CLUB.monthly} per month billed quarterly, and ${CLUB.discount}% off boat rentals at Lighthouse Resort & Marina with no blackout dates.`,
          offers: {
            "@type": "Offer",
            url: config.boatClubJoinUrl,
            priceCurrency: "USD",
            price: String(CLUB.initiation),
            priceSpecification: [
              { "@type": "UnitPriceSpecification", name: "Initiation fee (first membership, discounted)", price: CLUB.initiation, priceCurrency: "USD" },
              { "@type": "UnitPriceSpecification", name: "Initiation fee (standard, and when rejoining)", price: CLUB.returningInitiation, priceCurrency: "USD" },
              { "@type": "UnitPriceSpecification", name: "Membership dues", price: CLUB.monthly, priceCurrency: "USD", unitCode: "MON", billingIncrement: 3 },
            ],
            eligibleCustomerType: `Adults ${CLUB.minAge}+`,
          },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Boat Club" }]),
        faqPage(FAQS, "/boatclub/"),
      ]} />

      {/* ── Hero ── */}
      <section className="bwm-hero bwm-hero--club" aria-labelledby="club-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="Friends playing in the shallows next to a pontoon on Lake Texoma" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Big Water Boat Club · Lake Texoma</p>
          <h1 id="club-title" className="bwm-heroTitle">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>All the lake days.</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>None of the upkeep.</em></span>
          </h1>
          <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "500ms" }}>That&rsquo;s going Big.</p>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <strong>${CLUB.initiation} to join. ${CLUB.monthly} a month. {CLUB.discount}% off every rental.</strong> No blackout dates, no boat payment,
            no storage, no winterizing. Just pick your day and bring your people.
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "720ms" }}>
            <a href={config.boatClubJoinUrl} className="bwm-btnTeal">Join the club</a>
            <a href={smsHref("Hi! I have a question about joining Big Water Boat Club.")} className="bwm-btnOutlineLight">Text us a question</a>
          </div>
          <dl className="bwm-heroStats bwm-in" style={{ ["--d" as string]: "840ms" }}>
            <div><dt>Off every rental</dt><dd>{CLUB.discount}%</dd></div>
            <div><dt>Per month, billed quarterly</dt><dd>${CLUB.monthly}</dd></div>
            <div><dt>Blackout dates</dt><dd>0</dd></div>
          </dl>
        </div>
      </section>

      {/* ── The math ── */}
      <section className="bwm-section bwm-white" aria-labelledby="club-math">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Do the math</p>
            <h2 id="club-math" className="bwm-h2 bwm-h2--xl">Half price. <em>Every time you go.</em></h2>
            <p className="bwm-lede">Members pay {CLUB.discount}% of the posted rental rate at Lighthouse Resort &amp; Marina. On a busy summer, that adds up fast.</p>
          </header>
          <div className="bwm-math">
            <div className="bwm-mathCard bwm-fx">
              <p className="bwm-mathLabel">Winter half day</p>
              <p className="bwm-mathWas">${CLUB.winterHalfDay}</p>
              <p className="bwm-mathNow">${CLUB.winterHalfDay / 2}<span>member price</span></p>
            </div>
            <div className="bwm-mathCard bwm-fx">
              <p className="bwm-mathLabel">Holiday-weekend full day</p>
              <p className="bwm-mathWas">up to ${CLUB.holidayFullDay.toLocaleString()}</p>
              <p className="bwm-mathNow">${CLUB.holidayFullDay / 2}<span>member price</span></p>
            </div>
            <div className="bwm-mathCard bwm-mathCard--own bwm-fx">
              <p className="bwm-mathLabel">Owning a ${ownPrice.toLocaleString()} pontoon</p>
              <p className="bwm-mathNow">about {money(ownPayment)}<span>a month financed*, before storage, upkeep and winterizing</span></p>
              <p className="bwm-mathVs">Membership: <strong>${CLUB.monthly}/month.</strong></p>
            </div>
          </div>
          <p className="bwm-fine bwm-center">
            Rental rates vary by season, weekdays, weekends and holidays. Each rental requires a refundable ${CLUB.deposit} damage deposit; fuel is billed at the member rate.
            *{config.loan.downPercent}% down, {config.loan.apr}% APR, {config.loan.termYears} years, on approved credit.
          </p>
        </div>
      </section>

      {/* ── Why join ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="club-why">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Why members love it</p>
            <h2 id="club-why" className="bwm-h2">Max flex. <em>Experience boating without the hassle of ownership.</em></h2>
            <p className="bwm-lede">
              We&rsquo;re your top choice when you want more than the usual Lake Texoma boat rental but aren&rsquo;t ready to commit to ownership. Our club
              offers exclusive access to our outstanding boat fleet, eliminating concerns about maintenance, storage, and ownership expenses, so you can
              focus on having a great time on the water.
            </p>
          </header>
          <ul className="bwm-perks" role="list">
            {PERKS.map(([k, v]) => (
              <li key={k} className="bwm-fx"><h3>{k}</h3><p>{v}</p></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Photo break ── */}
      <section className="bwm-section bwm-white" aria-label="Life in the club">
        <div className="bwm-wrap">
          <div className="bwm-mosaic">
            <figure className="bwm-mosaicA bwm-fx"><Image src={fleet} alt="Boat Club boats running in formation on Lake Texoma" fill sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" className="object-cover" /></figure>
            <figure className="bwm-mosaicB bwm-fx"><Image src={couple} alt="A couple relaxing at the bow of a club boat" fill sizes="(min-width: 1024px) 34vw, 55vw" placeholder="blur" className="object-cover" /></figure>
            <figure className="bwm-mosaicC bwm-fx"><Image src={family} alt="A dad catching a kid jumping off a pontoon" fill sizes="(min-width: 1024px) 26vw, 45vw" placeholder="blur" className="object-cover" /></figure>
            <figure className="bwm-mosaicD bwm-fx"><Image src={sunset} alt="A family cruising at golden hour" fill sizes="(min-width: 1024px) 30vw, 100vw" placeholder="blur" className="object-cover" /></figure>
            <p className="bwm-script bwm-mosaicScript bwm-fx">See you on the water</p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="club-how">
        <div className="bwm-wrap bwm-howGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />How it works</p>
            <h2 id="club-how" className="bwm-h2">From sign-up <em>to sandbar.</em></h2>
            <p className="bwm-lede">
              Four simple steps to your first lake day. When you join Big Water Boat Club, you are not joining a &ldquo;time share-like boating
              club.&rdquo; You are becoming a member of Lake Texoma&rsquo;s largest and most experienced boating operations company, with over 15 years
              of on-the-water experience, and part of the Texoma Destinations family.
            </p>
            <div className="bwm-actions">
              <a href={config.boatClubJoinUrl} className="bwm-btnTeal">Join the club</a>
              <Link href="/big-water-boat-club-vs-freedom-boat-club/" className="bwm-textLink">How we compare to Freedom Boat Club <Arrow /></Link>
            </div>
          </div>
          <ol className="bwm-howSteps" role="list">
            {STEPS.map(([k, v], i) => (
              <li key={k} className="bwm-fx"><span className="bwm-stepNum">{i + 1}</span><div><h3>{k}</h3><p>{v}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Compare ── */}
      <section className="bwm-section bwm-white" aria-labelledby="club-compare">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Simple on purpose</p>
            <h2 id="club-compare" className="bwm-h2">Owning, typical clubs, <em>or Big Water.</em></h2>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare">
              <thead>
                <tr><th scope="col"><span className="bwm-srOnly">Feature</span></th><th scope="col">Owning a boat</th><th scope="col">Typical boat club</th><th scope="col" className="bwm-us">Big Water Boat Club</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">Upfront cost</th><td>Down payment on the boat</td><td>High buy-in</td><td className="bwm-us">${CLUB.initiation} initiation</td></tr>
                <tr><th scope="row">Monthly cost</th><td>Loan, insurance, storage</td><td>Expensive dues</td><td className="bwm-us">${CLUB.monthly}/month</td></tr>
                <tr><th scope="row">Membership levels</th><td>n/a</td><td>Multiple tiers</td><td className="bwm-us">One simple plan</td></tr>
                <tr><th scope="row">Reservation limits</th><td>None</td><td>Often limited</td><td className="bwm-us">None, no blackout dates</td></tr>
                <tr><th scope="row">Maintenance &amp; winterizing</th><td>Yours to handle</td><td>Included</td><td className="bwm-us">Not your problem</td></tr>
                <tr><th scope="row">Commitment</th><td>Years of payments</td><td>Varies by club</td><td className="bwm-us">3-month minimum</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="club-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Straight answers</p>
            <h2 id="club-faq" className="bwm-h2">Everything you <em>want to know.</em></h2>
            <p className="bwm-lede">Still wondering? Text us. A real person on our team will answer.</p>
            <div className="bwm-actions">
              <a href={smsHref("Hi! I have a question about Big Water Boat Club.")} className="bwm-btnTeal">Text {config.phone}</a>
            </div>
          </div>
          <div className="bwm-faq">
            {FAQS.map((f) => (
              <details key={f.q} className="bwm-faqItem">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final call ── */}
      <section className="bwm-statement" aria-labelledby="club-final">
        <Image src={dusk} alt="" fill sizes="100vw" placeholder="blur" className="bwm-statementImg bwm-parallax" />
        <div className="bwm-statementShade" aria-hidden />
        <div className="bwm-statementInner bwm-fx">
          <Motif className="bwm-statementMotif" lineColor="var(--bwm-teal)" barColor="rgba(255,255,255,.28)" />
          <h2 id="club-final" className="bwm-statementLine">
            Not just a boat club. The boat club.
            <span>Your next lake day is closer than you think. You&rsquo;re not joining a club. You&rsquo;re joining the Big Water family.</span>
          </h2>
          <div className="bwm-actions bwm-actions--center">
            <a href={config.boatClubJoinUrl} className="bwm-btnTeal">Join Big Water Boat Club</a>
            <Link href="/inventory/" className="bwm-btnOutlineLight">Ready to own? Shop boats</Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white bwm-terms" aria-labelledby="club-terms">
        <div className="bwm-wrap">
          <details className="bwm-faqItem">
            <summary id="club-terms">Membership terms</summary>
            <p>Dues of ${CLUB.quarterly} per quarter are billed automatically. Initiation fee and membership dues are not refundable or transferable. A refundable ${CLUB.deposit} damage deposit is required for each rental and is returned, less any amount due, when the boat comes back in the condition it left. Written, signed notice is required to cancel. Big Water Boat Club may cancel a membership for non-payment or conduct detrimental to the club. Reservations are subject to availability. Members must be {CLUB.minAge} or older.</p>
          </details>
        </div>
      </section>
    </>
  );
}
