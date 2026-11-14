"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BoatImage from "@/bigwatermarine/components/BoatImage";
import type { Boat } from "@/bigwatermarine/lib/boats/types";
import { boatPath, brandOf, money, statusLabel } from "@/bigwatermarine/lib/boats/format";
import { FILTER_EVENT, type FinderFilter } from "./filters";

const BRANDS = ["All", "Scout", "Veranda", "Highfield", "Berkshire", "Other"] as const;
const CONDITIONS = ["All", "New", "Used"] as const;

// Plain-language boat types, grouped from the listing "class".
export const TYPES = [
  { key: "pontoon", label: "Pontoons", test: (c: string) => /pontoon/i.test(c) },
  { key: "console", label: "Center & dual consoles", test: (c: string) => /console|fish/i.test(c) },
  { key: "rib", label: "RIBs & tenders", test: (c: string) => /rib|inflatable|tender/i.test(c) },
  { key: "runabout", label: "Bowriders & cruisers", test: (c: string) => /bowrider|cruiser|runabout|deck/i.test(c) },
] as const;
const typeOf = (b: Boat) => TYPES.find((t) => t.test(b.boatClass ?? ""))?.key ?? "other";

const PRICES = [
  { label: "Any price", test: () => true },
  { label: "Under $50,000", test: (b: Boat) => b.price !== null && b.price < 50000 },
  { label: "$50,000 – $100,000", test: (b: Boat) => b.price !== null && b.price >= 50000 && b.price <= 100000 },
  { label: "Over $100,000", test: (b: Boat) => b.price === null || b.price > 100000 },
];
const SORTS = {
  featured: "Featured",
  low: "Price: low to high",
  high: "Price: high to low",
  newest: "Newest model year",
  length: "Length: longest first",
} as const;

// "Featured" leads with new boats from the four builders we carry.
const rank = (b: Boat) => (b.condition === "New" ? 0 : 2) + (brandOf(b.make) === "Other" ? 1 : 0) + (b.status === "active" ? 0 : 0.5);

type Props = {
  boats: Boat[];
  variant?: "home" | "full";
  title?: string;
  headingLevel?: "h1" | "h2";
};

export default function Finder({ boats, variant = "home", title = "On our lot today", headingLevel = "h2" }: Props) {
  const full = variant === "full";
  // The full page lists every boat so search engines can see (and link to) all of them.
  const PAGE = full ? 1000 : 8;
  const [condition, setCondition] = useState<string>("All");
  const [brand, setBrand] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [price, setPrice] = useState(0);
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");
  const [shown, setShown] = useState(PAGE);

  // Shareable filter links on the inventory page, e.g. /inventory/?make=scout&condition=new
  useEffect(() => {
    if (!full) return;
    // Syncing from an external source (the page URL) after hydration, so the
    // server-rendered HTML still lists every boat for search engines.
    /* eslint-disable react-hooks/set-state-in-effect */
    const p = new URLSearchParams(window.location.search);
    const make = p.get("make");
    if (make) setBrand(BRANDS.find((b) => b.toLowerCase() === make.toLowerCase()) ?? "All");
    const c = p.get("condition");
    if (c) setCondition(c.toLowerCase() === "new" ? "New" : /used|pre/i.test(c) ? "Used" : "All");
    const t = p.get("type");
    if (t && TYPES.some((x) => x.key === t)) setType(t);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [full]);

  useEffect(() => {
    if (!full) return;
    const p = new URLSearchParams();
    if (brand !== "All") p.set("make", brand.toLowerCase());
    if (condition !== "All") p.set("condition", condition === "New" ? "new" : "used");
    if (type !== "All") p.set("type", type);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [full, brand, condition, type]);

  useEffect(() => {
    const on = (e: Event) => {
      const f = (e as CustomEvent<FinderFilter>).detail;
      if (f.brand) setBrand(f.brand);
      if (f.condition) setCondition(f.condition);
      setPrice(0);
      setType("All");
      setShown(PAGE);
    };
    window.addEventListener(FILTER_EVENT, on);
    return () => window.removeEventListener(FILTER_EVENT, on);
  }, [PAGE]);

  const results = useMemo(() => {
    const list = boats
      .map((b, i) => ({ b, i }))
      .filter(({ b }) =>
        (condition === "All" || b.condition === condition) &&
        (brand === "All" || brandOf(b.make) === brand) &&
        (type === "All" || typeOf(b) === type) &&
        PRICES[price].test(b),
      );
    const p = (b: Boat) => b.price ?? Number.POSITIVE_INFINITY;
    list.sort((x, y) => {
      if (sort === "low") return p(x.b) - p(y.b);
      if (sort === "high") return (y.b.price ?? 1e9) - (x.b.price ?? 1e9);
      if (sort === "newest") return (y.b.year ?? 0) - (x.b.year ?? 0) || x.i - y.i;
      if (sort === "length") return (y.b.lengthFt ?? 0) - (x.b.lengthFt ?? 0);
      return rank(x.b) - rank(y.b) || x.i - y.i;
    });
    return list.map(({ b }) => b);
  }, [boats, condition, brand, type, price, sort]);

  const countBy = (fn: (b: Boat) => boolean) => boats.filter(fn).length;
  const reset = () => { setCondition("All"); setBrand("All"); setType("All"); setPrice(0); setShown(PAGE); };
  const pick = (fn: () => void) => { fn(); setShown(PAGE); };
  const Heading = headingLevel;

  return (
    <section id="boats" className={`bwm-lot ${full ? "bwm-lot--full" : ""}`} aria-labelledby="bwm-lot-title">
      <div className="bwm-finder">
        <div className="bwm-finderHead">
          <Heading id="bwm-lot-title" className="bwm-finderTitle">{title}</Heading>
          {!full && <Link href="/inventory/" className="bwm-textLink">See all {boats.length} boats <Arrow /></Link>}
        </div>

        <div className="bwm-filterRow" role="group" aria-label="Condition">
          {CONDITIONS.map((c) => (
            <button key={c} type="button" className="bwm-chip" aria-pressed={condition === c} onClick={() => pick(() => setCondition(c))}>
              {c === "All" ? "New & pre-owned" : c === "Used" ? "Pre-owned" : c}
              <span className="bwm-count">{countBy((b) => c === "All" || b.condition === c)}</span>
            </button>
          ))}
        </div>

        <div className="bwm-filterRow" role="group" aria-label="Brand">
          {BRANDS.map((b) => (
            <button key={b} type="button" className="bwm-chip" aria-pressed={brand === b} onClick={() => pick(() => setBrand(b))}>
              {b === "All" ? "All brands" : b === "Other" ? "Other makes" : b}
            </button>
          ))}
        </div>

        {full && (
          <div className="bwm-filterRow" role="group" aria-label="Boat type">
            <button type="button" className="bwm-chip" aria-pressed={type === "All"} onClick={() => pick(() => setType("All"))}>All types</button>
            {TYPES.map((t) => {
              const n = countBy((b) => typeOf(b) === t.key);
              return n ? (
                <button key={t.key} type="button" className="bwm-chip" aria-pressed={type === t.key} onClick={() => pick(() => setType(t.key))}>
                  {t.label}<span className="bwm-count">{n}</span>
                </button>
              ) : null;
            })}
          </div>
        )}

        <div className="bwm-filterRow2">
          <label className="bwm-selectWrap">
            <span className="bwm-selectLabel">Price</span>
            <select value={price} onChange={(e) => pick(() => setPrice(Number(e.target.value)))} className="bwm-select">
              {PRICES.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
            </select>
          </label>
          <label className="bwm-selectWrap">
            <span className="bwm-selectLabel">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="bwm-select">
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <p className="bwm-resultCount" aria-live="polite">
            {results.length === 0 ? "No boats match" : `Showing ${Math.min(shown, results.length)} of ${results.length}`}
          </p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bwm-empty">
          <p>Nothing in stock matches that combination today. New arrivals land every week, and we can find one for you.</p>
          <div className="bwm-actions">
            <button type="button" className="bwm-btnTeal" onClick={reset}>Clear filters</button>
          </div>
        </div>
      ) : (
        <ul className="bwm-grid" role="list">
          {results.slice(0, shown).map((b, i) => (
            <li key={b.id} className="bwm-tile" style={{ ["--i" as string]: i % PAGE }}>
              <Link href={boatPath(b)} className="bwm-tileLink">
                <div className="bwm-tileMedia">
                  {b.images[0] && (
                    <BoatImage
                      src={b.images[0]}
                      alt={b.title}
                      fill
                      sizes="(min-width: 1100px) 24vw, (min-width: 640px) 46vw, 92vw"
                      className="bwm-tileImg"
                    />
                  )}
                  {statusLabel(b) && <span className="bwm-tileStatus">{statusLabel(b)}</span>}
                </div>
                <div className="bwm-tileBody">
                  <p className="bwm-tileMake">
                    <span className="bwm-cond" data-new={b.condition === "New"}>{b.condition === "New" ? "New" : "Pre-owned"}</span>
                    {b.year} {b.make}
                  </p>
                  <h3 className="bwm-tileModel">{b.model}</h3>
                  <p className="bwm-tileSpecs">
                    {[b.lengthLabel, b.engineMake && b.totalHp ? `${b.engineMake} ${b.totalHp} HP` : null].filter(Boolean).join(" · ")}
                  </p>
                  <p className="bwm-tilePrice">{b.price ? money(b.price) : "Call for pricing"}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {results.length > shown && (
        <div className="bwm-more">
          <button type="button" className="bwm-btnOutlineDark" onClick={() => setShown((n) => n + PAGE)}>
            Show {Math.min(PAGE, results.length - shown)} more boats
          </button>
        </div>
      )}
    </section>
  );
}

export function Arrow() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden className="bwm-arrow">
      <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
