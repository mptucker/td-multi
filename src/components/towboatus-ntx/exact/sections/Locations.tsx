import type { Location } from "@/components/towboatus-ntx/exact/types";
import LocationCard from "@/components/towboatus-ntx/exact/ui/LocationCard";

interface LocationsProps {
  locations: Location[];
}

export default function Locations({ locations }: LocationsProps) {
  return (
    <section
      id="locations"
      className="bg-off-white py-14 lg:py-20 px-5 lg:px-8"
      aria-labelledby="loc-h2"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="numberOfItems" content={String(locations.length)} />
      <meta itemProp="name" content="TowBoatUS Big Water Cowboys Service Locations" />

      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <header>
          <div
            className="text-red text-[12px] tracking-[0.14em] uppercase mb-4 flex items-center gap-3"
            style={{ fontFamily: 'var(--font-teko)' }}
          >
            <span className="w-6 h-[2px] bg-red" aria-hidden="true" />
            Our Lakes
          </div>
          <h2
            id="loc-h2"
            className="text-[clamp(36px,8vw,56px)] uppercase leading-[0.95] tracking-[0.01em] text-navy mb-5"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Three Lakes, One Trusted Team
          </h2>
          <p
            className="text-[clamp(15px,2.5vw,18px)] font-light text-g500 leading-[1.6] max-w-[600px] mb-12"
            itemProp="description"
          >
            Big Water Cowboys holds TowBoatUS licensed service provider agreements across three major
            North Texas reservoirs — putting professional captains on the water where you boat.
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]" role="list">
          {locations.map((location, index) => (
            <div
              key={location.id}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              role="listitem"
            >
              <meta itemProp="position" content={String(index + 1)} />
              <LocationCard location={location} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
