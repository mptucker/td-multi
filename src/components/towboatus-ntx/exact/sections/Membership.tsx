import { membershipFeatures } from "@/components/towboatus-ntx/exact/static-data";
import { CheckIcon, StarIcon } from "@/components/towboatus-ntx/exact/icons";
import type { ImageRecord } from "@/components/towboatus-ntx/exact/data";
import ImageSlideshow from "@/components/towboatus-ntx/exact/ui/ImageSlideshow";

interface MembershipProps {
  boatusJoinUrl: string;
  boatusTowingUrl: string;
  coverageMapImages?: ImageRecord[];
}

export default function Membership({ boatusJoinUrl, boatusTowingUrl, coverageMapImages = [] }: MembershipProps) {
  return (
    <section
      id="membership"
      className="bg-navy-deep py-14 lg:py-20 px-5 lg:px-8 relative overflow-hidden"
      aria-labelledby="mem-h2"
    >
      {/* Diagonal pattern overlay */}
      <div
        className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,rgba(200,16,46,0.035)_40px,rgba(200,16,46,0.035)_42px)]"
        aria-hidden="true"
      />

      <div className="relative z-[1] max-w-[1280px] mx-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[60px] items-start mb-10">
          {/* Left column: copy + features */}
          <div>
            <div
              className="text-gold text-[12px] tracking-[0.14em] uppercase mb-4 flex items-center gap-3"
              style={{ fontFamily: 'var(--font-teko)' }}
            >
              <span className="w-6 h-[2px] bg-gold" aria-hidden="true" />
              BoatUS Membership
            </div>
            <h2
              id="mem-h2"
              className="text-[clamp(36px,8vw,56px)] uppercase leading-[0.95] tracking-[0.01em] text-white mb-5"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              The Smartest Investment
              <br />
              <span className="text-gold-lt">Before You Leave the Dock</span>
            </h2>
            <p className="text-[clamp(15px,2.5vw,18px)] font-light text-white/65 leading-[1.6] max-w-[600px] mb-7">
              A BoatUS Membership means BoatUS pays 100% for covered towing, fuel delivery (just pay for fuel), jump
              starts, soft-ungroundings, and dock-to-dock tows.
            </p>

            {/* Feature list */}
            <ul className="list-none flex flex-col gap-4 mb-8" aria-label="Membership benefits">
              {[
                {
                  title: "BoatUS Pays 100%",
                  desc: "for on-the-water towing, jump starts, fuel delivery, soft ungroundings, and dock-to-dock towing",
                },
                {
                  title: "Good on Any Boat",
                  desc: "you own, borrow, or rent — one membership, every vessel",
                },
                {
                  title: "Nation's Largest Fleet",
                  desc: "— 650+ boats in 325+ ports. Your membership works everywhere, not just our three lakes",
                },
                {
                  title: "25+ Benefits & Discounts",
                  desc: "including exclusive rewards at West Marine and partner retailers",
                },
                {
                  title: "24/7/365 Dispatch",
                  desc: "— call any time, any day, and be connected to your nearest TowBoatUS operator",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-white/70 leading-[1.55]">
                  <div
                    className="w-5 h-5 bg-red/20 border border-red/50 rounded-full flex items-center justify-center shrink-0 mt-[2px]"
                    aria-hidden="true"
                  >
                    <CheckIcon className="w-[11px] h-[11px] text-red" />
                  </div>
                  <span>
                    <strong className="text-white font-semibold">{item.title}</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={boatusJoinUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 bg-gold text-navy-deep no-underline font-display text-[13px] font-bold tracking-[0.1em] uppercase py-[11px] px-[18px] rounded max-w-[300px] transition-all hover:bg-gold-lt hover:-translate-y-px"
            >
              <StarIcon className="w-[14px] h-[14px]" aria-hidden="true" />
              Join BoatUS — Official Site
            </a>
          </div>

          {/* Right column: stat cards */}
          <div className="flex flex-col gap-5 mt-4 lg:mt-0">
            <div className="bg-white/[0.05] border border-white/10 border-l-4 border-l-red rounded-md p-5 px-6">
              <div
                className="text-[56px] text-gold-lt leading-none"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                $0
              </div>
              <div className="text-[14px] text-white/65 mt-2 leading-[1.5]">
                Member pays for covered towing.
                <br />
                <span className="text-white/45 text-[12px]">BoatUS pays 100% of the invoice.</span>
              </div>
            </div>
            <div className="bg-white/[0.05] border border-white/10 border-l-4 border-l-gold rounded-md p-5 px-6">
              <div
                className="text-[56px] text-gold-lt leading-none"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                650+
              </div>
              <div className="text-[14px] text-white/65 mt-2 leading-[1.5]">
                TowBoatUS vessels in
                <br />
                <span className="text-white/45 text-[12px]">325+ ports coast to coast</span>
              </div>
            </div>
            <div className="bg-white/[0.05] border border-white/10 border-l-4 border-l-white/25 rounded-md p-5 px-6">
              <div
                className="text-[56px] text-white leading-none"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                VHF 16
              </div>
              <div className="text-[14px] text-white/65 mt-2 leading-[1.5]">
                National dispatch channel &amp;
                <br />
                <span className="text-white/45 text-[12px]">800-391-4869 any time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing table */}
        <div
          className="overflow-x-auto rounded-[10px] border border-white/10"
          role="region"
          aria-label="BoatUS membership plan comparison"
        >
          <table className="w-full min-w-[480px] border-collapse bg-white/[0.03]">
            <thead>
              <tr>
                <th className="text-left p-4 pl-5 bg-black/25 border-b-2 border-white/10 align-bottom">
                  <span
                    className="text-[12px] tracking-[0.14em] uppercase text-white/45"
                    style={{ fontFamily: 'var(--font-teko)' }}
                  >
                    Plan Comparison
                  </span>
                </th>
                <th className="p-4 text-center bg-red/15 border-t-[3px] border-t-red border-b-2 border-white/10 align-bottom pb-0">
                  <span
                    className="text-[14px] tracking-[0.1em] uppercase text-white block mb-2"
                    style={{ fontFamily: 'var(--font-teko)' }}
                  >
                    ★ Freshwater Towing
                  </span>
                  <div className="leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                    <span className="text-[48px] text-white">
                      <sup className="text-[24px] align-top">$</sup>130
                    </span>
                    <span className="text-[16px] text-white/50 ml-1">/yr</span>
                  </div>
                  <a
                    href={boatusTowingUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-block bg-red text-white no-underline text-[12px] font-bold tracking-[0.1em] uppercase py-[10px] px-[20px] rounded my-3 mb-4 transition-colors hover:bg-red-dark whitespace-nowrap"
                  >
                    Get Towing
                  </a>
                </th>
                <th className="p-4 text-center bg-black/25 border-b-2 border-white/10 align-bottom pb-0">
                  <span
                    className="text-[14px] tracking-[0.1em] uppercase text-white/70 block mb-2"
                    style={{ fontFamily: 'var(--font-teko)' }}
                  >
                    Saltwater Towing
                  </span>
                  <div className="leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                    <span className="text-[48px] text-gold-lt">
                      <sup className="text-[24px] align-top">$</sup>215
                    </span>
                    <span className="text-[16px] text-white/50 ml-1">/yr</span>
                  </div>
                  <a
                    href={boatusTowingUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-block bg-white/20 text-white border border-white/30 no-underline text-[12px] font-bold tracking-[0.1em] uppercase py-[10px] px-[20px] rounded my-3 mb-4 transition-colors hover:bg-white/30 whitespace-nowrap"
                  >
                    Get Towing
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              {membershipFeatures.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "[&>td]:bg-white/[0.025]" : ""}>
                  <td className="text-left p-[13px] pl-5 border-b border-white/[0.06] text-white/80 text-[13px] leading-[1.45]">
                    {row.feature}
                  </td>
                  <td className="text-center p-[13px] border-b border-white/[0.06] bg-red/[0.06] align-middle">
                    {row.freshwater ? (
                      <span className="text-[#4CAF50] text-[17px]" aria-label="Included">
                        ✓
                      </span>
                    ) : (
                      <span className="text-white/20 text-[17px]" aria-label="Not included">
                        —
                      </span>
                    )}
                  </td>
                  <td className="text-center p-[13px] border-b border-white/[0.06] align-middle">
                    {row.saltwater ? (
                      <span className="text-[#4CAF50] text-[17px]" aria-label="Included">
                        ✓
                      </span>
                    ) : (
                      <span className="text-white/20 text-[17px]" aria-label="Not included">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-white/30 mt-3 leading-[1.5]">
          *Freshwater Towing plan covers inland waters of the Continental U.S. (excluding Florida) —
          this is the right plan for Lake Texoma, Bois d&apos;Arc, and Cedar Creek boaters. Pricing
          current as of 2025; always verify at{" "}
          <a
            href={boatusJoinUrl}
            target="_blank"
            rel="noopener"
            className="text-white/40 hover:text-white/60"
          >
            boatus.com/membership
          </a>
          . Big Water Cowboys, LLC is an authorized TowBoatUS licensed service provider.
        </p>

        {/* Coverage map slideshow */}
        {coverageMapImages.length > 0 && (
          <div className="mt-12 rounded-[10px] overflow-hidden border-2 border-white/10">
            <ImageSlideshow
              images={coverageMapImages}
              interval={8000}
              aspectRatio="2/1"
              className="bg-navy-mid"
              sizes="(max-width: 1280px) 100vw, 1280px"
              objectFit="cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
