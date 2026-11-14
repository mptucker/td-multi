"use client";

import Image from "next/image";
import { useState } from "react";
import { brands } from "@/bigwatermarine/lib/content";
import { applyFinderFilter } from "./filters";
import { Arrow } from "./Finder";

// Names on one side, one large photo on the other (desktop: hover, focus
// or click swaps it). On phones each builder opens like an accordion with
// its own photo, so nothing depends on hover.
export default function Builders({ counts }: { counts: Record<string, number> }) {
  const [active, setActive] = useState(0);

  return (
    <div className="bwm-builders">
      <div className="bwm-buildersMedia" aria-hidden>
        {brands.map((b, i) => (
          <Image
            key={b.name}
            src={b.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 56vw, 1px"
            placeholder="blur"
            className="bwm-buildersImg"
            data-active={i === active}
          />
        ))}
        <p className="bwm-buildersCaption"><span>{brands[active].name}</span>{brands[active].kind}</p>
      </div>

      <ul className="bwm-buildersList" role="list">
        {brands.map((b, i) => {
          const n = counts[b.name] ?? 0;
          const on = i === active;
          return (
            <li key={b.name} className="bwm-builder" data-active={on}>
              <button
                type="button"
                className="bwm-builderRow"
                aria-expanded={on}
                aria-controls={`bwm-builder-${i}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="bwm-builderName">{b.name}</span>
                <span className="bwm-builderKind">{b.kind}</span>
              </button>
              <div id={`bwm-builder-${i}`} className="bwm-builderMore">
                <div>
                  <div className="bwm-builderPhoto">
                    <Image src={b.image} alt={b.alt} fill sizes="92vw" placeholder="blur" className="object-cover" />
                  </div>
                  <p className="bwm-builderLine">{b.line}</p>
                  <div className="bwm-builderActions">
                    <button type="button" className="bwm-btnTeal bwm-btnSm" onClick={() => applyFinderFilter({ brand: b.name, condition: "All" })}>
                      {n} in stock · Shop now
                    </button>
                    <a href={b.href} className="bwm-textLink">About {b.name} <Arrow /></a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
