"use client";

import { useState } from "react";
import type { Package } from "@/bigwatermarine/lib/service";

// Package cards with an at-our-shop / at-your-dock price switch. Both prices
// are always in the HTML (the inactive one is visually hidden) for search.
// Labels come from content/bigwatermarine.json → pages.winterize.packages.
export type PackageLabels = {
  shopOption: string;
  mobileOption: string;
  bestTag: string;
  shopPrice: string;
  mobilePrice: string;
  shopOnly: string;
  /** May include {hours}. */
  hours: string;
  /** May include {package}. */
  button: string;
};

export default function Packages({ packages, workOrderUrl, labels }: { packages: Package[]; workOrderUrl: string; labels: PackageLabels }) {
  const [where, setWhere] = useState<"onsite" | "mobile">("onsite");
  return (
    <div>
      <div className="bwm-switch" role="radiogroup" aria-label="Where should we winterize your boat?">
        <button type="button" role="radio" aria-checked={where === "onsite"} onClick={() => setWhere("onsite")}>{labels.shopOption}</button>
        <button type="button" role="radio" aria-checked={where === "mobile"} onClick={() => setWhere("mobile")}>{labels.mobileOption}</button>
      </div>
      <ul className="bwm-packages" role="list">
        {packages.map((p) => {
          const available = where === "onsite" || p.mobile != null;
          return (
            <li key={p.key} className="bwm-package" data-best={p.best ?? false} data-off={!available}>
              {p.best && <span className="bwm-serviceTag">{labels.bestTag}</span>}
              <h3>{p.name}</h3>
              <p className="bwm-packageTag">{p.tagline}</p>
              <p className="bwm-packagePrice" aria-live="polite">
                <span className={where === "onsite" ? "" : "bwm-srOnly"}>${p.onsite.toLocaleString()}<small> {labels.shopPrice}</small></span>
                <span className={where === "mobile" ? "" : "bwm-srOnly"}>
                  {p.mobile != null ? <>${p.mobile.toLocaleString()}<small> {labels.mobilePrice}</small></> : <small>{labels.shopOnly}</small>}
                </span>
              </p>
              <p className="bwm-packageHours">{labels.hours.replace("{hours}", p.hours)}</p>
              {p.builds && <p className="bwm-packageBuilds">{p.builds}</p>}
              <ul className="bwm-checks" role="list">
                {p.includes.map((x) => <li key={x}>{x}</li>)}
              </ul>
              <a href={workOrderUrl} className={p.best ? "bwm-btnTeal" : "bwm-btnOutlineDark"} aria-disabled={!available}>
                {labels.button.replace("{package}", p.name)}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
