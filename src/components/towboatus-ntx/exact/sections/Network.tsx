import type { GroupedOperators } from "@/components/towboatus-ntx/exact/types";
import NetworkCard from "@/components/towboatus-ntx/exact/ui/NetworkCard";

interface NetworkProps {
  operators: GroupedOperators;
  nationalDispatchPhone: string;
}

const regionLabels: Record<string, string> = {
  "big-water-cowboys": "Big Water Cowboys Operations",
  "north-texas": "North Texas / DFW Region",
  oklahoma: "Oklahoma Region",
};

export default function Network({ operators, nationalDispatchPhone }: NetworkProps) {
  return (
    <section
      id="network"
      className="bg-navy-deep py-14 lg:py-20 px-5 lg:px-8 relative overflow-hidden"
      aria-labelledby="net-h2"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(200,16,46,0.06)_0%,transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative z-[1] max-w-[1280px] mx-auto">
        {/* Section header */}
        <div
          className="text-gold text-[12px] tracking-[0.14em] uppercase mb-4 flex items-center gap-3"
          style={{ fontFamily: 'var(--font-teko)' }}
        >
          <span className="w-6 h-[2px] bg-gold" aria-hidden="true" />
          Regional Network
        </div>
        <h2
          id="net-h2"
          className="text-[clamp(36px,8vw,56px)] uppercase leading-[0.95] tracking-[0.01em] text-white mb-5"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          North Texas & Oklahoma
          <br />
          <span className="text-gold-lt">TowBoatUS Network</span>
        </h2>
        <p className="text-[clamp(15px,2.5vw,18px)] font-light text-white/65 leading-[1.6] max-w-[600px] mb-10">
          Wherever you boat in North Texas or Oklahoma, there&apos;s a BoatUS-affiliated towing
          operator nearby. We believe in the network — here are the operators serving our region.
        </p>

        {/* Intro callout */}
        <div className="bg-white/[0.04] border border-white/[0.08] border-l-4 border-l-red rounded-r-md p-4 px-5 mb-9 text-sm text-white/65 leading-[1.6]">
          <strong className="text-white">Why we list our fellow operators:</strong> BoatUS Towing
          membership works everywhere the network reaches. Whether you&apos;re on our lakes or a
          neighboring reservoir, the same coverage applies. Know your nearest operator before you
          need them.
        </div>

        {/* Regions */}
        <div className="flex flex-col gap-8">
          {(["big-water-cowboys", "north-texas", "oklahoma"] as const).map((region) => {
            const ops = operators[region];
            if (!ops || ops.length === 0) return null;

            return (
              <div key={region}>
                {/* Region title */}
                <div className="flex items-center gap-3 mb-4">
                  <h3
                    className="text-[14px] tracking-[0.12em] uppercase text-white/60"
                    style={{ fontFamily: 'var(--font-teko)' }}
                  >
                    {regionLabels[region]}
                  </h3>
                  <span className="flex-1 h-px bg-white/10" aria-hidden="true" />
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ops.map((op) => (
                    <NetworkCard key={op.id} operator={op} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Find All Towers CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/[0.03] border border-white/[0.08] rounded-lg p-5">
          <div className="flex-1">
            <div
              className="text-[13px] tracking-[0.1em] uppercase text-gold mb-1"
              style={{ fontFamily: 'var(--font-teko)' }}
            >
              Nationwide Coverage
            </div>
            <p className="text-[14px] text-white/60 leading-[1.5]">
              Traveling outside our region? Find any TowBoatUS operator across the country with the official BoatUS Service Locator.
            </p>
          </div>
          <a
            href="https://www.boatus.com/servicelocator/Default.asp"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white no-underline text-[13px] font-semibold tracking-[0.02em] py-3 px-5 rounded transition-all hover:bg-white/20 whitespace-nowrap"
          >
            Find All Towers Nationwide <span className="text-[16px]">→</span>
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-white/30 mt-5 pt-5 border-t border-white/[0.06] leading-[1.55]">
          Contact information listed above is provided as a community resource for boaters on North
          Texas and Oklahoma lakes. Big Water Cowboys, LLC is not affiliated with the other
          operators listed — each is an independently owned and operated TowBoatUS licensed service
          provider. Verify current contact details before heading out. For 24/7 national dispatch:{" "}
          <strong className="text-white/60">{nationalDispatchPhone}</strong> or hail{" "}
          <strong className="text-white/60">VHF Channel 16</strong>.
        </p>
      </div>
    </section>
  );
}
