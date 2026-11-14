import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { REVIEWS, SERVICE_ADDONS, SERVICE_WHY, SHOP_POLICIES } from "@/bigwatermarine/lib/service";
import { abs, breadcrumbs, faqPage, pageMeta, SERVICE_ID } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import { cms, fill, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

// Page copy and photos are edited in /admin (content/bigwatermarine.json → pages.service).
const P = cms.pages.service;

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: "/service/",
  image: abs(P.images.hero.src),
});

const SERVICES = P.services.items;

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.service).
const FAQS = pageFaqs("service");

export default function ServicePage() {
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": abs("/service/#service"),
          name: "Marine service and boat repair",
          serviceType: "Boat repair and maintenance",
          provider: { "@id": SERVICE_ID },
          areaServed: ["Lake Texoma", "Pottsboro", "Sherman", "Denison", "North Texas", "Southern Oklahoma"].map((name) => ({ "@type": "Place", name })),
          url: abs("/service/"),
          potentialAction: { "@type": "ReserveAction", target: config.windlassIntakeUrl, name: P.hero.primaryButton },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Marine services",
            itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, description: s.text } })),
          },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Service" }]),
        faqPage(FAQS, "/service/"),
      ]} />

      {/* ── Hero ── */}
      <section className="bwm-hero bwm-hero--service" aria-labelledby="svc-title">
        <div className="bwm-heroMedia">
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg bwm-heroImg--svc" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="svc-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "500ms" }}>
            <Rich text={P.hero.lede} />
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "620ms" }}>
            <a href={config.windlassIntakeUrl} className="bwm-btnTeal">{P.hero.primaryButton}</a>
            <a href={smsHref(P.hero.textMessage)} className="bwm-btnOutlineLight">{P.hero.secondaryButton}</a>
          </div>
          <p className="bwm-heroMeta bwm-in" style={{ ["--d" as string]: "740ms" }}>
            {P.hero.details}
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bwm-section bwm-white" aria-labelledby="svc-how">
        <div className="bwm-wrap bwm-howGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.how.kicker}</p>
            <h2 id="svc-how" className="bwm-h2"><Rich text={P.how.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.how.lede} />
            </p>
            <div className="bwm-actions">
              <a href={config.windlassIntakeUrl} className="bwm-btnTeal">{P.how.button}</a>
              <a href={`tel:${config.phoneE164}`} className="bwm-textLink">{fill(P.how.callLink, { phone: config.phone })} <Arrow /></a>
            </div>
          </div>
          <ol className="bwm-howSteps" role="list">
            {P.how.steps.map((step, n) => (
              <li key={step.title} className="bwm-fx"><span className="bwm-stepNum">{n + 1}</span><div><h3>{step.title}</h3><p><Rich text={step.text} /></p></div></li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Factory-authorized ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="svc-auth">
        <div className="bwm-wrap bwm-splitGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.authorized.kicker}</p>
            <h2 id="svc-auth" className="bwm-h2"><Rich text={P.authorized.title} /></h2>
            {P.authorized.paragraphs.map((text) => (
              <p key={text} className="bwm-lede">
                <Rich text={text} />
              </p>
            ))}
            <ul className="bwm-engineList" role="list">
              {P.authorized.engines.map((e) => <li key={e}>{e}</li>)}
            </ul>
            <ul className="bwm-checks" role="list">
              {P.authorized.checks.map((x) => <li key={x}><Rich text={x} /></li>)}
            </ul>
          </div>
          <figure className="bwm-tallFigure bwm-fx">
            <CmsImage image={P.images.team} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <figcaption><Rich text={P.authorized.caption} /></figcaption>
          </figure>
        </div>
      </section>

      {/* ── What we do ── */}
      <section className="bwm-section bwm-white" aria-labelledby="svc-what">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.services.kicker}</p>
            <h2 id="svc-what" className="bwm-h2"><Rich text={P.services.title} /></h2>
          </header>
          <ul className="bwm-services" role="list">
            {SERVICES.map((s) => (
              <li key={s.name} className="bwm-fx">
                <span className="bwm-serviceTag">{s.tag}</span>
                <h3>{s.name}</h3>
                <p><Rich text={s.text} /></p>
                {s.link && <Link href={s.link} className="bwm-textLink">{P.services.linkLabel} <Arrow /></Link>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Shop or mobile ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="svc-where">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.where.kicker}</p>
            <h2 id="svc-where" className="bwm-h2"><Rich text={P.where.title} /></h2>
          </header>
          <div className="bwm-twoUp">
            <div className="bwm-option bwm-fx">
              <h3>{P.where.shop.title}</h3>
              <p className="bwm-optionPrice"><Rich text={P.where.shop.price} /><span>{P.where.shop.priceUnit}</span></p>
              <ul className="bwm-checks" role="list">
                {P.where.shop.checks.map((x) => <li key={x}><Rich text={x} /></li>)}
              </ul>
              <p className="bwm-optionMeta"><Rich text={P.where.shop.details} /></p>
            </div>
            <div className="bwm-option bwm-option--hi bwm-fx">
              <span className="bwm-serviceTag">{P.where.mobile.tag}</span>
              <h3>{P.where.mobile.title}</h3>
              <p className="bwm-optionPrice"><Rich text={P.where.mobile.price} /><span>{P.where.mobile.priceUnit}</span></p>
              <ul className="bwm-checks" role="list">
                {P.where.mobile.checks.map((x) => <li key={x}><Rich text={x} /></li>)}
              </ul>
              <p className="bwm-optionMeta"><Rich text={P.where.mobile.details} /></p>
            </div>
          </div>
          <div className="bwm-actions bwm-actions--center">
            <a href={config.windlassIntakeUrl} className="bwm-btnTeal">{P.where.button}</a>
          </div>
        </div>
      </section>

      {/* ── Why Big Water ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="svc-whyus">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.why.kicker}</p>
            <h2 id="svc-whyus" className="bwm-h2"><Rich text={P.why.title} /></h2>
            <p className="bwm-lede"><Rich text={P.why.lede} /></p>
          </header>
          <ul className="bwm-perks" role="list">
            {SERVICE_WHY.map((w) => <li key={w.title}><h3>{w.title}</h3><p>{w.body}</p></li>)}
          </ul>
          <div className="bwm-menuGrid bwm-mt">
            <div>
              <h3 className="bwm-h3">{P.why.addonsTitle}</h3>
              <ul className="bwm-checks" role="list">{SERVICE_ADDONS.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="bwm-notes">
              <h3 className="bwm-h3">{P.why.notesTitle}</h3>
              <ul role="list">{SHOP_POLICIES.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bwm-section bwm-white" aria-labelledby="svc-reviews">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.reviews.kicker}</p>
            <h2 id="svc-reviews" className="bwm-h2"><Rich text={P.reviews.title} /></h2>
          </header>
          <ul className="bwm-reviews" role="list">
            {REVIEWS.map((r) => (
              <li key={r.name} className="bwm-fx">
                <blockquote><p>&ldquo;{r.text}&rdquo;</p></blockquote>
                <p className="bwm-reviewBy"><span aria-label="5 out of 5 stars">★★★★★</span> {r.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Winterize callout ── */}
      <section className="bwm-statement" aria-labelledby="svc-winter">
        <CmsImage image={P.images.winter} fill sizes="100vw" className="bwm-statementImg bwm-parallax" />
        <div className="bwm-statementShade" aria-hidden />
        <div className="bwm-statementInner bwm-fx">
          <p className="bwm-script bwm-statementScript">{P.winter.script}</p>
          <h2 id="svc-winter" className="bwm-statementLine">
            <Rich text={P.winter.title} />
            <span><Rich text={P.winter.text} /></span>
          </h2>
          <div className="bwm-actions bwm-actions--center">
            <Link href="/winterize/" className="bwm-btnTeal">{P.winter.button}</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="svc-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.faq.kicker}</p>
            <h2 id="svc-faq" className="bwm-h2"><Rich text={P.faq.title} /></h2>
            <p className="bwm-lede"><Rich text={P.faq.lede} /></p>
            <div className="bwm-actions">
              <a href={smsHref(P.faq.textMessage)} className="bwm-btnTeal">{fill(P.faq.button, { phone: config.phone })}</a>
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
