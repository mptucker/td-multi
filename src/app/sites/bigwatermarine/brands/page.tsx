import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config } from "@/bigwatermarine/lib/config";
import { getInventory, brandOf } from "@/bigwatermarine/lib/boats";
import { abs, breadcrumbs, faqPage, ORG_ID, pageMeta } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import hero from "@public/media/hero-lifestyle.webp";
import berkshireImg from "@public/media/berkshire-sport.webp";
import verandaImg from "@public/media/veranda-vx27.webp";
import scoutImg from "@public/media/scout-xsf-running.webp";
import highfieldImg from "@public/media/highfield-open-water.webp";
import berkshireLogo from "@public/brands/berkshire-logo.png";
import verandaLogo from "@public/brands/veranda-logo.png";
import scoutLogo from "@public/brands/scout-logo.png";
import highfieldLogo from "@public/brands/highfield-logo.png";

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: "Boat Brands We Sell | Lake Texoma",
  description:
    "Big Water Marine carries four new boat brands in Pottsboro, Texas on Lake Texoma: Berkshire and Veranda pontoons, Scout center consoles and Highfield aluminum-hull RIBs, with Suzuki, Yamaha, Mercury or Rotax power.",
  path: "/brands/",
  image: abs("/bigwatermarine/media/hero-lifestyle.webp"),
});

type Brand = {
  name: "Berkshire" | "Veranda" | "Scout" | "Highfield";
  path: string;
  type: string;
  builtFor: string;
  signature: string;
  why: string;
  img: StaticImageData;
  alt: string;
  logo: StaticImageData;
};

// From the current Brands page (verbatim).
const BRANDS: Brand[] = [
  {
    name: "Berkshire", path: "/berkshire/", type: "Pontoon", builtFor: "Family days, entertaining, performance",
    signature: "Full-length under-deck performance packages; triple-toon and lifting strake options",
    why: "heavy-gauge aluminum construction and under-deck protection, built to stay solid season after season. The range runs from the entry-level LE series to ultra-luxury layouts.",
    img: berkshireImg, alt: "A Berkshire pontoon running on open water", logo: berkshireLogo,
  },
  {
    name: "Veranda", path: "/veranda/", type: "Luxury pontoon", builtFor: "Lake living, quiet comfort",
    signature: "Patented all-aluminum interlocking deck — no wood to rot",
    why: "the patented all-aluminum deck is the differentiator. No wood means nothing to rot, and the interlocking system gives a notably quiet, solid ride.",
    img: verandaImg, alt: "A Veranda luxury pontoon on the water", logo: verandaLogo,
  },
  {
    name: "Scout", path: "/scout/", type: "Center console", builtFor: "Fishing and family offshore",
    signature: "Tournament-grade fishability; 25+ years of build heritage",
    why: "offshore capability and tournament-grade fishability in a boat a family can still enjoy on a Saturday. Built to last generations, and priced accordingly.",
    img: scoutImg, alt: "A Scout XSF center console running fast", logo: scoutLogo,
  },
  {
    name: "Highfield", path: "/highfield/", type: "RIB / tender", builtFor: "Tenders, fast rough-water runs",
    signature: "America’s best-selling RIB; high-performance aluminum hull",
    why: "America’s number-one selling RIB, with aluminum hulls that take abuse a fiberglass tender would not survive.",
    img: highfieldImg, alt: "A Highfield RIB crossing open water", logo: highfieldLogo,
  },
];

const FAQS = [
  { q: "Which brands do you sell new?", a: "Berkshire and Veranda pontoons, Scout center consoles, and Highfield rigid inflatable boats and tenders. All four are available new at our Pottsboro location." },
  { q: "What engines do your boats come with?", a: "Suzuki, Yamaha, Mercury and Rotax, depending on model. We are a factory-authorized service center for Mercury, Yamaha, Suzuki and BRP, so whatever you buy, we can service it here." },
  { q: "Which brand is best for Lake Texoma?", a: "It depends on how you boat. Pontoons suit entertaining and family days in Texoma chop; a Scout center console suits serious fishing; a Highfield RIB suits tenders and fast, rough-water runs. Come tell us how you use the lake." },
  { q: "Do you sell used boats from other brands?", a: "Yes. Used inventory rotates and has included Trifecta, Carolina Skiff, Monterey and Sea Ray alongside used examples of the brands we carry new." },
  { q: "Can I sea trial before I buy?", a: "Yes, by appointment. Schedule a demo and feel how the boat handles real Texoma water before you commit." },
];

export default async function BrandsPage() {
  const boats = (await getInventory()).filter((b) => b.status !== "sold");
  const count = (name: string) => boats.filter((b) => brandOf(b.make) === name).length;

  return (
    <>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": abs("/brands/#page"),
          url: abs("/brands/"),
          name: "Boat brands we sell",
          about: { "@id": ORG_ID },
          hasPart: BRANDS.map((b) => ({ "@type": "WebPage", name: `${b.name} boats`, url: abs(b.path) })),
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": ORG_ID,
          brand: BRANDS.map((b) => ({ "@type": "Brand", name: b.name })),
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Brands" }]),
        faqPage(FAQS, "/brands/"),
      ]} />

      <section className="bwm-hero bwm-hero--short" aria-labelledby="brands-title">
        <div className="bwm-heroMedia">
          <Image src={hero} alt="Friends enjoying a day on a boat on Lake Texoma" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <nav aria-label="Breadcrumb" className="bwm-crumbs bwm-crumbs--light"><ol><li><Link href="/">Home</Link></li><li aria-current="page">Brands</li></ol></nav>
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Four new brands · Pottsboro, Texas</p>
          <h1 id="brands-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Boat brands</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>we sell.</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "460ms" }}>
            Big Water Marine carries four new boat brands at our Pottsboro, Texas dealership on Lake Texoma: Berkshire and Veranda pontoons, Scout center
            consoles, and Highfield aluminum-hull RIBs. Boats are rigged with Suzuki, Yamaha, Mercury or Rotax power, and we service all of it in-house.
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="brands-compare">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Side by side</p>
            <h2 id="brands-compare" className="bwm-h2">Compare <em>the four.</em></h2>
          </header>
          <div className="bwm-tableWrap">
            <table className="bwm-compare bwm-compare--brands">
              <thead><tr><th scope="col">Brand</th><th scope="col">Type</th><th scope="col">Built for</th><th scope="col">Signature</th></tr></thead>
              <tbody>
                {BRANDS.map((b) => (
                  <tr key={b.name}>
                    <th scope="row"><Link href={b.path} className="bwm-inlineLink">{b.name}</Link></th>
                    <td>{b.type}</td>
                    <td>{b.builtFor}</td>
                    <td>{b.signature}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bwm-section bwm-foam" aria-labelledby="brands-why">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Hand-picked for this lake</p>
            <h2 id="brands-why" className="bwm-h2">Why we carry <em>these four.</em></h2>
          </header>
          <ul className="bwm-brandCards" role="list">
            {BRANDS.map((b) => {
              const n = count(b.name);
              return (
                <li key={b.name}>
                  <Link href={b.path} className="bwm-brandCardImg" tabIndex={-1} aria-hidden>
                    <Image src={b.img} alt="" fill sizes="(min-width: 1100px) 45vw, 100vw" placeholder="blur" className="object-cover" />
                  </Link>
                  <div className="bwm-brandCardBody">
                    <h3 className="bwm-brandCardLogo"><Image src={b.logo} alt={b.name} sizes="200px" /></h3>
                    <p className="bwm-brandCardType">{b.type}</p>
                    <p><strong>{b.name}</strong> &mdash; {b.why}</p>
                    <div className="bwm-actions">
                      <Link href={b.path} className="bwm-btnTeal">
                        {n ? `Shop ${n} ${b.name} ${n === 1 ? "boat" : "boats"}` : `Explore ${b.name}`}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="bwm-lede bwm-brandNote">
            All four are serviced by our factory-authorized technicians, so the boat you buy here is maintained here — including mobile service to your dock.
          </p>
        </div>
      </section>

      <section className="bwm-section bwm-white" aria-labelledby="brands-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div>
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Brand questions</p>
            <h2 id="brands-faq" className="bwm-h2">Which one <em>fits you?</em></h2>
            <p className="bwm-lede">
              See what’s in stock on our <Link href="/inventory/" className="bwm-inlineLink">inventory page</Link>, or call{" "}
              <a href={`tel:${config.phoneE164}`} className="bwm-inlineLink">{config.phone}</a> to schedule a demo.
            </p>
            <div className="bwm-actions">
              <Link href="/inventory/" className="bwm-btnTeal">Shop all boats</Link>
              <Link href="/lake-texoma-boat-buying-guide/" className="bwm-textLink">Boat buying guide <Arrow /></Link>
            </div>
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
