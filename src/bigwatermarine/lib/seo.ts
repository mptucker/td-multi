import type { Metadata } from "next";
import { config } from "@/bigwatermarine/lib/config";
import type { Boat } from "@/bigwatermarine/lib/boats/types";
import { boatPath, boatSummary, brandOf } from "@/bigwatermarine/lib/boats/format";

// ─────────────────────────────────────────────────────────────────────────
// SEO / AEO / GEO helpers. Every page builds its metadata and structured
// data from here so facts (name, address, hours, phone) never drift.
// ─────────────────────────────────────────────────────────────────────────

export const SITE = config.siteUrl.replace(/\/$/, "");
export const abs = (path: string) => `${SITE}${path.startsWith("/") ? path : `/${path}`}`;

export const BUSINESS = {
  name: "Big Water Marine",
  legalName: "Big Water Marine",
  description:
    "Boat dealer and factory-authorized marine service center on Lake Texoma in Pottsboro, Texas. New and pre-owned Scout, Veranda, Highfield and Berkshire boats, Suzuki, Yamaha, Mercury and BRP service, winterization, and Big Water Boat Club.",
  phone: "+1-903-419-1019",
  email: config.email,
  logo: abs("/bigwatermarine/brand/logo-grey-teal.png"),
  areaServed: ["Lake Texoma", "Pottsboro", "Sherman", "Denison", "North Texas", "Southern Oklahoma"],
  sameAs: [
    "https://www.facebook.com/bigwatermarinetexoma",
    "https://instagram.com/bigwatermarinetexoma",
    "https://www.youtube.com/@BigWaterCo",
    "https://maps.app.goo.gl/sjmwCSwReJN7aUYD8",
    "https://maps.app.goo.gl/GDXtV5XZCpCp2tao9",
  ],
  sales: {
    street: "50055 N State Hwy 289",
    hours: [{ days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "17:00" }],
  },
  service: {
    street: "33 Tackle Box Dr",
    hours: [
      { days: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
      { days: ["Saturday"], opens: "08:00", closes: "15:00" },
    ],
  },
};

const address = (street: string) => ({
  "@type": "PostalAddress",
  streetAddress: street,
  addressLocality: "Pottsboro",
  addressRegion: "TX",
  postalCode: "75076",
  addressCountry: "US",
});
const hours = (h: { days: string[]; opens: string; closes: string }[]) =>
  h.map((x) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: x.days, opens: x.opens, closes: x.closes }));

export const ORG_ID = `${SITE}/#organization`;
export const SERVICE_ID = `${SITE}/#service-center`;

/** Site-wide graph: the dealership, the service center and the website. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AutoDealer", "LocalBusiness"],
        "@id": ORG_ID,
        name: BUSINESS.name,
        url: `${SITE}/`,
        logo: BUSINESS.logo,
        image: BUSINESS.logo,
        description: BUSINESS.description,
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        priceRange: "$$",
        address: address(BUSINESS.sales.street),
        openingHoursSpecification: hours(BUSINESS.sales.hours),
        areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "Place", name })),
        brand: ["Scout", "Veranda", "Highfield", "Berkshire"].map((name) => ({ "@type": "Brand", name })),
        sameAs: BUSINESS.sameAs,
        department: { "@id": SERVICE_ID },
      },
      {
        "@type": "AutoRepair",
        "@id": SERVICE_ID,
        name: "Big Water Marine Service Center",
        url: abs("/service/"),
        telephone: BUSINESS.phone,
        address: address(BUSINESS.service.street),
        openingHoursSpecification: hours(BUSINESS.service.hours),
        parentOrganization: { "@id": ORG_ID },
        description:
          "Factory-authorized Suzuki, Yamaha, Mercury and BRP marine service: maintenance, diagnostics, repowers, winterization and mobile service around Lake Texoma.",
        areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "Place", name })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: `${SITE}/`,
        name: BUSINESS.name,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-US",
      },
    ],
  };
}

export function breadcrumbs(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: abs(it.path) } : {}),
    })),
  };
}

export type Faq = { q: string; a: string };
export function faqPage(faqs: Faq[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

const AVAILABILITY: Record<Boat["status"], string> = {
  active: "https://schema.org/InStock",
  "on-order": "https://schema.org/PreOrder",
  "sale-pending": "https://schema.org/LimitedAvailability",
  sold: "https://schema.org/SoldOut",
};

/** Vehicle + Product + Offer for one boat. */
export function boatProduct(b: Boat) {
  const url = abs(boatPath(b));
  const props: [string, string | number | null | undefined][] = [
    ["Year", b.year], ["Length", b.lengthLabel], ["Condition", b.condition], ["HIN", b.hin],
    ["Class", b.boatClass], ["Hull Material", b.hullMaterial],
    ["Engine", b.engineMake && b.totalHp ? `${b.engineMake} ${b.totalHp} HP` : b.engineMake],
  ];
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Vehicle"],
    "@id": `${url}#product`,
    name: b.title,
    url,
    description: boatSummary(b),
    image: b.images.slice(0, 6),
    brand: { "@type": "Brand", name: b.make },
    manufacturer: { "@type": "Organization", name: b.make },
    model: b.model,
    sku: b.id,
    ...(b.hin ? { serialNumber: b.hin, vehicleIdentificationNumber: b.hin } : {}),
    ...(b.year ? { vehicleModelDate: String(b.year), productionDate: String(b.year) } : {}),
    itemCondition: b.condition === "New" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    category: b.boatClass ?? "Boat",
    additionalProperty: props
      .filter(([, v]) => v != null && v !== "")
      .map(([name, value]) => ({ "@type": "PropertyValue", name, value: String(value) })),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      ...(b.price ? { price: String(b.price) } : {}),
      availability: AVAILABILITY[b.status],
      itemCondition: b.condition === "New" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      seller: { "@id": ORG_ID },
      areaServed: "Lake Texoma",
    },
  };
}

export function inventoryList(boats: Boat[], path = "/inventory/") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${abs(path)}#list`,
    name: "Boats for sale at Big Water Marine",
    numberOfItems: boats.length,
    itemListElement: boats.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(boatPath(b)),
      name: b.title,
    })),
  };
}

/** Standard page metadata: canonical URL, Open Graph, Twitter card. */
export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = abs(path);
  const images = image ? [{ url: image }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, siteName: BUSINESS.name, locale: "en_US", images },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export const brandName = brandOf;
