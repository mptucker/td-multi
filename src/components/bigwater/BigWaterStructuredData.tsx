const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://bigwater.co/#organization",
      name: "BigWater.co",
      legalName: "Big Water Cowboys, LLC",
      url: "https://bigwater.co/",
      logo: {
        "@type": "ImageObject",
        url: "https://bigwater.co/bigwater/BWco_Logo.png",
        width: 1000,
        height: 246,
      },
      description:
        "A family of premium marine lifestyle, boat sales, boat club, towing, salvage, and on-water assistance brands serving Lake Texoma and North Texas.",
      telephone: "+1-903-419-1019",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pottsboro",
        addressRegion: "TX",
        postalCode: "75076",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "Lake", name: "Lake Texoma" },
        { "@type": "State", name: "Texas" },
        { "@type": "State", name: "Oklahoma" },
      ],
      brand: [
        { "@type": "Brand", name: "Big Water Marine", url: "https://bigwatermarine.com/" },
        { "@type": "Brand", name: "Big Water Boat Club", url: "https://bigwatermarine.com/boatclub" },
        { "@type": "Brand", name: "Big Water Cowboys", url: "https://towboatusntx.com/" },
        { "@type": "Brand", name: "TowBoatUS Lake Texoma", url: "https://towboatuslaketexoma.com/" },
      ],
      knowsAbout: [
        "Boat sales and service",
        "Boat club membership",
        "Marine towing",
        "Marine salvage",
        "Lake Texoma boating",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://bigwater.co/#website",
      url: "https://bigwater.co/",
      name: "BigWater.co",
      description: "Premium marine lifestyle brands serving Lake Texoma and North Texas.",
      publisher: { "@id": "https://bigwater.co/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": "https://bigwater.co/#webpage",
      url: "https://bigwater.co/",
      name: "BigWater.co — The Premium Marine Lifestyle",
      isPartOf: { "@id": "https://bigwater.co/#website" },
      about: { "@id": "https://bigwater.co/#organization" },
      inLanguage: "en-US",
    },
  ],
};

export function BigWaterStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
