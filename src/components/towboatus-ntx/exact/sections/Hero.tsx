import type { Location } from "@/components/towboatus-ntx/exact/types";
import type { ImageRecord } from "@/components/towboatus-ntx/exact/data";
import { PhoneIcon, StarIcon } from "@/components/towboatus-ntx/exact/icons";
import ImageSlideshow from "@/components/towboatus-ntx/exact/ui/ImageSlideshow";

interface HeroProps {
  locations: Location[];
  boatusJoinUrl: string;
  heroImages?: ImageRecord[];
  heroImagesMobile?: ImageRecord[];
}

export default function Hero({ locations, boatusJoinUrl, heroImages = [], heroImagesMobile = [] }: HeroProps) {
  const primaryPhone = locations[0]?.phone || "903-419-0911";
  const primaryPhoneClean = primaryPhone.replace(/[^0-9]/g, "");

  return (
    <section className="bg-navy-deep relative" aria-labelledby="hero-h1">
      {/* Background image slideshow with new gradient overlay */}
      <div className="absolute inset-0">
        {/* Mobile hero images (shown below sm breakpoint) */}
        {heroImagesMobile.length > 0 ? (
          <ImageSlideshow
            images={heroImagesMobile}
            interval={8000}
            className="absolute inset-0 sm:hidden"
            sizes="100vw"
            priority
            objectFit="cover"
            objectPosition="center -160px"
          />
        ) : heroImages.length > 0 ? (
          <ImageSlideshow
            images={heroImages}
            interval={8000}
            className="absolute inset-0 sm:hidden"
            sizes="100vw"
            priority
            objectFit="cover"
            objectPosition="center -160px"
          />
        ) : null}

        {/* Tablet hero images (640px to 1099px) */}
        {heroImages.length > 0 ? (
          <ImageSlideshow
            images={heroImages}
            interval={8000}
            className="absolute inset-0 hidden hero-bg-tablet"
            sizes="100vw"
            priority
            objectFit="cover"
            objectPosition="24% -208px"
          />
        ) : null}

        {/* Mid breakpoint hero images (1100px to 1279px) */}
        {heroImages.length > 0 ? (
          <ImageSlideshow
            images={heroImages}
            interval={8000}
            className="absolute inset-0 hidden hero-bg-mid"
            sizes="100vw"
            priority
            objectFit="cover"
            objectPosition="0% -211px"
          />
        ) : null}

        {/* Desktop hero images (1280px and above) */}
        {heroImages.length > 0 ? (
          <ImageSlideshow
            images={heroImages}
            interval={8000}
            className="absolute inset-0 hidden hero-bg-desktop"
            sizes="100vw"
            priority
            objectFit="cover"
            objectPosition="0% 116%"
          />
        ) : (
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_60%_40%,rgba(30,58,95,0.6)_0%,transparent_70%),linear-gradient(160deg,var(--color-navy-deep)_0%,var(--color-navy-mid)_50%,var(--color-steel)_100%)]"
            aria-hidden="true"
          />
        )}
        {/* Gradient overlay - left to right */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,17,26,0.75)_0%,rgba(6,17,26,0.65)_25%,rgba(6,17,26,0.25)_45%,rgba(6,17,26,0.05)_60%,transparent_75%)]"
          aria-hidden="true"
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-[2] min-h-[420px] flex flex-col justify-between">
        {/* Hero body section */}
        <div className="pt-10 px-9 pb-0">
          <div className="max-w-[560px]">
            {/* Eyebrow */}
            <div className="mb-4">
              <span className="text-[11px] uppercase tracking-[0.14em] text-white/50 font-semibold" style={{ fontFamily: 'var(--font-teko)' }}>
                24 / 7 / 365 · Licensed & Trained Captains · Lake Texoma · Bois d&apos;Arc · Cedar Creek
              </span>
            </div>

            {/* H1 Headline - Two-line treatment */}
            <h1 id="hero-h1" className="mb-5">
              <span
                className="block text-[clamp(36px,11vw,72px)] lg:text-[72px] leading-[0.95] text-white uppercase tracking-[0.02em]"
                style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700 }}
              >
                On The Water
              </span>
              <span
                className="block text-[clamp(28px,8vw,52px)] lg:text-[52px] leading-[1.05] text-red tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                When You Need Us Most
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-[16px] lg:text-[18px] text-white/65 leading-[1.6] mb-8 max-w-[480px] font-light">
              Professional towing, ungrounding, fuel, jump starts, and salvage across three North Texas lakes. One call and we&apos;re underway.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <a
                href={`tel:+1${primaryPhoneClean}`}
                className="inline-flex items-center justify-center gap-3 bg-red text-white no-underline text-[15px] font-bold tracking-[0.02em] py-[15px] px-[28px] rounded transition-all hover:bg-red-dark hover:scale-[1.02]"
              >
                <span className="text-[18px]">☎</span>
                <span>Call for Help · {primaryPhone}</span>
              </a>
              <a
                href="https://tide.towboatuslaketexoma.com/request"
                target="_blank"
                rel="noopener"
                className="inline-flex flex-col items-start justify-center bg-white/10 border border-white/25 text-white/85 no-underline py-[14px] px-[22px] rounded transition-all hover:bg-white/20"
              >
                <span className="text-[13px] font-semibold">Request Dispatch Online</span>
              </a>
            </div>
          </div>
        </div>

        {/* Membership anchor strip */}
        <div className="bg-[rgba(6,17,26,0.88)] border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-9 py-5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5 flex-wrap">
              {/* Label */}
              <div
                className="text-[13px] uppercase tracking-[0.12em] text-gold font-medium whitespace-nowrap"
                style={{ fontFamily: 'var(--font-teko)' }}
              >
                BoatUS Membership
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-8 bg-white/15 flex-shrink-0" aria-hidden="true" />

              {/* Copy */}
              <div className="flex-1 min-w-[200px] text-[15px] text-white/70 leading-[1.5]">
                <strong className="text-white font-semibold">Members pay $0 for covered towing.</strong> Join for $130/yr. Good on any boat, any lake, nationwide.
              </div>

              {/* Join button */}
              <a
                href={boatusJoinUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 bg-gold text-navy-deep no-underline text-[13px] tracking-[0.04em] py-[11px] px-[22px] rounded whitespace-nowrap flex-shrink-0 transition-all hover:bg-gold-lt hover:scale-[1.02] font-bold"
              >
                Join BoatUS <span className="text-[16px]">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Lake numbers strip - 3 column grid */}
        <div className="bg-navy-deep border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {/* Lake Texoma */}
            <div className="py-5 px-6 text-center">
              <div
                className="text-[11px] uppercase tracking-[0.14em] text-white/40 font-medium mb-2"
                style={{ fontFamily: 'var(--font-teko)' }}
              >
                Lake Texoma
              </div>
              <a
                href={`tel:+1${locations[0]?.phone.replace(/[^0-9]/g, "") || "9034190911"}`}
                className="text-[28px] lg:text-[32px] text-white no-underline transition-colors hover:text-red block leading-none"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {locations[0]?.phone || "903-419-0911"}
              </a>
              <div className="text-[11px] text-white/35 mt-2 font-medium">
                Texas / Oklahoma Border
              </div>
            </div>

            {/* Bois d'Arc Lake */}
            <div className="py-5 px-6 text-center">
              <div
                className="text-[11px] uppercase tracking-[0.14em] text-white/40 font-medium mb-2"
                style={{ fontFamily: 'var(--font-teko)' }}
              >
                Bois d&apos;Arc Lake
              </div>
              <a
                href={`tel:+1${locations[1]?.phone.replace(/[^0-9]/g, "") || "9036640911"}`}
                className="text-[28px] lg:text-[32px] text-white no-underline transition-colors hover:text-red block leading-none"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {locations[1]?.phone || "903-664-0911"}
              </a>
              <div className="text-[11px] text-white/35 mt-2 font-medium">
                Fannin County, Texas
              </div>
            </div>

            {/* Cedar Creek */}
            <div className="py-5 px-6 text-center">
              <div
                className="text-[11px] uppercase tracking-[0.14em] text-white/40 font-medium mb-2"
                style={{ fontFamily: 'var(--font-teko)' }}
              >
                Cedar Creek
              </div>
              <a
                href={`tel:+1${locations[2]?.phone.replace(/[^0-9]/g, "") || "9036080911"}`}
                className="text-[28px] lg:text-[32px] text-white no-underline transition-colors hover:text-red block leading-none"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                {locations[2]?.phone || "903-608-0911"}
              </a>
              <div className="text-[11px] text-white/35 mt-2 font-medium">
                Henderson & Kaufman Counties, Texas
              </div>
            </div>
          </div>
        </div>

        {/* Credential strip */}
        <div className="bg-navy-deep border-t border-white/[0.06] py-3 px-7">
          <div className="flex items-center justify-center gap-4 flex-wrap" style={{ fontFamily: 'var(--font-teko)' }}>
            <span className="text-[11px] uppercase tracking-[0.1em] text-white/30">
              Professional, Trained, Licensed & Insured
            </span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="text-[11px] uppercase tracking-[0.1em] text-white/30">
              Tower of the Year 2025
            </span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="text-[11px] uppercase tracking-[0.1em] text-white/30">
              BoatUS Authorized Provider
            </span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="text-[11px] uppercase tracking-[0.1em] text-white/30">
              Nationwide Network. Local Expertise.
            </span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="text-[11px] uppercase tracking-[0.1em] text-white/30">
              Meritorious Service Award 2026
            </span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="text-[11px] uppercase tracking-[0.1em] text-white/30">
              AFRAS Life Saving Award 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
