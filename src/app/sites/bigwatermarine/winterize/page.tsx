import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { ADD_ONS, INSPECTION_POINTS, OUTBOARD_MENU, SHOP_POLICIES, WINTER_DETAILING, WINTER_NOTES, WINTER_PACKAGES } from "@/bigwatermarine/lib/service";
import { abs, breadcrumbs, faqPage, pageMeta, SERVICE_ID } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";
import Packages from "./Packages";

import hero from "@public/media/winter-shrinkwrap-row.webp";
import heatWrap from "@public/media/winter-shrinkwrap-heat.webp";
import antifreeze from "@public/media/winter-antifreeze.webp";
import { faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

export const metadata: Metadata = pageMeta({
  title: "Boat Winterization on Lake Texoma | Guaranteed, From $335",
  description:
    "Guaranteed boat winterization in Pottsboro, TX and mobile around Lake Texoma. Packages from $335 (FreezeGuard) to $1,750 (SecurePro with shrink wrap, 6 months storage and spring startup). Outboard and PWC winterization from $165.",
  path: "/winterize/",
  image: abs("/bigwatermarine/media/winter-shrinkwrap-row.webp"),
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.winterize).
const FAQS = pageFaqs("winterize");

export default function WinterizePage() {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": abs("/winterize/#service"),
          name: "Guaranteed boat winterization",
          serviceType: "Boat winterization",
          provider: { "@id": SERVICE_ID },
          areaServed: { "@type": "Place", name: "Lake Texoma" },
          url: abs("/winterize/"),
          potentialAction: { "@type": "ReserveAction", target: config.windlassIntakeUrl, name: "Book winterization" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Winterization packages",
            itemListElement: WINTER_PACKAGES.map((p) => ({
              "@type": "Offer",
              name: p.name,
              description: `${p.tagline}. ${[p.builds, ...p.includes].filter(Boolean).join(" ")}`,
              price: String(p.onsite),
              priceCurrency: "USD",
              itemOffered: { "@type": "Service", name: `${p.name} winterization` },
            })),
          },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Service", path: "/service/" }, { name: "Winterization" }]),
        faqPage(FAQS, "/winterize/"),
      ]} />

      {/* ── Hero ── */}
      <section className="bwm-hero bwm-hero--winter" aria-labelledby="win-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="A row of shrink-wrapped boats on trailers in winter storage" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Boat winterization · Lake Texoma</p>
          <h1 id="win-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Winterize once.</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>Relax all winter.</em></span>
          </h1>
          <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "460ms" }}>It&rsquo;s that time</p>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "560ms" }}>
            <strong>Professional, guaranteed winterization from Texoma&rsquo;s most trusted marine team.</strong> If your engine doesn&rsquo;t start
            in spring due to our winterization process, we&rsquo;ll make it right at no charge. Limited appointments available &mdash; book today and get on the schedule.
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "680ms" }}>
            <a href={config.windlassIntakeUrl} className="bwm-btnTeal">Book winterization</a>
            <a href={smsHref("Hi! I'd like to get my boat winterized.")} className="bwm-btnOutlineLight">Text us</a>
          </div>
        </div>
      </section>

      {/* ── Why ── */}
      <section className="bwm-section bwm-white" aria-labelledby="win-why">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Why winterize</p>
            <h2 id="win-why" className="bwm-h2">Don&rsquo;t let winter <em>cost you thousands.</em></h2>
            <p className="bwm-lede">
              Frozen engines, cracked manifolds, and lack of service cost boaters thousands every spring&hellip; and ruin the fun. Protect your vessel
              before temperatures drop. Texas ranks #1 nationally for freeze-damage insurance claims (GEICO and BoatUS data).
            </p>
          </header>
          <ul className="bwm-proof bwm-proof--3" role="list">
            <li className="bwm-fx"><span className="bwm-proofK">Freeze damage</span>Prevent cracked blocks, damaged drives, and broken tanks.</li>
            <li className="bwm-fx"><span className="bwm-proofK">Avoid costly repairs</span>Save thousands in spring engine repairs.</li>
            <li className="bwm-fx"><span className="bwm-proofK">Limited slots</span>Book before availability runs out.</li>
          </ul>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="packages" className="bwm-section bwm-foam" aria-labelledby="win-packages">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Inboard &amp; sterndrive packages</p>
            <h2 id="win-packages" className="bwm-h2">Pick your level <em>of protection.</em></h2>
            <p className="bwm-lede">Each package builds on the one before it. Prices are labor only for single-engine boats; materials are billed separately.</p>
          </header>
          <Packages packages={WINTER_PACKAGES} workOrderUrl={config.windlassIntakeUrl} />
        </div>
      </section>

      {/* ── Outboard / PWC / add-ons ── */}
      <section className="bwm-section bwm-white" aria-labelledby="win-menu">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Outboards, PWC &amp; extras</p>
            <h2 id="win-menu" className="bwm-h2">The full <em>winter menu.</em></h2>
          </header>
          <div className="bwm-menuGrid">
            <div>
              <h3 className="bwm-h3">Outboard &amp; PWC winterization</h3>
              <MenuTable items={OUTBOARD_MENU} />
            </div>
            <div>
              <h3 className="bwm-h3">Add-ons, storage &amp; spring startup</h3>
              <MenuTable items={ADD_ONS} />
            </div>
          </div>
          <div className="bwm-menuGrid bwm-mt">
            <div>
              <h3 className="bwm-h3">Additional services</h3>
              <ul className="bwm-checks" role="list">{WINTER_DETAILING.map((x) => <li key={x}>{x}</li>)}</ul>
              <figure className="bwm-wideFigure">
                <Image src={heatWrap} alt="A technician heat-shrinking white wrap over a boat for winter" fill sizes="(min-width: 1024px) 45vw, 100vw" placeholder="blur" className="object-cover object-[50%_30%]" />
                <figcaption>Shrink wrap at $25/ft, with vents and supports, done at our service center.</figcaption>
              </figure>
            </div>
            <div className="bwm-notes">
              <h3 className="bwm-h3">Important notes</h3>
              <ul role="list">{[...WINTER_NOTES, ...SHOP_POLICIES].map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inspection + guarantee ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="win-guarantee">
        <div className="bwm-wrap bwm-splitGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />The Big Water guarantee</p>
            <h2 id="win-guarantee" className="bwm-h2">If it won&rsquo;t start, <em>we make it right.</em></h2>
            <p className="bwm-lede">
              If your engine doesn&rsquo;t start in spring because of our winterization process, we fix it at no charge. Because we do the spring
              dewinterization too, we verify the whole system end to end.
            </p>
            <h3 className="bwm-h3 bwm-mt">The 20-point vessel inspection (TotalLock and SecurePro)</h3>
            <ul className="bwm-checks bwm-checks--2" role="list">{INSPECTION_POINTS.map((p) => <li key={p}>{p}</li>)}</ul>
            <div className="bwm-actions">
              <a href={config.windlassIntakeUrl} className="bwm-btnTeal">Book winterization</a>
              <Link href="/service/" className="bwm-textLink">All marine services <Arrow /></Link>
            </div>
          </div>
          <figure className="bwm-tallFigure bwm-fx">
            <Image src={antifreeze} alt="A technician pouring non-toxic antifreeze into a boat engine" fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
            <figcaption>Drain, fog, stabilize and fill with non-toxic antifreeze, done right.</figcaption>
          </figure>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bwm-section bwm-white" aria-labelledby="win-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Straight answers</p>
            <h2 id="win-faq" className="bwm-h2">Winterization <em>questions.</em></h2>
            <p className="bwm-lede">Not sure which package fits your boat? Text us the year, make and engine and we&rsquo;ll tell you.</p>
            <div className="bwm-actions">
              <a href={smsHref("Hi! Which winterization package fits my boat? It's a ")} className="bwm-btnTeal">Text {config.phone}</a>
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
    </>
  );
}

function MenuTable({ items }: { items: { name: string; hours: string; onsite: string; mobile?: string; note: string }[] }) {
  return (
    <ul className="bwm-menuList" role="list">
      {items.map((m) => (
        <li key={m.name}>
          <div className="bwm-menuHead">
            <span className="bwm-menuName">{m.name}</span>
            <span className="bwm-menuPrice">{m.onsite}{m.mobile && <small> · mobile {m.mobile}</small>}</span>
          </div>
          <p>{m.note} <span className="bwm-menuHours">({m.hours})</span></p>
        </li>
      ))}
    </ul>
  );
}
