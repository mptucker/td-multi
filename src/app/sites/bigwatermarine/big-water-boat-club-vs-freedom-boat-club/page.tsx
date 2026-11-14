import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import { cms, fill, n } from "@/bigwatermarine/lib/cms";

// Page copy, comparison table and photos are edited in /admin
// (content/bigwatermarine.json → pages.clubVsFreedom).
const P = cms.pages.clubVsFreedom;

const PATH = "/big-water-boat-club-vs-freedom-boat-club/";

export const metadata: Metadata = pageMeta({
  title: P.meta.title,
  description: P.meta.description,
  path: PATH,
  image: abs(P.images.hero.src),
});

// The FAQ answers reuse the page's own paragraphs.
const FAQS = [
  { q: P.faq.costQuestion, a: P.cost.text },
  { q: P.faq.localQuestion, a: P.local.text },
  { q: P.faq.availabilityQuestion, a: `${P.availability.paragraphs[0]} ${P.availability.paragraphs[1]}` },
];

const JUMP = [
  ["#cost", P.hero.jumpLinks.cost],
  ["#local", P.hero.jumpLinks.local],
  ["#availability", P.hero.jumpLinks.availability],
  ["#comparison", P.hero.jumpLinks.comparison],
];

// Rows where "No" is the good answer.
const NO_IS_GOOD = new Set(["Restrictions", "Black out dates", "Long-term commitment"]);

function Mark({ v, row }: { v: string; row: string }) {
  if (v !== "Yes" && v !== "No") return <>{v}</>;
  const good = (v === "Yes") !== NO_IS_GOOD.has(row);
  return <><span aria-hidden className={good ? "bwm-yes" : "bwm-no"}>{good ? "✓" : "✕"}</span> {v}</>;
}

export default function ClubVsFreedomPage() {
  const chart = P.cost.chart;
  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": abs(`${PATH}#article`),
          headline: P.article.headline,
          description: P.article.description,
          url: abs(PATH),
          image: abs(P.images.hero.src),
          author: { "@id": ORG_ID },
          publisher: { "@id": ORG_ID },
          about: [{ "@type": "Organization", name: "Big Water Boat Club" }, { "@type": "Organization", name: "Freedom Boat Club" }],
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Boat Club", path: "/boatclub/" }, { name: "Big Water vs Freedom Boat Club" }]),
        faqPage(FAQS, PATH),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="vs-title">
        <div className="bwm-heroMedia">
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li><Link href="/boatclub/">Boat Club</Link></li><li aria-current="page">vs Freedom Boat Club</li></ol></nav>
          <CmsImage image={P.images.vsMark} className="bwm-vsMark bwm-in" style={{ ["--d" as string]: "60ms" }} sizes="320px" />
          <h1 id="vs-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            <Rich text={P.hero.lede} />
          </p>
          <nav aria-label="On this page" className="bwm-jump bwm-in" style={{ ["--d" as string]: "600ms" }}>
            {JUMP.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          </nav>
        </div>
      </section>

      <section id="cost" className="bwm-section bwm-white" aria-labelledby="vs-cost">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.cost.kicker}</p>
            <h2 id="vs-cost" className="bwm-h2"><Rich text={P.cost.title} /></h2>
            <p className="bwm-lede"><Rich text={P.cost.text} /></p>
            <CmsImage image={P.images.cost} className="bwm-cutout" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          <figure className="bwm-priceChart" aria-labelledby="vs-chart-cap">
            <p className="bwm-priceChartBig"><span>{chart.before}</span> {chart.multiple} <small>{chart.after}</small></p>
            <div className="bwm-priceBars" role="img" aria-label={`Big Water Boat Club about ${chart.usAmount} a year versus Freedom Boat Club about ${chart.themAmount} a year, based on eight half-day rentals`}>
              <div className="bwm-priceBar bwm-priceBar--us" style={{ ["--h" as string]: `${(n(chart.usAmount) / n(chart.themAmount, 1)) * 100}%` }}>
                <strong>{chart.usAmount}</strong><span>{chart.usLabel}</span>
              </div>
              <div className="bwm-priceBar bwm-priceBar--them" style={{ ["--h" as string]: "100%" }}>
                <strong>{chart.themAmount}</strong><span>{chart.themLabel}</span>
              </div>
            </div>
            <figcaption id="vs-chart-cap">{chart.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section id="local" className="bwm-section bwm-foam" aria-labelledby="vs-local">
        <div className="bwm-wrap bwm-splitGrid">
          <CmsImage image={P.images.local} className="bwm-cutout" sizes="(min-width: 1024px) 45vw, 100vw" />
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.local.kicker}</p>
            <h2 id="vs-local" className="bwm-h2"><Rich text={P.local.title} /></h2>
            <p className="bwm-lede"><Rich text={P.local.text} /></p>
          </div>
        </div>
      </section>

      <section id="comparison" className="bwm-section bwm-white" aria-labelledby="vs-table">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.comparison.kicker}</p>
            <h2 id="vs-table" className="bwm-h2"><Rich text={P.comparison.title} /></h2>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare bwm-compare--vs">
              <thead>
                <tr><th scope="col"><span className="bwm-srOnly">Feature</span></th><th scope="col" className="bwm-us">{P.comparison.usHeader}</th><th scope="col">{P.comparison.themHeader}</th></tr>
              </thead>
              <tbody>
                {P.comparison.rows.map((r) => (
                  <tr key={r.feature}>
                    <th scope="row">{r.feature}</th>
                    <td className="bwm-us"><Mark v={r.us} row={r.feature} /></td>
                    <td><Mark v={r.them} row={r.feature} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="bwm-fine bwm-fine--dark">
            <Rich text={P.comparison.footnote} />
          </p>
          <div className="bwm-actions">
            <a href={config.boatClubJoinUrl} className="bwm-btnTeal">{P.comparison.joinButton}</a>
            <Link href={P.comparison.learnMore.href} className="bwm-textLink">{P.comparison.learnMore.label} <Arrow /></Link>
          </div>
        </div>
      </section>

      <section id="availability" className="bwm-section bwm-foam" aria-labelledby="vs-avail">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.availability.kicker}</p>
            <h2 id="vs-avail" className="bwm-h2"><Rich text={P.availability.title} /></h2>
            {P.availability.paragraphs.map((p) => <p key={p.slice(0, 20)} className="bwm-lede"><Rich text={p} /></p>)}
          </div>
          <CmsImage image={P.images.availability} className="bwm-cutout bwm-cutout--tall" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="vs-ask">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.questions.kicker}</p>
            <h2 id="vs-ask" className="bwm-h2"><Rich text={P.questions.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.questions.lede} values={{ phoneE164: config.phoneE164 }} />
            </p>
            <p className="bwm-optionMeta"><Rich text={P.questions.optionsIntro} /></p>
            <ul className="bwm-askList" role="list">
              {P.questions.options.map((a) => (
                <li key={a}><a href={smsHref(fill(P.questions.textMessage, { option: a }))} className="bwm-btnOutlineDark">{a}</a></li>
              ))}
            </ul>
            <p className="bwm-fine bwm-fine--dark">{P.questions.privacy}</p>
          </div>
          <CmsImage image={P.images.questions} className="bwm-cutout" sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>
      </section>
    </>
  );
}
