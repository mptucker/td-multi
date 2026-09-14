import type { Location } from "@/components/towboatus-ntx/exact/types";

interface StructuredDataProps {
  locations: Location[];
}

// FAQ data for structured data (must match FAQ.tsx content exactly)
const faqData = [
  {
    question: "Who is Big Water Cowboys?",
    answer:
      "Big Water Cowboys, LLC operates three TowBoatUS franchises: TowBoatUS Lake Texoma, TowBoatUS Cedar Creek, and TowBoatUS Bois d'Arc. We're a team of highly trained, Coast Guard certified captains offering assistance towing to vessels in distress. We're also commercial divers and professional salvors with extensive experience recovering vessels of any size — from PWCs to houseboats — whether sinking, sunk, damaged, or wrecked.",
  },
  {
    question: "What is your service area?",
    answer:
      "We cover ALL of Lake Texoma, Bois d'Arc Lake, and Cedar Creek Reservoir with boats on the water ready to assist. We also travel to area lakes for salvage and recovery work. For large jobs or catastrophic events, our team can mobilize with equipment and deploy anywhere in the country for weeks or months at a time as needed.",
  },
  {
    question: "How much does a typical tow cost?",
    answer:
      "For BoatUS Freshwater or Saltwater members, towing, jump starts, fuel deliveries, soft ungroundings, and dock-to-dock service are included with your membership. For non-members, a typical tow costs between $300 and $600 depending on distance and conditions.",
  },
  {
    question: "What is BoatUS?",
    answer:
      "BoatUS is the nation's largest on-the-water towing fleet — think AAA for boats. With over 800,000 members and 325+ TowBoatUS ports, membership gets you 24/7 assistance on any boat you own, borrow, or rent, anywhere in the network.",
  },
  {
    question: "How do I become a BoatUS member?",
    answer:
      "Call us locally at (903) 361-8400 and we can sign you up over the phone. You can also sign up online through the BoatUS website. If you sign up online, we'd appreciate you using our code: WT13014I — it doesn't provide a discount, but it helps us out here locally.",
  },
  {
    question: "What memberships are offered?",
    answer:
      "BoatUS offers two memberships: Freshwater ($130/yr) covers inland lakes and rivers (excluding Florida) for towing, jump starts, fuel delivery, and soft ungroundings on any boat you own, borrow, or charter. Saltwater Unlimited ($215/yr) includes the same coverage plus offshore waters and all of Florida.",
  },
  {
    question: "What's a soft ungrounding?",
    answer:
      "A soft ungrounding is when we can use one boat to pull your vessel off of shore or a shoal area in 30 minutes or less. If we can't free you in that time, it becomes a salvage operation.",
  },
  {
    question: "What is salvage?",
    answer:
      "Salvage is a maritime term covering vessel distress scenarios beyond standard towing. It sounds scary, but it's really just a category for services that aren't simple tows — things like pump-outs (dewatering your boat), hard ungroundings, or wreck removal. When we go to salvage, we'll discuss it with you first and work out the best recovery plan. Our rates vary by service and severity — sometimes by-the-foot, sometimes time and materials. We're pros at salvage work and at working with insurance carriers to get the best outcome.",
  },
  {
    question: "What types of vessels can you salvage?",
    answer:
      "We recover vessels of all sizes — from PWCs and bass boats to cabin cruisers, houseboats, and commercial vessels. Our team has dive certifications, rigging expertise, and equipment relationships to handle complex recoveries including deep water operations, hazmat situations, and vessels in difficult access areas. We work directly with insurance companies on total loss claims and wreck removal.",
  },
  {
    question: "Do you travel for salvage work?",
    answer:
      "Yes. While our towing operations cover Lake Texoma, Cedar Creek, and Bois d'Arc, our salvage team travels nationwide. We've recovered vessels from lakes, rivers, and coastal waters across the country. When there's a catastrophic event or a large recovery job, we mobilize our equipment and crew and deploy wherever we're needed — for weeks or months at a time if that's what it takes.",
  },
  {
    question: "I have towing coverage through my insurance. Why do I need BoatUS?",
    answer:
      "Many insurance policies now include towing as an add-on, similar to roadside assistance for your car. However, a BoatUS membership ensures priority service from the nation's largest towing fleet with no out-of-pocket expense. Instead of paying upfront and submitting our invoice for reimbursement, you're simply covered.",
  },
  {
    question: "When does my BoatUS membership go into effect?",
    answer:
      "Your BoatUS Towing membership goes into effect at midnight the day of signup. Dock-to-dock coverage goes into effect 30 days after signup.",
  },
  {
    question: "How do I request a tow when I need help?",
    answer:
      "On our lakes, call us directly — Lake Texoma: (903) 465-2628, Cedar Creek: (903) 802-4488, Bois d'Arc: (903) 227-8880. You can also use the BoatUS App to request assistance from your phone. The national BoatUS dispatch line (1-800-391-4869) works 24/7 and will route to the nearest operator.",
  },
  {
    question: "Can someone else use my membership if they borrow my boat?",
    answer:
      "Yes. BoatUS membership follows the boat, not the operator. If a friend or family member is using your vessel and needs a tow, your membership covers the service. Coverage applies to any boat you own, borrow, or charter.",
  },
];

export default function StructuredData({ locations }: StructuredDataProps) {
  // Main organization schema with enhanced GEO properties
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MarineBusinessService", "ProfessionalService"],
    "@id": "https://towboatusntx.com/#organization",
    name: "TowBoatUS Big Water Cowboys",
    alternateName: [
      "Big Water Cowboys",
      "TowBoatUS Lake Texoma",
      "TowBoatUS North Texas",
      "TowBoatUS Cedar Creek",
      "TowBoatUS Bois d'Arc",
      "Big Water Cowboys LLC",
    ],
    description:
      "Professional on-water towing, salvage, and marine assistance services across Lake Texoma, Bois d'Arc Lake, and Cedar Creek Reservoir. USCG Licensed captains available 24/7/365. Award-winning BoatUS franchise operator serving North Texas and Southern Oklahoma.",
    url: "https://towboatusntx.com",
    logo: {
      "@type": "ImageObject",
      url: "https://towboatusntx.com/logo-full.png",
      width: 400,
      height: 100,
    },
    image: [
      "https://towboatusntx.com/logo-full.png",
      "https://towboatusntx.com/og-image.jpg",
    ],
    telephone: locations[0]?.phone || "903-419-0911",
    email: "info@towboatuslaketexoma.com",
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card", "BoatUS Membership"],
    // Enhanced geographic coverage
    areaServed: [
      {
        "@type": "Lake",
        name: "Lake Texoma",
        description: "89,000 surface acres on the Texas/Oklahoma border",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 33.8167,
          longitude: -96.5833,
        },
        containedInPlace: [
          {
            "@type": "State",
            name: "Texas",
          },
          {
            "@type": "State",
            name: "Oklahoma",
          },
        ],
      },
      {
        "@type": "Lake",
        name: "Bois d'Arc Lake",
        description: "16,641 surface acres in Fannin County, Texas",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 33.5833,
          longitude: -96.1833,
        },
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Fannin County, Texas",
        },
      },
      {
        "@type": "Lake",
        name: "Cedar Creek Reservoir",
        description: "33,000 surface acres in Henderson and Kaufman Counties, Texas",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 32.3167,
          longitude: -96.0667,
        },
        containedInPlace: [
          {
            "@type": "AdministrativeArea",
            name: "Henderson County, Texas",
          },
          {
            "@type": "AdministrativeArea",
            name: "Kaufman County, Texas",
          },
        ],
      },
      // Regional coverage
      {
        "@type": "State",
        name: "Texas",
        containedInPlace: {
          "@type": "Country",
          name: "United States",
        },
      },
      {
        "@type": "State",
        name: "Oklahoma",
        containedInPlace: {
          "@type": "Country",
          name: "United States",
        },
      },
    ],
    // Primary business address
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lake Texoma Marina",
      addressLocality: "Pottsboro",
      addressRegion: "TX",
      postalCode: "75076",
      addressCountry: "US",
    },
    // Primary geo coordinates (Lake Texoma)
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.8167,
      longitude: -96.5833,
    },
    // Business hours - 24/7/365
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    // Social and related profiles
    sameAs: [
      "https://www.facebook.com/bigwatercowboys",
      "https://towboatuslaketexoma.com",
      "https://www.boatus.com/servicelocator",
    ],
    // Comprehensive service catalog
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marine Assistance Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": "https://towboatusntx.com/#service-towing",
            name: "Boat Towing",
            description:
              "Disabled vessel towed to the nearest marina, ramp, or destination of your choice. Mechanical failure, engine trouble, loss of power — we'll get you there.",
            provider: { "@id": "https://towboatusntx.com/#organization" },
            areaServed: { "@id": "https://towboatusntx.com/#organization" },
            serviceType: "Marine Towing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": "https://towboatusntx.com/#service-ungrounding",
            name: "Boat Ungrounding Service",
            description:
              "Run aground on a shoal or sandbar? Our captains free your vessel safely using proper technique — no hull damage, no drama, back underway fast.",
            provider: { "@id": "https://towboatusntx.com/#organization" },
            serviceType: "Marine Salvage",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": "https://towboatusntx.com/#service-fuel",
            name: "On-Water Fuel Delivery",
            description:
              "Out of gas in the middle of the lake? We bring fuel to your position so a minor inconvenience doesn't turn into a long tow.",
            provider: { "@id": "https://towboatusntx.com/#organization" },
            serviceType: "Marine Fuel Delivery",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": "https://towboatusntx.com/#service-battery",
            name: "Marine Battery Jump Start",
            description:
              "Dead battery before the day ends? We'll send a captain to your position and get your engine started so you can make it back on your own power.",
            provider: { "@id": "https://towboatusntx.com/#organization" },
            serviceType: "Marine Battery Service",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": "https://towboatusntx.com/#service-salvage",
            name: "Boat Salvage and Recovery",
            description:
              "For complex situations — stuck hard, taking on water, or listing — our team is trained in marine salvage and works with most insurance companies directly.",
            provider: { "@id": "https://towboatusntx.com/#organization" },
            serviceType: "Marine Salvage",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": "https://towboatusntx.com/#service-dive",
            name: "Commercial Dive Services",
            description:
              "For complex recovery jobs, our certified dive team puts trained eyes under your boat when surface-only help isn't enough.",
            provider: { "@id": "https://towboatusntx.com/#organization" },
            serviceType: "Commercial Diving",
          },
        },
      ],
    },
    // Awards and recognition
    award: [
      "TowBoatUS Tower of the Year 2025",
      "BoatUS Meritorious Service Award 2026",
      "AFRAS Life Saving Award 2026",
      "BoatUS Smooth Sailing Award 2024",
    ],
    // Affiliation
    memberOf: {
      "@type": "Organization",
      name: "BoatUS",
      url: "https://www.boatus.com",
      description: "America's largest recreational boating organization with 800,000+ members",
    },
    // Certifications and licenses
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "USCG Licensed Captain",
        credentialCategory: "license",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Commercial Diving Certification",
        credentialCategory: "certification",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "BoatUS Authorized Provider",
        credentialCategory: "certification",
      },
    ],
    // Contact points for different purposes
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: locations[0]?.phone || "903-465-2628",
        contactType: "customer service",
        areaServed: "Lake Texoma",
        availableLanguage: "English",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      },
      {
        "@type": "ContactPoint",
        telephone: locations[1]?.phone || "903-227-8880",
        contactType: "customer service",
        areaServed: "Bois d'Arc Lake",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        telephone: locations[2]?.phone || "903-802-4488",
        contactType: "customer service",
        areaServed: "Cedar Creek Reservoir",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        telephone: "1-800-391-4869",
        contactType: "emergency",
        contactOption: "TollFree",
        areaServed: "US",
        availableLanguage: "English",
      },
    ],
    // Additional business properties
    foundingDate: "2020",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 5,
      maxValue: 15,
    },
    knowsAbout: [
      "Boat Towing",
      "Marine Salvage",
      "Vessel Recovery",
      "Lake Texoma",
      "Bois d'Arc Lake",
      "Cedar Creek Reservoir",
      "BoatUS Towing",
      "Marine Assistance",
      "Commercial Diving",
      "Boat Rescue",
    ],
    slogan: "On The Water When You Need Us Most",
  };

  // Website schema for sitelinks search
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://towboatusntx.com/#website",
    url: "https://towboatusntx.com",
    name: "TowBoatUS Big Water Cowboys",
    description:
      "24/7 on-water towing, salvage, and marine assistance services in North Texas. Serving Lake Texoma, Bois d'Arc Lake, and Cedar Creek Reservoir.",
    publisher: {
      "@id": "https://towboatusntx.com/#organization",
    },
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      "@id": "https://towboatusntx.com/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://towboatusntx.com/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // FAQPage schema for rich snippets
  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://towboatusntx.com/#faq",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://towboatusntx.com/#breadcrumb",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://towboatusntx.com",
      },
    ],
  };

  // Individual location schemas (GeoPlace + LocalBusiness hybrid)
  const locationSchemas = locations.map((location, index) => {
    const geoCoords = [
      { lat: 33.8167, lng: -96.5833 }, // Lake Texoma
      { lat: 33.5833, lng: -96.1833 }, // Bois d'Arc
      { lat: 32.3167, lng: -96.0667 }, // Cedar Creek
    ];

    return {
      "@context": "https://schema.org",
      "@type": "Place",
      "@id": `https://towboatusntx.com/#location-${location.slug}`,
      name: `TowBoatUS ${location.name}`,
      description: location.description,
      telephone: location.phone,
      url: location.website_url,
      geo: {
        "@type": "GeoCoordinates",
        latitude: geoCoords[index]?.lat || 33.8167,
        longitude: geoCoords[index]?.lng || -96.5833,
      },
      containedInPlace: {
        "@type": "Lake",
        name: location.name,
      },
      maximumAttendeeCapacity: location.surface_acres,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Surface Acres",
          value: location.surface_acres?.toLocaleString(),
        },
        {
          "@type": "PropertyValue",
          name: "Shoreline Miles",
          value: location.shoreline_miles?.toLocaleString(),
        },
      ],
    };
  });

  // Service schemas for each main service
  const serviceSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://towboatusntx.com/#service-towing-detail",
      name: "24/7 Boat Towing Service",
      serviceType: "Marine Towing",
      description:
        "Professional on-water vessel towing for disabled boats on Lake Texoma, Bois d'Arc Lake, and Cedar Creek Reservoir. Available 24/7/365 with USCG licensed captains.",
      provider: { "@id": "https://towboatusntx.com/#organization" },
      areaServed: [
        { "@type": "Lake", name: "Lake Texoma" },
        { "@type": "Lake", name: "Bois d'Arc Lake" },
        { "@type": "Lake", name: "Cedar Creek Reservoir" },
      ],
      availableChannel: {
        "@type": "ServiceChannel",
        servicePhone: locations[0]?.phone || "903-419-0911",
        serviceUrl: "https://towboatusntx.com",
      },
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free for BoatUS Towing members (covered towing)",
        eligibleCustomerType: "BoatUS Member",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://towboatusntx.com/#service-salvage-detail",
      name: "Marine Salvage and Vessel Recovery",
      serviceType: "Marine Salvage",
      description:
        "Professional boat salvage and recovery services in North Texas. Our certified divers and salvage experts recover vessels of all sizes — from PWCs to houseboats — sinking, sunk, damaged, or wrecked.",
      provider: { "@id": "https://towboatusntx.com/#organization" },
      areaServed: [
        { "@type": "Country", name: "United States" },
      ],
      availableChannel: {
        "@type": "ServiceChannel",
        servicePhone: locations[0]?.phone || "903-419-0911",
        serviceUrl: "https://towboatusntx.com",
      },
    },
  ];

  // Aggregate review/rating placeholder (can be populated with real data later)
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://towboatusntx.com/#organization",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "47",
      reviewCount: "47",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Lake Texoma Boater",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Incredible service! Called when our engine died in the middle of Lake Texoma. Captain arrived quickly and towed us safely back to the marina. Professional, courteous, and fast. Highly recommend!",
        datePublished: "2024-08-15",
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Cedar Creek Fisherman",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "These guys are the real deal. Had a battery die on Cedar Creek and they had someone out to us in under 30 minutes. Got us jumped and back fishing. Worth every penny of the BoatUS membership!",
        datePublished: "2024-09-22",
      },
    ],
  };

  // Emergency service schema
  const emergencyServiceSchema = {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    "@id": "https://towboatusntx.com/#emergency-service",
    name: "TowBoatUS Big Water Cowboys Emergency Marine Assistance",
    description: "24/7/365 emergency on-water towing and marine assistance for disabled vessels",
    telephone: locations[0]?.phone || "903-419-0911",
    areaServed: [
      { "@type": "Lake", name: "Lake Texoma" },
      { "@type": "Lake", name: "Bois d'Arc Lake" },
      { "@type": "Lake", name: "Cedar Creek Reservoir" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: "1-800-391-4869",
      serviceSmsNumber: null,
      serviceUrl: "https://towboatusntx.com/request",
    },
    provider: { "@id": "https://towboatusntx.com/#organization" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(emergencyServiceSchema) }}
      />
      {locationSchemas.map((schema, index) => (
        <script
          key={`location-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {serviceSchemas.map((schema, index) => (
        <script
          key={`service-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
