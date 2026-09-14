import type { Service } from "@/components/towboatus-ntx/exact/types";
import { serviceIcons } from "@/components/towboatus-ntx/exact/icons";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = serviceIcons[service.icon];

  return (
    <article
      className="group p-5 px-[18px] border border-g100 rounded-lg transition-all duration-200 relative overflow-hidden hover:border-red/20 hover:shadow-[0_8px_28px_rgba(11,30,56,0.07)] hover:-translate-y-[3px]"
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] bg-g100 transition-colors duration-200 group-hover:bg-red"
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="w-10 h-10 bg-g100 rounded-[7px] flex items-center justify-center mb-3 transition-colors duration-200 group-hover:bg-red/10"
        role="img"
        aria-label={`${service.name} service icon`}
      >
        {IconComponent && (
          <IconComponent
            className="w-5 h-5 text-navy transition-colors duration-200 group-hover:text-red"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Name */}
      <h3
        className="font-condensed text-base font-bold uppercase text-navy mb-[6px] tracking-[0.02em]"
        itemProp="name"
      >
        {service.name}
      </h3>

      {/* Description */}
      <p className="text-[12.5px] text-g500 leading-[1.6]" itemProp="description">
        {service.description}
      </p>

      {/* Hidden SEO metadata */}
      <meta itemProp="serviceType" content={service.name} />
      <meta itemProp="areaServed" content="Lake Texoma, Bois d'Arc Lake, Cedar Creek Reservoir, North Texas" />
      <meta itemProp="provider" content="TowBoatUS Big Water Cowboys" />
    </article>
  );
}
