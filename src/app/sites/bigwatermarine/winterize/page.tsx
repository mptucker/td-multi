import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import Rich from "@/bigwatermarine/components/Rich";
import CmsImage from "@/bigwatermarine/components/CmsImage";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { ADD_ONS, INSPECTION_POINTS, OUTBOARD_MENU, SHOP_POLICIES, WINTER_DETAILING, WINTER_NOTES, WINTER_PACKAGES } from "@/bigwatermarine/lib/service";
import { abs, breadcrumbs, faqPage, pageMeta, SERVICE_ID } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";
import Packages from "./Packages";

import { cms, fill, faqs as pageFaqs } from "@/bigwatermarine/lib/cms";

// Page copy and photos are edited in /admin (content/bigwatermarine.json → pages.winterize).
const P = cms.pages.winterize;

export const metadata: Metadata = pageMeta({
  title: fill(P.meta.title),
  description: fill(P.meta.description),
  path: "/winterize/",
  image: abs(P.images.hero.src),
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
          potentialAction: { "@type": "ReserveAction", target: config.windlassIntakeUrl, name: P.hero.primaryButton },
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
          <CmsImage image={P.images.hero} fill sizes="100vw" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>{P.hero.eyebrow}</p>
          <h1 id="win-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}><Rich text={P.hero.title[0]} /></span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><Rich text={P.hero.title[1]} /></span>
          </h1>
          <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "460ms" }}>{P.hero.script}</p>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "560ms" }}>
            <Rich text={P.hero.lede} />
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "680ms" }}>
            <a href={config.windlassIntakeUrl} className="bwm-btnTeal">{P.hero.primaryButton}</a>
            <a href={smsHref(P.hero.textMessage)} className="bwm-btnOutlineLight">{P.hero.secondaryButton}</a>
          </div>
        </div>
      </section>

      {/* ── Why ── */}
      <section className="bwm-section bwm-white" aria-labelledby="win-why">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.why.kicker}</p>
            <h2 id="win-why" className="bwm-h2"><Rich text={P.why.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.why.lede} />
            </p>
          </header>
          <ul className="bwm-proof bwm-proof--3" role="list">
            {P.why.items.map((x) => (
              <li key={x.label} className="bwm-fx"><span className="bwm-proofK">{x.label}</span><Rich text={x.text} /></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="packages" className="bwm-section bwm-foam" aria-labelledby="win-packages">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.packages.kicker}</p>
            <h2 id="win-packages" className="bwm-h2"><Rich text={P.packages.title} /></h2>
            <p className="bwm-lede"><Rich text={P.packages.lede} /></p>
          </header>
          <Packages packages={WINTER_PACKAGES} workOrderUrl={config.windlassIntakeUrl} labels={P.packages} />
        </div>
      </section>

      {/* ── Outboard / PWC / add-ons ── */}
      <section className="bwm-section bwm-white" aria-labelledby="win-menu">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.menu.kicker}</p>
            <h2 id="win-menu" className="bwm-h2"><Rich text={P.menu.title} /></h2>
          </header>
          <div className="bwm-menuGrid">
            <div>
              <h3 className="bwm-h3">{P.menu.outboardTitle}</h3>
              <MenuTable items={OUTBOARD_MENU} mobileLabel={P.menu.mobileLabel} />
            </div>
            <div>
              <h3 className="bwm-h3">{P.menu.addOnsTitle}</h3>
              <MenuTable items={ADD_ONS} mobileLabel={P.menu.mobileLabel} />
            </div>
          </div>
          <div className="bwm-menuGrid bwm-mt">
            <div>
              <h3 className="bwm-h3">{P.menu.detailingTitle}</h3>
              <ul className="bwm-checks" role="list">{WINTER_DETAILING.map((x) => <li key={x}>{x}</li>)}</ul>
              <figure className="bwm-wideFigure">
                <CmsImage image={P.images.shrinkWrap} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-[50%_30%]" />
                <figcaption><Rich text={P.menu.shrinkWrapCaption} /></figcaption>
              </figure>
            </div>
            <div className="bwm-notes">
              <h3 className="bwm-h3">{P.menu.notesTitle}</h3>
              <ul role="list">{[...WINTER_NOTES, ...SHOP_POLICIES].map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inspection + guarantee ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="win-guarantee">
        <div className="bwm-wrap bwm-splitGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.guarantee.kicker}</p>
            <h2 id="win-guarantee" className="bwm-h2"><Rich text={P.guarantee.title} /></h2>
            <p className="bwm-lede">
              <Rich text={P.guarantee.lede} />
            </p>
            <h3 className="bwm-h3 bwm-mt"><Rich text={P.guarantee.inspectionTitle} /></h3>
            <ul className="bwm-checks bwm-checks--2" role="list">{INSPECTION_POINTS.map((p) => <li key={p}>{p}</li>)}</ul>
            <div className="bwm-actions">
              <a href={config.windlassIntakeUrl} className="bwm-btnTeal">{P.guarantee.button}</a>
              <Link href="/service/" className="bwm-textLink">{P.guarantee.serviceLink} <Arrow /></Link>
            </div>
          </div>
          <figure className="bwm-tallFigure bwm-fx">
            <CmsImage image={P.images.antifreeze} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <figcaption><Rich text={P.guarantee.caption} /></figcaption>
          </figure>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bwm-section bwm-white" aria-labelledby="win-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{P.faq.kicker}</p>
            <h2 id="win-faq" className="bwm-h2"><Rich text={P.faq.title} /></h2>
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

function MenuTable({ items, mobileLabel }: { items: { name: string; hours: string; onsite: string; mobile?: string; note: string }[]; mobileLabel: string }) {
  return (
    <ul className="bwm-menuList" role="list">
      {items.map((m) => (
        <li key={m.name}>
          <div className="bwm-menuHead">
            <span className="bwm-menuName">{m.name}</span>
            <span className="bwm-menuPrice">{m.onsite}{m.mobile && <small> · {mobileLabel} {m.mobile}</small>}</span>
          </div>
          <p>{m.note} <span className="bwm-menuHours">({m.hours})</span></p>
        </li>
      ))}
    </ul>
  );
}
