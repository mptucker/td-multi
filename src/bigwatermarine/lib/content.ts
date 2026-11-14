// Homepage data. Words come from content/bigwatermarine.json (edited in /admin).

import scoutOffshore from "@public/media/scout-offshore.webp";
import scoutDorado from "@public/media/scout-dorado.webp";
import verandaVx27 from "@public/media/veranda-vx27.webp";
import highfieldFamily from "@public/media/highfield-family.webp";
import berkshireCruise from "@public/media/berkshire-cruise.webp";
import type { StaticImageData } from "next/image";
import { cms } from "./cms";

export const site = {
  phone: cms.site.phone,
  phoneHref: `tel:${cms.site.phoneE164}`,
  locations: cms.site.locations,
  // Site-relative so they work on the new site and the preview alike.
  // Pages not rebuilt yet are served from WordPress automatically.
  links: {
    inventory: "/inventory/",
    service: "/service/",
    winterize: "/winterize/",
    boatClub: "/boatclub/",
    contact: "/contact/",
    about: "/about/",
    brands: "/brands/",
    financing: "/financing/",
    rentals: "/keepboating/",
    storage: "/storage/",
    faq: "/faq/",
    clubVsFreedom: "/big-water-boat-club-vs-freedom-boat-club/",
    texoma: "https://texomadestinations.com/",
  },
};

export type Brand = {
  name: string;
  kind: string;
  line: string;
  image: StaticImageData;
  alt: string;
  href: string;
};

const BRAND_IMAGES: Record<string, StaticImageData> = {
  Scout: scoutOffshore,
  Veranda: verandaVx27,
  Highfield: highfieldFamily,
  Berkshire: berkshireCruise,
};

/** Homepage builder cards. Words come from content/bigwatermarine.json (homeBrands). */
export const brands: Brand[] = cms.homeBrands.map((b) => ({ ...b, image: BRAND_IMAGES[b.name] ?? scoutOffshore }));


export const engineMakers = ["Suzuki", "Yamaha", "Mercury", "BRP"];

export { scoutDorado };
