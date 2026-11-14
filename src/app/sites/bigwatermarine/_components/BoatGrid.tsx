import Link from "next/link";
import BoatImage from "@/bigwatermarine/components/BoatImage";
import type { Boat } from "@/bigwatermarine/lib/boats/types";
import { boatPath, money, statusLabel } from "@/bigwatermarine/lib/boats/format";

// Server-rendered boat tiles (same look as the inventory finder), so every
// listing link is in the HTML for search engines.
export default function BoatGrid({ boats }: { boats: Boat[] }) {
  return (
    <ul className="bwm-grid" role="list">
      {boats.map((b, i) => (
        <li key={b.id} className="bwm-tile" style={{ ["--i" as string]: i % 8 }}>
          <Link href={boatPath(b)} className="bwm-tileLink">
            <div className="bwm-tileMedia">
              {b.images[0] && (
                <BoatImage src={b.images[0]} alt={b.title} fill sizes="(min-width: 1100px) 24vw, (min-width: 640px) 46vw, 92vw" className="bwm-tileImg" />
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
  );
}
