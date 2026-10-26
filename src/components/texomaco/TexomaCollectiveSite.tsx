import Image from "next/image";
import Link from "next/link";
import type { AlertItem, BrandConfig, BrandContent, EventItem } from "@/config/types";
import { DismissibleAlert } from "@/components/DismissibleAlert";
import { InquiryForm } from "./InquiryForm";
import { PillarArt, River, Scene, StampBadge, SunMark, ValueIcon, WaveEdge } from "./Art";
import { Rail, RevealObserver } from "./Interactive";
import styles from "./TexomaCollective.module.css";

type TCContent = BrandContent & { pages: Record<string, any>; home: BrandContent["home"] & Record<string, any> };

const NAV = [
  ["/about", "About"],
  ["/services", "Services"],
  ["/partners", "Partners"],
  ["/groups-events", "Groups & Events"],
  ["/events", "Events"],
  ["/explore", "Explore"],
] as const;

/** Card colors cycle through the palette so rails and grids feel collected, not templated. */
const CARD_TONES = ["teal", "sun", "coral", "slate", "sand", "deep"] as const;
const tone = (i: number) => styles[`tone_${CARD_TONES[i % CARD_TONES.length]}`];

const isExternal = (href: string) => /^https?:/.test(href);
function SmartLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return isExternal(href) ? <a href={href} className={className}>{children}</a> : <Link href={href} className={className}>{children}</Link>;
}

/* ───────────────────────── Shell ───────────────────────── */

export function TexomaCollectiveShell({ brand, content, alert, children }: { brand: BrandConfig; content: TCContent; alert: AlertItem | null; children: React.ReactNode }) {
  return (
    <div className={styles.site} data-tc-site="">
      <RevealObserver />
      {alert && <DismissibleAlert alert={alert} brand={brand.slug} />}
      <a href="#main-content" className={styles.skip}>Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="Texoma Collective home">
          <Image src={brand.logo.src} alt="Texoma Collective" width={brand.logo.width} height={brand.logo.height} priority />
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/contact">Contact</Link>
        </nav>
        <Link className={`${styles.btn} ${styles.headerCta}`} href="/partners">Partner with us</Link>
        <details className={styles.mobileMenu}>
          <summary aria-label="Open navigation"><span /><span /><span /></summary>
          <nav aria-label="Mobile navigation">
            {NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            <Link href="/contact">Contact</Link>
            <Link className={styles.btn} href="/partners">Partner with us</Link>
          </nav>
        </details>
      </header>

      <main id="main-content">{children}</main>

      <section className={styles.tapBand} aria-labelledby="tap-heading">
        <Image src="/brands/tap-pass.png" alt="Texoma Access Package" width={500} height={500} />
        <div>
          <p className={styles.kicker}>Texoma Access Package</p>
          <h2 id="tap-heading">One pass. More ways into Texoma.</h2>
          <p>TAP is the visitor side of the Collective, connecting people with participating places, experiences and benefits.</p>
        </div>
        <a className={styles.btnDark} href="https://texomadestinations.com/tap">Explore TAP</a>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLead}>
          <Image src={brand.logo.src} alt="Texoma Collective" width={brand.logo.width} height={brand.logo.height} />
          <p className={styles.script}>{content.footerBlurb}</p>
        </div>
        <div>
          <h3>Explore</h3>
          {NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/faq">FAQ</Link>
        </div>
        <div>
          <h3>Start a conversation</h3>
          <a href={`tel:${brand.nap.phoneE164}`}>{brand.nap.phone}</a>
          <Link href="/contact?type=partner">Business partnership</Link>
          <Link href="/contact?type=group_event">Group or event</Link>
          <Link href="/contact">General question</Link>
        </div>
        <div>
          <h3>Visit</h3>
          <address>{brand.nap.streetAddress}<br />{brand.nap.city}, {brand.nap.region} {brand.nap.postalCode}<br />{brand.nap.hours?.[0]}</address>
          {brand.nap.googleMapsUrl && <a href={brand.nap.googleMapsUrl}>Get directions</a>}
        </div>
        <div className={styles.footerBase}>
          <span>© {new Date().getFullYear()} Texoma Collective</span>
          <span>Texoma Destinations is a founding partner.</span>
          <span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span>
        </div>
      </footer>
    </div>
  );
}

/* ───────────────────────── Shared bits ───────────────────────── */

function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`${styles.kicker} ${light ? styles.light : ""}`}>{children}</p>;
}

function PillarLine({ pillars, light = false }: { pillars: string[]; light?: boolean }) {
  return <p className={`${styles.pillarLine} ${light ? styles.light : ""}`}>{pillars.map((p, i) => <span key={p}>{i > 0 && <b aria-hidden="true">•</b>}{p}</span>)}</p>;
}

/** Highlights phrases inside a sentence with a hand-drawn underline. */
function Highlight({ text, marks }: { text: string; marks: string[] }) {
  if (!marks.length) return <>{text}</>;
  const pattern = new RegExp(`(${marks.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return <>{text.split(pattern).map((part, i) => marks.includes(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>)}</>;
}

function PageHero({ eyebrow, title, intro, tone: sky = "sunset", color = "sand" }: { eyebrow: string; title: string; intro?: string; tone?: "sunset" | "day" | "dusk"; color?: "sand" | "teal" | "slate" }) {
  return (
    <section className={`${styles.pageHero} ${styles[`hero_${color}`]}`}>
      <div className={styles.pageHeroCopy}>
        <Kicker light={color === "slate"}>{eyebrow}</Kicker>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      <div className={styles.pageHeroArt}><div className={styles.arch}><Scene tone={sky} /></div></div>
      <WaveEdge color="var(--tc-bg)" className={styles.edgeBottom} />
    </section>
  );
}

function Callout({ kicker, title, body, href, label, tone: sky = "sunset" }: { kicker: string; title: string; body: string; href: string; label: string; tone?: "sunset" | "dusk" }) {
  return (
    <section className={styles.callout} data-reveal>
      <Scene tone={sky} wide className={styles.calloutScene} />
      <div className={styles.calloutCard}>
        <Kicker>{kicker}</Kicker>
        <h2>{title}</h2>
        <p>{body}</p>
        <Link className={styles.btn} href={href}>{label}</Link>
      </div>
    </section>
  );
}

function PostcardRail({ pillars }: { pillars: any[] }) {
  return (
    <Rail label="This Is Texoma stories">
      {pillars.map((p, i) => (
        <SmartLink key={p.title} href={p.href} className={`${styles.postcard} ${tone(i)}`}>
          <span className={styles.postcardNum}>{String(i + 1).padStart(2, "0")}</span>
          <PillarArt index={i} />
          <span className={styles.postcardBody} role="listitem">
            <strong>{p.title}</strong>
            <span>{p.body}</span>
            <em>Explore <span aria-hidden="true">→</span></em>
          </span>
        </SmartLink>
      ))}
    </Rail>
  );
}

function EventCards({ events }: { events: EventItem[] }) {
  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "America/Chicago" }).format(new Date(iso));
  return (
    <div className={styles.eventCards}>
      {events.map((event, i) => (
        <Link key={event.id} href={`/events/${event.slug}`} className={`${styles.eventCard} ${tone(i)}`} data-reveal>
          <span className={styles.eventDate}><b>{fmt(event.starts_at, { month: "short" })}</b><strong>{fmt(event.starts_at, { day: "numeric" })}</strong></span>
          <h3>{event.title}</h3>
          {event.location && <p>{event.location}</p>}
          <em>Event details →</em>
        </Link>
      ))}
    </div>
  );
}

/* ───────────────────────── Home ───────────────────────── */

export function TexomaCollectiveHome({ content, events }: { content: TCContent; events: EventItem[] }) {
  const h = content.home;
  const pillars: string[] = h.pillars ?? [];
  const explore: any[] = content.pages?.explore?.pillars ?? [];
  const values: any[] = content.pages?.services?.values ?? [];
  const [titleA, titleB] = String(h.heroTitle ?? "The Destination, Together.").split(/,\s*/);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <PillarLine pillars={pillars} />
          <h1 className={styles.heroTitle}>
            <span className={styles.script}>{titleA}{titleB ? "," : ""}</span>
            {titleB && <span className={styles.script}>{titleB}</span>}
          </h1>
          <p className={styles.heroLead}>{h.heroSubtitle}</p>
          <div className={styles.actions}>
            <Link className={styles.btn} href="/explore">Explore Texoma</Link>
            <Link className={styles.btnGhost} href="/partners">Grow with the Collective</Link>
          </div>
        </div>
        <div className={styles.heroArt}>
          <div className={styles.arch}><Scene tone="sunset" /></div>
          <StampBadge className={styles.heroStamp} />
          <p className={styles.heroNote}>{h.heroKicker}</p>
        </div>
        <WaveEdge color="var(--tc-primary)" className={styles.edgeBottom} />
      </section>

      {/* Pillars marquee */}
      <section className={styles.marquee} aria-label="What Texoma Collective does">
        <div>{[...pillars, ...pillars, ...pillars, ...pillars].map((p, i) => <span key={`${p}-${i}`} aria-hidden={i >= pillars.length}>{p}<b aria-hidden="true" /></span>)}</div>
      </section>

      {/* Mission */}
      <section className={styles.mission}>
        <div className={styles.missionPin} data-reveal>
          <Image src="/texomaco/pin.png" alt="The Texoma Collective pin: sun, lake and the Red and Washita rivers" width={700} height={941} />
        </div>
        <div data-reveal>
          <Kicker>Our mission</Kicker>
          <blockquote className={styles.missionQuote}>
            <Highlight text={h.mission ?? ""} marks={["market businesses", "grow businesses", "tell the stories"]} />
          </blockquote>
          <p className={styles.scriptLine}>{h.intro?.title}</p>
          <Link className={styles.textLink} href="/about">Meet the Collective <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      {/* This Is Texoma */}
      {explore.length > 0 && (
        <section className={styles.railSection}>
          <div className={styles.sectionHead} data-reveal>
            <Kicker>This Is Texoma</Kicker>
            <h2>{content.pages?.explore?.title}</h2>
            <p>{content.pages?.explore?.intro}</p>
          </div>
          <PostcardRail pillars={explore} />
        </section>
      )}

      {/* Ways in */}
      <section className={styles.ways}>
        <div className={styles.sectionHead} data-reveal>
          <Kicker>Choose your way in</Kicker>
          <h2>One lake. More than one story.</h2>
        </div>
        <div className={styles.wayGrid}>
          {(h.paths ?? []).map((path: any, i: number) => (
            <Link key={path.title} href={path.href} className={`${styles.wayCard} ${tone(i)}`} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <SunMark className={styles.waySun} />
              <span className={styles.wayNum}>{path.number}</span>
              <h3>{path.title}</h3>
              <p>{path.body}</p>
              <em>{path.label} <span aria-hidden="true">→</span></em>
            </Link>
          ))}
        </div>
      </section>

      {/* Two states */}
      <section className={styles.twoStates}>
        <WaveEdge color="var(--tc-deep)" flip className={styles.edgeTop} />
        <div className={styles.stateWord} data-reveal><span>Texas</span></div>
        <River className={styles.river} />
        <div className={styles.stateWord} data-reveal><span>Oklahoma</span></div>
        <div className={styles.twoStatesCopy} data-reveal>
          <h2><span className={styles.script}>Two States.</span> One Lake.</h2>
          <p>Texas and Oklahoma meet in one shared destination. The Collective works on both shores.</p>
        </div>
        <WaveEdge color="var(--tc-bg)" className={styles.edgeBottom} />
      </section>

      {/* Events */}
      {events.length > 0 && (
        <section className={styles.eventsPreview}>
          <div className={styles.sectionHead} data-reveal>
            <Kicker>On the calendar</Kicker>
            <h2>Gather around something good.</h2>
            <Link className={styles.textLink} href="/events">See all events <span aria-hidden="true">→</span></Link>
          </div>
          <EventCards events={events} />
        </section>
      )}

      {/* For businesses */}
      <section className={styles.business}>
        <div className={styles.businessHead} data-reveal>
          <Kicker>For Texoma businesses</Kicker>
          <h2>{content.pages?.partners?.title}</h2>
          <p>{content.pages?.services?.intro}</p>
          <div className={styles.actions}>
            <Link className={styles.btn} href="/partners">Partner with us</Link>
            <Link className={styles.btnGhost} href="/services">What we do</Link>
          </div>
        </div>
        <ol className={styles.valueList}>
          {values.map((v, i) => (
            <li key={v.title} className={tone(i)} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
              <ValueIcon index={i} />
              <strong>{v.title}</strong>
              <span>{v.body}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* More Texoma */}
      <section className={styles.finale}>
        <Scene tone="dusk" wide className={styles.finaleScene} />
        <div className={styles.finaleCopy}>
          <h2 className={styles.script}>{h.moreTexoma?.title}</h2>
          <p>{h.moreTexoma?.body}</p>
          <div className={styles.actions}>
            <Link className={styles.btn} href="/explore">Explore the lake</Link>
            <Link className={styles.btnLight} href="/contact">Start a conversation</Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ───────────────────────── Inner pages ───────────────────────── */

export function TexomaCollectivePage({ page, content, events }: { page: string; content: TCContent; events: EventItem[] }) {
  const data = content.pages?.[page];
  if (page === "about") return <About data={data} />;
  if (page === "services") return <Services data={data} />;
  if (page === "partners") return <Partners data={data} />;
  if (page === "groups-events") return <GroupsEvents data={data} />;
  if (page === "events") return <Events data={data} events={events} />;
  if (page === "explore") return <Explore data={data} />;
  if (page === "contact") return <Contact data={data} />;
  if (page === "faq") return <Faq data={data} />;
  if (page === "privacy" || page === "terms") return <Legal data={data} />;
  return null;
}

function About({ data }: { data: any }) {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} tone="sunset" />
      <section className={styles.prose} data-reveal>
        {data.body.map((p: string) => <p key={p}>{p}</p>)}
      </section>

      {data.mark && (
        <section className={styles.markStory}>
          <div className={styles.markPin} data-reveal>
            <Image src="/texomaco/pin.png" alt="The Texoma Collective pin" width={700} height={941} />
            <p>{data.mark.caption}</p>
          </div>
          <div>
            <div data-reveal><Kicker>{data.mark.eyebrow}</Kicker><h2>{data.mark.title}</h2></div>
            <dl className={styles.markList}>
              {data.mark.items.map((item: any, i: number) => (
                <div key={item.name} className={tone(i)} data-reveal><dt>{item.name}</dt><dd>{item.body}</dd></div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className={styles.bigPicture}>
        <WaveEdge color="var(--tc-primary)" flip className={styles.edgeTop} />
        <div className={styles.sectionHead} data-reveal>
          <Kicker light>The big picture</Kicker>
          <h2>Three roles. <span className={styles.script}>One stronger Texoma.</span></h2>
        </div>
        <div className={styles.roleGrid}>
          {data.roles.map((role: any, i: number) => (
            <article key={role.name} className={i === 2 ? styles.roleFeature : ""} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <span>{role.label}</span>
              <h3>{role.name}</h3>
              <p>{role.body}</p>
            </article>
          ))}
        </div>
        <WaveEdge color="var(--tc-bg)" className={styles.edgeBottom} />
      </section>

      <section className={styles.team}>
        <div data-reveal><Kicker>The team</Kicker><h2>Lake lovers, parents and storytellers.</h2></div>
        <div className={styles.teamGrid}>
          {data.team.map((person: any, i: number) => (
            <article key={person.name} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <span className={`${styles.avatar} ${tone(i + 1)}`}>{person.name.split(" ").map((part: string) => part[0]).join("")}</span>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Services({ data }: { data: any }) {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} tone="day" color="teal" />
      <section className={styles.valueGrid}>
        {data.values.map((value: any, i: number) => (
          <article key={value.title} className={tone(i)} data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
            <span className={styles.valueNum}>{String(i + 1).padStart(2, "0")}</span>
            <ValueIcon index={i} />
            <h2>{value.title}</h2>
            <p>{value.body}</p>
          </article>
        ))}
      </section>
      <Callout kicker="Where we start" title="Sell the solution. Not the membership." body="The right starting point is the opportunity a business needs: discovery, referrals, visitors, collaboration or insight." href="/contact?type=partner" label="Tell us what you need" />
    </>
  );
}

function Partners({ data }: { data: any }) {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} tone="sunset" color="slate" />
      <section className={styles.tiers}>
        <div className={styles.tierIntro} data-reveal>
          <Kicker>Ways to participate</Kicker>
          <h2>Start where you are. <span className={styles.script}>Grow from there.</span></h2>
          <p>Every level builds on the one before it. We start with fit, need and the opportunity to create real value.</p>
        </div>
        <ol className={styles.tierPath}>
          {data.tiers.map((tier: any, i: number) => (
            <li key={tier.name} className={tone(i)} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <span className={styles.tierStep}>{i + 1}</span>
              <h3>{tier.name}</h3>
              <p className={styles.tierFor}>{tier.for}</p>
              <ul>{tier.benefits.map((b: string) => <li key={b}>{b}</li>)}</ul>
              <Link href={`/contact?type=partner&tier=${encodeURIComponent(tier.name)}`}>Ask about {tier.name} →</Link>
            </li>
          ))}
        </ol>
        <p className={styles.editorialNote}>{data.editorialNote}</p>
      </section>
      <Callout kicker="Your business. The right opportunity." title="Tell us what you are trying to grow." body="A useful partnership begins with a real conversation." href="/contact?type=partner" label="Start a partner inquiry" />
    </>
  );
}

function GroupsEvents({ data }: { data: any }) {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} tone="dusk" color="teal" />
      <section className={styles.collections}>
        <div className={styles.sectionHead} data-reveal>
          <Kicker>Collections</Kicker>
          <h2>The Collective is who we are. <span className={styles.script}>The Collections are what we create.</span></h2>
        </div>
        <div className={styles.collectionGrid}>
          {data.collections.map((item: any, i: number) => (
            <article key={item.title} className={tone(i + 2)} data-reveal>
              <SunMark className={styles.collectionSun} />
              <span className={styles.collectionStatus}>{item.status}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      <Callout kicker="Planning something at Texoma?" title="Start with the people who know the lake." body="Share the shape of your group, wedding, retreat or event and we will route the conversation." href="/contact?type=group_event" label="Plan a group or event" tone="dusk" />
    </>
  );
}

function Events({ data, events }: { data: any; events: EventItem[] }) {
  return (
    <>
      <PageHero eyebrow={data?.eyebrow ?? "What's happening"} title={data?.title ?? "Events"} intro={data?.intro} tone="dusk" color="slate" />
      <section className={styles.eventsPage}>
        {events.length ? <EventCards events={events} /> : (
          <div className={styles.emptyState} data-reveal>
            <Image src="/texomaco/pin.png" alt="" width={700} height={941} />
            <Kicker>The calendar is taking shape</Kicker>
            <h2>No public dates yet.</h2>
            <p>Have an event, partnership or group idea? Start a conversation with the Collective.</p>
            <Link className={styles.btn} href="/contact?type=group_event">Contact the events team</Link>
          </div>
        )}
      </section>
    </>
  );
}

function Explore({ data }: { data: any }) {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} tone="day" color="teal" />
      <section className={styles.exploreGrid}>
        {data.pillars.map((p: any, i: number) => (
          <SmartLink key={p.title} href={p.href} className={`${styles.postcard} ${styles.postcardGrid} ${tone(i)}`}>
            <span className={styles.postcardNum}>{String(i + 1).padStart(2, "0")}</span>
            <PillarArt index={i} />
            <span className={styles.postcardBody}>
              <strong>{p.title}</strong>
              <span>{p.body}</span>
              <em>Explore <span aria-hidden="true">→</span></em>
            </span>
          </SmartLink>
        ))}
      </section>
    </>
  );
}

function Contact({ data }: { data: any }) {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} tone="sunset" />
      <section className={styles.contactGrid}>
        <div className={styles.contactInfo} data-reveal>
          <h2>Come by. Call us. <span className={styles.script}>Tell us the idea.</span></h2>
          <dl>
            <div><dt>Visit</dt><dd><address>81750 N State Hwy 289, Suite 106<br />Pottsboro, TX 75076</address></dd></div>
            <div><dt>Call</dt><dd><a href="tel:+19032001408">903.200.1408</a></dd></div>
            <div><dt>Hours</dt><dd>Tuesday–Saturday, 9am–6pm</dd></div>
          </dl>
        </div>
        <InquiryForm />
      </section>
    </>
  );
}

function Faq({ data }: { data: any }) {
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: data.items.map((item: any) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PageHero eyebrow={data.eyebrow} title={data.title} tone="day" />
      <section className={styles.faq}>
        {data.items.map((item: any, i: number) => (
          <details key={item.q} open={i === 0} data-reveal>
            <summary><span className={styles.faqNum}>{String(i + 1).padStart(2, "0")}</span>{item.q}<b aria-hidden="true">+</b></summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>
    </>
  );
}

function Legal({ data }: { data: any }) {
  return (
    <section className={styles.legal}>
      <Kicker>Texoma Collective</Kicker>
      <h1>{data.title}</h1>
      {data.body.map((p: string) => <p key={p} className={p.startsWith("[OPEN]") ? styles.openItem : ""}>{p}</p>)}
    </section>
  );
}
