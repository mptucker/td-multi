import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { getInventory, brandOf, money } from "@/bigwatermarine/lib/boats";
import { BRANDS, BRAND_REVIEWS, FINANCING, type BrandKey } from "@/bigwatermarine/lib/brands";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { abs, boatProduct, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import BoatGrid from "./BoatGrid";
import { Arrow } from "./Finder";

export function brandMetadata(key: BrandKey): Metadata {
  const b = BRANDS[key];
  return pageMeta({ title: b.metaTitle, description: b.metaDescription, path: b.path, image: abs(b.hero.src) });
}

function brandFaqs(key: BrandKey, inStock: number) {
  const b = BRANDS[key];
  return [
    ...b.faqs,
    { q: `Where can I buy a ${b.name} near Lake Texoma?`, a: `Big Water Marine in Pottsboro, Texas, is Lake Texoma’s ${b.name} dealer, serving Sherman, Denison, North Texas and Southern Oklahoma. ${inStock ? `We have ${inStock} ${b.name} ${inStock === 1 ? "boat" : "boats"} available right now.` : "Call or text to see what’s arriving next."} Sales are at 50055 N State Hwy 289, open Tuesday–Saturday 9am–5pm.` },
    { q: `Can I order a ${b.name} that isn’t in stock?`, a: `Yes. We can order the exact ${b.name} model, layout, colors and power you want. Call or text ${config.phone} and we’ll walk you through options and timing.` },
    { q: `Can I schedule a ${b.name} demo?`, a: `Yes. Call or text ${config.phone} to schedule an on-water demo on Lake Texoma.` },
  ];
}

export default async function BrandPage({ brand }: { brand: BrandKey }) {
  const b = BRANDS[brand];
  const all = await getInventory();
  const boats = all
    .filter((x) => brandOf(x.make) === b.name)
    .sort((x, y) => (x.condition === y.condition ? 0 : x.condition === "New" ? -1 : 1));
  const priced = boats.filter((x) => x.price).map((x) => x.price!);
  const from = priced.length ? Math.min(...priced) : null;
  const faqs = brandFaqs(brand, boats.length);
  const others = (Object.keys(BRANDS) as BrandKey[]).filter((k) => k !== brand).map((k) => BRANDS[k]);

  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${abs(b.path)}#page`,
          url: abs(b.path),
          name: b.metaTitle,
          description: b.metaDescription,
          about: { "@type": "Brand", name: b.name, url: b.site },
          provider: { "@id": ORG_ID },
          mainEntity: {
            "@type": "ItemList",
            name: `${b.name} boats for sale at Big Water Marine`,
            numberOfItems: boats.length,
            itemListElement: boats.map((x, i) => ({ "@type": "ListItem", position: i + 1, item: boatProduct(x) })),
          },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Inventory", path: "/inventory/" }, { name: b.name }]),
        faqPage(faqs, b.path),
      ]} />

      {/* ── Hero ── */}
      <section className="bwm-hero bwm-hero--brand" aria-labelledby="brand-title">
        <div className="bwm-heroMedia">
          <Image src={b.hero} alt={b.heroAlt} fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light bwm-in" style={{ ["--d" as string]: "40ms" }}>
            <ol><li><Link href="/">Home</Link></li><li><Link href="/inventory/">Inventory</Link></li><li aria-current="page">{b.name}</li></ol>
          </nav>
          <Image src={b.logo.src} alt={`${b.name} logo`} width={b.logo.width} height={b.logo.height} className="bwm-brandLogo bwm-in" style={{ ["--d" as string]: "100ms" }} />
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "160ms" }}>{b.eyebrow}</p>
          <h1 id="brand-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-srOnly">{b.name} {b.kindPlural} for sale on Lake Texoma: </span>
            <span className="bwm-in" style={{ ["--d" as string]: "200ms" }}>{b.headline[0]}</span>
            <span className="bwm-in" style={{ ["--d" as string]: "300ms" }}><em>{b.headline[1]}</em></span>
          </h1>
          <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "480ms" }}>Go Big! Wherever the water takes you</p>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "580ms" }}>{b.lede}</p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "700ms" }}>
            <a href="#in-stock" className="bwm-btnTeal">{boats.length ? `Shop ${boats.length} ${b.name} ${boats.length === 1 ? "boat" : "boats"}` : `Order your ${b.name}`}</a>
            <a href={smsHref(`Hi! I'd like to schedule a ${b.name} demo.`)} className="bwm-btnOutlineLight">Text to schedule a demo</a>
          </div>
          {boats.length > 0 && (
            <dl className="bwm-heroStats bwm-in" style={{ ["--d" as string]: "820ms" }}>
              <div><dt>{b.name} boats available</dt><dd>{boats.length}</dd></div>
              {from && <div><dt>Starting at</dt><dd>{money(from)}</dd></div>}
              <div><dt>Series we carry</dt><dd>{b.series.length}</dd></div>
            </dl>
          )}
        </div>
      </section>

      {/* ── In stock ── */}
      <section id="in-stock" className="bwm-section bwm-white" aria-labelledby="brand-stock">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Available at Big Water Marine</p>
            <h2 id="brand-stock" className="bwm-h2">{b.name} boats <em>ready to go.</em></h2>
            <p className="bwm-lede">
              {boats.length
                ? `${boats.length} ${b.name} ${boats.length === 1 ? "boat is" : "boats are"} available now in Pottsboro, on Lake Texoma. Limited inventory; boats sell fast.`
                : `Nothing on the lot today, but new ${b.name} boats arrive regularly and we can order the exact one you want.`}
            </p>
          </header>
          {boats.length > 0 && <BoatGrid boats={boats} />}
          <div className="bwm-buyStrip">
            <p><strong>Don&rsquo;t see the one?</strong> We can order the exact {b.name} layout, colors and power you want.</p>
            <div className="bwm-actions bwm-actions--tight">
              <a href={smsHref(`Hi! I'd like to order a ${b.name}.`)} className="bwm-btnTeal bwm-btnSm">Text about a custom order</a>
              <Link href={`/inventory/?make=${b.key}`} className="bwm-textLink">All {b.name} inventory <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── The difference ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="brand-diff">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />{b.differenceKicker}</p>
            <h2 id="brand-diff" className="bwm-h2">{b.differenceTitle[0]} <em>{b.differenceTitle[1]}</em></h2>
            <p className="bwm-lede">{b.differenceIntro}</p>
          </header>
          <ul className="bwm-perks" role="list">
            {b.points.map((p) => <li key={p.title}><h3>{p.title}</h3><p>{p.body}</p></li>)}
          </ul>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="bwm-section bwm-white" aria-label={`${b.name} on the water`}>
        <div className="bwm-wrap">
          <div className="bwm-mosaic">
            {b.gallery.map((g, i) => (
              <figure key={i} className={["bwm-mosaicA", "bwm-mosaicB", "bwm-mosaicC", "bwm-mosaicD"][i]}>
                <Image src={g.src} alt={g.alt} fill sizes={i === 0 ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 32vw, 55vw"} placeholder="blur" className="object-cover" />
              </figure>
            ))}
            <p className="bwm-script bwm-mosaicScript">See you on the water</p>
          </div>
        </div>
      </section>

      {/* ── Series ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="brand-series">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Explore the fleet</p>
            <h2 id="brand-series" className="bwm-h2">Find your <em>perfect {b.name}.</em></h2>
            <p className="bwm-lede">{b.fleetIntro}</p>
          </header>
          <ul className="bwm-services bwm-series" role="list">
            {b.series.map((s) => (
              <li key={s.name}>
                {s.range && <span className="bwm-serviceTag">{s.range}</span>}
                <h3>{s.name}</h3>
                <p>{s.body}</p>
                <a href={s.href} className="bwm-textLink" target="_blank" rel="noopener">
                  See {s.name} on {new URL(b.site).hostname.replace(/^www\./, "")} <Arrow />
                </a>
              </li>
            ))}
          </ul>
          <div className="bwm-videoNote">
            <h3 className="bwm-h3">{b.videoTitle}</h3>
            <p>{b.videoBody}</p>
            <a href={b.youtube ?? b.site} className="bwm-textLink" target="_blank" rel="noopener">
              {b.youtubeLabel ?? `Visit ${new URL(b.site).hostname.replace(/^www\./, "")}`} <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* ── Why buy here ── */}
      <section className="bwm-section bwm-white" aria-labelledby="brand-why">
        <div className="bwm-wrap bwm-howGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Your {b.name} headquarters</p>
            <h2 id="brand-why" className="bwm-h2">Why buy your {b.name} <em>from Big Water.</em></h2>
            <p className="bwm-lede">{b.whyIntro}</p>
            <div className="bwm-actions">
              <a href={smsHref(`Hi! I have a question about ${b.name} boats.`)} className="bwm-btnTeal">Text {config.phone}</a>
              <a href={config.financingUrl} className="bwm-btnOutlineDark">Apply for financing</a>
            </div>
          </div>
          <ol className="bwm-howSteps" role="list">
            {b.whyUs.map((w, i) => (
              <li key={w.title}><span className="bwm-stepNum">{i + 1}</span><div><h3>{w.title}</h3><p>{w.body}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="brand-reviews">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Genuine care</p>
            <h2 id="brand-reviews" className="bwm-h2">What our customers <em>are saying.</em></h2>
          </header>
          <ul className="bwm-reviews" role="list">
            {BRAND_REVIEWS.map((r) => (
              <li key={r.name}>
                <blockquote><p>&ldquo;{r.text}&rdquo;</p></blockquote>
                <p className="bwm-reviewBy"><span aria-label="5 out of 5 stars">★★★★★</span> {r.name}, Big Water Marine</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Financing & trade-ins ── */}
      <section className="bwm-section bwm-white" aria-labelledby="brand-finance">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Flexible financing &amp; trade-ins welcome</p>
            <h2 id="brand-finance" className="bwm-h2">Make your {b.name} <em>a reality.</em></h2>
          </header>
          <div className="bwm-twoUp">
            <div className="bwm-option bwm-option--hi">
              <h3>Financing options</h3>
              <p className="bwm-optionMeta">Make your {b.name} dreams a reality with competitive financing options tailored to your budget. Low rates, flexible terms, quick approvals.</p>
              <ul className="bwm-checks" role="list">{FINANCING.financing.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="bwm-actions"><a href={config.financingUrl} className="bwm-btnTeal">Get pre-approved</a></div>
            </div>
            <div className="bwm-option">
              <h3>Trade-in value</h3>
              <p className="bwm-optionMeta">Upgrade to a {b.name} and get top dollar for your current boat. We make the transition seamless with fair valuations and easy paperwork.</p>
              <ul className="bwm-checks" role="list">{FINANCING.trade.map((x) => <li key={x}>{x}</li>)}</ul>
              <div className="bwm-actions"><a href={config.tradeValueUrl} className="bwm-btnOutlineDark">Get your trade value</a></div>
            </div>
          </div>
          <p className="bwm-fine">*For qualified buyers, on approved credit.</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="brand-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Common questions</p>
            <h2 id="brand-faq" className="bwm-h2">{b.name} <em>FAQ.</em></h2>
            <p className="bwm-lede">Anything else? Text us and a real person on our team answers.</p>
          </div>
          <div className="bwm-faq">
            {faqs.map((f) => (
              <details key={f.q} className="bwm-faqItem">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other builders ── */}
      <section className="bwm-section bwm-white bwm-otherBrands" aria-labelledby="brand-others">
        <div className="bwm-wrap">
          <h2 id="brand-others" className="bwm-h3">More builders we carry</h2>
          <ul className="bwm-brandJump" role="list">
            {others.map((o) => <li key={o.key}><Link href={o.path}>{o.name}</Link></li>)}
            <li><Link href="/inventory/">All inventory</Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}
