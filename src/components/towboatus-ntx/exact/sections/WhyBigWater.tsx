import { whyPoints, awards } from "@/components/towboatus-ntx/exact/static-data";
import { StarIcon, ShieldIcon } from "@/components/towboatus-ntx/exact/icons";
import type { ImageRecord } from "@/components/towboatus-ntx/exact/data";
import ImageSlideshow from "@/components/towboatus-ntx/exact/ui/ImageSlideshow";

interface WhyBigWaterProps {
  fleetImages?: ImageRecord[];
}

export default function WhyBigWater({ fleetImages = [] }: WhyBigWaterProps) {
  return (
    <section
      id="about"
      className="bg-off-white py-14 lg:py-20 px-5 lg:px-8"
      aria-labelledby="why-h2"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Fleet image slideshow if available */}
        {fleetImages.length > 0 && (
          <div className="mb-10 rounded-lg overflow-hidden border-2 border-g300">
            <ImageSlideshow
              images={fleetImages}
              interval={8000}
              aspectRatio="21/9"
              className="bg-g100"
              sizes="(max-width: 1280px) 100vw, 1280px"
              objectFit="cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Left column: Stats */}
          <div className="grid grid-cols-2 gap-4 lg:mb-0 mb-10">
            {/* Full-width stat */}
            <div className="col-span-2 bg-navy rounded-lg p-6 border-b-4 border-red">
              <div
                className="text-[52px] text-white leading-none mb-1"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                120K+
              </div>
              <div
                className="text-[11px] tracking-[0.12em] uppercase text-white/60"
                style={{ fontFamily: 'var(--font-teko)' }}
              >
                Combined Surface Acres Served
              </div>
              <p className="text-[13px] text-white/50 mt-2 leading-[1.5]">
                Lake Texoma (89K) + Cedar Creek (33K) + Bois d&apos;Arc (16.6K). Solid North Texas
                and Southern Oklahoma coverage and willing to travel as needed.
              </p>
            </div>

            {/* Smaller stats */}
            <div className="bg-white rounded-lg p-5 border-b-4 border-red">
              <div
                className="text-[48px] text-navy leading-none mb-1"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                3
              </div>
              <div
                className="text-[11px] tracking-[0.1em] uppercase text-g500"
                style={{ fontFamily: 'var(--font-teko)' }}
              >
                Active Lake Operations
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 border-b-4 border-red">
              <div
                className="text-[48px] text-navy leading-none mb-1"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                24/7
              </div>
              <div
                className="text-[11px] tracking-[0.1em] uppercase text-g500"
                style={{ fontFamily: 'var(--font-teko)' }}
              >
                Live Dispatch available around the clock, every day of the year
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 border-b-4 border-red">
              <div
                className="text-[48px] text-navy leading-none mb-1"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                100%
              </div>
              <div
                className="text-[11px] tracking-[0.1em] uppercase text-g500"
                style={{ fontFamily: 'var(--font-teko)' }}
              >
                Licensed &amp; Insured
              </div>
            </div>
            <div className="bg-white rounded-lg p-5 border-b-4 border-red">
              <div
                className="text-[48px] text-navy leading-none mb-1"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                Salvors
              </div>
              <div
                className="text-[11px] tracking-[0.1em] uppercase text-g500"
                style={{ fontFamily: 'var(--font-teko)' }}
              >
                Salvage Experts, Certified Divers, Relationships with Insurance Companies
              </div>
            </div>
          </div>

          {/* Right column: Why points */}
          <div>
            <div
              className="text-red text-[12px] tracking-[0.14em] uppercase mb-4 flex items-center gap-3"
              style={{ fontFamily: 'var(--font-teko)' }}
            >
              <span className="w-6 h-[2px] bg-red" aria-hidden="true" />
              Why Big Water Cowboys
            </div>
            <h2
              id="why-h2"
              className="text-[clamp(32px,7vw,48px)] uppercase leading-[0.95] tracking-[0.01em] text-navy mb-6"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              Built for Big Water.
              <br />
              <span className="text-red">Operated by Professionals.</span>
            </h2>

            {/* Why points list */}
            <ul className="list-none flex flex-col gap-5 mb-8">
              {whyPoints.map((point) => (
                <li key={point.num} className="flex gap-4">
                  <div
                    className="text-[32px] text-red leading-none shrink-0 w-8"
                    style={{ fontFamily: 'var(--font-bebas)' }}
                    aria-hidden="true"
                  >
                    {point.num}
                  </div>
                  <div>
                    <div
                      className="text-[16px] uppercase text-navy mb-1 tracking-[0.02em]"
                      style={{ fontFamily: 'var(--font-teko)', fontWeight: 600 }}
                    >
                      {point.title}
                    </div>
                    <p className="text-[14px] text-g500 leading-[1.6]">{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Award ribbons */}
            <div className="flex flex-col gap-[10px]" role="list" aria-label="Awards and recognition">
              {awards.map((award) => (
                <div
                  key={award.id}
                  role="listitem"
                  className="flex items-center gap-3 bg-white border border-g300 border-l-4 border-l-gold rounded p-3 px-4"
                >
                  {award.icon === "star" ? (
                    <StarIcon className="w-5 h-5 text-gold shrink-0" aria-hidden="true" />
                  ) : (
                    <ShieldIcon className="w-5 h-5 text-gold shrink-0" aria-hidden="true" />
                  )}
                  <div className="text-xs text-g700 leading-[1.4]">
                    <strong className="block text-navy font-bold text-[13px] mb-[1px]">
                      {award.title}
                    </strong>
                    {award.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
