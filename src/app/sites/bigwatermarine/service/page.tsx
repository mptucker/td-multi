import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import Motif from "@/bigwatermarine/components/Motif";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import { LABOR, MOBILE_TRAVEL, REVIEWS, SERVICE_ADDONS, SERVICE_WHY, SHOP_POLICIES } from "@/bigwatermarine/lib/service";
import { abs, breadcrumbs, faqPage, pageMeta, SERVICE_ID } from "@/bigwatermarine/lib/seo";
import { Arrow } from "../_components/Finder";

import tech from "@public/media/service-tech.webp";
import team from "@public/media/service-team.webp";
import shrinkwrap from "@public/media/winter-shrinkwrap-row.webp";

export const metadata: Metadata = pageMeta({
  title: "Boat Repair & Marine Service on Lake Texoma | Suzuki, Yamaha, Mercury & BRP",
  description:
    "Factory-authorized boat service in Pottsboro, TX: Suzuki, Yamaha, Mercury and BRP maintenance, repowers, diagnostics, electronics and mobile service at your Lake Texoma dock. Routine work often done the same day.",
  path: "/service/",
  image: abs("/bigwatermarine/media/service-tech.webp"),
});

const ENGINES = ["Suzuki", "Yamaha", "Mercury", "BRP"];

const SERVICES = [
  { name: "Routine maintenance", body: "Factory-interval service: oil and filters, water-pump impellers, lower-unit gear lube, fuel systems. Often finished the same day.", tag: "Often same day" },
  { name: "Repowers", body: "New engine, new life. Engine selection, complete installation and rigging, prop selection and performance tuning, with financing available.", tag: "Quotes by text" },
  { name: "Diagnostics & repairs", body: "State-of-the-art diagnostic equipment, warranty-approved repairs, and an honest timeline before any work starts.", tag: "No surprises" },
  { name: "Winterization & storage", body: "Guaranteed winterization packages, shrink wrap, outdoor storage and spring startup.", tag: "Book early", href: "/winterize/" },
  { name: "Sterndrives & inboards", body: "Inboard/outboard (I/O) service alongside every major outboard brand, whoever sold you the boat.", tag: "All major brands" },
  { name: "Marine electronics", body: "Install and service for Garmin, Humminbird, Lowrance and Raymarine, plus Minn Kota trolling motors, GPS, radar and sonar.", tag: "Install & service" },
  { name: "Audio & lighting", body: "Authorized Wet Sounds dealer: tower speakers, subwoofers, amplifiers and custom lighting, installed right.", tag: "Wet Sounds dealer" },
  { name: "Trailer service", body: "Bearings and repacking, brakes and controllers, axles and hubs, wiring and lights, for boat and utility trailers.", tag: "Safety first" },
  { name: "General repairs", body: "Fiberglass and gelcoat, steering and controls, fuel systems, electrical troubleshooting, upholstery and canvas.", tag: "If it’s broken" },
];

const FAQS = [
  { q: "How do I schedule boat service at Big Water Marine?", a: "Start a work order online through our secure service intake. It takes about two minutes. Our service team texts you back to confirm the work, the timing and the price, and texts again when your boat is ready. You can also call or text 903-419-1019." },
  { q: "Do you service boats you didn’t sell?", a: "Yes. We’re factory-authorized for Suzuki, Yamaha, Mercury and BRP, and we service all major outboards plus sterndrives (I/O), wherever the boat came from." },
  { q: "Can routine maintenance be done the same day?", a: "Often, yes, with advance scheduling. Factory-interval work like oil and filters, impellers and gear lube depends on parts availability, our workload and your boat. We confirm timing with you up front." },
  { q: "Do you offer mobile boat service on Lake Texoma?", a: `Yes. Our mobile team comes to marinas, docks, storage facilities and homes around Lake Texoma, and we’re an approved, insured vendor at most marinas from Highport to Rock Creek and Cedar Bayou. Mobile labor is $${LABOR.mobile}/hour plus travel ($${MOBILE_TRAVEL.minimum} minimum, $${MOBILE_TRAVEL.perMile.toFixed(2)}/mile). Some work, like gear lube or impeller changes, needs the boat on a trailer or lift.` },
  { q: "What is your labor rate?", a: `$${LABOR.onsite} per hour at our Pottsboro service center and $${LABOR.mobile} per hour for mobile service, plus parts and materials. We give you an estimate before doing additional work.` },
  { q: "Will service at Big Water Marine keep my engine warranty intact?", a: "Yes. As an authorized service center for Mercury, Yamaha, Suzuki and BRP, we follow factory procedures, use genuine OEM parts and fluids, and have direct manufacturer support." },
  { q: "Can you pick up my boat?", a: "Yes. We can pick your boat up, service it at our facility and bring it back. For on-water emergencies, we work with TowBoatUS Lake Texoma, then get you back out fast." },
  { q: "Where is the service center and what are the hours?", a: "33 Tackle Box Dr, Pottsboro, TX 75076, minutes from Lake Texoma. Open Tuesday through Friday 8am–5pm and Saturday 8am–3pm." },
];

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
          potentialAction: { "@type": "ReserveAction", target: config.windlassIntakeUrl, name: "Start a work order" },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Marine services",
            itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, description: s.body } })),
          },
        },
        breadcrumbs([{ name: "Home", path: "/" }, { name: "Service" }]),
        faqPage(FAQS, "/service/"),
      ]} />

      {/* ── Hero ── */}
      <section className="bwm-hero bwm-hero--service" aria-labelledby="svc-title">
        <div className="bwm-heroMedia">
          <Image src={tech} alt="A Big Water Marine technician working on a Suzuki outboard in the service shop" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg bwm-heroImg--svc" />
        </div>
        <div className="bwm-heroShade" aria-hidden />
        <div className="bwm-heroInner">
          <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Expert care for your investment</p>
          <h1 id="svc-title" className="bwm-heroTitle bwm-heroTitle--md">
            <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Bought here or not,</span>
            <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}><em>we&rsquo;ll keep you on the water.</em></span>
          </h1>
          <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "500ms" }}>
            Factory-authorized service from certified technicians who treat every boat like their own: <strong>Suzuki, Yamaha, Mercury and BRP</strong>.
            Same-day service available. On-site or mobile, we come to you. Start a work order and we&rsquo;ll text you.
          </p>
          <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "620ms" }}>
            <a href={config.windlassIntakeUrl} className="bwm-btnTeal">Start a work order</a>
            <a href={smsHref("Hi! I have a question about service for my boat.")} className="bwm-btnOutlineLight">Text the service team</a>
          </div>
          <p className="bwm-heroMeta bwm-in" style={{ ["--d" as string]: "740ms" }}>
            33 Tackle Box Dr, Pottsboro · Tue–Fri 8am–5pm · Sat 8am–3pm
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bwm-section bwm-white" aria-labelledby="svc-how">
        <div className="bwm-wrap bwm-howGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />How service works</p>
            <h2 id="svc-how" className="bwm-h2">Two minutes to book. <em>Texts the whole way.</em></h2>
            <p className="bwm-lede">
              Tell us about the boat once, on our secure work-order page. From there, everything happens by text: the estimate, the timing, the
              &ldquo;it&rsquo;s ready&rdquo; message. Repairs and repowers get an honest timeline before anything starts.
            </p>
            <div className="bwm-actions">
              <a href={config.windlassIntakeUrl} className="bwm-btnTeal">Start a work order</a>
              <a href={`tel:${config.phoneE164}`} className="bwm-textLink">Or call {config.phone} <Arrow /></a>
            </div>
          </div>
          <ol className="bwm-howSteps" role="list">
            <li className="bwm-fx"><span className="bwm-stepNum">1</span><div><h3>Start a work order</h3><p>Your boat, your engine, what it needs, and where it is: our shop, your dock or your driveway.</p></div></li>
            <li className="bwm-fx"><span className="bwm-stepNum">2</span><div><h3>We text to confirm</h3><p>Timing and price, before any work. Anything extra gets an estimate first, every time.</p></div></li>
            <li className="bwm-fx"><span className="bwm-stepNum">3</span><div><h3>We do it right</h3><p>Factory procedures, genuine parts, and techs who treat every boat like their own.</p></div></li>
            <li className="bwm-fx"><span className="bwm-stepNum">4</span><div><h3>Back on the water</h3><p>We text when it&rsquo;s ready. Routine maintenance is often finished the same day.</p></div></li>
          </ol>
        </div>
      </section>

      {/* ── Factory-authorized ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="svc-auth">
        <div className="bwm-wrap bwm-splitGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Factory-authorized</p>
            <h2 id="svc-auth" className="bwm-h2">The exact care <em>your engine maker recommends.</em></h2>
            <p className="bwm-lede">
              When you&rsquo;ve invested in premium equipment, you need a service center that matches that commitment. Big Water Marine combines
              factory-authorized expertise with genuine care for every vessel that enters our facility. Whether it&rsquo;s routine maintenance, a complex
              repower, or seasonal winterization, our certified technicians approach every job with precision and pride. We&rsquo;re not just fixing
              boats&mdash;we&rsquo;re protecting your time on the water.
            </p>
            <p className="bwm-lede">
              As an authorized service center for Mercury, Yamaha, Suzuki, and BRP, we have direct access to technical support, genuine parts, and
              factory training. Your warranty stays intact, and your engine gets the exact care the manufacturer recommends.
            </p>
            <ul className="bwm-engineList" role="list">
              {ENGINES.map((e) => <li key={e}>{e}</li>)}
            </ul>
            <ul className="bwm-checks" role="list">
              <li>Factory-trained, certified technicians</li>
              <li>Genuine OEM parts and fluids</li>
              <li>State-of-the-art diagnostic equipment</li>
              <li>Transparent pricing and communication</li>
              <li>Work guaranteed&mdash;because we stand behind our service</li>
              <li>All major outboard brands, plus sterndrive and inboard/outboard (I/O) service</li>
              <li>Factory service intervals, diagnostics and warranty-approved repairs</li>
              <li>Same-day service for routine maintenance</li>
            </ul>
          </div>
          <figure className="bwm-tallFigure bwm-fx">
            <Image src={team} alt="The Big Water Marine service team outside the shop in Pottsboro" fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
            <figcaption>The crew at 33 Tackle Box Dr. We&rsquo;re boaters too.</figcaption>
          </figure>
        </div>
      </section>

      {/* ── What we do ── */}
      <section className="bwm-section bwm-white" aria-labelledby="svc-what">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />What we do</p>
            <h2 id="svc-what" className="bwm-h2">Full-service marine, <em>start to finish.</em></h2>
          </header>
          <ul className="bwm-services" role="list">
            {SERVICES.map((s) => (
              <li key={s.name} className="bwm-fx">
                <span className="bwm-serviceTag">{s.tag}</span>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
                {s.href && <Link href={s.href} className="bwm-textLink">See packages and prices <Arrow /></Link>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Shop or mobile ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="svc-where">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Your choice</p>
            <h2 id="svc-where" className="bwm-h2">We come to you. <em>Or you come to us.</em></h2>
          </header>
          <div className="bwm-twoUp">
            <div className="bwm-option bwm-fx">
              <h3>At our service center</h3>
              <p className="bwm-optionPrice">${LABOR.onsite}<span>/hour labor</span></p>
              <ul className="bwm-checks" role="list">
                <li>State-of-the-art facility with modern diagnostic tools</li>
                <li>Climate-controlled bays, professional equipment, and a comfortable waiting area</li>
                <li>Convenient location minutes from Lake Texoma</li>
                <li>Trailer available if you need transport assistance</li>
                <li>Drop-off scheduling for your convenience</li>
                <li>Same-day service available for routine maintenance</li>
              </ul>
              <p className="bwm-optionMeta">33 Tackle Box Dr, Pottsboro, TX 75076 · Tue–Fri 8–5, Sat 8–3. Serving Lake Texoma, North Texas and DFW, and Southern Oklahoma and Oklahoma City markets.</p>
            </div>
            <div className="bwm-option bwm-option--hi bwm-fx">
              <span className="bwm-serviceTag">Popular</span>
              <h3>Mobile, at your dock</h3>
              <p className="bwm-optionPrice">${LABOR.mobile}<span>/hour labor + travel</span></p>
              <ul className="bwm-checks" role="list">
                <li>Marinas, private docks, storage facilities and homes</li>
                <li>Approved and insured at most Texoma marinas, from Highport to Rock Creek and Cedar Bayou</li>
                <li>Service throughout the Texoma area</li>
                <li>Full diagnostic and repair capability on site</li>
                <li>Transport service available to bring your boat to our shop if needed</li>
                <li>On-water towing through our TowBoatUS Lake Texoma partnership</li>
              </ul>
              <p className="bwm-optionMeta">Travel: ${MOBILE_TRAVEL.minimum} minimum, ${MOBILE_TRAVEL.perMile.toFixed(2)}/mile. Some work needs a trailer or lift.</p>
            </div>
          </div>
          <div className="bwm-actions bwm-actions--center">
            <a href={config.windlassIntakeUrl} className="bwm-btnTeal">Start a work order</a>
          </div>
        </div>
      </section>

      {/* ── Why Big Water ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="svc-whyus">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Why Big Water Marine for service?</p>
            <h2 id="svc-whyus" className="bwm-h2">You have choices. <em>Here&rsquo;s why boaters choose us.</em></h2>
            <p className="bwm-lede">You have choices when it comes to marine service. Here&rsquo;s why discerning boat owners throughout Lake Texoma trust Big Water Marine.</p>
          </header>
          <ul className="bwm-perks" role="list">
            {SERVICE_WHY.map((w) => <li key={w.title}><h3>{w.title}</h3><p>{w.body}</p></li>)}
          </ul>
          <div className="bwm-menuGrid bwm-mt">
            <div>
              <h3 className="bwm-h3">Additional services</h3>
              <ul className="bwm-checks" role="list">{SERVICE_ADDONS.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="bwm-notes">
              <h3 className="bwm-h3">Good to know</h3>
              <ul role="list">{SHOP_POLICIES.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="bwm-section bwm-white" aria-labelledby="svc-reviews">
        <div className="bwm-wrap">
          <header className="bwm-sectionHead bwm-sectionHead--center bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Genuine care</p>
            <h2 id="svc-reviews" className="bwm-h2">What Texoma boaters <em>tell us.</em></h2>
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
        <Image src={shrinkwrap} alt="" fill sizes="100vw" placeholder="blur" className="bwm-statementImg bwm-parallax" />
        <div className="bwm-statementShade" aria-hidden />
        <div className="bwm-statementInner bwm-fx">
          <p className="bwm-script bwm-statementScript">It&rsquo;s that time</p>
          <h2 id="svc-winter" className="bwm-statementLine">
            Winterize once. Relax all winter.
            <span>Protect your investment through the off-season. Guaranteed winterization packages from $335, plus shrink wrap, outdoor storage, spring commissioning, and pickup and delivery options.</span>
          </h2>
          <div className="bwm-actions bwm-actions--center">
            <Link href="/winterize/" className="bwm-btnTeal">See winterization packages</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bwm-section bwm-foam" aria-labelledby="svc-faq">
        <div className="bwm-wrap bwm-helpGrid">
          <div className="bwm-fx">
            <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Straight answers</p>
            <h2 id="svc-faq" className="bwm-h2">Service <em>questions.</em></h2>
            <p className="bwm-lede">Anything else? Text the service team and a real person answers.</p>
            <div className="bwm-actions">
              <a href={smsHref("Hi! I have a service question.")} className="bwm-btnTeal">Text {config.phone}</a>
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
