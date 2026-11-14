import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { getInventory } from "@/bigwatermarine/lib/boats";
import { abs, breadcrumbs, faqPage, inventoryList, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import BoatGrid from "../_components/BoatGrid";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/club-fleet.webp";
import pontoon from "@public/media/rental-red-pontoon.webp";

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: "Fleet & Rental Boat Sales, Lake Texoma",
  description:
    "Fleet boat sales for marinas, resorts, rental operators, boat clubs and camps on Lake Texoma and North Texas. Volume pricing from two boats, mobile service at your dock, and used rental boats anyone can buy.",
  path: "/fleet-sales/",
  image: abs("/bigwatermarine/media/club-fleet.webp"),
});

// From the current Fleet Sales page (verbatim).
const OPERATORS = [
  ["Volume pricing that starts at two boats", "Fleet buyers don’t pay retail, and you don’t need a marina full of boats to qualify. Pricing steps down as the order grows: two boats earn fleet pricing, four or more earns a deep discount, and at eight or more you’re buying at wholesale. Mixed models and mixed sizes count toward the same order — we’ll quote a full season as one deal rather than boat by boat."],
  ["Brands that survive a rental season", "We’re a dealer for Berkshire and Veranda pontoons, Scout center consoles, and Highfield aluminum-hull RIBs and tenders — rigged with Suzuki, Yamaha, Mercury and Rotax power. Heavy-gauge construction, simple layouts, and parts availability matter more in a fleet than any feature list, and we’ll steer you toward the models that hold up rather than the ones with the best brochure."],
  ["Mobile service to your dock", "This is the part most dealers can’t offer. Our technicians are factory-authorized for Mercury, Yamaha, Suzuki and BRP, same-day service is available, and we come to your dock or marina. A boat that gets fixed in its slip is a boat that’s still earning that weekend."],
  ["One relationship, whole lifecycle", "Buy the fleet, service the fleet, cycle the fleet. We rig and prep every boat before delivery, keep genuine OEM parts on hand, handle seasonal winterization and shrink wrap, and help you move boats on when you’re ready to refresh."],
];

const TIERS = [
  ["2+", "boats", "Fleet pricing"],
  ["4+", "boats", "Deep discount"],
  ["8+", "boats", "Wholesale"],
];

const CYCLE = [
  ["Spec it.", "We help you choose layouts, power, and options that rent well and service easily."],
  ["Run it.", "Scheduled maintenance at your dock keeps boats in the water through the season."],
  ["Cycle it.", "When you refresh, we help you get the most out of the boats you’re replacing — and into next season’s fleet."],
];

const SUPPLY = [
  "Marinas and resorts",
  "Rental and charter operators",
  "Boat clubs",
  "Youth camps and church camps",
  "Lodges and RV resorts",
  "Municipal and patrol operations",
  "Corporate and event fleets",
];

const FAQS = [
  { q: "Do I have to buy a whole fleet?", a: "No. Fleet pricing starts at two boats, gets deeper at four, and reaches wholesale at eight. Plenty of operators start with a pair and build from there." },
  { q: "Do you deliver?", a: "Yes — rigged, prepped, and water-ready. Delivery anywhere on Lake Texoma is included. Beyond Texoma we’ll quote it at a reasonable rate." },
  { q: "What do I do with the boats I’m replacing?", a: "Whatever nets you the most. We’ll help you retail them yourself, take them on consignment and handle the sale, or make you a favorable trade on the upgrade — and we’ll tell you honestly which one puts more money back in your pocket." },
  { q: "Can you service our existing fleet, even if we didn’t buy it here?", a: "Yes. We’re factory-authorized for Mercury, Yamaha, Suzuki and BRP, and our mobile technicians work at your dock or marina." },
  { q: "Do you handle off-season storage and winterization?", a: "Yes — winterization, shrink wrap, and storage are all handled in-house." },
  { q: "Can you help with financing?", a: "Commercial fleet purchases don’t go through our retail lenders — but we’ll help you find the right banking partner for it. Tell us how the deal is structured and we’ll make the introduction." },
];

const FLEET_TEXT = "Hi! I'm interested in fleet pricing. We run ___ boats for ___ and need them on the water by ___.";

export default async function FleetSalesPage() {
  const all = await getInventory();
  const forSale = all.filter((b) => b.status !== "sold");
  const isPontoon = (b: (typeof all)[number]) => /pontoon/i.test(`${b.boatClass ?? ""} ${b.category ?? ""}`);
  const newFleet = forSale.filter((b) => b.condition === "New" && b.make === "Berkshire");
  const usedRental = forSale.filter((b) => b.condition === "Used" && isPontoon(b));

  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": abs("/fleet-sales/#service"),
          name: "Fleet and rental boat sales",
          serviceType: "Commercial fleet boat sales",
          provider: { "@id": ORG_ID },
          areaServed: [{ "@type": "Place", name: "Lake Texoma" }, { "@type": "Place", name: "North Texas" }],
          audience: { "@type": "BusinessAudience", audienceType: SUPPLY.join(", ") },
          url: abs("/fleet-sales/"),
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Fleet Sales" }]),
        faqPage(FAQS, "/fleet-sales/"),
        ...(usedRental.length ? [inventoryList(usedRental, "/fleet-sales/")] : []),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="fleet-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="A fleet of pontoon boats running together on Lake Texoma" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Fleet Sales</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Rental, fleet and boat club boat sales</p>
          <h1 id="fleet-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Fleet &amp; rental</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>boat sales.</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            If you run a marina, resort, rental operation, boat club, or camp, your boats are working assets — they need to launch every morning, take a
            beating all season, and hold their value when it’s time to cycle them out. Big Water Marine sells new and used fleet boats to operators across
            Lake Texoma and North Texas, at volume pricing, from a dealership that runs its own rental fleet and boat club on this lake.
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <a href={smsHref(FLEET_TEXT)} className="bwm-btnTeal">Text for a fleet quote</a>
            <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineLight">Call {config.phone}</a>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="fleet-ops">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Why operators buy here</p>
            <h2 id="fleet-ops" className="bwm-h2">Built for operators, <em>not just owners.</em></h2>
          </header>
          <ul className="bwm-tiers" role="list" aria-label="Fleet pricing tiers">
            {TIERS.map(([n, unit, label]) => (
              <li key={n}><strong>{n}</strong><span>{unit}</span><em>{label}</em></li>
            ))}
          </ul>
          <ul className="bwm-services bwm-services--2" role="list">
            {OPERATORS.map(([k, v]) => (
              <li key={k}><h3>{k}</h3><p>{v}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="fleet-new">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--row">
            <div>
              <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />In stock now</p>
              <h2 id="fleet-new" className="bwm-h2">Available new <em>fleet boats.</em></h2>
            </div>
            <Link href="/berkshire/" className="bwm-textLink">See all Berkshire inventory <Arrow /></Link>
          </header>
          {newFleet.length ? (
            <BoatGrid boats={newFleet} />
          ) : (
            <p className="bwm-lede">No new fleet boats are listed right now. Text us what you need and we’ll put together a quote.</p>
          )}
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="fleet-cycle">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Plan it, don’t react to it</p>
            <h2 id="fleet-cycle" className="bwm-h2">How the fleet <em>cycle works.</em></h2>
            <p className="bwm-lede">
              Most operators run a boat two to three seasons, then move it on while it still carries strong resale value and before maintenance costs
              climb. We help you plan that cycle instead of reacting to it.
            </p>
            <ol className="bwm-steps" role="list">
              {CYCLE.map(([k, v], i) => (
                <li key={k}><span className="bwm-stepNum">{i + 1}</span><span><strong>{k}</strong> {v}</span></li>
              ))}
            </ol>
            <h3 className="bwm-h3">We’d rather you get retail than wholesale</h3>
            <p className="bwm-lede">
              Most dealers want your trade cheap. We’d rather see you sell that boat at retail, because a fleet boat that retails well almost always
              returns more than one absorbed at wholesale — and that’s your margin, not ours. So we’ll support you selling it yourself, take it on
              consignment and do the work for you, or make you a favorable trade on the upgrade when that’s genuinely the cleaner deal.
            </p>
            <p className="bwm-lede">
              The point is maximum dollar out for dollar in, and a fleet fresh enough that renters keep choosing you over the operation down the lake.
            </p>
          </div>
          <figure className="bwm-tallFigure">
            <Image src={pontoon} alt="A red rental pontoon beached on a Lake Texoma shoreline" fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
            <figcaption>Two to three seasons in the fleet, then on to a new owner.</figcaption>
          </figure>
        </div>
      </section>

      <section id="used-rental" className="bwm-section bwm-foam" aria-labelledby="fleet-used">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Anyone can buy one</p>
            <h2 id="fleet-used" className="bwm-h2">Available used <em>rental boats.</em></h2>
            <p className="bwm-lede">
              Gently used fleet boats at substantially reduced prices — maintained on a commercial schedule, serviced by factory-authorized technicians,
              and priced well below comparable new models. Anyone can buy one; you don’t have to be an operator. If you’ve been pricing a first pontoon or
              a second boat for the lake house, this is usually the most boat per dollar on our lot.
            </p>
          </header>
          {usedRental.length ? (
            <BoatGrid boats={usedRental} />
          ) : (
            <p className="bwm-lede">No used rental boats are listed right now. Text us and we’ll let you know when the next ones are available.</p>
          )}
          <div className="bwm-actions">
            <a href={smsHref("Hi! I'm interested in one of your used rental boats.")} className="bwm-btnTeal">Text about a rental boat</a>
            <Link href="/inventory/" className="bwm-textLink">All boats for sale <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="fleet-who">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Who we supply</p>
            <h2 id="fleet-who" className="bwm-h2">Working boats for <em>working operations.</em></h2>
          </header>
          <ul className="bwm-chips" role="list">
            {SUPPLY.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="fleet-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Fleet questions</p>
            <h2 id="fleet-faq" className="bwm-h2">Let’s build <em>your fleet.</em></h2>
            <p className="bwm-lede">
              Tell us how many boats you run, what they do, and when you need them on the water. We’ll put together a quote — and if you’d rather talk it
              through, call and ask for fleet sales.
            </p>
            <div className="bwm-actions">
              <a href={smsHref(FLEET_TEXT)} className="bwm-btnTeal">Text for a fleet quote</a>
              <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineDark">Call {config.phone}</a>
            </div>
            <p className="bwm-fine bwm-fine--dark">Sales, Tuesday through Saturday, 9am–5pm · 50055 N State Hwy 289, Pottsboro, TX 75076</p>
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
