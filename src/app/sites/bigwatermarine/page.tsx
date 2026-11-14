import Motif from "@/bigwatermarine/components/Motif";
import Link from "next/link";
import { engineMakers, site } from "@/bigwatermarine/lib/content";
import { getInventory, brandOf } from "@/bigwatermarine/lib/boats";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import { faqPage } from "@/bigwatermarine/lib/seo";
import Finder, { Arrow } from "./_components/Finder";
import Builders from "./_components/Builders";

import CmsImage from "@/bigwatermarine/components/CmsImage";
import Rich from "@/bigwatermarine/components/Rich";
import { cms, fill, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";


// FAQs are edited in /admin (content/bigwatermarine.json → faqs.home).
const faqs = pageFaqs("home");

const P = cms.pages.home;

export const revalidate = 300;

export default async function Home() {
  const inventory = await getInventory();
  const newCount = inventory.filter((b) => b.condition === "New").length;
  const usedCount = inventory.length - newCount;
  const counts: Record<string, number> = {};
  for (const b of inventory) counts[brandOf(b.make)] = (counts[brandOf(b.make)] ?? 0) + 1;

  const [own, join, explore] = P.nextStep.items;
  const values = { "boats.count": inventory.length };

  return (
    <>
      <JsonLd data={faqPage(faqs.map((f) => ({ q: f.q, a: f.a })), "/")} />
        {/* 1 · Hero: lead with what's for sale */}
        <section id="top" className="bwm-hero" aria-labelledby="bwm-hero-title">
          <div className="bwm-heroMedia">
            <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
          </div>
          <div className="bwm-heroShade" aria-hidden />
          <div className="bwm-heroInner">
            <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
            <h1 id="bwm-hero-title" className="bwm-heroTitle">
              <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
              <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
            </h1>
            <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "520ms" }}>{P.hero.script}</p>
            <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "620ms" }}>
              <Rich text={P.hero.lede} values={values} />
            </p>
            <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "740ms" }}>
              <Link href="/inventory/" className="bwm-btnTeal">{fill(P.hero.primaryButton, values)}</Link>
              <a href={config.windlassIntakeUrl} className="bwm-btnOutlineLight">{P.hero.secondaryButton}</a>
            </div>
            <dl className="bwm-heroStats bwm-in" style={{ ["--d" as string]: "860ms" }}>
              <div><dt>{P.hero.stats.newInStock}</dt><dd>{newCount}</dd></div>
              <div><dt>{P.hero.stats.preOwned}</dt><dd>{usedCount}</dd></div>
              <div><dt>{P.hero.stats.engineMakers}</dt><dd>{engineMakers.length}</dd></div>
            </dl>
          </div>
        </section>

        {/* 2 · On our lot (overlaps the hero) */}
        <div className="bwm-lotField">
          <div className="bwm-wrap">
            <Finder boats={inventory} />
            <div className="bwm-buyStrip">
              <p><Rich text={P.buyStrip.text} /></p>
              <Link href={site.links.financing} className="bwm-textLink">{P.buyStrip.link} <Arrow /></Link>
            </div>
          </div>
        </div>

        {/* 3 · Photographic bridge into the builders and service */}
        <section className="bwm-bridge" aria-label="Every boat comes with a team">
          <CmsImage image={P.images.bridge} fill sizes="100vw" className="bwm-bridgeImg bwm-parallax" />
          <div className="bwm-bridgeShade" aria-hidden />
          <p className="bwm-bridgeLine bwm-fx"><Rich text={P.bridge.line} /></p>
        </section>

        {/* 4 · Four builders */}
        <section id="builders" className="bwm-section bwm-white" aria-labelledby="bwm-builders-title">
          <div className="bwm-wrap">
            <header className="bwm-sectionHead bwm-fx">
              <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.builders.kicker}</p>
              <h2 id="bwm-builders-title" className="bwm-h2"><Rich text={P.builders.title} /></h2>
              <p className="bwm-lede">
                <Rich text={P.builders.lede} />
              </p>
            </header>
            <Builders counts={counts} />
          </div>
        </section>

        {/* 5 · Service advantage */}
        <section id="service" className="bwm-section bwm-foam" aria-labelledby="bwm-service-title">
          <div className="bwm-wrap bwm-serviceGrid">
            <div>
              <header className="bwm-fx">
                <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.service.kicker}</p>
                <h2 id="bwm-service-title" className="bwm-h2"><Rich text={P.service.title} /></h2>
                <p className="bwm-lede">
                  <Rich text={P.service.lede} />
                </p>
              </header>

              <ul className="bwm-proof" role="list">
                {P.service.proof.map((item) => (
                  <li key={item.label}><span className="bwm-proofK">{item.label}</span><Rich text={item.text} values={{ engineMakers: engineMakers.join(" · ") }} /></li>
                ))}
              </ul>

              <figure className="bwm-serviceFigure">
                <CmsImage image={P.images.service} fill sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover" />
                <figcaption>
                  <Rich text={P.service.caption} />
                  <span>{P.service.captionHours}</span>
                </figcaption>
              </figure>

              <aside className="bwm-season" aria-label="Winterization">
                <p className="bwm-script bwm-seasonScript">{P.service.season.script}</p>
                <p>{P.service.season.text}</p>
                <a href="/winterize/" className="bwm-textLink">{P.service.season.link} <Arrow /></a>
              </aside>
            </div>

            <div className="bwm-serviceSide">
              <div className="bwm-planner">
                <h3 className="bwm-plannerTitle">{P.service.planner.title}</h3>
                <ol className="bwm-steps" role="list">
                  {P.service.planner.steps.map((step, i) => (
                    <li key={i}><span className="bwm-stepNum">{i + 1}</span><span><Rich text={step} /></span></li>
                  ))}
                </ol>
                <div className="bwm-actions">
                  <a href={config.windlassIntakeUrl} className="bwm-btnTeal">{P.service.planner.primaryButton}</a>
                  <a href={smsHref(P.service.planner.textMessage)} className="bwm-textLink">{P.service.planner.textLink} <Arrow /></a>
                </div>
              </div>
              <div className="bwm-faq">
                <h3 className="bwm-faqTitle">{P.service.faqTitle}</h3>
                {faqs.map((f) => (
                  <details key={f.q} className="bwm-faqItem">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6 · One-line promise */}
        <section className="bwm-statement" aria-label="Our promise">
          <CmsImage image={P.images.statement} fill sizes="100vw" className="bwm-statementImg bwm-parallax" />
          <div className="bwm-statementShade" aria-hidden />
          <div className="bwm-statementInner bwm-fx">
            <Motif className="bwm-statementMotif" lineColor="var(--bwm-teal)" barColor="rgba(255,255,255,.28)" />
            <p className="bwm-statementLine">
              {P.statement.line}
              <span>{P.statement.subline}</span>
            </p>
          </div>
        </section>

        {/* 7 · The Big Water lifestyle + Boat Club */}
        <section id="family" className="bwm-section bwm-white" aria-labelledby="bwm-family-title">
          <div className="bwm-wrap">
            <header className="bwm-sectionHead bwm-sectionHead--center bwm-fx">
              <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.family.kicker}</p>
              <h2 id="bwm-family-title" className="bwm-h2 bwm-h2--xl"><Rich text={P.family.title} /></h2>
              <p className="bwm-lede">
                <Rich text={P.family.lede} />
              </p>
            </header>

            <div className="bwm-mosaic">
              <figure className="bwm-mosaicA bwm-fx">
                <CmsImage image={P.images.familyMain} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </figure>
              <figure className="bwm-mosaicB bwm-fx">
                <CmsImage image={P.images.familyGoldenHour} fill sizes="(min-width: 1024px) 34vw, 55vw" className="object-cover" />
              </figure>
              <figure className="bwm-mosaicC bwm-fx">
                <CmsImage image={P.images.familyJump} fill sizes="(min-width: 1024px) 26vw, 45vw" className="object-cover" />
              </figure>
              <figure className="bwm-mosaicD bwm-fx">
                <CmsImage image={P.images.familyOpenWater} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
              </figure>
              <p className="bwm-script bwm-mosaicScript bwm-fx">{P.family.script}</p>
            </div>
          </div>
        </section>

        <section id="club" className="bwm-section bwm-club" aria-labelledby="bwm-club-title">
          <div className="bwm-wrap bwm-clubGrid">
            <div className="bwm-clubMedia bwm-fx">
              <CmsImage image={P.images.clubFleet} fill sizes="(min-width: 1024px) 54vw, 100vw" className="object-cover" />
              <div className="bwm-clubInset">
                <CmsImage image={P.images.clubCouple} fill sizes="(min-width: 1024px) 24vw, 50vw" className="object-cover" />
              </div>
            </div>
            <div className="bwm-clubText bwm-fx">
              <p className="bwm-kicker bwm-kicker--light"><Motif linesOnly className="bwm-kickerMark" />{P.club.kicker}</p>
              <h2 id="bwm-club-title" className="bwm-h2"><Rich text={P.club.title} /></h2>
              <p className="bwm-lede">
                <Rich text={P.club.lede} />
              </p>
              <div className="bwm-actions">
                <Link href="/boatclub/" className="bwm-btnTeal">{P.club.primaryButton}</Link>
                <a href={smsHref(P.club.textMessage)} className="bwm-textLink bwm-textLink--light">{P.club.textLink} <Arrow /></a>
              </div>
              <p className="bwm-fine">{P.club.fine}</p>
            </div>
          </div>

          <div className="bwm-wrap">
            <h3 className="bwm-nextTitle">{P.nextStep.title}</h3>
            <ul className="bwm-next" role="list">
              <li><span className="bwm-nextK">{own.label}</span><span>{own.text}</span><Link href="/inventory/" className="bwm-textLink bwm-textLink--light">{own.link} <Arrow /></Link></li>
              <li><span className="bwm-nextK">{join.label}</span><span>{join.text}</span><a href={site.links.boatClub} className="bwm-textLink bwm-textLink--light">{join.link} <Arrow /></a></li>
              <li><span className="bwm-nextK">{explore.label}</span><span>{explore.text}</span><a href={site.links.texoma} className="bwm-textLink bwm-textLink--light">{explore.link} <Arrow /></a></li>
            </ul>
          </div>
        </section>

        {/* 8 · Visit */}
        <section id="visit" className="bwm-visit" aria-labelledby="bwm-visit-title">
          <CmsImage image={P.images.visit} fill sizes="100vw" className="bwm-visitImg" />
          <div className="bwm-visitShade" aria-hidden />
          <div className="bwm-wrap">
            <p className="bwm-script bwm-visitScript">{P.visit.script}</p>
            <h2 id="bwm-visit-title" className="bwm-h2"><Rich text={P.visit.title} /></h2>
            <p className="bwm-visitArea">{P.visit.area}</p>
            <div className="bwm-visitGrid">
              {site.locations.map((l) => (
                <div key={l.name} className="bwm-loc">
                  <h3>{l.name}</h3>
                  <p>{l.street}<br />{l.city}</p>
                  <p className="bwm-locHours">{l.hours.map((h) => <span key={h}>{h}</span>)}</p>
                  <a href={l.map} className="bwm-textLink bwm-textLink--light">{P.visit.directionsLink} <Arrow /></a>
                </div>
              ))}
              <div className="bwm-loc">
                <h3>{P.visit.contactTitle}</h3>
                <a href={site.phoneHref} className="bwm-bigPhone">{site.phone}</a>
                <a href={smsHref(P.visit.textMessage)} className="bwm-btnTeal">{P.visit.textButton}</a>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
