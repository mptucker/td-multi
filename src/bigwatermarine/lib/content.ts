// Single source of truth for homepage copy and data.

import scoutOffshore from "@public/media/scout-offshore.webp";
import scoutDorado from "@public/media/scout-dorado.webp";
import verandaVx27 from "@public/media/veranda-vx27.webp";
import highfieldFamily from "@public/media/highfield-family.webp";
import berkshireCruise from "@public/media/berkshire-cruise.webp";
import type { StaticImageData } from "next/image";

export const site = {
  phone: "903-419-1019",
  phoneHref: "tel:+19034191019",
  locations: [
    {
      name: "Sales",
      street: "50055 N State Hwy 289",
      city: "Pottsboro, TX 75076",
      hours: ["Tuesday – Saturday", "9am – 5pm"],
      map: "https://maps.google.com/?q=50055+N+State+Hwy+289+Pottsboro+TX+75076",
    },
    {
      name: "Service",
      street: "33 Tackle Box Dr",
      city: "Pottsboro, TX 75076",
      hours: ["Tuesday – Friday 8am – 5pm", "Saturday 8am – 3pm"],
      map: "https://maps.google.com/?q=33+Tackle+Box+Dr+Pottsboro+TX+75076",
    },
  ],
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

export const brands: Brand[] = [
  {
    name: "Scout",
    kind: "Center consoles & dual consoles",
    line: "Offshore-grade craftsmanship that feels right at home on open water.",
    image: scoutOffshore,
    alt: "A Scout center console carving a wide wake across open water",
    href: "/scout/",
  },
  {
    name: "Veranda",
    kind: "Luxury pontoons",
    line: "Sport-boat performance with all-day pontoon comfort.",
    image: verandaVx27,
    alt: "A Veranda luxury pontoon with twin outboards running past a wooded shoreline",
    href: "/veranda/",
  },
  {
    name: "Highfield",
    kind: "Aluminum-hull RIBs",
    line: "Light, tough and stable. Built to go just about anywhere.",
    image: highfieldFamily,
    alt: "Friends relaxing aboard a Highfield RIB on calm turquoise water",
    href: "/highfield/",
  },
  {
    name: "Berkshire",
    kind: "Premium pontoons",
    line: "Room for the whole crew, and a smooth ride when the lake gets lively.",
    image: berkshireCruise,
    alt: "A Berkshire pontoon cruising under a bright summer sky",
    href: "/berkshire/",
  },
];


export const engineMakers = ["Suzuki", "Yamaha", "Mercury", "BRP"];

export { scoutDorado };
