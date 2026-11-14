import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { BRAND_REVIEWS } from "@/bigwatermarine/lib/brands";
import { abs, breadcrumbs, faqPage, pageMeta } from "@/bigwatermarine/lib/seo";
import RentJoinOwn from "./RentJoinOwn";
import { cms, fill, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

// Page copy and photos are edited in /admin (content/bigwatermarine.json → pages.keepboating).
// The calculator's formula and labels stay in RentJoinOwn.tsx.
const P = cms.pages.keepboating;

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: fill(P.meta.description),
  path: "/keepboating/",
  image: abs(P.images.hero.src),
});

const FLEET = "/fleet-sales/";
const CLUB = "/boatclub/";
const INVENTORY = "/inventory/";

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.keepboating).
const FAQS = pageFaqs("keepboating");

export default function KeepBoatingPage() {
  const reviews = [...P.reviews.rental, ...BRAND_REVIEWS.map((r) => ({ name: fill(P.reviews.brandReviewName, { name: r.name }), text: r.text }))];

  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": abs("/keepboating/#page"),
          url: abs("/keepboating/"),
          name: P.meta.title,
          description: fill(P.meta.schemaDescription),
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Keep Boating" }]),
        faqPage(FAQS, "/keepboating/"),
      ]} />

      <section className="bwm-hero" aria-labelledby="kb-title">
        <div className="bwm-heroMedia">
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}><Rich text={P.hero.eyebrow} /></p>
          <h1 id="kb-title" className="bwm-heroTitle">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "460ms" }}><Rich text={P.hero.script} /></p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <Link href={FLEET} className="bwm-btnTeal">{fill(P.hero.buttons.buyRental)}</Link>
            <Link href={CLUB} className="bwm-btnOutlineLight">{fill(P.hero.buttons.joinClub)}</Link>
            <Link href={INVENTORY} className="bwm-btnOutlineLight">{fill(P.hero.buttons.buyNew)}</Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="kb-memories">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.memories.kicker} /></p>
            <h2 id="kb-memories" className="bwm-h2"><Rich text={P.memories.title} /></h2>
          </header>
          <ul className="bwm-memories" role="list">
            {P.memories.photos.map((m) => (
              <li key={m.caption}>
                <figure>
                  <div className="bwm-memoryImg"><CmsImage image={m.image} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" /></div>
                  <figcaption><Rich text={m.caption} /></figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="bwm-script bwm-pullQuote"><Rich text={P.memories.quote} /></p>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="kb-options">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.options.kicker} /></p>
            <h2 id="kb-options" className="bwm-h2"><Rich text={P.options.title} /></h2>
          </header>
          <ul className="bwm-optionCards" role="list">
            {P.options.cards.map((o) => (
              <li key={o.title}>
                <div className="bwm-optionCardImg"><CmsImage image={o.image} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" /></div>
                <div className="bwm-optionCardBody">
                  <h3><Rich text={o.title} /></h3>
                  {o.subtitle ? <p className="bwm-optionCardSub"><Rich text={o.subtitle} /></p> : null}
                  <ul className="bwm-checks" role="list">{o.points.map((p) => <li key={p}><Rich text={p} /></li>)}</ul>
                  <Link href={o.href} className="bwm-btnTeal">{fill(o.button)}</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="calculator" className="bwm-section bwm-white" aria-labelledby="kb-math">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.calculator.kicker} /></p>
            <h2 id="kb-math" className="bwm-h2"><Rich text={P.calculator.title} /></h2>
            <p className="bwm-lede"><Rich text={P.calculator.lede} /></p>
          </header>
          <div className="bwm-panel">
            <RentJoinOwn fleetHref={FLEET} clubHref={CLUB} inventoryHref={INVENTORY} />
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="kb-reviews">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.reviews.kicker} /></p>
            <h2 id="kb-reviews" className="bwm-h2"><Rich text={P.reviews.title} /></h2>
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
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.faq.kicker} /></p>
            <h2 id="kb-faq" className="bwm-h2"><Rich text={P.faq.title} /></h2>
            <p className="bwm-lede"><Rich text={P.faq.lede} /></p>
            <div className="bwm-actions"><a href={smsHref(P.faq.textMessage)} className="bwm-btnTeal">{fill(P.faq.button, { phone: config.phone })}</a></div>
          </div>
          <div className="bwm-faq">
            {FAQS.map((f) => <details key={f.q} className="bwm-faqItem"><summary>{f.q}</summary><p>{f.a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="bwm-statement" aria-labelledby="kb-final">
        <CmsImage image={P.images.final} fill sizes="100vw" className="bwm-statementImg bwm-parallax" />
        <div className="bwm-statementShade" aria-hidden />
        <div className="bwm-statementInner">
          <Motif className="bwm-statementMotif" lineColor="var(--bwm-teal)" barColor="rgba(255,255,255,.28)" />
          <h2 id="kb-final" className="bwm-statementLine">
            <Rich text={P.final.title} />
            <span>
              <Rich text={P.final.text} />
            </span>
          </h2>
          <div className="bwm-actions bwm-actions--center">
            <Link href={FLEET} className="bwm-btnTeal">{fill(P.final.buttons.buyRental)}</Link>
            <Link href={CLUB} className="bwm-btnOutlineLight">{fill(P.final.buttons.joinClub)}</Link>
            <Link href={INVENTORY} className="bwm-btnOutlineLight">{fill(P.final.buttons.buyNew)}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
