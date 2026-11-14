import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { money, monthlyPayment } from "@/bigwatermarine/lib/boats/format";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";
import { cms, fill, n, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

// Page copy and photos are edited in /admin (content/bigwatermarine.json → pages.boatclub).
const P = cms.pages.boatclub;

// Boat Club terms are edited in /admin (content/bigwatermarine.json → club.*).
const CLUB = {
  initiation: n(cms.club.initiation),
  returningInitiation: n(cms.club.returningInitiation),
  monthly: n(cms.club.monthly),
  minAge: n(cms.club.minAge),
  holidayFullDay: n(cms.club.holidayFullDay),
};

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: fill(P.meta.description),
  path: "/boatclub/",
  image: abs(P.images.couple.src),
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.boatclub).
const FAQS = pageFaqs("boatclub");

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
          description: fill(P.meta.schemaDescription),
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
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}><Rich text={P.hero.eyebrow} /></p>
          <h1 id="club-title" className="bwm-heroTitle">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "500ms" }}><Rich text={P.hero.script} /></p>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "600ms" }}>
            <Rich text={P.hero.lede} />
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "720ms" }}>
            <a href={config.boatClubJoinUrl} className="bwm-btnTeal">{fill(P.hero.primaryButton)}</a>
            <a href={smsHref(P.hero.textMessage)} className="bwm-btnOutlineLight">{fill(P.hero.secondaryButton)}</a>
          </div>
          <dl className="bwm-heroStats bwm-in" style={{ ["--d" as string]: "840ms" }}>
            {P.hero.stats.map((s) => (
              <div key={s.label}><dt><Rich text={s.label} /></dt><dd><Rich text={s.value} /></dd></div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── The math ── */}
      <section className="bwm-section bwm-white" aria-labelledby="club-math">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.math.kicker} /></p>
            <h2 id="club-math" className="bwm-h2 bwm-h2--xl"><Rich text={P.math.title} /></h2>
            <p className="bwm-lede"><Rich text={P.math.lede} /></p>
          </header>
          <div className="bwm-math">
            <div className="bwm-mathCard bwm-fx">
              <p className="bwm-mathLabel"><Rich text={P.math.winter.label} /></p>
              <p className="bwm-mathWas"><Rich text={P.math.winter.was} /></p>
              <p className="bwm-mathNow"><Rich text={P.math.winter.now} /><span><Rich text={P.math.winter.nowNote} /></span></p>
            </div>
            <div className="bwm-mathCard bwm-fx">
              <p className="bwm-mathLabel"><Rich text={P.math.holiday.label} /></p>
              <p className="bwm-mathWas"><Rich text={P.math.holiday.was} values={{ "club.holidayFullDay": CLUB.holidayFullDay.toLocaleString() }} /></p>
              <p className="bwm-mathNow"><Rich text={P.math.holiday.now} /><span><Rich text={P.math.holiday.nowNote} /></span></p>
            </div>
            <div className="bwm-mathCard bwm-mathCard--own bwm-fx">
              <p className="bwm-mathLabel"><Rich text={P.math.own.label} values={{ "own.price": ownPrice.toLocaleString() }} /></p>
              <p className="bwm-mathNow"><Rich text={P.math.own.now} values={{ "own.payment": money(ownPayment) }} /><span><Rich text={P.math.own.nowNote} /></span></p>
              <p className="bwm-mathVs"><Rich text={P.math.own.versus} /></p>
            </div>
          </div>
          <p className="bwm-fine bwm-center">
            <Rich text={P.math.fine} values={{ "loan.downPercent": config.loan.downPercent, "loan.apr": config.loan.apr, "loan.termYears": config.loan.termYears }} />
          </p>
        </div>
      </section>

      {/* ── Why join ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="club-why">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.why.kicker} /></p>
            <h2 id="club-why" className="bwm-h2"><Rich text={P.why.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.why.lede} />
            </p>
          </header>
          <ul className="bwm-perks" role="list">
            {P.why.perks.map((p) => (
              <li key={p.title} className="bwm-fx"><h3><Rich text={p.title} /></h3><p><Rich text={p.text} /></p></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Photo break ── */}
      <section className="bwm-section bwm-white" aria-label="Life in the club">
        <div className="bwm-wrap">
          <div className="bwm-mosaic">
            <figure className="bwm-mosaicA bwm-fx"><CmsImage image={P.images.fleet} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" /></figure>
            <figure className="bwm-mosaicB bwm-fx"><CmsImage image={P.images.couple} fill sizes="(min-width: 1024px) 34vw, 55vw" className="object-cover" /></figure>
            <figure className="bwm-mosaicC bwm-fx"><CmsImage image={P.images.family} fill sizes="(min-width: 1024px) 26vw, 45vw" className="object-cover" /></figure>
            <figure className="bwm-mosaicD bwm-fx"><CmsImage image={P.images.sunset} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" /></figure>
            <p className="bwm-script bwm-mosaicScript bwm-fx"><Rich text={P.photos.script} /></p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="club-how">
        <div className="bwm-wrap bwm-howGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.how.kicker} /></p>
            <h2 id="club-how" className="bwm-h2"><Rich text={P.how.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.how.lede} />
            </p>
            <div className="bwm-actions">
              <a href={config.boatClubJoinUrl} className="bwm-btnTeal">{fill(P.how.primaryButton)}</a>
              <Link href={P.how.compareLink.href} className="bwm-textLink">{fill(P.how.compareLink.label)} <Arrow /></Link>
            </div>
          </div>
          <ol className="bwm-howSteps" role="list">
            {P.how.steps.map((s, i) => (
              <li key={s.title} className="bwm-fx"><span className="bwm-stepNum">{i + 1}</span><div><h3><Rich text={s.title} /></h3><p><Rich text={s.text} /></p></div></li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Compare ── */}
      <section className="bwm-section bwm-white" aria-labelledby="club-compare">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.compare.kicker} /></p>
            <h2 id="club-compare" className="bwm-h2"><Rich text={P.compare.title} /></h2>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare">
              <thead>
                <tr><th scope="col"><span className="bwm-srOnly">Feature</span></th><th scope="col"><Rich text={P.compare.columns.owning} /></th><th scope="col"><Rich text={P.compare.columns.typical} /></th><th scope="col" className="bwm-us"><Rich text={P.compare.columns.us} /></th></tr>
              </thead>
              <tbody>
                {P.compare.rows.map((r) => (
                  <tr key={r.label}><th scope="row"><Rich text={r.label} /></th><td><Rich text={r.owning} /></td><td><Rich text={r.typical} /></td><td className="bwm-us"><Rich text={r.us} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="club-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" /><Rich text={P.faq.kicker} /></p>
            <h2 id="club-faq" className="bwm-h2"><Rich text={P.faq.title} /></h2>
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

      {/* ── Final call ── */}
      <section className="bwm-statement" aria-labelledby="club-final">
        <CmsImage image={P.images.final} fill sizes="100vw" className="bwm-statementImg bwm-parallax" />
        <div className="bwm-statementShade" aria-hidden />
        <div className="bwm-statementInner bwm-fx">
          <Motif className="bwm-statementMotif" lineColor="var(--bwm-teal)" barColor="rgba(255,255,255,.28)" />
          <h2 id="club-final" className="bwm-statementLine">
            <Rich text={P.final.title} />
            <span><Rich text={P.final.text} /></span>
          </h2>
          <div className="bwm-actions bwm-actions--center">
            <a href={config.boatClubJoinUrl} className="bwm-btnTeal">{fill(P.final.primaryButton)}</a>
            <Link href="/inventory/" className="bwm-btnOutlineLight">{fill(P.final.secondaryButton)}</Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white bwm-terms" aria-labelledby="club-terms">
        <div className="bwm-wrap">
          <details className="bwm-faqItem">
            <summary id="club-terms"><Rich text={P.terms.title} /></summary>
            <p><Rich text={P.terms.text} /></p>
          </details>
        </div>
      </section>
    </>
  );
}
