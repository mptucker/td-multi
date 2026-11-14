import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import BoatImage from "@/bigwatermarine/components/BoatImage";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import {
  getBoat, getInventory, similarBoats, soldPageExpired,
  boatPath, boatSummary, brandPath, conditionLabel, money, monthlyPayment, statusLabel,
} from "@/bigwatermarine/lib/boats";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, boatProduct, breadcrumbs, faqPage, pageMeta } from "@/bigwatermarine/lib/seo";
import Gallery from "../../../_components/Gallery";
import BoatTabs from "../../../_components/BoatTabs";
import LoanCalculator from "../../../_components/LoanCalculator";
import ReadMore from "../../../_components/ReadMore";
import ShareTools from "../../../_components/ShareTools";
import { Arrow } from "@/app/sites/bigwatermarine/_components/Finder";

export const revalidate = 300;
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string; id: string }> };

export async function generateStaticParams() {
  const boats = await getInventory();
  return boats.map((b) => ({ slug: b.slug, id: b.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const b = await getBoat(id);
  if (!b) return { title: "Boat not found", robots: { index: false } };
  const status = statusLabel(b);
  return {
    ...pageMeta({
      title: `${b.title}${status ? ` (${status})` : ""} for Sale in Pottsboro, TX`,
      description: boatSummary(b) + " View photos, full specs and payment estimates.",
      path: boatPath(b),
      image: b.images[0],
    }),
    // Sold boats stay reachable for shoppers but drop out of search results.
    ...(b.status === "sold" ? { robots: { index: false, follow: true } } : {}),
  };
}

const FAQS = (b: { model: string }) => [
  { q: "Is the trailer included in the price?", a: "All of our boat packages include the trailer unless otherwise specified. If you don't need a trailer, we can remove it from the estimate." },
  { q: "What fees are not included in the price?", a: "Tax, title and license (TTL), freight, prep and doc fees are not reflected in the posted price." },
  { q: "Can I finance this boat?", a: "Yes. Use “Apply for financing” for fast, secure pre-approval, or try the loan calculator to estimate a payment." },
  { q: "Can you value my trade?", a: "Yes. Use our “Value your trade” tool for a quick estimate. Final value is set after an in-person inspection." },
  { q: `Can I take the ${b.model} for a sea trial?`, a: "Yes, by appointment. Call or text 903-419-1019 to schedule an on-water demo on Lake Texoma." },
];

const WHY = [
  ["Transparent pricing", "No add-on games; trailer included in price."],
  ["Lake Texoma experts", "Setup and lake-ready orientation at delivery."],
  ["Easy financing", "Quick approvals with competitive rates."],
  ["Trade-ins welcome", "Get a fair value in minutes."],
  ["Service", "Factory-trained techs and priority scheduling."],
  ["After-sale support", "You're not buying a boat, you're joining the Big Water family."],
  ["Training available", "Certified by NSBC for on-water training."],
  ["Delivery available", "Reasonable delivery anywhere in the U.S."],
];

export default async function BoatPage({ params }: Params) {
  const { slug, id } = await params;
  const boat = await getBoat(id);
  if (!boat) notFound();

  // One canonical URL per boat: fix old or mistyped slugs with a permanent redirect.
  if (boat.slug !== slug) permanentRedirect(boatPath(boat));
  // Sold long enough ago: send shoppers to that builder's boats.
  if (soldPageExpired(boat)) permanentRedirect(brandPath(boat.make));

  const all = await getInventory();
  const similar = similarBoats(boat, all);
  const url = abs(boatPath(boat));
  const status = statusLabel(boat);
  const faqs = FAQS(boat);
  const payment = boat.price ? monthlyPayment(boat.price) : null;
  const textBody = `Hi! I'm interested in the ${boat.title} (#${boat.stockNumber ?? boat.id}). ${url}`;
  const asOf = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" });

  const specs = (
    <div className="bwm-specs">
      {boat.specs.map((s) => (
        <section key={s.title} className="bwm-specSection">
          <h3 className="bwm-h3">{s.title}</h3>
          <dl className="bwm-specGrid">
            {s.rows.map(([k, v]) => (
              <div key={k} className="bwm-specRow"><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );

  return (
    <div className="bwm-pageTop bwm-boatPage">
      <JsonLd data={[
        boatProduct(boat),
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Inventory", path: "/inventory/" }, { name: boat.title }]),
        faqPage(faqs, boatPath(boat)),
      ]} />

      <div className="bwm-wrap">
        <nav aria-label="Breadcrumb" className="bwm-crumbs">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/inventory/">Inventory</Link></li>
            <li aria-current="page">{boat.title}</li>
          </ol>
        </nav>

        {status && (
          <div className="bwm-statusBanner" data-status={boat.status}>
            {boat.status === "sold" && <>This boat has <strong>sold</strong>. Similar boats are below, or text us and we&rsquo;ll help you find one.</>}
            {boat.status === "sale-pending" && <><strong>Sale pending.</strong> Text us to get on the backup list, or see similar boats below.</>}
            {boat.status === "on-order" && <><strong>On order.</strong> This boat is on its way to Pottsboro. Reserve it before it lands.</>}
          </div>
        )}

        <div className="bwm-boatLayout">
          <div className="bwm-boatMain">
            <header className="bwm-boatHead">
              <div>
                <h1 className="bwm-boatTitle">{boat.title}</h1>
                <p className="bwm-boatSub">
                  {boat.location}
                  {boat.hin && <> · HIN: {boat.hin}</>}
                  {boat.stockNumber && <> · Stock #{boat.stockNumber}</>}
                </p>
              </div>
              <div className="bwm-boatPrice">
                <p className="bwm-boatPriceMain">{boat.price ? money(boat.price) : "Call for pricing"}</p>
                {payment && <p className="bwm-boatPriceSub">as low as {money(payment)}/mo*</p>}
              </div>
            </header>

            {/* Phones: the two things most shoppers want, right away. */}
            <div className="bwm-boatQuick">
              <a href={smsHref(textBody)} className="bwm-btnTeal">Text about this boat</a>
              <a href={`tel:${config.phoneE164}`} className="bwm-btnOutlineDark">Call {config.phone}</a>
            </div>

            <Gallery images={boat.images} title={boat.title} />

            <dl className="bwm-facts">
              {[
                ["Year", boat.year],
                ["Make", boat.make],
                ["Model", boat.model],
                ["Condition", conditionLabel(boat)],
                ["Length", boat.lengthLabel],
                ["Power", boat.engineMake && boat.totalHp ? `${boat.engineMake} ${boat.totalHp} HP` : null],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k as string}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>

            {/* Plain-language answer block: what AI and voice assistants quote. */}
            <p className="bwm-answer">
              {boatSummary(boat)}{" "}
              {boat.status === "active" && <>Available at Big Water Marine as of {asOf}. </>}
              Call or text <a href={`tel:${config.phoneE164}`}>{config.phone}</a> to see it in person.
            </p>

            {boat.description.length > 0 && (
              <section className="bwm-panel" aria-labelledby="desc-title">
                <h2 id="desc-title" className="bwm-h3">About this {boat.make}</h2>
                <ReadMore>
                  {boat.description.map((p, k) => <p key={k}>{p}</p>)}
                </ReadMore>
              </section>
            )}

            <BoatTabs
              specs={specs}
              calculator={boat.price ? (
                <LoanCalculator
                  price={boat.price}
                  downPercent={config.loan.downPercent}
                  apr={config.loan.apr}
                  termYears={config.loan.termYears}
                  financingUrl={config.financingUrl}
                />
              ) : null}
            />

            <section className="bwm-panel" aria-labelledby="faq-title">
              <h2 id="faq-title" className="bwm-h3">Frequently asked questions</h2>
              {faqs.map((f) => (
                <details key={f.q} className="bwm-faqItem">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
              <div className="bwm-ctaRow">
                <a href={config.financingUrl} className="bwm-btnTeal">Apply for financing</a>
                <a href={config.tradeValueUrl} className="bwm-btnOutlineDark">Value your trade</a>
                <a href={config.insuranceUrl} className="bwm-btnOutlineDark">Find insurance</a>
              </div>
            </section>

            <section className="bwm-panel bwm-moreThan">
              <h2 className="bwm-h3">More than just buying</h2>
              <p>
                Ready to own this {boat.make} {boat.model} today? Or want flexible ways to get on the water first, like{" "}
                <Link href="/boatclub/">Big Water Boat Club</Link> or <Link href="/keepboating/">boat rentals</Link>? We&rsquo;ll help you find the right fit.
              </p>
            </section>
          </div>

          <aside className="bwm-boatSide" aria-label="Contact and tools">
            <div className="bwm-sideCard">
              <p className="bwm-sideKicker">Call or text us</p>
              <a href={`tel:${config.phoneE164}`} className="bwm-sidePhone">{config.phone}</a>
              <div className="bwm-sideBtns">
                <a href={smsHref(textBody)} className="bwm-btnTeal">Text about this boat</a>
                <a href={config.financingUrl} className="bwm-btnOutlineDark">Apply for financing</a>
                <a href={config.tradeValueUrl} className="bwm-btnOutlineDark">Value your trade</a>
                <a href={config.insuranceUrl} className="bwm-btnOutlineDark">Find insurance</a>
              </div>
              <ShareTools title={boat.title} url={url} />
            </div>

            <div className="bwm-sideCard">
              <h2 className="bwm-sideTitle">Why buy from Big Water Marine?</h2>
              <ul className="bwm-badges" role="list">
                <li><span aria-hidden>⭐⭐⭐⭐⭐</span> 4.9/5 (Google)</li>
                <li><span aria-hidden>🏆</span> Authorized Dealer</li>
                <li><span aria-hidden>📜</span> A+ Rated Service</li>
                <li><span aria-hidden>✅</span> 30+ Years Experience</li>
              </ul>
              <ul className="bwm-why" role="list">
                {WHY.map(([k, v]) => <li key={k}><strong>{k}</strong> {v}</li>)}
              </ul>
            </div>

            {similar.length > 0 && (
              <div className="bwm-sideCard bwm-similar">
                <h2 className="bwm-sideTitle">Similar boats</h2>
                <ul role="list">
                  {similar.map((s) => (
                    <li key={s.id}>
                      <Link href={boatPath(s)} className="bwm-similarLink">
                        <span className="bwm-similarImg">
                          {s.images[0] && <BoatImage src={s.images[0]} alt="" fill sizes="(min-width: 1100px) 300px, 45vw" className="object-cover" />}
                        </span>
                        <span className="bwm-similarName">{s.title}</span>
                        <span className="bwm-similarPrice">{s.price ? money(s.price) : "Call for pricing"}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        <p className="bwm-fine bwm-boatFine">
          *Estimated payment uses {config.loan.downPercent}% down, {config.loan.apr}% APR for {config.loan.termYears} years, on approved credit. Change any of these in the loan calculator.
          Listing details are provided in good faith; please verify specifications with our sales team.
        </p>
        <p className="bwm-backLink"><Link href="/inventory/" className="bwm-textLink">Back to all boats <Arrow /></Link></p>
      </div>
    </div>
  );
}
