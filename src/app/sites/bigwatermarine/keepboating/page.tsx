import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { BRAND_REVIEWS } from "@/bigwatermarine/lib/brands";
import { abs, breadcrumbs, faqPage, pageMeta } from "@/bigwatermarine/lib/seo";
import RentJoinOwn from "./RentJoinOwn";

import hero from "@public/media/berkshire-le-2500.webp";
import redPontoon from "@public/media/rental-red-pontoon.webp";
import dog from "@public/media/rental-dog.webp";
import tube from "@public/media/rental-tube.webp";
import selfie from "@public/media/rental-selfie.webp";
import beachball from "@public/media/rental-beachball.webp";
import le from "@public/media/berkshire-le.webp";

export const metadata: Metadata = pageMeta({
  title: "Rent, Join or Buy a Boat on Lake Texoma",
  description:
    "Rent, join or own? Compare Lake Texoma rentals, Big Water Boat Club at 50% off rentals, and buying your own boat. Find what fits your days on the water.",
  path: "/keepboating/",
  image: abs("/bigwatermarine/media/berkshire-le-2500.webp"),
});

const FLEET = "/fleet-sales/";
const CLUB = "/boatclub/";
const INVENTORY = "/inventory/";

const MEMORIES = [
  { src: hero, alt: "Berkshire LE pontoon under way with passengers", caption: "Perfect boat, perfect memories." },
  { src: tube, alt: "Riders on a towable tube behind a boat", caption: "“One more ride!” — the tubing that never should end." },
  { src: dog, alt: "Woman holding a small dog aboard a boat on Lake Texoma", caption: "Cold drinks, sun on our skin, nothing but Texoma ahead." },
  { src: beachball, alt: "Family playing with a beach ball on a pontoon boat", caption: "The Islands were a highlight of our day." },
  { src: selfie, alt: "Couple taking a selfie on a boat", caption: "The moment we said, “We should do this more often.”" },
];

const OPTIONS = [
  {
    title: "Buy Your Rental Boat",
    points: ["Huge discounts on last year's boats", "Exclusive Discounts for our Previous Renters", "Same Boat, Same Memories", "No more \"sold out\" weekends"],
    cta: "Buy This Pontoon",
    href: FLEET,
    image: redPontoon,
    alt: "A red rental pontoon on Lake Texoma under a blue sky",
  },
  {
    title: "Big Water Boat Club",
    subtitle: "Boating without the Hassle",
    points: ["Premium fleet access to member-only boats", "50% off rentals + priority booking", "Break even after 2 rentals"],
    cta: "Join Boat Club",
    href: CLUB,
    image: le,
    alt: "A Berkshire LE pontoon full of friends on the lake",
  },
  {
    title: "Buy A New Boat",
    subtitle: "Find your dream boat and save $",
    points: ["Apply renter discount to any in-stock model on your new boat", "Financing Available", "Membership, Discounts, Service"],
    cta: "View Inventory",
    href: INVENTORY,
    image: selfie,
    alt: "A couple enjoying a day on their boat",
  },
];

const RENTAL_REVIEWS = [
  { name: "Kristin H – Lighthouse Boat Rental", text: "Had a great experience! Amazing new boat, great staff and great price. Highly recommend!!" },
  { name: "Cindy B – Lighthouse Boat Rental", text: "This was an easy boat rental. The staff was friendly and thorough with needed information. The boat was clean and in good shape. We will go back the next time we are in the area." },
  { name: "Ryan A – Lighthouse Boat Rental", text: "Extremly informative, friendly staff, easy setup, boat was perfect. I highly recommend lighthouse marina boat rentals. Overally an amazing experience." },
];

const FAQS = [
  { q: "Should I rent, join Big Water Boat Club, or buy a boat on Lake Texoma?", a: "It depends on how many days you boat. At about 1–3 days a year, renting keeps it simple. From roughly 2–9 days, Big Water Boat Club saves 50% on every rental for $500 to join and $150 a quarter. At 10 or more days a year, owning your own boat usually makes the most sense. Use the Rent, Join, Own calculator on this page to run your own numbers." },
  { q: "Can I buy the boat I rented?", a: "Yes. Previous renters get exclusive discounts on our rental fleet boats, and last year’s boats are offered at big discounts. Same boat, same memories, and no more sold-out weekends." },
  { q: "How much does Big Water Boat Club save on rentals?", a: "Members pay 50% of the posted rental rate at Lighthouse Resort & Marina, plus priority booking and access to member-only boats. With a $500 initiation (discounted from $1,000 for your first membership) and $50 a month billed quarterly, most members break even after about two rentals." },
  { q: "Can I use a renter discount on a new boat?", a: "Yes. Apply your renter discount to any in-stock model when you buy new, with financing available." },
];

export default function KeepBoatingPage() {
  const reviews = [...RENTAL_REVIEWS, ...BRAND_REVIEWS.map((r) => ({ name: `${r.name} – Big Water Marine`, text: r.text }))];

  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": abs("/keepboating/#page"),
          url: abs("/keepboating/"),
          name: "Rent, Join or Buy a Boat on Lake Texoma",
          description: "Compare Lake Texoma boat rentals, Big Water Boat Club at 50% off rentals, and buying your own boat.",
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Keep Boating" }]),
        faqPage(FAQS, "/keepboating/"),
      ]} />

      <section className="bwm-hero" aria-labelledby="kb-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="Berkshire LE pontoon under way with passengers" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>❤️ Life is better on a boat.</p>
          <h1 id="kb-title" className="bwm-heroTitle">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Make every weekend</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>a lake weekend.</em></span>
          </h1>
          <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "460ms" }}>Your best Texoma memories happen on the water.</p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <Link href={FLEET} className="bwm-btnTeal">Buy the boat you rented</Link>
            <Link href={CLUB} className="bwm-btnOutlineLight">Join Big Water Boat Club</Link>
            <Link href={INVENTORY} className="bwm-btnOutlineLight">Buy a new boat and save</Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="kb-memories">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Your best Texoma memories</p>
            <h2 id="kb-memories" className="bwm-h2">Perfect boat, <em>perfect memories.</em></h2>
          </header>
          <ul className="bwm-memories" role="list">
            {MEMORIES.map((m) => (
              <li key={m.caption}>
                <figure>
                  <div className="bwm-memoryImg"><Image src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 20vw, 50vw" placeholder="blur" className="object-cover" /></div>
                  <figcaption>{m.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="bwm-script bwm-pullQuote">“Don’t let it be a rental memory. Make it your lifestyle.”</p>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="kb-options">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Rent? Join? Own?</p>
            <h2 id="kb-options" className="bwm-h2">You <em>decide!</em></h2>
          </header>
          <ul className="bwm-optionCards" role="list">
            {OPTIONS.map((o) => (
              <li key={o.title}>
                <div className="bwm-optionCardImg"><Image src={o.image} alt={o.alt} fill sizes="(min-width: 1024px) 30vw, 100vw" placeholder="blur" className="object-cover" /></div>
                <div className="bwm-optionCardBody">
                  <h3>{o.title}</h3>
                  {o.subtitle && <p className="bwm-optionCardSub">{o.subtitle}</p>}
                  <ul className="bwm-checks" role="list">{o.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <Link href={o.href} className="bwm-btnTeal">{o.cta}</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="calculator" className="bwm-section bwm-white" aria-labelledby="kb-math">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Do the math</p>
            <h2 id="kb-math" className="bwm-h2">Find your best <em>Lake Texoma path.</em></h2>
            <p className="bwm-lede">Compare keep renting, join the club (50% off normal rentals), and purchase.</p>
          </header>
          <div className="bwm-panel">
            <RentJoinOwn fleetHref={FLEET} clubHref={CLUB} inventoryHref={INVENTORY} />
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="kb-reviews">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Genuine care</p>
            <h2 id="kb-reviews" className="bwm-h2">What our customers <em>are saying.</em></h2>
          </header>
          <ul className="bwm-reviews" role="list">
            {reviews.map((r) => (
              <li key={r.name}>
                <blockquote><p>&ldquo;{r.text}&rdquo;</p></blockquote>
                <p className="bwm-reviewBy"><span aria-label="5 out of 5 stars">★★★★★</span> {r.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="kb-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Straight answers</p>
            <h2 id="kb-faq" className="bwm-h2">Rent, join <em>or own?</em></h2>
            <p className="bwm-lede">Not sure which fits? Text us how you like to spend a lake day and we&rsquo;ll help you decide.</p>
            <div className="bwm-actions"><a href={smsHref("Hi! Help me decide: rent, join the Boat Club, or buy?")} className="bwm-btnTeal">Text {config.phone}</a></div>
          </div>
          <div className="bwm-faq">
            {FAQS.map((f) => <details key={f.q} className="bwm-faqItem"><summary>{f.q}</summary><p>{f.a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="bwm-statement" aria-labelledby="kb-final">
        <Image src={redPontoon} alt="" fill sizes="100vw" placeholder="blur" className="bwm-statementImg bwm-parallax" />
        <div className="bwm-statementShade" aria-hidden />
        <div className="bwm-statementInner">
          <Motif className="bwm-statementMotif" lineColor="var(--bwm-teal)" barColor="rgba(255,255,255,.28)" />
          <h2 id="kb-final" className="bwm-statementLine">
            Your Texoma adventure doesn&rsquo;t have to end!
            <span>
              Keep the fun going beyond your rental. Join the Big Water Boat Club for year-round access, buy the boat you already love, or upgrade to
              something new &mdash; all with exclusive discounts and top-notch service.
            </span>
          </h2>
          <div className="bwm-actions bwm-actions--center">
            <Link href={FLEET} className="bwm-btnTeal">Buy the boat you rented</Link>
            <Link href={CLUB} className="bwm-btnOutlineLight">Join Big Water Boat Club</Link>
            <Link href={INVENTORY} className="bwm-btnOutlineLight">Buy a new boat and save</Link>
          </div>
        </div>
      </section>
    </>
  );
}
