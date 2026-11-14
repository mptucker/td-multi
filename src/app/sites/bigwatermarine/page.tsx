import Image from "next/image";
import Motif from "@/bigwatermarine/components/Motif";
import Link from "next/link";
import { engineMakers, site } from "@/bigwatermarine/lib/content";
import { getInventory, brandOf } from "@/bigwatermarine/lib/boats";
import { config, smsHref } from "@/bigwatermarine/lib/config";
import JsonLd from "@/bigwatermarine/components/JsonLd";
import { faqPage } from "@/bigwatermarine/lib/seo";
import Finder, { Arrow } from "./_components/Finder";
import Builders from "./_components/Builders";

import hero from "@public/media/scout-offshore.webp";
import bridge from "@public/media/scout-dorado.webp";
import outboards from "@public/media/veranda-vx27.webp";
import dusk from "@public/media/texoma-dusk-cruise.webp";
import familyBig from "@public/media/hero-lifestyle.webp";
import familyA from "@public/media/highfield-sunset.webp";
import familyB from "@public/media/veranda-family.webp";
import familyC from "@public/media/texoma-open-water.webp";
import fleet from "@public/media/club-fleet.webp";
import couple from "@public/media/club-couple.webp";
import sunset from "@public/media/texoma-sunset.webp";
import { faqs as pageFaqs } from "@/bigwatermarine/lib/cms";


// FAQs are edited in /admin (content/bigwatermarine.json → faqs.home).
const faqs = pageFaqs("home");

export const revalidate = 300;

export default async function Home() {
  const inventory = await getInventory();
  const newCount = inventory.filter((b) => b.condition === "New").length;
  const usedCount = inventory.length - newCount;
  const counts: Record<string, number> = {};
  for (const b of inventory) counts[brandOf(b.make)] = (counts[brandOf(b.make)] ?? 0) + 1;

  return (
    <>
      <JsonLd data={faqPage(faqs.map((f) => ({ q: f.q, a: f.a })), "/")} />
        {/* 1 · Hero: lead with what's for sale */}
        <section id="top" className="bwm-hero" aria-labelledby="bwm-hero-title">
          <div className="bwm-heroMedia">
            <Image src={hero} alt="A Scout center console carving a wide wake across deep blue water" fill sizes="100vw" placeholder="blur" loading="eager" fetchPriority="high" className="bwm-heroImg" />
          </div>
          <div className="bwm-heroShade" aria-hidden />
          <div className="bwm-heroInner">
            <p className="bwm-eyebrow bwm-in" style={{ ["--d" as string]: "80ms" }}>Lake Texoma · Pottsboro, Texas</p>
            <h1 id="bwm-hero-title" className="bwm-heroTitle">
              <span className="bwm-in" style={{ ["--d" as string]: "160ms" }}>Your next boat</span>
              <span className="bwm-in" style={{ ["--d" as string]: "260ms" }}>is <em>already here.</em></span>
            </h1>
            <p className="bwm-heroScript bwm-in" style={{ ["--d" as string]: "520ms" }}>Welcome to the family</p>
            <p className="bwm-heroLede bwm-in" style={{ ["--d" as string]: "620ms" }}>
              {inventory.length} new and pre-owned boats in stock from Scout, Veranda, Highfield and Berkshire.
              Every one backed by the factory-certified service team down the road.
            </p>
            <div className="bwm-actions bwm-in" style={{ ["--d" as string]: "740ms" }}>
              <Link href="/inventory/" className="bwm-btnTeal">Shop {inventory.length} boats</Link>
              <a href={config.windlassIntakeUrl} className="bwm-btnOutlineLight">Book service</a>
            </div>
            <dl className="bwm-heroStats bwm-in" style={{ ["--d" as string]: "860ms" }}>
              <div><dt>New in stock</dt><dd>{newCount}</dd></div>
              <div><dt>Pre-owned</dt><dd>{usedCount}</dd></div>
              <div><dt>Certified engine makers</dt><dd>{engineMakers.length}</dd></div>
            </dl>
          </div>
        </section>

        {/* 2 · On our lot (overlaps the hero) */}
        <div className="bwm-lotField">
          <div className="bwm-wrap">
            <Finder boats={inventory} />
            <div className="bwm-buyStrip">
              <p><strong>Financing &amp; trade-ins handled in-house.</strong> Get pre-qualified or value your trade before you visit.</p>
              <Link href={site.links.financing} className="bwm-textLink">Financing &amp; trade-ins <Arrow /></Link>
            </div>
          </div>
        </div>

        {/* 3 · Photographic bridge into the builders and service */}
        <section className="bwm-bridge" aria-label="Every boat comes with a team">
          <Image src={bridge} alt="A Scout Dorado running fast across open water" fill sizes="100vw" placeholder="blur" className="bwm-bridgeImg bwm-parallax" />
          <div className="bwm-bridgeShade" aria-hidden />
          <p className="bwm-bridgeLine bwm-fx">Every boat we sell comes with <em>a team that keeps it running.</em></p>
        </section>

        {/* 4 · Four builders */}
        <section id="builders" className="bwm-section bwm-white" aria-labelledby="bwm-builders-title">
          <div className="bwm-wrap">
            <header className="bwm-sectionHead bwm-fx">
              <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Premium Boats</p>
              <h2 id="bwm-builders-title" className="bwm-h2">Four builders we&rsquo;d put <em>our own name behind.</em></h2>
              <p className="bwm-lede">
                We carry a short list on purpose. Scout, Veranda, Highfield and Berkshire each earned their place on Texoma&rsquo;s big,
                sometimes rough water, and every one of them is backed by our own service team.
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
                <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Superior Service</p>
                <h2 id="bwm-service-title" className="bwm-h2">Bought here or not, <em>we&rsquo;ll keep you on the water.</em></h2>
                <p className="bwm-lede">
                  Texoma&rsquo;s factory-authorized service department, with genuine OEM parts and technicians who know these engines inside and out.
                  Routine maintenance at your engine maker&rsquo;s recommended intervals is often finished the same day, so a quick check-up
                  doesn&rsquo;t cost you a weekend. Repairs and repowers get an honest timeline up front.
                </p>
              </header>

              <ul className="bwm-proof" role="list">
                <li><span className="bwm-proofK">Factory-certified</span>{engineMakers.join(" · ")}</li>
                <li><span className="bwm-proofK">Often same day</span>Oil &amp; filter, impeller and lower-unit service</li>
                <li><span className="bwm-proofK">Mobile service</span>A certified technician comes to your dock</li>
                <li><span className="bwm-proofK">Any boat</span>We service boats we didn&rsquo;t sell</li>
              </ul>

              <figure className="bwm-serviceFigure">
                <Image src={outboards} alt="Twin outboards on a Veranda pontoon running past a wooded shore" fill sizes="(min-width: 1024px) 44vw, 100vw" placeholder="blur" className="object-cover" />
                <figcaption>
                  <strong>Service center</strong> 33 Tackle Box Dr, Pottsboro
                  <span>Tue–Fri 8am–5pm · Sat 8am–3pm</span>
                </figcaption>
              </figure>

              <aside className="bwm-season" aria-label="Winterization">
                <p className="bwm-script bwm-seasonScript">It&rsquo;s that time</p>
                <p>Guaranteed winterization protects your engine through the freeze. Appointments fill fast.</p>
                <a href="/winterize/" className="bwm-textLink">Reserve winterization <Arrow /></a>
              </aside>
            </div>

            <div className="bwm-serviceSide">
              <div className="bwm-planner">
                <h3 className="bwm-plannerTitle">Start a service request</h3>
                <ol className="bwm-steps" role="list">
                  <li><span className="bwm-stepNum">1</span><span><strong>Tell us about your boat</strong> on our secure work-order page. It takes about two minutes.</span></li>
                  <li><span className="bwm-stepNum">2</span><span><strong>We text you back</strong> to confirm the work, the timing and the price.</span></li>
                  <li><span className="bwm-stepNum">3</span><span><strong>We text again when it&rsquo;s ready.</strong> Routine work is often done the same day.</span></li>
                </ol>
                <div className="bwm-actions">
                  <a href={config.windlassIntakeUrl} className="bwm-btnTeal">Start a work order</a>
                  <a href={smsHref("Hi! I have a service question about my boat.")} className="bwm-textLink">Or text us <Arrow /></a>
                </div>
              </div>
              <div className="bwm-faq">
                <h3 className="bwm-faqTitle">A few things people ask</h3>
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
          <Image src={dusk} alt="" fill sizes="100vw" placeholder="blur" className="bwm-statementImg bwm-parallax" />
          <div className="bwm-statementShade" aria-hidden />
          <div className="bwm-statementInner bwm-fx">
            <Motif className="bwm-statementMotif" lineColor="var(--bwm-teal)" barColor="rgba(255,255,255,.28)" />
            <p className="bwm-statementLine">
              Premium boats. Superior service. Genuine care.
              <span>One team from the day you buy to every season after.</span>
            </p>
          </div>
        </section>

        {/* 7 · The Big Water lifestyle + Boat Club */}
        <section id="family" className="bwm-section bwm-white" aria-labelledby="bwm-family-title">
          <div className="bwm-wrap">
            <header className="bwm-sectionHead bwm-sectionHead--center bwm-fx">
              <p className="bwm-kicker"><Motif linesOnly className="bwm-kickerMark" />Genuine Care</p>
              <h2 id="bwm-family-title" className="bwm-h2 bwm-h2--xl">You&rsquo;re not buying a boat. <em>You&rsquo;re joining the family.</em></h2>
              <p className="bwm-lede">
                Some places sell boats. We&rsquo;re here for everything that comes after. The first launch. The kids&rsquo; favorite cove.
                The friends who turn into family. That&rsquo;s the good stuff.
              </p>
            </header>

            <div className="bwm-mosaic">
              <figure className="bwm-mosaicA bwm-fx">
                <Image src={familyBig} alt="Friends tossing a football in the shallows beside a Berkshire pontoon" fill sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" className="object-cover" />
              </figure>
              <figure className="bwm-mosaicB bwm-fx">
                <Image src={familyA} alt="A family cruising in a Highfield RIB at golden hour" fill sizes="(min-width: 1024px) 34vw, 55vw" placeholder="blur" className="object-cover" />
              </figure>
              <figure className="bwm-mosaicC bwm-fx">
                <Image src={familyB} alt="A dad in the water catching a jumping kid off a Veranda pontoon" fill sizes="(min-width: 1024px) 26vw, 45vw" placeholder="blur" className="object-cover" />
              </figure>
              <figure className="bwm-mosaicD bwm-fx">
                <Image src={familyC} alt="A boat crossing open water under a wide Texoma sky" fill sizes="(min-width: 1024px) 30vw, 100vw" placeholder="blur" className="object-cover" />
              </figure>
              <p className="bwm-script bwm-mosaicScript bwm-fx">That&rsquo;s going Big.</p>
            </div>
          </div>
        </section>

        <section id="club" className="bwm-section bwm-club" aria-labelledby="bwm-club-title">
          <div className="bwm-wrap bwm-clubGrid">
            <div className="bwm-clubMedia bwm-fx">
              <Image src={fleet} alt="The Big Water Boat Club fleet running in formation" fill sizes="(min-width: 1024px) 54vw, 100vw" placeholder="blur" className="object-cover" />
              <div className="bwm-clubInset">
                <Image src={couple} alt="A couple relaxing aboard a Boat Club boat" fill sizes="(min-width: 1024px) 24vw, 50vw" placeholder="blur" className="object-cover" />
              </div>
            </div>
            <div className="bwm-clubText bwm-fx">
              <p className="bwm-kicker bwm-kicker--light"><Motif linesOnly className="bwm-kickerMark" />Big Water Boat Club</p>
              <h2 id="bwm-club-title" className="bwm-h2">All of the lake days. <em>None of the upkeep.</em></h2>
              <p className="bwm-lede">
                Not ready to own? You&rsquo;re still one of us. Membership unlocks discounted boat rentals at Lighthouse Resort &amp; Marina,
                with no maintenance, storage or ownership costs. Pick your day, bring your people, and let the lake do the rest.
                Plenty of our owners started right here.
              </p>
              <div className="bwm-actions">
                <Link href="/boatclub/" className="bwm-btnTeal">Explore Boat Club</Link>
                <a href={smsHref("Hi! I'd like to hear more about Big Water Boat Club.")} className="bwm-textLink bwm-textLink--light">Text us about membership <Arrow /></a>
              </div>
              <p className="bwm-fine">Membership dues, rental charges, fuel, deposits and other program terms apply. Reservations subject to availability.</p>
            </div>
          </div>

          <div className="bwm-wrap">
            <h3 className="bwm-nextTitle">Your next step</h3>
            <ul className="bwm-next" role="list">
              <li><span className="bwm-nextK">Own</span><span>Find the boat that fits how you actually spend a Saturday.</span><Link href="/inventory/" className="bwm-textLink bwm-textLink--light">Shop boats <Arrow /></Link></li>
              <li><span className="bwm-nextK">Join</span><span>Boat Club access, with the upkeep handled for you.</span><a href={site.links.boatClub} className="bwm-textLink bwm-textLink--light">Boat Club <Arrow /></a></li>
              <li><span className="bwm-nextK">Explore</span><span>Lodging, camping and adventure with our friends at Texoma Destinations.</span><a href={site.links.texoma} className="bwm-textLink bwm-textLink--light">The Most Texoma <Arrow /></a></li>
            </ul>
          </div>
        </section>

        {/* 8 · Visit */}
        <section id="visit" className="bwm-visit" aria-labelledby="bwm-visit-title">
          <Image src={sunset} alt="Sunset over Lake Texoma" fill sizes="100vw" placeholder="blur" className="bwm-visitImg" />
          <div className="bwm-visitShade" aria-hidden />
          <div className="bwm-wrap">
            <p className="bwm-script bwm-visitScript">See you on the water</p>
            <h2 id="bwm-visit-title" className="bwm-h2">Come see us <em>in Pottsboro.</em></h2>
            <p className="bwm-visitArea">Based in Pottsboro, we serve Lake Texoma, Sherman, Denison, North Texas and Southern Oklahoma.</p>
            <div className="bwm-visitGrid">
              {site.locations.map((l) => (
                <div key={l.name} className="bwm-loc">
                  <h3>{l.name}</h3>
                  <p>{l.street}<br />{l.city}</p>
                  <p className="bwm-locHours">{l.hours.map((h) => <span key={h}>{h}</span>)}</p>
                  <a href={l.map} className="bwm-textLink bwm-textLink--light">Get directions <Arrow /></a>
                </div>
              ))}
              <div className="bwm-loc">
                <h3>Sales &amp; Service</h3>
                <a href={site.phoneHref} className="bwm-bigPhone">{site.phone}</a>
                <a href={smsHref("Hi Big Water Marine!")} className="bwm-btnTeal">Text us</a>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
