import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import { cms, fill } from "@/bigwatermarine/lib/cms";

// Page copy and photos are edited in /admin (content/bigwatermarine.json → pages.about).
const P = cms.pages.about;
const V = { phone: config.phone, phoneE164: config.phoneE164, email: config.email };

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: "/about/",
  image: abs(P.images.team.src),
});

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
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">About</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="about-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "420ms" }}>{P.hero.script}</p>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "520ms" }}>
            <Rich text={P.hero.lede} />
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="about-what">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.whatWeDo.kicker}</p>
            <h2 id="about-what" className="bwm-h2"><Rich text={P.whatWeDo.title} /></h2>
          </header>
          <ul className="bwm-services" role="list">
            {P.whatWeDo.items.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p><Rich text={item.text} /></p>
                <Link href={item.href} className="bwm-textLink">{item.link} <Arrow /></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="about-team">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.mission.kicker}</p>
            <h2 id="about-team" className="bwm-h2"><Rich text={P.mission.title} /></h2>
            {P.mission.paragraphs.map((text) => (
              <p key={text} className="bwm-lede">
                <Rich text={text} />
              </p>
            ))}
          </div>
          <figure className="bwm-tallFigure">
            <CmsImage image={P.images.team} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <figcaption><Rich text={P.mission.caption} /></figcaption>
          </figure>
        </div>
      </section>

      <section id="find-us" className="bwm-section bwm-white" aria-labelledby="about-where">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.findUs.kicker}</p>
            <h2 id="about-where" className="bwm-h2"><Rich text={P.findUs.title} /></h2>
          </header>
          <div className="bwm-twoUp">
            {[P.findUs.sales, P.findUs.service].map((loc) => (
              <div key={loc.title} className="bwm-option">
                <h3>{loc.title}</h3>
                <p className="bwm-optionMeta">{loc.address}<br />{loc.hours}</p>
                <p className="bwm-optionMeta"><Rich text={loc.email} values={V} /></p>
                <div className="bwm-actions"><a href={loc.directionsHref} className="bwm-textLink">{loc.directionsLink} <Arrow /></a></div>
              </div>
            ))}
          </div>
          <div className="bwm-actions">
            <a href={`tel:${config.phoneE164}`} className="bwm-btnTeal">{fill(P.findUs.callButton, V)}</a>
            <a href={smsHref("Hi Big Water Marine!")} className="bwm-btnOutlineDark">{fill(P.findUs.textButton, V)}</a>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="about-related">
        <div className="bwm-wrap bwm-splitGrid">
          <figure className="bwm-tallFigure bwm-tallFigure--wide">
            <CmsImage image={P.images.fleet} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </figure>
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.related.kicker}</p>
            <h2 id="about-related" className="bwm-h2"><Rich text={P.related.title} /></h2>
            <ul className="bwm-related" role="list">
              {P.related.items.map(({ name, text, href }) => (
                <li key={name}>
                  {href.startsWith("http") ? <a href={href} className="bwm-relatedName">{name}</a> : <Link href={href} className="bwm-relatedName">{name}</Link>}
                  <span> &mdash; {text}</span>
                </li>
              ))}
            </ul>
            <p className="bwm-lede"><Rich text={P.related.closing} values={V} /></p>
          </div>
        </div>
      </section>
    </>
  );
}
