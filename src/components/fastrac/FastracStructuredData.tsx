import { fastracCruises } from "@/components/fastrac/FastracHome";

const origin = "https://fastrac.com";

const faqs = [
  {
    question: "Where do Fastrac cruises depart?",
    answer: "Fastrac public cruises depart from the charter dock at Lighthouse Marina, 300 Lighthouse Drive in Pottsboro, Texas. Guests should arrive at least 15 minutes before departure.",
  },
  {
    question: "Can guests bring their own drinks on a Fastrac cruise?",
    answer: "Adult beverages are BYOB unless the individual event listing says otherwise. Guests should review their cruise details before departure.",
  },
  {
    question: "Can I charter the entire boat?",
    answer: "Yes. Fastrac offers private Lake Texoma charters for groups ranging from two guests to celebrations of up to 70 guests.",
  },
  {
    question: "Where can I see current Fastrac cruise dates?",
    answer: "Current public cruises and seasonal experiences are listed in the live Texoma Destinations schedule linked from Fastrac.com.",
  },
];

export function FastracStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${origin}/#webpage`,
        url: `${origin}/`,
        name: "Fastrac Cruises | Lake Texoma Cruises & Private Charters",
        description: "Lake Texoma sunset, dinner, sightseeing and seasonal cruises plus private charters for 2–70 guests departing Lighthouse Marina in Pottsboro, Texas.",
        isPartOf: { "@id": `${origin}/#website` },
        about: { "@id": `${origin}/#business` },
        primaryImageOfPage: { "@id": `${origin}/#primaryimage` },
        inLanguage: "en-US",
      },
      {
        "@type": "ImageObject",
        "@id": `${origin}/#primaryimage`,
        url: `${origin}/fastrac/island-girl-aerial-current.jpg`,
        contentUrl: `${origin}/fastrac/island-girl-aerial-current.jpg`,
        caption: "Fastrac charter boat Island Girl on Lake Texoma",
      },
      {
        "@type": "ItemList",
        "@id": `${origin}/#cruises`,
        name: "Lake Texoma cruises and boat experiences",
        numberOfItems: fastracCruises.length,
        itemListElement: fastracCruises.map((cruise, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "TouristTrip",
            "@id": `${origin}/cruises/${cruise.slug}/#trip`,
            name: cruise.title,
            description: cruise.description,
            url: `${origin}/cruises/${cruise.slug}`,
            image: `${origin}${cruise.image}`,
            provider: { "@id": `${origin}/#business` },
            touristType: cruise.category,
            itinerary: {
              "@type": "Place",
              name: "Lake Texoma",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Pottsboro",
                addressRegion: "TX",
                addressCountry: "US",
              },
            },
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${origin}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
