"use client";

import { useState } from "react";
import type { Package } from "@/bigwatermarine/lib/service";

// Package cards with an at-our-shop / at-your-dock price switch. Both prices
// are always in the HTML (the inactive one is visually hidden) for search.
export default function Packages({ packages, workOrderUrl }: { packages: Package[]; workOrderUrl: string }) {
  const [where, setWhere] = useState<"onsite" | "mobile">("onsite");
  return (
    <div>
      <div className="bwm-switch" role="radiogroup" aria-label="Where should we winterize your boat?">
        <button type="button" role="radio" aria-checked={where === "onsite"} onClick={() => setWhere("onsite")}>At our service center</button>
        <button type="button" role="radio" aria-checked={where === "mobile"} onClick={() => setWhere("mobile")}>Mobile, at your dock</button>
      </div>
      <ul className="bwm-packages" role="list">
        {packages.map((p) => {
          const available = where === "onsite" || p.mobile != null;
          return (
            <li key={p.key} className="bwm-package" data-best={p.best ?? false} data-off={!available}>
              {p.best && <span className="bwm-serviceTag">Best value</span>}
              <h3>{p.name}</h3>
              <p className="bwm-packageTag">{p.tagline}</p>
              <p className="bwm-packagePrice" aria-live="polite">
                <span className={where === "onsite" ? "" : "bwm-srOnly"}>${p.onsite.toLocaleString()}<small> at our shop</small></span>
                <span className={where === "mobile" ? "" : "bwm-srOnly"}>
                  {p.mobile != null ? <>${p.mobile.toLocaleString()}<small> mobile</small></> : <small>Service center only</small>}
                </span>
              </p>
              <p className="bwm-packageHours">{p.hours} labor · single engine · materials extra</p>
              {p.builds && <p className="bwm-packageBuilds">{p.builds}</p>}
              <ul className="bwm-checks" role="list">
                {p.includes.map((x) => <li key={x}>{x}</li>)}
              </ul>
              <a href={workOrderUrl} className={p.best ? "bwm-btnTeal" : "bwm-btnOutlineDark"} aria-disabled={!available}>
                Book {p.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
