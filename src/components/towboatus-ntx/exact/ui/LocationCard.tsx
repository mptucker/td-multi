import type { Location } from "@/components/towboatus-ntx/exact/types";
import { PhoneIcon } from "@/components/towboatus-ntx/exact/icons";

interface LocationCardProps {
  location: Location;
  index: number;
}

export default function LocationCard({ location, index }: LocationCardProps) {
  const phoneClean = location.phone.replace(/[^0-9]/g, "");
  const locationName = location.short_name || location.name.replace("TowBoatUS ", "");

  return (
    <article
      className="bg-white rounded-lg overflow-hidden border border-g300 transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_16px_40px_rgba(11,30,56,0.12)] flex flex-col"
      itemScope
      itemType="https://schema.org/LocalBusiness"
      aria-label={`TowBoatUS ${locationName} - Boat towing and marine assistance`}
    >
      {/* Hidden SEO metadata */}
      <meta itemProp="name" content={`TowBoatUS ${locationName}`} />
      <meta itemProp="telephone" content={location.phone} />
      <meta itemProp="priceRange" content="$$" />
      <meta itemProp="paymentAccepted" content="Cash, Credit Card, BoatUS Membership" />
      {location.website_url && <meta itemProp="url" content={location.website_url} />}
      {/* Header */}
      <div className="bg-navy-mid px-6 pt-[22px] pb-[18px] relative overflow-hidden">
        {/* Background number */}
        <div
          className="absolute top-[6px] right-[18px] font-condensed text-[56px] font-black text-white/[0.05] leading-none pointer-events-none"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Red bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-red" aria-hidden="true" />

        {/* Badge */}
        {location.badge_label && (
          <div className="inline-block bg-red text-white text-[8px] font-bold tracking-[0.14em] uppercase px-[9px] py-[3px] rounded-sm mb-2">
            {location.badge_label}
          </div>
        )}

        {/* Name */}
        <h3 className="font-display text-xl font-bold text-white leading-[1.15] mb-1">
          TowBoatUS
          <br />
          {locationName}
        </h3>

        {/* State */}
        <div
          className="text-[10px] text-white/50 font-medium tracking-[0.1em] uppercase"
          itemProp="areaServed"
          itemScope
          itemType="https://schema.org/Place"
        >
          <span itemProp="name">{location.state || location.county}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 px-6 flex-1 flex flex-col">
        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-g100">
          {location.surface_acres && (
            <div className="flex flex-col gap-[1px]">
              <div className="font-condensed text-[22px] font-extrabold text-navy">
                {location.surface_acres}
              </div>
              <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-g500">
                Surface Acres
              </div>
            </div>
          )}
          {location.shoreline_miles && (
            <div className="flex flex-col gap-[1px]">
              <div className="font-condensed text-[22px] font-extrabold text-navy">
                {location.shoreline_miles}
              </div>
              <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-g500">
                Shoreline Miles
              </div>
            </div>
          )}
          <div className="flex flex-col gap-[1px]">
            <div className="font-condensed text-[22px] font-extrabold text-navy">24/7</div>
            <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-g500">
              Dispatch
            </div>
          </div>
        </div>

        {/* Description */}
        {location.description && (
          <p className="text-[13.5px] text-g700 leading-[1.65] mb-[18px] flex-1" itemProp="description">
            {location.description}
          </p>
        )}

        {/* Phone link */}
        <a
          href={`tel:+1${phoneClean}`}
          className="flex items-center gap-[9px] no-underline text-navy font-display text-[17px] font-semibold transition-colors hover:text-red mb-3"
        >
          <PhoneIcon className="w-[15px] h-[15px] text-red shrink-0" aria-hidden="true" />
          {location.phone}
        </a>

        {/* Website link */}
        {location.website_url && (
          <a
            href={location.website_url}
            target="_blank"
            rel="noopener"
            className="text-[11px] text-g500 no-underline inline-flex items-center gap-[5px] mb-[14px] transition-colors hover:text-red"
          >
            {location.website_url.replace("https://", "").replace(/\/$/, "")} ↗
          </a>
        )}

        {/* CTA */}
        <a
          href={`tel:+1${phoneClean}`}
          className="flex items-center justify-center gap-[7px] bg-red text-white no-underline font-display text-[13px] font-bold tracking-[0.1em] uppercase py-3 rounded transition-colors hover:bg-red-dark"
          aria-label={`Call TowBoatUS ${locationName} for emergency boat towing assistance`}
        >
          Get Help Now →
        </a>
      </div>

      {/* Opening hours schema */}
      <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification" className="hidden">
        <meta itemProp="dayOfWeek" content="Monday Tuesday Wednesday Thursday Friday Saturday Sunday" />
        <meta itemProp="opens" content="00:00" />
        <meta itemProp="closes" content="23:59" />
      </div>
    </article>
  );
}
