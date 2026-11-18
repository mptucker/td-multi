"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------------------------------------
 * ParadiseMotion — one small, dependency-free motion layer for the Paradise home page.
 *  • reveals (.pd-r / .pd-r-img / .pd-r-tilt / .pd-strikes) via IntersectionObserver
 *  • the "weekend clock" wayfinder, driven by [data-chapter] sections
 *  • hover previews for the mood words (fine pointers only)
 *  • exposes the shared header height as --pd-head for sticky posters
 * Parallax and the hero "window" are CSS scroll-driven animations (see paradise.css), so they cost
 * no main-thread work and simply stay still where unsupported. Everything respects reduced motion.
 * ---------------------------------------------------------------------------------------------- */

type Chapter = { id: string; day: string; time: string; label: string; hour: number };

const REVEAL = ".pd-r, .pd-r-img, .pd-r-tilt, .pd-strikes";

function sunPoint(hour: number) {
  // 6am → left horizon, 1pm → zenith, 8pm → right horizon.
  const t = Math.min(1, Math.max(0, (hour - 6) / 14));
  const a = Math.PI * t;
  return { x: 24 - 18 * Math.cos(a), y: 22 - 16 * Math.sin(a), night: hour >= 20 || hour < 6 };
}

export function ParadiseMotion() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-pd-root]");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* reveals */
    const targets = Array.from(root.querySelectorAll<HTMLElement>(REVEAL));
    let io: IntersectionObserver | null = null;
    if (!reduced && "IntersectionObserver" in window) {
      const vh = window.innerHeight;
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("is-in");
      });
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io?.unobserve(entry.target);
            }
          }),
        { rootMargin: "0px 0px -9% 0px", threshold: 0.12 },
      );
      targets.forEach((el) => !el.classList.contains("is-in") && io!.observe(el));
      root.classList.add("pd-js");
    } else {
      targets.forEach((el) => el.classList.add("is-in"));
    }

    /* chapters → weekend clock */
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
    setChapters(
      sections.map((s) => ({
        id: s.id,
        day: s.dataset.day ?? "",
        time: s.dataset.time ?? "",
        label: s.dataset.label ?? "",
        hour: Number(s.dataset.hour ?? 12),
      })),
    );
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const mark = window.innerHeight * 0.45;
        let index = 0;
        sections.forEach((s, i) => {
          if (s.getBoundingClientRect().top <= mark) index = i;
        });
        setActive(index);
        const hero = sections[0]?.getBoundingClientRect();
        const end = document.querySelector("[data-brand] > footer")?.getBoundingClientRect();
        setVisible(!!hero && hero.bottom < window.innerHeight * 0.55 && (!end || end.top > window.innerHeight * 0.6));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    /* shared header height → sticky offsets */
    const header = document.querySelector<HTMLElement>('[data-brand="paradise"] > header');
    const setHead = () => document.documentElement.style.setProperty("--pd-head", `${header?.offsetHeight ?? 0}px`);
    setHead();
    const ro = header && "ResizeObserver" in window ? new ResizeObserver(setHead) : null;
    if (header) ro?.observe(header);

    /* mood word previews */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const preview = previewRef.current;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".pd-mood-link"));
    const cleanups: (() => void)[] = [];
    if (fine && preview && !reduced) {
      links.forEach((link) => {
        const enter = () => {
          preview.style.backgroundImage = `url(${link.dataset.preview})`;
          preview.classList.add("is-on");
        };
        const move = (e: PointerEvent) => {
          preview.style.setProperty("--x", `${e.clientX}px`);
          preview.style.setProperty("--y", `${e.clientY}px`);
        };
        const leave = () => preview.classList.remove("is-on");
        link.addEventListener("pointerenter", enter);
        link.addEventListener("pointermove", move);
        link.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          link.removeEventListener("pointerenter", enter);
          link.removeEventListener("pointermove", move);
          link.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => {
      io?.disconnect();
      ro?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const current = chapters[active];
  const sun = sunPoint(current?.hour ?? 15);

  return (
    <>
      <div className="pd-preview" ref={previewRef} aria-hidden="true" />
      {current && (
        <nav
          className={`pd-clock ${visible ? "is-visible" : ""} ${open ? "is-open" : ""} ${sun.night ? "is-night" : ""}`}
          aria-label="Your weekend at Paradise"
          onMouseLeave={() => setOpen(false)}
        >
          <button type="button" className="pd-clock-face" aria-expanded={open} onClick={() => setOpen((v) => !v)} onMouseEnter={() => setOpen(true)}>
            <svg viewBox="0 0 48 26" aria-hidden="true">
              <path className="pd-clock-arc" d="M6 22a18 16 0 0 1 36 0" />
              <path className="pd-clock-ground" d="M2 22.5h44" />
              <g className="pd-clock-sun" style={{ transform: `translate(${sun.x}px, ${sun.y}px)` }}>
                <circle r="3.4" />
              </g>
              <g className="pd-clock-moon">
                <path d="M26 9.5a5 5 0 1 1-5.6-5.2 4 4 0 0 0 5.6 5.2Z" />
                <circle cx="35" cy="7" r=".9" />
                <circle cx="12" cy="11" r=".7" />
              </g>
            </svg>
            <span className="pd-clock-text">
              <span className="pd-clock-time">
                {current.day} · {current.time}
              </span>
              <span className="pd-clock-label">{current.label}</span>
            </span>
            <span className="sr-only">, show the rest of the weekend</span>
          </button>
          <ol className="pd-clock-list" hidden={!open}>
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={i === active ? "step" : undefined} onClick={() => setOpen(false)}>
                  <span>
                    {c.day} {c.time}
                  </span>
                  {c.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}

/* ------------------------------------------------------------------------------------------------
 * StayMap — a hand-drawn take on the property map. Choosing a stay draws the route from the gate
 * and swaps in its story + the exact texomadestinations.com booking link.
 * ---------------------------------------------------------------------------------------------- */

export type MapStay = {
  id: string;
  name: string;
  kicker: string;
  line: string;
  body: string;
  facts: string[];
  image: string;
  alt: string;
  href: string;
  cta: string;
  pin: { x: number; y: number };
  route: string;
};

const W = 1000;
const H = 620;

const TREE_CLUSTERS: [number, number, number][] = [
  [330, 58, 9], [560, 78, 10], [700, 120, 8], [870, 100, 9], [430, 318, 9], [540, 392, 8], [770, 350, 10], [880, 460, 9],
  [810, 560, 7], [470, 470, 6], [232, 336, 6], [250, 160, 5], [760, 300, 5], [900, 330, 6], [380, 220, 4],
];

function trees() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const out: { x: number; y: number; r: number; s: number }[] = [];
  TREE_CLUSTERS.forEach(([cx, cy, n]) => {
    for (let i = 0; i < n; i++) out.push({ x: cx + (rnd() - 0.5) * 110, y: cy + (rnd() - 0.5) * 70, r: 7 + rnd() * 8, s: Math.floor(rnd() * 3) });
  });
  return out;
}
const TREES = trees();

export function StayMap({ stays }: { stays: MapStay[] }) {
  const [selected, setSelected] = useState(0);
  const stay = stays[selected];

  return (
    <div className="pd-map">
      <div className="pd-map-tabs" role="group" aria-label="Choose a kind of stay">
        {stays.map((s, i) => (
          <button key={s.id} type="button" aria-pressed={selected === i} aria-controls="pd-map-detail" onClick={() => setSelected(i)}>
            <span className="pd-map-tab-n">{i + 1}</span>
            {s.name}
          </button>
        ))}
      </div>

      <div className="pd-map-board pd-r">
        <svg className="pd-map-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Illustrated map of Paradise: the lake wraps the west and south shores, the gate is on the east side.">
          <defs>
            <filter id="pd-rough">
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale="9" />
            </filter>
            <pattern id="pd-ripples" width="60" height="26" patternUnits="userSpaceOnUse">
              <path d="M4 14c6-5 10 5 16 0" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.4" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect width={W} height={H} className="pd-map-lake" />
          <rect width={W} height={H} fill="url(#pd-ripples)" className="pd-map-ripples" />
          <path
            className="pd-map-land"
            filter="url(#pd-rough)"
            d="M158 0H1000V620H704C668 602 624 572 566 562C506 552 446 586 384 568C326 551 304 484 252 458C204 434 150 452 122 404C96 362 150 322 170 290C190 258 140 228 150 190C160 150 122 112 132 72C140 40 156 22 158 0Z"
          />
          <g className="pd-map-trees">
            {TREES.map((t, i) => (
              <circle key={i} cx={t.x} cy={t.y} r={t.r} className={`pd-tree-${t.s}`} />
            ))}
          </g>
          <g className="pd-map-roads">
            <path d="M962 236H300C282 236 272 248 262 262" />
            <path d="M566 236C520 236 500 222 494 196S486 160 482 150" />
            <path d="M640 236V560" />
            <path d="M520 236C468 236 452 262 430 300" />
            <path d="M640 330C700 330 720 380 700 430S640 470 640 470" />
          </g>
          <g className="pd-map-routes">
            {stays.map((s, i) => (
              <path key={`${s.id}-${selected === i}`} d={s.route} className={selected === i ? "is-active" : ""} pathLength={1} />
            ))}
          </g>
          <g className="pd-map-labels">
            <text x="60" y="300" transform="rotate(-78 60 300)">Lake Texoma</text>
            <text x="420" y="606" className="pd-map-small">the cove</text>
            <text x="196" y="66">day use</text>
            <text x="268" y="122">hammock garden</text>
            <text x="268" y="146" className="pd-map-small">community bar &amp; firepit</text>
            <text x="760" y="204">office &amp; store</text>
            <text x="904" y="268" className="pd-map-small">the gate</text>
            <text x="660" y="598">boat ramp</text>
          </g>
          <g className="pd-map-marks">
            <circle cx="380" cy="160" r="5" />
            <circle cx="214" cy="84" r="5" />
            <rect x="800" y="214" width="14" height="12" rx="2" />
            <path d="M948 222v28M956 222v28" />
            <path d="M640 566l-12 18M640 566l12 18" />
          </g>
          <g className="pd-map-north" transform="translate(940 60)">
            <path d="M0 18V-14M-7-6 0-15l7 9" />
            <text x="-6" y="40">N</text>
          </g>
        </svg>
        {stays.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`pd-pin ${selected === i ? "is-active" : ""}`}
            style={{ left: `${(s.pin.x / W) * 100}%`, top: `${(s.pin.y / H) * 100}%` }}
            onClick={() => setSelected(i)}
            tabIndex={-1}
            aria-hidden="true"
          >
            <span>{i + 1}</span>
            <em>{s.name}</em>
          </button>
        ))}
        <span className="pd-map-scale" aria-hidden="true">
          not to scale (but close)
        </span>
      </div>

      <div className="pd-map-detail" id="pd-map-detail" aria-live="polite">
        <div className="pd-map-photo" key={stay.image}>
          <Image src={stay.image} alt={stay.alt} fill sizes="(min-width: 900px) 30vw, 90vw" />
        </div>
        <div className="pd-map-text" key={stay.id}>
          <span className="pd-eyebrow">{stay.kicker}</span>
          <h3>{stay.line}</h3>
          <p>{stay.body}</p>
          <ul>
            {stay.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <a className="pd-btn" href={stay.href} data-intent={stay.id === "rv" ? "rv" : stay.id === "tents" ? "tents" : "cabins"}>
            {stay.cta}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <small>Live dates &amp; rates on texomadestinations.com</small>
        </div>
      </div>
    </div>
  );
}
