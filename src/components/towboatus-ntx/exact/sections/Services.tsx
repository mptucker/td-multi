import { services } from "@/components/towboatus-ntx/exact/static-data";
import ServiceCard from "@/components/towboatus-ntx/exact/ui/ServiceCard";

export default function Services() {
  return (
    <section
      id="services"
      className="py-14 lg:py-20 px-5 lg:px-8"
      aria-labelledby="svc-h2"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="numberOfItems" content={String(services.length)} />
      <meta itemProp="itemListOrder" content="Unordered" />

      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <header>
          <div
            className="text-red text-[12px] tracking-[0.14em] uppercase mb-4 flex items-center gap-3"
            style={{ fontFamily: 'var(--font-teko)' }}
          >
            <span className="w-6 h-[2px] bg-red" aria-hidden="true" />
            <span itemProp="name">What We Do</span>
          </div>
          <h2
            id="svc-h2"
            className="text-[clamp(36px,8vw,56px)] uppercase leading-[0.95] tracking-[0.01em] text-navy mb-5"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Complete On-Water Assistance
          </h2>
          <p
            className="text-[clamp(15px,2.5vw,18px)] font-light text-g500 leading-[1.6] max-w-[600px] mb-12"
            itemProp="description"
          >
            From a dead battery at sunset to a full salvage operation, our USCG-licensed captains
            handle every situation with professionalism and urgency.
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" role="list">
          {services.map((service, index) => (
            <div key={service.id} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" role="listitem">
              <meta itemProp="position" content={String(index + 1)} />
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
