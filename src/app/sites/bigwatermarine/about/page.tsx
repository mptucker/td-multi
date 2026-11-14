import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/texoma-sunset.webp";
import team from "@public/media/service-team.webp";
import fleet from "@public/media/club-fleet.webp";

export const metadata: Metadata = pageMeta({
  title: "About Us | Pottsboro, TX on Lake Texoma",
  description:
    "Big Water Marine is a new and used boat dealership and full-service marine center in Pottsboro, Texas, on Lake Texoma: Berkshire, Veranda, Scout and Highfield boats, factory-authorized Mercury, Yamaha, Suzuki and BRP service, and Big Water Boat Club.",
  path: "/about/",
  image: abs("/bigwatermarine/media/service-team.webp"),
});

const WHAT = [
  ["Sell boats.", "New Berkshire, Veranda, Scout and Highfield models, plus used and brokerage inventory that rotates through the lot.", "/inventory/", "Shop boats"],
  ["Service them.", "Factory-authorized for Mercury, Yamaha, Suzuki and BRP. Same-day service for routine work, mobile service to your dock, repowers, marine audio, winterization and storage.", "/service/", "Marine service"],
  ["Keep people boating.", "Big Water Boat Club and rentals exist for people who want the water without the ownership.", "/keepboating/", "Rent, join or own"],
  ["Supply operators.", "We sell fleet and rental boats to marinas, resorts and rental companies, and service their fleets at the dock.", "/fleet-sales/", "Fleet sales"],
];

const RELATED = [
  ["Big Water Boat Club", "membership boating on Lake Texoma.", "/boatclub/"],
  ["TowBoatUS North Texas / Big Water Cowboys", "24/7 on-water towing and salvage on Lake Texoma, Bois d’Arc and Cedar Creek.", "https://towboatusntx.com"],
  ["Texoma Destinations", "lodging, rentals and things to do around the lake.", "https://texomadestinations.com"],
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": abs("/about/#page"),
          url: abs("/about/"),
          name: "About Big Water Marine",
          about: { "@id": ORG_ID },
          mainEntity: { "@id": ORG_ID },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "About" }]),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="about-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="Sunset over Lake Texoma's wooded shoreline" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">About</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Who we are</p>
          <h1 id="about-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>About</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>Big Water Marine.</em></span>
          </h1>
          <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "420ms" }}>Welcome to the family</p>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "520ms" }}>
            Big Water Marine is a new and used boat dealership and full-service marine center in Pottsboro, Texas, on Lake Texoma. It sells Berkshire and
            Veranda pontoons, Scout center consoles and Highfield RIBs, runs a factory-authorized service department for Mercury, Yamaha, Suzuki and BRP,
            and operates Big Water Boat Club.
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="about-what">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />What we do</p>
            <h2 id="about-what" className="bwm-h2">Premium boats. Superior service. <em>Genuine care.</em></h2>
          </header>
          <ul className="bwm-services" role="list">
            {WHAT.map(([k, v, href, label]) => (
              <li key={k}>
                <h3>{k}</h3>
                <p>{v}</p>
                <Link href={href} className="bwm-textLink">{label} <Arrow /></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="about-team">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Our mission</p>
            <h2 id="about-team" className="bwm-h2">An unrivaled experience <em>on the water.</em></h2>
            <p className="bwm-lede">
              To offer an unrivaled customer experience through the world of boating, setting new standards for excellence and enjoyment on the water.
            </p>
            <p className="bwm-lede">
              We serve Lake Texoma, Pottsboro, Denison, Sherman, Durant, and the wider North Texas and Southern Oklahoma area.
            </p>
          </div>
          <figure className="bwm-tallFigure">
            <Image src={team} alt="The Big Water Marine team outside the shop in Pottsboro" fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
            <figcaption>The crew at 33 Tackle Box Dr. We&rsquo;re boaters too.</figcaption>
          </figure>
        </div>
      </section>

      <section id="find-us" className="bwm-section bwm-white" aria-labelledby="about-where">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Where to find us</p>
            <h2 id="about-where" className="bwm-h2">Two locations <em>in Pottsboro.</em></h2>
          </header>
          <div className="bwm-twoUp">
            <div className="bwm-option">
              <h3>Boat Sales</h3>
              <p className="bwm-optionMeta">50055 N State Hwy 289, Pottsboro, TX 75076<br />Tuesday–Saturday, 9am–5pm</p>
              <p className="bwm-optionMeta">Sales email: <a href="mailto:sales@bigwatermarine.com" className="bwm-inlineLink">sales@bigwatermarine.com</a></p>
              <div className="bwm-actions"><a href="https://maps.google.com/?q=50055+N+State+Hwy+289+Pottsboro+TX+75076" className="bwm-textLink">Get directions <Arrow /></a></div>
            </div>
            <div className="bwm-option">
              <h3>Service Center</h3>
              <p className="bwm-optionMeta">33 Tackle Box Dr, Pottsboro, TX 75076<br />Tuesday–Friday 8am–5pm, Saturday 8am–3pm</p>
              <p className="bwm-optionMeta">Service email: <a href={`mailto:${config.email}`} className="bwm-inlineLink">{config.email}</a></p>
              <div className="bwm-actions"><a href="https://maps.google.com/?q=33+Tackle+Box+Dr+Pottsboro+TX+75076" className="bwm-textLink">Get directions <Arrow /></a></div>
            </div>
          </div>
          <div className="bwm-actions">
            <a href={`tel:${config.phoneE164}`} className="bwm-btnTeal">Call {config.phone}</a>
            <a href={smsHref("Hi Big Water Marine!")} className="bwm-btnOutlineDark">Text {config.phone}</a>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="about-related">
        <div className="bwm-wrap bwm-splitGrid">
          <figure className="bwm-tallFigure bwm-tallFigure--wide">
            <Image src={fleet} alt="The Big Water Boat Club fleet running in formation on Lake Texoma" fill sizes="(min-width: 1024px) 45vw, 100vw" placeholder="blur" className="object-cover" />
          </figure>
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />The Big Water family</p>
            <h2 id="about-related" className="bwm-h2">Related businesses <em>on Lake Texoma.</em></h2>
            <ul className="bwm-related" role="list">
              {RELATED.map(([k, v, href]) => (
                <li key={k}>
                  {href.startsWith("http") ? <a href={href} className="bwm-relatedName">{k}</a> : <Link href={href} className="bwm-relatedName">{k}</Link>}
                  <span> &mdash; {v}</span>
                </li>
              ))}
            </ul>
            <p className="bwm-lede">Come see us in Pottsboro, or call <a href={`tel:${config.phoneE164}`} className="bwm-inlineLink">{config.phone}</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
