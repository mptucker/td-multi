"use client";

import { useMemo, useState } from "react";
import { money } from "@/bigwatermarine/lib/boats/format";

// "Rent, Join, Own" calculator — same formula and defaults as the WordPress
// version: rentals at $800/day, Boat Club at 50% off plus $500 initiation
// (first-membership discount off $1,000) and $50/month dues billed quarterly, and ownership financed at 10% down, 9% APR, 240 months.
const RENT_MIN = 41000;
const RENT_MAX = 52000;
const EQUIV_PRICE = 64000;
const CLUB_INITIATION = 500; // first membership; standard and rejoin fee is $1,000
const CLUB_INITIATION_STANDARD = 1000;
const CLUB_QUARTERLY = 150;
const CLUB_DISCOUNT = 0.5;

function pmt(rate: number, nper: number, pv: number) {
  if (rate === 0) return pv / nper;
  const f = Math.pow(1 + rate, nper);
  return (pv * rate * f) / (f - 1);
}

export default function RentJoinOwn({ fleetHref, clubHref, inventoryHref }: { fleetHref: string; clubHref: string; inventoryHref: string }) {
  const [days, setDays] = useState(8);
  const [rate, setRate] = useState(800);
  const [target, setTarget] = useState<"rental" | "equiv">("rental");
  const [boatPrice, setBoatPrice] = useState(45000);
  const [down, setDown] = useState(10);
  const [apr, setApr] = useState(9);
  const [term, setTerm] = useState(240);

  const r = useMemo(() => {
    const price = target === "equiv" ? EQUIV_PRICE : Math.min(RENT_MAX, Math.max(RENT_MIN, boatPrice || 45000));
    const rent = rate * days;
    const clubRental = rate * (1 - CLUB_DISCOUNT) * days;
    const clubFees = CLUB_QUARTERLY * 4;
    const clubFirst = CLUB_INITIATION + clubFees + clubRental;
    const clubRenew = clubFees + clubRental;
    const purchase = pmt(apr / 100 / 12, term, Math.max(0, price - price * (down / 100))) * 12;
    let best: "rent" | "club" | "own" = "rent";
    if (days >= 10) best = "own";
    else if (days >= 2) best = "club";
    return { price, rent, clubFirst, clubRenew, purchase, best, savings: rent - clubRenew };
  }, [days, rate, target, boatPrice, down, apr, term]);

  const headline =
    days <= 3 ? "Rentals make sense" : days <= 9 ? "Boat Club is your best fit" : "Ownership is the way to go";
  const explainer =
    days <= 3
      ? `At just ${days} days a year, renting keeps things simple and affordable.`
      : days <= 9
        ? `With ${days} days a year, our Boat Club gives you flexibility without ownership hassles (${money(CLUB_INITIATION)} initiation, discounted from ${money(CLUB_INITIATION_STANDARD)}, plus $50 a month billed quarterly).`
        : "At 10+ days a year, owning your own boat is the smartest investment. Let’s find your perfect match.";
  const rec =
    r.best === "own"
      ? `Ownership — at ${days} days/yr, buying makes the most sense.`
      : r.best === "club"
        ? `Join the Club — save about ${money(r.savings)} per year after year one.`
        : "Based on your usage, keep renting for now.";

  return (
    <div className="bwm-rjo">
      <div className="bwm-rjoInputs">
        <label className="bwm-field">
          <span>How many days do you want to boat this year? <strong className="bwm-rjoDays">{days} days</strong></span>
          <input type="range" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))} className="bwm-range" aria-label="Days per year" />
        </label>
        <label className="bwm-field">
          <span>Typical boat rental cost per day ($)</span>
          <input type="number" min={0} step={1} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} />
        </label>
        <div className="bwm-field">
          <span>Big Water Boat Club</span>
          <output>Saves 50% vs normal rental price · Initiation {money(CLUB_INITIATION)} (normally {money(CLUB_INITIATION_STANDARD)}) · $50/month, billed {money(CLUB_QUARTERLY)} quarterly</output>
        </div>
        <label className="bwm-field">
          <span>Purchase target</span>
          <select value={target} onChange={(e) => setTarget(e.target.value as "rental" | "equiv")}>
            <option value="rental">Used rental (typ. $45k)</option>
            <option value="equiv">New similar boat ($64,000)</option>
          </select>
        </label>
        {target === "rental" && (
          <label className="bwm-field">
            <span>&ldquo;This rental&rdquo; price ($41,000–$52,000)</span>
            <input type="number" min={RENT_MIN} max={RENT_MAX} step={100} value={boatPrice} onChange={(e) => setBoatPrice(Number(e.target.value) || 0)} />
          </label>
        )}
        <details className="bwm-faqItem">
          <summary>Advanced: financing details</summary>
          <div className="bwm-fieldRow bwm-fieldRow--3">
            <label className="bwm-field"><span>Down payment (%)</span><input type="number" min={0} max={100} step={1} value={down} onChange={(e) => setDown(Number(e.target.value) || 0)} /></label>
            <label className="bwm-field"><span>APR (%)</span><input type="number" min={0} max={30} step={0.1} value={apr} onChange={(e) => setApr(Number(e.target.value) || 0)} /></label>
            <label className="bwm-field"><span>Term (months)</span><input type="number" min={12} step={12} value={term} onChange={(e) => setTerm(Number(e.target.value) || 12)} /></label>
          </div>
          <p className="bwm-fine bwm-fine--dark">Active purchase price: {money(r.price)}</p>
        </details>
      </div>

      <div className="bwm-rjoResults" aria-live="polite">
        <ul className="bwm-rjoStats" role="list">
          <li data-best={r.best === "rent"}><span>Keep renting</span><strong>{money(r.rent)}</strong><small>per year</small></li>
          <li data-best={r.best === "club"}><span>Join Big Water Boat Club</span><strong>{money(r.clubFirst)}</strong><small>Year 1 includes initiation · Renewal {money(r.clubRenew)} / yr</small></li>
          <li data-best={r.best === "own"}><span>Purchase</span><strong>{money(r.purchase)}</strong><small>per year est.</small></li>
        </ul>
        <div className="bwm-rjoBest">
          <p className="bwm-rjoLabel">Your best fit</p>
          <h3>{headline}</h3>
          <p>{explainer}</p>
          <p className="bwm-fine bwm-fine--dark">Recommendation: {rec} (Club saves 50% on rentals.)</p>
          <div className="bwm-actions">
            <a href={fleetHref} className={r.best === "own" ? "bwm-btnTeal" : "bwm-btnOutlineDark"}>Buy the boat you rented</a>
            <a href={clubHref} className={r.best === "club" ? "bwm-btnTeal" : "bwm-btnOutlineDark"}>Join Big Water Boat Club</a>
            <a href={inventoryHref} className="bwm-btnOutlineDark">Buy a new boat and save</a>
          </div>
        </div>
      </div>
    </div>
  );
}
