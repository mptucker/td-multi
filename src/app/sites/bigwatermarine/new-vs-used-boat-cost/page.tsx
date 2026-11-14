import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { WINTER_PACKAGES } from "@/bigwatermarine/lib/service";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import { cms, fill, n, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

// Page copy, photos and rates are edited in /admin (content/bigwatermarine.json → pages.newVsUsed).
const P = cms.pages.newVsUsed;

const PATH = "/new-vs-used-boat-cost/";
const UPDATED = "2026-09-10";

// Published rates used throughout this page.
const WRAP_PER_FT = n(P.rates.wrapPerFoot, 25);
const STORAGE_PER_FT_MONTH = n(P.rates.storagePerFootMonth, 2);
const STORAGE_MONTHS = n(P.rates.storageMonths, 6);
const FREEZEGUARD = WINTER_PACKAGES.find((p) => p.name === "FreezeGuard")?.onsite ?? 335;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

// {wrap}, {storage}, {months} and {freezeGuard} in the page copy.
const RATES = { wrap: WRAP_PER_FT, storage: STORAGE_PER_FT_MONTH, months: STORAGE_MONTHS, freezeGuard: FREEZEGUARD };

const SEASON = [20, 22, 24, 26].map((ft) => {
  const wrap = ft * WRAP_PER_FT;
  const storage = ft * STORAGE_PER_FT_MONTH * STORAGE_MONTHS;
  return { ft, wrap, storage, total: wrap + storage + FREEZEGUARD };
});

export const metadata: Metadata = pageMeta({
  title: fill(P.meta.title),
  description: fill(P.meta.description),
  path: PATH,
  image: abs(P.images.hero.src),
});

// FAQs are edited in /admin (content/bigwatermarine.json → faqs.newVsUsed).
const FAQS = pageFaqs("newVsUsed");

function CaseCards({ items }: { items: { tag: string; title: string; text: string }[] }) {
  return (
    <ul className="bwm-services" role="list">
      {items.map((c) => (
        <li key={c.title}>
          <span className="bwm-serviceTag">{c.tag}</span>
          <h3>{c.title}</h3>
          <p><Rich text={c.text} /></p>
        </li>
      ))}
    </ul>
  );
}

export default function NewVsUsedPage() {
  const ex = SEASON.find((s) => s.ft === 22)!;
  const example = {
    "example.wrap": usd(ex.wrap),
    "example.storage": usd(ex.storage),
    "example.freezeGuard": usd(FREEZEGUARD),
    "example.total": usd(ex.total),
  };
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
          dateModified: UPDATED,
          author: { "@id": ORG_ID },
          publisher: { "@id": ORG_ID },
          about: { "@type": "Place", name: "Lake Texoma" },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Boats", path: "/inventory/" }, { name: "New vs used boat cost" }]),
        faqPage(FAQS, PATH),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="nvu-title">
        <div className="bwm-heroMedia">
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li><Link href="/inventory/">Boats</Link></li><li aria-current="page">New vs used</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="nvu-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            <Rich text={P.hero.lede} />
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-label="About these numbers">
        <div className="bwm-wrap">
          <p className="bwm-lede bwm-guideIntro">
            <Rich text={P.intro.text} />
          </p>
          <ul className="bwm-statRow" role="list">
            {P.intro.stats.map((s) => <li key={s.label}><strong>{fill(s.value, RATES)}</strong><span>{s.label}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="nvu-season">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.season.kicker}</p>
            <h2 id="nvu-season" className="bwm-h2"><Rich text={P.season.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.season.lede} />
            </p>
          </header>
          <h3 className="bwm-h3"><Rich text={P.season.tableTitle} /></h3>
          <p className="bwm-lede">
            <Rich text={P.season.tableIntro} values={RATES} />
          </p>
          <div className="bwm-tableWrap">
            <table className="bwm-compare">
              <thead><tr>{P.season.tableHeaders.map((h) => <th key={h} scope="col">{fill(h, RATES)}</th>)}</tr></thead>
              <tbody>
                {SEASON.map((s) => (
                  <tr key={s.ft}>
                    <th scope="row">{fill(P.season.lengthLabel, { ft: s.ft })}</th>
                    <td>{usd(s.wrap)}</td>
                    <td>{usd(s.storage)}</td>
                    <td>{usd(FREEZEGUARD)}</td>
                    <td className="bwm-us">{usd(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="bwm-callout">
            <h3>{P.season.callout.title}</h3>
            <p>
              <Rich text={P.season.callout.text} values={RATES} />
            </p>
          </aside>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="nvu-differ">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.differ.kicker}</p>
            <h2 id="nvu-differ" className="bwm-h2"><Rich text={P.differ.title} /></h2>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare">
              <thead><tr>{P.differ.tableHeaders.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>
                {P.differ.rows.map((r) => (
                  <tr key={r.cost}>
                    <th scope="row">{r.cost}</th>
                    {r.used ? <><td>{fill(r.new, RATES)}</td><td>{fill(r.used, RATES)}</td></> : <td colSpan={2} className="bwm-same">{fill(r.new, RATES)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <blockquote className="bwm-pull">
            <Rich text={P.differ.pullQuote} />
          </blockquote>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="nvu-new">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.newCase.kicker}</p>
            <h2 id="nvu-new" className="bwm-h2"><Rich text={P.newCase.title} /></h2>
          </header>
          <CaseCards items={P.newCase.cards} />
          <div className="bwm-actions">
            <Link href={P.newCase.link.href} className="bwm-textLink">{P.newCase.link.label} <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="nvu-used">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.usedCase.kicker}</p>
            <h2 id="nvu-used" className="bwm-h2"><Rich text={P.usedCase.title} /></h2>
          </header>
          <CaseCards items={P.usedCase.cards} />
          <div className="bwm-actions">
            <Link href={P.usedCase.link.href} className="bwm-textLink">{P.usedCase.link.label} <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="nvu-example">
        <div className="bwm-wrap bwm-splitGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.example.kicker}</p>
            <h2 id="nvu-example" className="bwm-h2"><Rich text={P.example.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.example.lede} />
            </p>
            <ul className="bwm-checks" role="list">
              {P.example.points.map((p) => <li key={p}><Rich text={p} values={{ ...RATES, ...example }} /></li>)}
            </ul>
            <p className="bwm-lede">
              <Rich text={P.example.closing} />
            </p>
          </div>
          <div className="bwm-callout bwm-callout--side">
            <h3>{P.example.callout.title}</h3>
            <p>
              <Rich text={P.example.callout.text} />
            </p>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="nvu-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.contact.kicker}</p>
            <h2 id="nvu-faq" className="bwm-h2"><Rich text={P.contact.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.contact.lede} />
            </p>
            <div className="bwm-actions">
              <Link href="/inventory/" className="bwm-btnTeal">{P.contact.primaryButton}</Link>
              <Link href="/winterize/" className="bwm-btnOutlineDark">{P.contact.secondaryButton}</Link>
            </div>
            <p className="bwm-fine bwm-fine--dark">
              {P.contact.textPrompt} <a href={smsHref(P.contact.textMessage)} className="bwm-inlineLink">{fill(P.contact.textLink, { phone: config.phone })}</a><Rich text={P.contact.afterText} />
            </p>
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
