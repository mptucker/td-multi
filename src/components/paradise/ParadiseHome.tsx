import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { BrandConfig } from "@/config/types";
import { hubUrl } from "@/config/hub-links";
import { ParadiseMotion, StayMap, type MapStay } from "./ParadiseExperience";

/* ------------------------------------------------------------------------------------------------
 * Paradise on Lake Texoma — "one weekend at Paradise".
 * The home page is told as a single weekend: arrive Friday afternoon, exhale at golden hour, wake up
 * Saturday, find your kind of Paradise, find your spot, gather at the fire, and (reluctantly) leave
 * Sunday. Every booking path resolves through hubUrl() → texomadestinations.com.
 *
 * Photo files were exported with misleading names; alt text below describes what is actually in each
 * frame (verified by eye, Nov 2026).
 * ---------------------------------------------------------------------------------------------- */

const HERO_WORD = "PARADISE";

function Stamp({ day, time, note }: { day: string; time: string; note: string }) {
  return (
    <p className="pd-stamp pd-r">
      <span className="pd-stamp-time">
        {day} <b>{time}</b>
      </span>
      <svg viewBox="0 0 64 12" aria-hidden="true">
        <path d="M1 6c6-5 10 5 16 0s10-5 16 0 10 5 16 0 10-5 14 0" />
      </svg>
      <span className="pd-stamp-note">{note}</span>
    </p>
  );
}

function Strike({ children, i }: { children: ReactNode; i: number }) {
  return (
    <span className="pd-strike" style={{ ["--i" as string]: i }}>
      {children}
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
        <path d="M1 11.5C16 9 30 12.5 50 10.5S84 9 99 10" pathLength={100} />
      </svg>
    </span>
  );
}

function Frame({
  src,
  alt,
  caption,
  sizes,
  className = "",
  priority,
}: {
  src: string;
  alt: string;
  caption?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`pd-frame ${className}`}>
      <div className="pd-frame-photo">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Sun({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="17" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M50 8v14m0 56v14M8 50h14m56 0h14M20 20l10 10m40 40 10 10M20 80l10-10m40-40 10-10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Arrow() {
  return (
    <svg className="pd-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const MOODS = [
  {
    id: "relaxing",
    word: "Relaxing",
    adj: "relaxing",
    image: "/paradise/pavilion-detail.jpg",
    alt: "A guest stretched out in a hammock as the sun sets through the trees",
    line: "Claim a hammock.\nLeave the afternoon wide open.",
    body: "The hammock garden is strung between the oaks, the shade is free, and nobody is going to ask what you did today.",
    note: "permission to do nothing",
  },
  {
    id: "adventure",
    word: "Adventure",
    adj: "adventurous",
    image: "/paradise/aerial-peninsula.jpg",
    alt: "Aerial view of the Paradise shoreline, oak trees and open Lake Texoma water",
    line: "A whole lake out there.\nA quiet place to come back to.",
    body: "Launch from the private boat ramp, or grab a kayak or paddleboard at the office and explore the calm coves along our shoreline.",
    note: "come back sun-kissed",
  },
  {
    id: "refreshing",
    word: "Refreshing",
    adj: "refreshing",
    image: "/paradise/glamping-porch-lake.jpg",
    alt: "A cedar porch with a grill and string lights looking out over the lake at first light",
    line: "More lake light.\nLess screen time.",
    body: "Wi-Fi lives at the office. Out here it's fresh air, wide water and the kind of quiet that resets the whole week.",
    note: "fresh air, refilled",
  },
  {
    id: "cozy",
    word: "Cozy",
    adj: "cozy",
    image: "/paradise/dog-friendly-stay.jpg",
    alt: "A glowing tent beneath the Milky Way at the edge of the trees",
    line: "Dinner on the grill.\nOne more story.",
    body: "Then a good night under a sky that feels a lot bigger out here. Bring the warm socks.",
    note: "a million night-lights",
  },
] as const;

export function ParadiseHome({ brand }: { brand: BrandConfig }) {
  const book = (intent: "cabins" | "rv" | "tents" | "kayaks", content: string) =>
    hubUrl(intent, brand, { campaign: "paradise-home", content });

  const stays: MapStay[] = [
    {
      id: "glamping",
      name: "Glamping",
      kicker: "Kabanas · Kasitas · Kimas",
      line: "Closest to the water.",
      body: "Little lakeside hideaways with a porch, a fire pit and a grill. Climate-controlled, linens included, with hot showers in the shared bathhouse a short walk away.",
      facts: ["Sleeps 2–4", "Fire pit & grill", "Shared bathhouse"],
      image: "/paradise/guest-dog.jpg",
      alt: "Two metal chairs on the deck of an A-frame glamping cabin under the oaks",
      href: book("cabins", "map-glamping"),
      cta: "See glamping dates",
      pin: { x: 262, y: 262 },
      route: "M922 236H556C470 236 414 238 352 244S290 254 268 260",
    },
    {
      id: "cabins",
      name: "Cabins",
      kicker: "Cabins · the Paradise Express",
      line: "A porch, a kitchen, a door that locks.",
      body: "Cabins with private baths, including the Paradise Express, a real 1920s train car turned two-bedroom cabin that welcomes your dog.",
      facts: ["Private bath", "Kitchen or kitchenette", "Pet-friendly options"],
      image: "/paradise/lake-evening-with-dog.jpg",
      alt: "A small wood cabin with two yellow chairs on its porch beneath the trees",
      href: book("cabins", "map-cabins"),
      cta: "See cabin dates",
      pin: { x: 482, y: 146 },
      route: "M922 236H566C520 236 500 222 494 196S486 160 482 152",
    },
    {
      id: "rv",
      name: "RV sites",
      kicker: "Two shady loops",
      line: "Your rig. A whole new view.",
      body: "Shaded and waterfront sites with 30 or 50-amp power and water, many with full hookups. Every site has a picnic table, a fire ring and a look at the lake. Vintage campers especially welcome.",
      facts: ["30/50 amp", "Many full hookups", "Fire ring & table"],
      image: "/paradise/aerial-rv-loop.jpg",
      alt: "Aerial view of campers parked along a wooded loop with Lake Texoma beyond",
      href: book("rv", "map-rv"),
      cta: "Find an RV site",
      pin: { x: 620, y: 470 },
      route: "M922 236H660C646 236 640 246 640 262V420C640 446 634 462 620 468",
    },
    {
      id: "tents",
      name: "Tent camping",
      kicker: "Walk-in primitive sites",
      line: "Pack light. Sleep under the stars.",
      body: "Park at the trailhead and walk in to a quiet stretch of shoreline set aside for tents. No hookups, a fire pit, and the best stargazing on the property.",
      facts: ["Hike-in", "Fire pits", "Bring water"],
      image: "/paradise/dog-friendly-stay.jpg",
      alt: "A glowing tent beneath a starry sky at the edge of the trees",
      href: book("tents", "map-tents"),
      cta: "Reserve a tent site",
      pin: { x: 304, y: 420 },
      route: "M922 236H520C468 236 452 262 430 300S344 398 312 414",
    },
  ];

  return (
    <div className="pd" data-pd-root>
      {/* ───────── 01 · ARRIVE ───────── */}
      <section className="pd-hero" id="pd-arrive" data-chapter data-day="Fri" data-time="3:00 pm" data-hour="15" data-label="Arrive" aria-labelledby="pd-title">
        <div className="pd-hero-stage">
          <div className="pd-hero-photo pd-hero-back" aria-hidden="true">
            <Image src="/paradise/glamping-guest-lake.jpg" alt="" fill priority sizes="100vw" />
          </div>
          <div className="pd-hero-photo pd-hero-window">
            <Image
              src="/paradise/glamping-guest-lake.jpg"
              alt="A guest and her dog relaxing on the deck of an A-frame glamping cabin, Lake Texoma through the trees"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <span className="pd-hero-rule pd-hero-rule-l" aria-hidden="true" />
          <span className="pd-hero-rule pd-hero-rule-r" aria-hidden="true" />
        </div>

        <div className="pd-hero-copy">
          <p className="pd-hero-place">
            <span>Pottsboro, Texas</span>
            <span>On the quiet western shore of Lake Texoma</span>
          </p>
          <h1 className="pd-hero-title" id="pd-title" aria-label="Find your Paradise">
            <span className="pd-hero-find" aria-hidden="true">Find your</span>
            <span className="pd-hero-word" aria-hidden="true">
              {HERO_WORD.split("").map((letter, i) => (
                <span key={i} style={{ ["--i" as string]: i }}>
                  {letter}
                </span>
              ))}
            </span>
          </h1>
          <p className="pd-hero-sign" aria-hidden="true">
            however you lake.
          </p>
        </div>

        <a className="pd-hero-cue" href="#pd-leave">
          <span>Come on in</span>
          <i aria-hidden="true" />
        </a>

        <svg className="pd-wave" viewBox="0 0 2880 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 62C180 30 300 30 480 62S780 94 960 62s300-32 480 0 300 32 480 0 300-32 480 0 300 32 480 0V120H0Z" />
        </svg>
      </section>

      {/* ───────── 02 · THROUGH THE GATE ───────── */}
      <section className="pd-leave" id="pd-leave" data-chapter data-day="Fri" data-time="3:20 pm" data-hour="15.3" data-label="Through the gate" aria-labelledby="pd-leave-title">
        <div className="pd-wrap">
          <Stamp day="Friday" time="3:20 pm" note="through the gate" />
          <h2 className="pd-leave-lede pd-strikes" id="pd-leave-title">
            Leave the <Strike i={0}>traffic</Strike>, the <Strike i={1}>inbox</Strike>, the <Strike i={2}>group chat</Strike> and the{" "}
            <Strike i={3}>to-do list</Strike> at the gate.
          </h2>
          <p className="pd-leave-after pd-r">
            Everything else is <em>down by the water.</em>
          </p>
          <ul className="pd-leave-notes" aria-label="About Paradise">
            <li className="pd-r">
              <b>200</b> wooded acres
            </li>
            <li className="pd-r">
              <b>1</b> gated peninsula
            </li>
            <li className="pd-r">
              <b>0</b> reasons to hurry
            </li>
          </ul>
        </div>
      </section>

      {/* ───────── 03 · GOLDEN HOUR ───────── */}
      <section className="pd-exhale" id="pd-exhale" data-chapter data-day="Fri" data-time="7:45 pm" data-hour="19.75" data-label="Golden hour" aria-labelledby="pd-exhale-title">
        <div className="pd-wrap pd-exhale-head">
          <Stamp day="Friday" time="7:45 pm" note="golden hour" />
          <h2 id="pd-exhale-title" className="pd-r">
            <span className="pd-display">First,</span>
            <span className="pd-sign">exhale.</span>
          </h2>
        </div>
        <div className="pd-exhale-scene">
          <figure className="pd-exhale-wide pd-r-img">
            <div className="pd-par" data-speed="slow">
              <Image
                src="/paradise/morning-coffee.jpg"
                alt="A deck chair facing the low sun over Lake Texoma through the trees"
                fill
                sizes="(min-width: 900px) 78vw, 100vw"
              />
            </div>
          </figure>
          <div className="pd-exhale-copy pd-r">
            <Sun className="pd-breathe" />
            <p className="pd-quiet">
              Find a chair
              <br />
              facing west.
              <br />
              <strong>
                That&apos;s the
                <br />
                whole plan.
              </strong>
            </p>
            <p>
              The sun goes down over the water every night. Most people stop what they&apos;re doing to watch it. That&apos;s sort of the
              point.
            </p>
          </div>
          <Frame
            className="pd-polaroid pd-exhale-polaroid pd-r-tilt"
            src="/paradise/string-lights-lake.jpg"
            alt="A guest wrapped in a blanket with her dog, looking out at the lake under string lights"
            caption="someone already claimed the good blanket"
            sizes="(min-width: 900px) 24vw, 62vw"
          />
        </div>
      </section>

      {/* ───────── 04 · SATURDAY MORNING ───────── */}
      <section className="pd-morning" id="pd-morning" data-chapter data-day="Sat" data-time="7:10 am" data-hour="7.2" data-label="Wake up quieter" aria-labelledby="pd-morning-title">
        <div className="pd-wrap pd-morning-grid">
          <div className="pd-morning-copy">
            <Stamp day="Saturday" time="7:10 am" note="no alarm" />
            <h2 id="pd-morning-title" className="pd-r">
              <span className="pd-display">Wake up</span>
              <span className="pd-display">somewhere</span>
              <span className="pd-sign">quieter.</span>
            </h2>
            <p className="pd-r">
              Coffee on the porch. The lake right there. A deer wandering past like it owns the place, which, to be fair, it kind of does.
            </p>
          </div>
          <div className="pd-morning-collage">
            <Frame
              className="pd-memory pd-morning-main pd-r-img"
              src="/paradise/birthday-cabin.jpg"
              alt="A guest pouring coffee on the porch of a cedar cabin, the lake visible through the window"
              sizes="(min-width: 900px) 34vw, 80vw"
            />
            <Frame
              className="pd-polaroid pd-morning-deer pd-r-tilt"
              src="/paradise/tent-under-stars.jpg"
              alt="A young deer resting in sunlit grass"
              caption="the neighbors are up early"
              sizes="(min-width: 900px) 22vw, 56vw"
            />
            <Frame
              className="pd-polaroid pd-morning-hammock pd-r-tilt"
              src="/paradise/deer.jpg"
              alt="Striped hammocks hanging beneath a wooden pavilion in the trees"
              caption="first come, first nap"
              sizes="(min-width: 900px) 16vw, 42vw"
            />
          </div>
        </div>
      </section>

      {/* ───────── 05 · FIND YOUR PARADISE ───────── */}
      <section className="pd-yours" id="pd-yours" data-chapter data-day="Sat" data-time="10:00 am" data-hour="10" data-label="Find yours" aria-labelledby="pd-yours-title">
        <div className="pd-wrap pd-yours-intro">
          <Stamp day="Saturday" time="10:00 am" note="no plans yet" />
          <h2 id="pd-yours-title" className="pd-r">
            Paradise looks a little <span className="pd-sign">different</span> to everyone.
          </h2>
          <p className="pd-yours-ask pd-r">
            Today, mine feels{" "}
            {MOODS.map((mood, i) => (
              <span key={mood.id}>
                <a href={`#pd-mood-${mood.id}`} className="pd-mood-link" data-preview={mood.image}>
                  {mood.adj}
                </a>
                {i < MOODS.length - 2 ? ", " : i === MOODS.length - 2 ? " or " : "."}
              </span>
            ))}
          </p>
        </div>

        <div className="pd-posters">
          {MOODS.map((mood, i) => (
            <article className={`pd-poster pd-poster-${mood.id}`} id={`pd-mood-${mood.id}`} key={mood.id} aria-labelledby={`pd-mood-${mood.id}-title`}>
              <div className="pd-poster-photo">
                <Image src={mood.image} alt={mood.alt} fill sizes="100vw" />
              </div>
              {mood.id === "relaxing" && (
                <div className="pd-poster-window" aria-hidden="true">
                  <Image src={mood.image} alt="" fill sizes="100vw" />
                </div>
              )}
              {mood.id === "adventure" && (
                <svg className="pd-poster-slash" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path className="pd-slash-a" d="M58 0 70 100" />
                  <path d="M93 0l7 62" />
                </svg>
              )}
              {mood.id === "cozy" && <div className="pd-stars" aria-hidden="true" />}
              <div className="pd-poster-type">
                <h3 id={`pd-mood-${mood.id}-title`}>
                  {mood.id === "cozy" ? (
                    <>
                      <span className="pd-poster-find">Find</span>
                      <span className="pd-poster-word">your {mood.word} Paradise</span>
                    </>
                  ) : mood.id === "refreshing" ? (
                    <>
                      <span className="pd-poster-find">Find your</span>
                      <span className="pd-poster-word">{mood.word} Paradise</span>
                    </>
                  ) : (
                    <>
                      <span className="pd-poster-find">Find your</span>
                      <span className="pd-poster-word">{mood.word}</span>
                      <span className="pd-poster-sign">Paradise</span>
                    </>
                  )}
                </h3>
              </div>
              <div className="pd-poster-copy">
                <span className="pd-poster-count" aria-hidden="true">
                  0{i + 1} <i>/</i> 04
                </span>
                <p className="pd-poster-line">
                  {mood.line.split("\n").map((part, j) => (
                    <span key={j}>{part}</span>
                  ))}
                </p>
                <p>{mood.body}</p>
                {mood.id === "adventure" && (
                  <a className="pd-textlink" href={book("kayaks", "mood-adventure")} data-intent="kayaks">
                    Kayak &amp; paddleboard rentals <Arrow />
                  </a>
                )}
                <span className="pd-poster-note" aria-hidden="true">
                  {mood.note}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───────── 06 · FIND YOUR SPOT ───────── */}
      <section className="pd-place" id="pd-place" data-chapter data-day="Sat" data-time="2:00 pm" data-hour="14" data-label="Find your spot" aria-labelledby="pd-place-title">
        <div className="pd-wrap">
          <div className="pd-place-head">
            <div>
              <Stamp day="Saturday" time="2:00 pm" note="scouting next time" />
              <h2 id="pd-place-title" className="pd-r">
                <span className="pd-display">So, where should</span>
                <span className="pd-display">
                  we put <span className="pd-sign">you?</span>
                </span>
              </h2>
            </div>
            <p className="pd-r">
              A porch steps from the water, a cabin with a kitchen, a shady spot for the camper or a tent down by the shoreline. Tap around. Every
              stay has a view of the lake.
            </p>
          </div>
          <StayMap stays={stays} />
        </div>
      </section>

      {/* ───────── 07 · SATURDAY NIGHT ───────── */}
      <section className="pd-evening" id="pd-evening" data-chapter data-day="Sat" data-time="8:30 pm" data-hour="20.5" data-label="One big fire" aria-labelledby="pd-evening-title">
        <div className="pd-stars pd-stars-sky" aria-hidden="true" />
        <div className="pd-wrap pd-evening-grid">
          <div className="pd-evening-copy">
            <Stamp day="Saturday" time="8:30 pm" note="string lights on" />
            <h2 id="pd-evening-title" className="pd-r">
              <span className="pd-display">The fire&apos;s</span>
              <span className="pd-display">already going.</span>
              <span className="pd-sign">come on over</span>
            </h2>
            <p className="pd-r">
              Evenings drift toward the community bar and the big group firepit. Bring your people. Bring your best friend, too. Leashed pets are
              welcome on every RV site and in our pet-friendly stays.
            </p>
            <Link className="pd-textlink pd-r" href="/plan-your-visit">
              A few things to know before you go <Arrow />
            </Link>
          </div>
          <div className="pd-evening-collage">
            <Frame
              className="pd-memory pd-evening-main pd-r-img"
              src="/paradise/hammock-pavilion.jpg"
              alt="String lights glowing on an oak tree at the water's edge as dusk settles over the lake"
              sizes="(min-width: 900px) 30vw, 78vw"
            />
            <Frame
              className="pd-polaroid pd-evening-grill pd-r-tilt"
              src="/paradise/porch-coffee.jpg"
              alt="A hand lifting the lid of a charcoal grill at a campsite"
              caption="dinner's on"
              sizes="(min-width: 900px) 18vw, 46vw"
            />
            <Frame
              className="pd-polaroid pd-evening-party pd-r-tilt"
              src="/paradise/sunset-deck-chairs.jpg"
              alt="Colorful 'Birthday Vibes' balloon letters on the cedar wall of a cabin"
              caption="any excuse, really"
              sizes="(min-width: 900px) 18vw, 46vw"
            />
            <Frame
              className="pd-polaroid pd-evening-dog pd-r-tilt"
              src="/paradise/camp-grill.jpg"
              alt="A guest sitting in a cabin doorway hugging her golden retriever"
              caption="paws welcome"
              sizes="(min-width: 900px) 17vw, 46vw"
            />
          </div>
        </div>
        <div className="pd-drift" aria-hidden="true">
          <div>
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k}>
                s&apos;mores <i>✳</i> one more story <i>✳</i> string lights <i>✳</i> shooting stars <i>✳</i> quiet hours at 11 <i>✳</i> who brought the
                guitar? <i>✳</i>{" "}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 08 · SUNDAY ───────── */}
      <section className="pd-sunday" id="pd-sunday" data-chapter data-day="Sun" data-time="10:30 am" data-hour="10.5" data-label="Stay longer" aria-labelledby="pd-sunday-title">
        <div className="pd-wrap pd-sunday-grid">
          <div className="pd-sunday-photo">
            <Frame
              className="pd-memory pd-r-img"
              src="/paradise/glamping-patio.jpg"
              alt="A guest in cowboy boots lingering over a coffee outside her cabin"
              sizes="(min-width: 900px) 30vw, 80vw"
            />
            <span className="pd-sunday-note" aria-hidden="true">
              check-out&apos;s not till 11
            </span>
          </div>
          <div className="pd-sunday-copy">
            <Stamp day="Sunday" time="10:30 am" note="five more minutes" />
            <h2 id="pd-sunday-title" className="pd-r">
              <span className="pd-display">Stay a</span>
              <span className="pd-sign">little longer.</span>
            </h2>
            <p className="pd-r">
              Or better yet, pick the weekend you&apos;re coming back. Dates, rates and every unit live on texomadestinations.com, and we&apos;ll
              text your gate code before you arrive.
            </p>
            <ul className="pd-book" aria-label="Book your stay at Paradise">
              {[
                { label: "Glamping", sub: "Kabanas, Kasitas & Kimas", href: book("cabins", "sunday-glamping"), intent: "cabins" },
                { label: "Cabins", sub: "incl. the Paradise Express", href: book("cabins", "sunday-cabins"), intent: "cabins" },
                { label: "RV sites", sub: "30/50 amp, shady loops", href: book("rv", "sunday-rv"), intent: "rv" },
                { label: "Tent sites", sub: "Walk-in, by the shore", href: book("tents", "sunday-tents"), intent: "tents" },
              ].map((item, i) => (
                <li key={item.label} className="pd-r" style={{ ["--d" as string]: `${i * 70}ms` }}>
                  <a href={item.href} data-intent={item.intent}>
                    <span className="pd-book-label">{item.label}</span>
                    <span className="pd-book-sub">{item.sub}</span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
            <p className="pd-sunday-fine pd-r">
              <span className="pd-hand">psst, Sunday–Thursday nights are always discounted.</span>
              <span>
                Questions? Call <a href={`tel:${brand.nap.phoneE164}`}>{brand.nap.phone}</a>
              </span>
            </p>
          </div>
        </div>
        <p className="pd-signoff" aria-hidden="true">
          <span>however you lake,</span> you&apos;ll find your Paradise here.
        </p>
      </section>

      <ParadiseMotion />
    </div>
  );
}
