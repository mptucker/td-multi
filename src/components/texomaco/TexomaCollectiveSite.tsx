import Image from "next/image";
import Link from "next/link";
import type { AlertItem, BrandConfig, BrandContent, EventItem } from "@/config/types";
import { DismissibleAlert } from "@/components/DismissibleAlert";
import { InquiryForm } from "./InquiryForm";
import styles from "./TexomaCollective.module.css";

type TCContent = BrandContent & { pages: Record<string, any>; home: BrandContent["home"] & Record<string, any> };

const NAV = [
  ["/about", "About"],
  ["/services", "What we do"],
  ["/partners", "Partners"],
  ["/groups-events", "Groups & events"],
  ["/events", "Events"],
  ["/explore", "Explore"],
] as const;

export function TexomaCollectiveShell({ brand, content, alert, children }: { brand: BrandConfig; content: TCContent; alert: AlertItem | null; children: React.ReactNode }) {
  return <div className={styles.site}>
    {alert && <DismissibleAlert alert={alert} brand={brand.slug} />}
    <a href="#main-content" className={styles.skip}>Skip to content</a>
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="Texoma Collective home"><Image src={brand.logo.src} alt="Texoma Collective" width={brand.logo.width} height={brand.logo.height} priority /></Link>
      <nav className={styles.desktopNav} aria-label="Primary navigation">{NAV.map(([href,label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <Link className={styles.headerCta} href="/contact?type=partner">Partner with us <span>↗</span></Link>
      <details className={styles.mobileMenu}><summary aria-label="Open navigation">Menu</summary><nav>{NAV.map(([href,label]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/contact">Contact</Link></nav></details>
    </header>
    <main id="main-content">{children}</main>
    <section className={styles.tapBand} aria-labelledby="tap-heading"><Image src="/brands/tap-pass.png" alt="TAP" width={500} height={500} /><div><p>Texoma Access Package</p><h2 id="tap-heading">One pass. More ways into Texoma.</h2><span>TAP is the consumer side of the Collective - connecting people with participating places, experiences and benefits.</span></div><a href="https://texomadestinations.com/tap">Explore TAP <b>↗</b></a></section>
    <footer className={styles.footer}>
      <div className={styles.footerLead}><Image src={brand.logo.src} alt="Texoma Collective" width={brand.logo.width} height={brand.logo.height} /><p>{content.footerBlurb}</p></div>
      <div><h3>Explore</h3>{NAV.map(([href,label]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/faq">FAQ</Link></div>
      <div><h3>Start a conversation</h3><a href={`tel:${brand.nap.phoneE164}`}>{brand.nap.phone}</a><Link href="/contact?type=partner">Business partnership</Link><Link href="/contact?type=group_event">Group or event</Link></div>
      <div><h3>Visit</h3><address>{brand.nap.streetAddress}<br />{brand.nap.city}, {brand.nap.region} {brand.nap.postalCode}<br />{brand.nap.hours?.[0]}</address></div>
      <div className={styles.footerBase}><span>© {new Date().getFullYear()} Texoma Collective</span><span>Texoma Destinations is the founding partner.</span><span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></span></div>
    </footer>
  </div>;
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) { return <p className={`${styles.eyebrow} ${light ? styles.light : ""}`}><span />{children}</p>; }

export function TexomaCollectiveHome({ content, events }: { content: TCContent; events: EventItem[] }) {
  const h = content.home;
  return <>
    <section className={styles.hero}>
      <Image src={h.heroImage.src} alt={h.heroImage.alt} fill priority sizes="100vw" className={styles.cover} />
      <div className={styles.heroShade} />
      <div className={styles.heroMark}><Image src="/texomaco/pin.png" alt="" width={700} height={941} /></div>
      <div className={styles.heroCopy}><Eyebrow light>{h.heroKicker}</Eyebrow><h1>The Destination,<br /><em>Together.</em></h1><p>{h.heroSubtitle}</p><div className={styles.heroActions}><Link href="/explore">Explore Texoma <span>↗</span></Link><Link href="/partners">Grow with the Collective <span>↗</span></Link></div></div>
      <div className={styles.heroRail}><span>Tourism</span><span>Marketing</span><span>Events</span><span>Sales</span><span>Growth</span></div>
    </section>

    <section className={styles.intro}>
      <div><Eyebrow>Rooted here</Eyebrow><Image src="/texomaco/pin.png" alt="The Texoma Collective pin represents the lake, rivers and sun" width={700} height={941} /></div>
      <div><h2>{h.intro.title}</h2>{h.intro.body.map((p: string) => <p key={p}>{p}</p>)}<Link className={styles.textLink} href="/about">Meet the Collective <span>↗</span></Link></div>
    </section>

    <section className={styles.pathSection}>
      <div className={styles.pathHeading}><Eyebrow>Choose your way in</Eyebrow><h2>One lake.<br />More than one story.</h2></div>
      <div className={styles.paths}>{h.paths.map((path: any, index: number) => <article key={path.title} className={index === 1 ? styles.pathReverse : ""}><div className={styles.pathImage}><Image src={path.image} alt="" fill sizes="(max-width: 800px) 100vw, 55vw" className={styles.cover} /><span>{path.number}</span></div><div className={styles.pathCopy}><p>{path.number}</p><h3>{path.title}</h3><span>{path.body}</span><Link href={path.href}>{path.label} <b>↗</b></Link></div></article>)}</div>
    </section>

    <section className={styles.pillarMarquee} aria-label="Texoma Collective pillars"><div>{[...h.pillars,...h.pillars].map((p: string, i: number) => <span key={`${p}-${i}`}>{p}<b>•</b></span>)}</div></section>

    {events.length > 0 && <section className={styles.eventsPreview}><div><Eyebrow>On the calendar</Eyebrow><h2>Gather around<br />something good.</h2><Link className={styles.textLink} href="/events">See all events <span>↗</span></Link></div><EventCards events={events} /></section>}

    <section className={styles.moreBand}><div className={styles.morePhotos}><div><Image src="/water-taxi/family.webp" alt="Family enjoying Lake Texoma" fill sizes="40vw" className={styles.cover} /></div><div><Image src="/fastrac/guests-sunset-current.jpg" alt="Friends sharing a Lake Texoma sunset" fill sizes="40vw" className={styles.cover} /></div></div><div className={styles.moreCopy}><Eyebrow light>{h.moreTexoma.eyebrow}</Eyebrow><h2>{h.moreTexoma.title}</h2><p>{h.moreTexoma.body}</p><div><Link href="/explore">Explore the place <span>↗</span></Link><Link href="/contact">Start a conversation <span>↗</span></Link></div></div></section>
  </>;
}

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

function PageHero({ eyebrow, title, intro, image }: { eyebrow: string; title: string; intro?: string; image?: string }) {
  return <section className={styles.pageHero}><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{intro && <p>{intro}</p>}</div>{image && <div><Image src={image} alt="" fill priority sizes="(max-width: 800px) 100vw, 48vw" className={styles.cover} /></div>}</section>;
}

function About({ data }: { data: any }) { return <><PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} image="/water-taxi/family.webp" /><section className={styles.proseLead}>{data.body.map((p: string) => <p key={p}>{p}</p>)}</section><section className={styles.bigPicture}><Eyebrow>The big picture</Eyebrow><h2>Three roles.<br />One stronger destination.</h2><div>{data.roles.map((role: any, i: number) => <article key={role.name}><span>0{i+1}</span><p>{role.label}</p><h3>{role.name}</h3><div>{role.body}</div></article>)}</div></section><section className={styles.team}><div><Eyebrow>The team</Eyebrow><h2>Local knowledge.<br />Shared responsibility.</h2></div><div>{data.team.map((person: any) => <article key={person.name}><span>{person.name.split(" ").map((part: string) => part[0]).join("")}</span><h3>{person.name}</h3><p>{person.role}</p></article>)}</div></section></>; }

function Services({ data }: { data: any }) { return <><PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} image="/tackle-box/interior.webp" /><section className={styles.valueGrid}>{data.values.map((value: any, i: number) => <article key={value.title}><span>0{i+1}</span><h2>{value.title}</h2><p>{value.body}</p></article>)}</section><Callout eyebrow="The principle" title="Sell the solution. Not the membership." body="The right starting point is the opportunity a business needs - discovery, referrals, visitors, collaboration or insight." href="/contact?type=partner" label="Tell us what you need" /></>; }

function Partners({ data }: { data: any }) { return <><PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} image="/paradise/aerial-peninsula.jpg" /><section className={styles.tiers}><div className={styles.tierIntro}><Eyebrow>Ways to participate</Eyebrow><h2>Start where<br />you are.</h2><p>No public pricing is shown in this preview. We start with fit, need and the opportunity to create measurable value.</p></div><div>{data.tiers.map((tier: any, i: number) => <details key={tier.name} open={i === 0}><summary><span>0{i+1}</span><strong>{tier.name}</strong><em>{tier.for}</em><b>+</b></summary><div><ul>{tier.benefits.map((benefit: string) => <li key={benefit}>{benefit}</li>)}</ul><Link href={`/contact?type=partner&tier=${encodeURIComponent(tier.name)}`}>Ask about {tier.name} <span>↗</span></Link></div></details>)}</div></section><p className={styles.editorialNote}>{data.editorialNote}</p><Callout eyebrow="Your business. The right opportunity." title="Let us learn what you are trying to grow." body="A useful partnership begins with a real conversation." href="/contact?type=partner" label="Start a partner inquiry" /></>; }

function GroupsEvents({ data }: { data: any }) { return <><PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} image="/lighthouse/cruise.jpg" /><section className={styles.collectionStory}><div><Eyebrow>Collections</Eyebrow><h2>The Collective is who we are.<br /><em>The Collections are what we create.</em></h2></div>{data.collections.map((item: any, i: number) => <article key={item.title}><span>0{i+1}</span><small>{item.status}</small><h3>{item.title}</h3><p>{item.body}</p></article>)}</section><Callout eyebrow="Planning something at Texoma?" title="Start with the people who know the lake." body="Share the shape of your group, wedding, retreat or event and we will route the conversation." href="/contact?type=group_event" label="Plan a group or event" /></>; }

function Events({ events }: { data: any; events: EventItem[] }) { return <><PageHero eyebrow="What's happening" title="The lake gives us reasons to gather." intro="Owned events, partner events and Collections will appear here as dates are confirmed." image="/fastrac/guests-family-current.jpg" /><section className={styles.eventsPage}>{events.length ? <EventCards events={events} /> : <div className={styles.emptyState}><Image src="/texomaco/pin.png" alt="" width={700} height={941} /><Eyebrow>The calendar is taking shape</Eyebrow><h2>No public dates have been announced yet.</h2><p>Have an event, partnership or group idea? Start a conversation with the Collective.</p><Link href="/contact?type=group_event">Contact the events team <span>↗</span></Link></div>}</section></>; }

function EventCards({ events }: { events: EventItem[] }) { return <div className={styles.eventCards}>{events.map((event) => <article key={event.id}>{event.image && <div><Image src={event.image} alt="" fill sizes="(max-width: 800px) 100vw, 30vw" className={styles.cover} /></div>}<p>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Chicago" }).format(new Date(event.starts_at))}</p><h3>{event.title}</h3><span>{event.location}</span><Link href={`/events/${event.slug}`}>Event details ↗</Link></article>)}</div>; }

function Explore({ data }: { data: any }) { return <><PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} image="/paradise/aerial-peninsula.jpg" /><section className={styles.exploreGrid}>{data.pillars.map((pillar: any, i: number) => <a key={pillar.title} href={pillar.href} className={i % 3 === 0 ? styles.exploreTall : ""}><Image src={pillar.image} alt="" fill sizes="(max-width: 700px) 100vw, 50vw" className={styles.cover} /><span>0{i+1}</span><div><h2>{pillar.title}</h2><p>{pillar.body}</p><b>Explore ↗</b></div></a>)}</section></>; }

function Contact({ data }: { data: any }) { return <><PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} /><section className={styles.contactGrid}><div><Eyebrow>Texoma Collective</Eyebrow><h2>Come by.<br />Call us.<br />Tell us the idea.</h2><address>81750 N State Hwy 289, Suite 106<br />Pottsboro, TX 75076</address><a href="tel:+19032001408">903.200.1408</a><p>Tuesday-Saturday<br />9am-6pm</p></div><InquiryForm /></section></>; }

function Faq({ data }: { data: any }) { const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: data.items.map((item: any) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }; return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><PageHero eyebrow={data.eyebrow} title={data.title} image="/lighthouse/kayaking.jpg" /><section className={styles.faq}>{data.items.map((item: any, i: number) => <details key={item.q} open={i === 0}><summary><span>0{i+1}</span>{item.q}<b>+</b></summary><p>{item.a}</p></details>)}</section></>; }

function Legal({ data }: { data: any }) { return <section className={styles.legal}><Eyebrow>Texoma Collective</Eyebrow><h1>{data.title}</h1>{data.body.map((p: string) => <p key={p} className={p.startsWith("[OPEN]") ? styles.openItem : ""}>{p}</p>)}</section>; }

function Callout({ eyebrow, title, body, href, label }: { eyebrow: string; title: string; body: string; href: string; label: string }) { return <section className={styles.callout}><Image src="/lighthouse/marina-panorama.jpg" alt="Lake Texoma" fill sizes="100vw" className={styles.cover} /><div /><article><Eyebrow light>{eyebrow}</Eyebrow><h2>{title}</h2><p>{body}</p><Link href={href}>{label} <span>↗</span></Link></article></section>; }
