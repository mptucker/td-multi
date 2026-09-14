import type { Location } from "@/components/towboatus-ntx/exact/types";

interface CoverageStripProps {
  locations: Location[];
}

export default function CoverageStrip({ locations }: CoverageStripProps) {
  return (
    <div className="bg-red py-6 px-5" role="region" aria-label="Service coverage">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h3
            className="text-[22px] lg:text-[26px] text-white mb-1 leading-tight"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Three Lakes. Complete North Texas Coverage.
          </h3>
          <p className="text-[14px] text-white/80">
            120,000+ combined surface acres served by Big Water Cowboys
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-navy-deep text-white text-[11px] tracking-[0.12em] uppercase py-2 px-4 rounded"
              style={{ fontFamily: 'var(--font-teko)' }}
            >
              {location.short_name || location.name.replace("TowBoatUS ", "")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
