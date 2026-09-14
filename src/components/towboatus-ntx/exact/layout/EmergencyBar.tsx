import type { Location } from "@/components/towboatus-ntx/exact/types";
import { PhoneIcon } from "@/components/towboatus-ntx/exact/icons";

interface EmergencyBarProps {
  locations: Location[];
  dispatchUrl: string;
}

export default function EmergencyBar({ locations, dispatchUrl }: EmergencyBarProps) {
  return (
    <div
      className="bg-red sticky top-0 z-[950]"
      role="banner"
      aria-label="Emergency contact"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-2">
        {/* Mobile: Simple single-line with primary number */}
        <div className="flex sm:hidden items-center justify-center gap-3">
          <span
            className="text-[10px] tracking-[0.08em] uppercase text-white/80"
            style={{ fontFamily: 'var(--font-teko)' }}
          >
            24/7 Assistance
          </span>
          <a
            href={`tel:+1${locations[0]?.phone.replace(/[^0-9]/g, "") || "9034190911"}`}
            className="text-[16px] text-white no-underline font-bold"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {locations[0]?.phone || "903-419-0911"}
          </a>
        </div>

        {/* Desktop: Full three-lake display */}
        <div className="hidden sm:flex items-center justify-center gap-4 lg:gap-6">
          <span
            className="text-[11px] tracking-[0.1em] uppercase text-white/70 font-medium"
            style={{ fontFamily: 'var(--font-teko)' }}
          >
            On-water assistance
          </span>
          <span className="text-white/30">·</span>
          <div className="flex items-center gap-2">
            <span
              className="text-[12px] tracking-[0.08em] uppercase text-white/80"
              style={{ fontFamily: 'var(--font-teko)' }}
            >
              Texoma
            </span>
            <a
              href={`tel:+1${locations[0]?.phone.replace(/[^0-9]/g, "") || "9034190911"}`}
              className="text-[18px] text-white no-underline hover:text-white/80 transition-colors"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              {locations[0]?.phone || "903-419-0911"}
            </a>
          </div>
          <span className="text-white/30">·</span>
          <div className="flex items-center gap-2">
            <span
              className="text-[12px] tracking-[0.08em] uppercase text-white/80"
              style={{ fontFamily: 'var(--font-teko)' }}
            >
              Bois d&apos;Arc
            </span>
            <a
              href={`tel:+1${locations[1]?.phone.replace(/[^0-9]/g, "") || "9036640911"}`}
              className="text-[18px] text-white no-underline hover:text-white/80 transition-colors"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              {locations[1]?.phone || "903-664-0911"}
            </a>
          </div>
          <span className="text-white/30">·</span>
          <div className="flex items-center gap-2">
            <span
              className="text-[12px] tracking-[0.08em] uppercase text-white/80"
              style={{ fontFamily: 'var(--font-teko)' }}
            >
              Cedar Creek
            </span>
            <a
              href={`tel:+1${locations[2]?.phone.replace(/[^0-9]/g, "") || "9036080911"}`}
              className="text-[18px] text-white no-underline hover:text-white/80 transition-colors"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              {locations[2]?.phone || "903-608-0911"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
