// Content for the four builder pages (/scout/, /veranda/, /highfield/, /berkshire/),
// carried over from the WordPress brand pages. One entry per builder: edit text,
// series, FAQs or photos here and the page and its search data update.

import type { StaticImageData } from "next/image";

import scoutHero from "@public/media/scout-xsf-running.webp";
import scoutA from "@public/media/scout-offshore.webp";
import scoutB from "@public/media/scout-sport-dorado.webp";
import scoutC from "@public/media/scout-bay.webp";
import scoutD from "@public/media/scout-dorado.webp";

import verandaHero from "@public/media/veranda-vr265.webp";
import verandaA from "@public/media/veranda-vx27-twin.webp";
import verandaB from "@public/media/veranda-family.webp";
import verandaC from "@public/media/veranda-vone.webp";
import verandaD from "@public/media/veranda-vx27.webp";

import highfieldHero from "@public/media/highfield-family.webp";
import highfieldA from "@public/media/highfield-tender-beach.webp";
import highfieldB from "@public/media/highfield-aerial.webp";
import highfieldC from "@public/media/highfield-sunset.webp";
import highfieldD from "@public/media/highfield-open-water.webp";

import berkshireHero from "@public/media/berkshire-cruise.webp";
import berkshireA from "@public/media/berkshire-sts-night.webp";
import berkshireB from "@public/media/berkshire-le.webp";
import berkshireC from "@public/media/berkshire-margaritaville.webp";
import berkshireD from "@public/media/berkshire-sport.webp";

export type BrandKey = "scout" | "veranda" | "highfield" | "berkshire";
type Faq = { q: string; a: string };

export type BrandContent = {
  key: BrandKey;
  name: "Scout" | "Veranda" | "Highfield" | "Berkshire";
  path: string;
  logo: { src: string; width: number; height: number };
  /** What they build, in plain words. Used in titles and answers. */
  kind: string;
  kindPlural: string;
  metaTitle: string;
  metaDescription: string;
  /** Small line above the headline, e.g. "Heritage. Elegance. Performance. Innovation." */
  eyebrow: string;
  headline: [string, string];
  lede: string;
  hero: StaticImageData;
  heroAlt: string;
  differenceKicker: string;
  differenceTitle: [string, string];
  differenceIntro: string;
  points: { title: string; body: string }[];
  videoTitle: string;
  videoBody: string;
  fleetIntro: string;
  series: { name: string; range?: string; body: string; href: string }[];
  gallery: { src: StaticImageData; alt: string }[];
  site: string;
  youtube?: string;
  youtubeLabel?: string;
  whyIntro: string;
  whyUs: { title: string; body: string }[];
  faqs: Faq[];
};

export const BRANDS: Record<BrandKey, BrandContent> = {
  scout: {
    key: "scout",
    name: "Scout",
    path: "/scout/",
    logo: { src: "/bigwatermarine/brands/scout-logo.png", width: 1200, height: 434 },
    kind: "boat",
    kindPlural: "boats",
    metaTitle: "Scout Boats for Sale on Lake Texoma | Scout Dealer in Pottsboro, TX",
    metaDescription:
      "Scout Boats at Big Water Marine on Lake Texoma. Deep-V offshore hulls, tournament-grade fishing features and family comfort. Dorado, XSF, Sport, Bay and LXF series. Shop Scout in Pottsboro, TX.",
    eyebrow: "Heritage. Elegance. Performance. Innovation.",
    headline: ["The ultimate", "family offshore boat."],
    lede: "Legendary craftsmanship meets tournament-grade performance. Experience Scout at Lake Texoma’s premier dealer.",
    hero: scoutHero,
    heroAlt: "A Scout center console running fast across open water",
    differenceKicker: "The Scout difference",
    differenceTitle: ["Why serious boaters", "choose Scout."],
    differenceIntro:
      "For over 25 years, Scout Boats has built a reputation on one simple promise: to create the finest fishing and family boats on the water. Every Scout combines offshore capability, tournament-grade fishability, and family-friendly comfort in a package that’s built to last generations. This isn’t marketing—it’s South Carolina craftsmanship backed by passionate anglers who refuse to compromise.",
    points: [
      { title: "Offshore Confidence", body: "Deep-V hulls with 20-24 degree deadrise deliver smooth, dry rides in rough water. From Lake Texoma chop to Gulf Coast swells, Scout hulls inspire confidence wherever you point the bow." },
      { title: "Tournament Ready", body: "Massive insulated fish boxes, dozens of rodholders, raw-water washdowns, and tackle storage everywhere. Scout’s fishing features aren’t afterthoughts—they’re designed by anglers who live on the water." },
      { title: "Family Comfort", body: "Premium upholstery, spacious lounges, optional cabin berths, and head compartments. Scout doesn’t make you choose between fishing and family—you get both in one incredible package." },
      { title: "South Carolina Craftsmanship", body: "Hand-laid fiberglass, wood-free construction, premium gelcoat, and obsessive attention to detail. Every Scout is built in Summerville, SC by craftsmen who take pride in their work." },
      { title: "Power Matched Performance", body: "Scout partners with Yamaha, Mercury, and Suzuki for unmatched reliability and performance. From efficient four-strokes to screaming V8s, Scout’s outboard options deliver the perfect balance of speed, fuel economy, and dependability." },
      { title: "Award-Winning Innovation", body: "Multiple NMMA Innovation Awards and BoatTest.com “Best Of” honors. Scout consistently pushes the boundaries with features like LXF luxury sport yachts, hydraulic platforms, and industry-leading storage solutions." },
    ],
    videoTitle: "Scout Boats TV",
    videoBody:
      "Experience the legendary Scout ride, tournament-grade fishing features, and family-friendly comfort that makes Scout the choice of serious boaters. Watch reviews, walkthroughs, and real-world performance on Scout’s YouTube channel.",
    fleetIntro:
      "From versatile bay boats to luxury sport fishing yachts, Scout builds boats for every adventure. Whether you’re chasing bass on Lake Texoma or heading offshore in the Gulf, there’s a Scout built for your style of boating.",
    series: [
      { name: "Dorado Series", range: "17′ – 27′ | Center Console", body: "The ultimate family fishing boats. Dual console protection, massive fishing features, comfortable seating, and legendary Scout ride quality. Perfect for families who fish seriously.", href: "https://scoutboats.com/models/dorado/" },
      { name: "LXF Series", range: "25′ – 42′ | Luxury Sport Fishing", body: "Where luxury meets tournament performance. Air conditioning, cabin berths, premium entertainment systems, and every fishing feature imaginable. The pinnacle of Scout engineering.", href: "https://scoutboats.com/models/lxf/" },
      { name: "XSF Series", range: "23′ – 33′ | Center Console", body: "Pure fishing machines with serious offshore capability. Tournament-grade features, massive fuel capacity, and hardcore fishing layouts for anglers who demand the best.", href: "https://scoutboats.com/models/xsf/" },
      { name: "Sport Series", range: "16′ – 21′ | Dual Console", body: "The gateway to Scout ownership. Smaller packages with big boat features—fishing amenities, comfortable seating, and that unmistakable Scout ride.", href: "https://scoutboats.com/models/sport/" },
      { name: "Bay Series", range: "17′ – 24′ | Bay & Flats", body: "Shallow water specialists built for inshore fishing. Lightweight, nimble, and loaded with fishing features. Perfect for Texas bays, Louisiana marshes, or Lake Texoma’s countless coves.", href: "https://scoutboats.com/models/bay/" },
    ],
    gallery: [
      { src: scoutA, alt: "A Scout center console carving a wake with friends aboard" },
      { src: scoutB, alt: "A family cruising in a Scout Sport Dorado" },
      { src: scoutC, alt: "A Scout bay boat running along a marsh shoreline" },
      { src: scoutD, alt: "A Scout Dorado running across blue water" },
    ],
    site: "https://scoutboats.com/",
    youtube: "https://www.youtube.com/@TeamScoutBoats",
    youtubeLabel: "Team Scout Boats on YouTube",
    whyIntro:
      "As Lake Texoma’s factory-authorized Scout dealer, we provide the complete ownership experience—from expert sales consultation to factory-authorized Yamaha service. We’re passionate Scout owners ourselves, and we’re here to ensure your Scout ownership is exceptional.",
    whyUs: [
      { title: "Warranty Experts", body: "Official Scout dealer with direct factory support and comprehensive warranty backing. We handle all warranty work efficiently and correctly." },
      { title: "Factory-Authorized Service", body: "Expert marine technicians keep your Scout running at peak performance. We know these boats inside and out." },
      { title: "White-Glove Delivery", body: "Complete rigging, sea trials, on-site training, and walkthrough. Your Scout arrives perfect and ready for adventure." },
      { title: "Lifetime Support", body: "You’re not just buying a boat—you’re joining the Big Water Marine family. We’re here for you throughout your entire Scout ownership journey." },
    ],
    faqs: [
          {
                q: "What makes Scout boats different from other brands?",
                a: "Scout Boats combines offshore capability, tournament-grade fishing features, and family comfort in every model. Built in South Carolina with hand-laid fiberglass and wood-free construction, Scout boats are designed by anglers who understand what serious boaters need. The exclusive Yamaha partnership ensures reliable, efficient power, while award-winning innovations keep Scout at the forefront of boat design."
          },
          {
                q: "Are Scout boats good for Lake Texoma?",
                a: "Absolutely. Scout’s deep-V hulls handle Lake Texoma’s chop with ease, delivering smooth, dry rides even in rough conditions. The versatile layouts work perfectly for Texas striped bass fishing, family days on the lake, and everything in between. Scout’s superior build quality stands up to the rigors of freshwater use while maintaining that legendary Scout ride."
          },
          {
                q: "What warranty comes with a new Scout?",
                a: "New Scout boats come with a comprehensive manufacturer warranty covering structure, components, and gelcoat. Each motor manufacturer carries separate factory warranties. As a factory-authorized dealer, Big Water Marine handles all warranty service directly, ensuring fast, professional repairs."
          },
          {
                q: "Can you finance a Scout purchase?",
                a: "Yes! We offer competitive marine financing with terms up to 20 years and rates as low as 5.99% APR for qualified buyers. We work with multiple marine lenders to secure the best rate and structure for your situation."
          },
          {
                q: "What's a quick overview of the Scout models?",
                a: "Scout Boats builds a range of models designed to fit every style of boating, from shallow-water fishing to offshore luxury cruising. The LXS and LXF series sit at the top—premium, high-performance center consoles and sport yachts with advanced materials, elegant finishes, and offshore range. The XSF (Sportfish) line delivers similar performance in a more fishing-focused package, balancing speed and versatility. The Dorado series features dual-console layouts ideal for families who split their time between cruising and casual fishing, while the Bay Boat (XSS/XSB) models are shallow-draft designs built for lakes, bays, and inshore adventures. Together, the lineup combines Scout’s signature quality, innovation, and style across every size and price point."
          }
    ],
  },

  veranda: {
    key: "veranda",
    name: "Veranda",
    path: "/veranda/",
    logo: { src: "/bigwatermarine/brands/veranda-logo.png", width: 1133, height: 190 },
    kind: "luxury pontoon",
    kindPlural: "luxury pontoons",
    metaTitle: "Veranda Pontoons for Sale on Lake Texoma | Veranda Dealer in Pottsboro, TX",
    metaDescription:
      "Veranda luxury pontoons at Big Water Marine on Lake Texoma. Patented all-aluminum deck, no wood to rot, matched with Yamaha power. Vista, Relax, Vertex and V-One series. Pottsboro, TX.",
    eyebrow: "Luxury. Comfort. Performance. Craftsmanship.",
    headline: ["The luxury pontoon", "for lake living."],
    lede: "Patented all-aluminum deck, quiet solid ride, and upscale appointments. Experience Veranda at Lake Texoma’s premier dealer.",
    hero: verandaHero,
    heroAlt: "A Veranda luxury pontoon running past a wooded shoreline",
    differenceKicker: "The Veranda difference",
    differenceTitle: ["Why lake lovers", "choose Veranda."],
    differenceIntro:
      "Veranda’s patented all-aluminum, interlocking deck system creates a quiet, solid ride with zero wood to rot. Pair that with refined seating, smart layouts, and dependable outboards, and you get a luxury pontoon that’s made to live at the lake—season after season.",
    points: [
      { title: "All-Aluminum Deck", body: "Patented, interlocking, all-aluminum deck—no plywood to swell or rot. Rigid, quiet, and built to last." },
      { title: "Luxury Seating", body: "Diamond-stitch upholstery, ergonomic lounges, and thoughtful storage for full-day comfort." },
      { title: "Quiet, Solid Ride", body: "Welded construction and the aluminum deck system deliver a remarkably quiet, solid feel on the water." },
      { title: "Unparalleled Performance", body: "Veranda’s large toons and aluminum deck matched exclusively with Yamaha gives the best in class capacity and horsepower options." },
      { title: "Fit Your Style", body: "Multiple layouts, lounge configurations, and color packages—build the Veranda that matches your lifestyle." },
      { title: "Low-Maintenance", body: "Aluminum deck, durable vinyls, and smart drainage keep upkeep simple so you can just go." },
    ],
    videoTitle: "Veranda TV",
    videoBody: "Walkthroughs, reviews, and ownership stories straight from the source.",
    fleetIntro: "From family cruising to fishing or watersports, there’s a Veranda for every way you enjoy the lake.",
    series: [
      { name: "Vista Series", body: "Value-packed luxury with the signature aluminum deck. Perfect for a balance of quality and price.", href: "https://www.verandamarine.com/vista-series/" },
      { name: "Relax Series", body: "Upscale seating, versatile layouts, and options to make every lake day effortless.", href: "https://www.verandamarine.com/relax-series/" },
      { name: "Vertex", body: "Top-tier fit & finish, tech, and performance—built for the most discerning lake owners.", href: "https://www.verandamarine.com/vertex-series/" },
      { name: "V-One Series", range: "25′ – 27′ | Up to 600 HP", body: "Veranda V One is the brand’s flagship luxury performance pontoon, built on Veranda’s patented all-aluminum, all-welded interlocking deck and wrapped in a striking fiberglass exterior for a quiet, solid ride with upscale comfort. The lineup includes a 25′ model and a 27′ Twin-Engine version powered exclusively by Yamaha (up to twin F300s), positioning V One as a high-style, high-horsepower pontoon for lake life and watersports.", href: "https://www.verandamarine.com/v-one/" },
    ],
    gallery: [
      { src: verandaA, alt: "A Veranda twin-engine pontoon with friends aboard" },
      { src: verandaB, alt: "A dad in the water catching a kid jumping off a Veranda" },
      { src: verandaC, alt: "A Veranda V-One gliding past tree-lined shore" },
      { src: verandaD, alt: "A Veranda pontoon with twin outboards underway" },
    ],
    site: "https://www.verandamarine.com/",
    youtube: "https://www.youtube.com/@VerandaPontoons",
    youtubeLabel: "Veranda on YouTube",
    whyIntro:
      "As Lake Texoma’s factory-authorized Veranda dealer, we deliver the complete ownership experience—expert consultation, precision rigging, and service that keeps you on the water.",
    whyUs: [
      { title: "Warranty Experts", body: "Direct factory support and fast, correct warranty work." },
      { title: "Factory-Authorized Service", body: "Mercury • Yamaha • Suzuki – rigged and serviced by pros." },
      { title: "White-Glove Delivery", body: "Sea trials, on-water training, and a perfect hand-off." },
      { title: "Lifetime Support", body: "You’re part of the Big Water family—before and after the sale." },
    ],
    faqs: [
          {
                q: "What makes Veranda different from other pontoons?",
                a: "The patented, all-aluminum, interlocking deck system. It’s rigid, quiet, and eliminates wood that can rot—giving you a solid, long-lasting platform with premium comfort."
          },
          {
                q: "Are Veranda pontoons good for Lake Texoma?",
                a: "Yes—solid ride, stable platforms, and versatile layouts make Veranda ideal for Texoma’s chop, coves, and all-day family cruising."
          },
          {
                q: "What motor options are available with Veranda?",
                a: "Veranda Luxury Pontoons are matched exclusively with Yamaha Outboard for the most reliable motor."
          },
          {
                q: "What warranty comes with a new Veranda?",
                a: "Manufacturer warranties apply to structure and components, with separate factory warranties for outboards. As an authorized dealer, we handle warranty service in-house."
          },
          {
                q: "Can you finance a Veranda purchase?",
                a: "Absolutely. We work with leading marine lenders to secure competitive rates and terms up to 20 years for qualified buyers."
          },
          {
                q: "What layouts and power options are available?",
                a: "Veranda’s layout codes make it easy to find your perfect pontoon setup. The F (Fish) layouts include fishing seats and livewells for anglers, while the RC (Rear Chase) offers aft-facing loungers ideal for relaxing and sunning. The VL (Versa Lounger) provides multi-position rear seating that converts from bench to sun pad, and the L (L-Shaped Lounger) maximizes space for entertaining and conversation. Models with P feature plush Pillow-Top Seating for added luxury and comfort, and DC (Dual Console) designs add a sportier look and improved wind protection for the captain and co-captain."
          },
          {
                q: "What's the difference between the Vista, Relax, Vertex and V-One series?",
                a: "The Vista Series offers exceptional value by combining Veranda’s patented all-aluminum deck system with upscale styling in compact 20′–22′ or 25′ formats—ideal for families starting out on Lake Texoma. The Relax Series steps things up with chaise lounges, upgraded dashboards and lighting options, blending lounge-style comfort and casual performance. The Vertex Series brings luxury and performance together—with premium furniture, fiberglass console accents and refined finishes for those who demand refinement in addition to function. And the flagship V One Series pushes maximum performance and style, featuring a tri-toon layout with striking fiberglass exterior, high-end audio and electronics, and twin-engine capability for serious lake-life luxury."
          }
    ],
  },

  highfield: {
    key: "highfield",
    name: "Highfield",
    path: "/highfield/",
    logo: { src: "/bigwatermarine/brands/highfield-logo.png", width: 1200, height: 207 },
    kind: "RIB",
    kindPlural: "RIBs",
    metaTitle: "Highfield RIBs for Sale on Lake Texoma | Highfield Dealer in Pottsboro, TX",
    metaDescription:
      "Highfield RIBs at Big Water Marine on Lake Texoma - America’s best-selling rigid inflatable. Aluminum hulls, ORCA Hypalon tubes. Sport, Classic, Velox and Patrol series. Pottsboro, TX.",
    eyebrow: "America’s #1 selling RIB",
    headline: ["Built different.", "Built to last."],
    lede: "High-performance aluminum hulls. Luxury appointments. The Highfield difference, available at Lake Texoma’s premier marine dealer.",
    hero: highfieldHero,
    heroAlt: "Friends relaxing aboard a Highfield RIB on turquoise water",
    differenceKicker: "The Highfield difference",
    differenceTitle: ["Why the world’s best boaters", "choose Highfield."],
    differenceIntro:
      "When you’re investing in a premium rigid inflatable boat, you need more than promises—you need proof. Highfield RIBs have earned their reputation as America’s best-selling RIB brand through relentless engineering, uncompromising quality, and a commitment to pushing the boundaries of what’s possible on the water.",
    points: [
      { title: "Proven Performance", body: "From 10′ yacht tenders to 30′ offshore machines, Highfield delivers speeds up to 60 mph with confidence. Dry-riding hulls, superior seaworthiness, and handling that inspires you to explore further." },
      { title: "Aluminum Advantage", body: "Forget gel coat chips and hull delamination. Highfield’s powder-coated aluminum hulls are eco-friendly, recyclable, and virtually indestructible. Beach your boat without worry—these hulls can take whatever you throw at them." },
      { title: "Luxury Refinement", body: "EVA teak decking, diamond-stitch upholstery, and integrated LED lighting create the most sophisticated RIB on the water. Recessed stainless-steel cleats, premium helm consoles—every detail refined." },
      { title: "ORCA Hypalon Tubes", body: "Premium tube construction using German Valmex PVC or French ORCA Hypalon for extreme durability. UV-resistant, chemical-resistant, and backed by warranties up to 10 years." },
      { title: "Integrated Fuel Tanks", body: "Every Sport Series model features clean, integrated fuel tanks—maximizing deck space and maintaining the sleek aesthetic. No portable tanks cluttering your cockpit." },
      { title: "Military-Grade Construction", body: "High-tensile aluminum hulls built to commercial Patrol series standards. 20-26 degree deadrise for superior handling in rough water. When Coast Guard professionals choose Highfield for search and rescue, you know these boats are built to last." },
    ],
    videoTitle: "Highfield TV",
    videoBody:
      "The Best Selling RIB in the US, but don’t take our word for it, learn more on Highfield’s YouTube page. Best in class design, performance, and construction and absolutely fun.",
    fleetIntro:
      "From compact 10-foot tenders to 30-foot offshore command centers, Highfield builds a RIB for every adventure. Every model shares the same DNA: military-grade construction, luxury refinement, and performance that exceeds expectations.",
    series: [
      { name: "Sport Series", range: "10′ – 30′ | Up to 600 HP", body: "The flagship series. Premium yacht tenders and day boats featuring upscale styling, EVA teak decking, and diamond-stitch upholstery.", href: "https://www.highfieldboats.com/boat/the-sport-range/" },
      { name: "Classic Console Series", range: "11′ – 15′ | 70-90 HP", body: "Lightweight performance meets console convenience. Perfect combination of early planing, durability, and amazing space in a compact RIB.", href: "https://www.highfieldboats.com/boat/the-classic-range/" },
      { name: "Velox Jet Series", range: "14′ – 19′ | Rotax Jet Drive", body: "The future of family boating. Rotax jet propulsion delivers instant throttle response, shallow water access, and virtually zero maintenance.", href: "https://www.highfieldboats.com/boat/the-velox-range/" },
      { name: "Patrol Series", range: "13′ – 30′ | Up to 600 HP", body: "When response, safety, and handling matter, the Patrol Series is ideal. Designed with First Responders, Law Enforcement, and Commercial Operators in mind. Big Water Marine specializes in building boats for response and rescue operations.", href: "https://www.highfieldboats.com/boat/the-patrol-range/" },
    ],
    gallery: [
      { src: highfieldA, alt: "A Highfield tender beached on white sand with a dog aboard" },
      { src: highfieldB, alt: "A Highfield RIB seen from above on deep blue water" },
      { src: highfieldC, alt: "A red Highfield RIB running at golden hour" },
      { src: highfieldD, alt: "A Highfield RIB carving across open water" },
    ],
    site: "https://www.highfieldboats.com/",
    whyIntro:
      "As Lake Texoma’s factory-authorized Highfield dealer, we don’t just sell boats—we provide a complete ownership experience backed by expertise, service, and genuine care.",
    whyUs: [
      { title: "Warranty Experts", body: "Official Highfield dealer with direct factory support and warranty backing. We can get your RIB repaired right." },
      { title: "Factory-Authorized Service", body: "Expert Mercury, Yamaha, Suzuki, BRP service keeps your Highfield performing perfectly." },
      { title: "White-Glove Delivery", body: "Full rigging, water testing, on-site training—we ensure your Highfield is perfect." },
      { title: "RIB Experts", body: "We know Rigid Inflatable Boats and love them. Our team uses Highfields in their day-to-day and are passionate about why RIBs are superior." },
    ],
    faqs: [
          {
                q: "What makes Highfield RIBs different from other brands?",
                a: "Highfield RIBs feature military-grade aluminum hulls that are powder-coated and built to commercial Patrol series standards. Unlike fiberglass hulls, you never have to worry about gel coat chips, stress cracks, or delamination. Combined with premium Orca Hypalon tubes, EVA teak decking, and luxury appointments, Highfield delivers unmatched durability with sophisticated style."
          },
          {
                q: "Are Highfield boats good for Lake Texoma?",
                a: "Absolutely. Highfield RIBs excel in the varied conditions of Lake Texoma—from calm coves to choppy main-lake runs. The 20-26 degree deadrise hulls provide excellent rough-water handling, while the shallow draft and RIB tube design make them perfect for beach landings and tight marina maneuvering."
          },
          {
                q: "What's the warranty on a new Highfield?",
                a: "New Highfield boats come with a comprehensive manufacturer warranty. Aluminum hulls carry extended structural warranties, while tubes are backed by 5-year (PVC) or 10-year (Hypalon) warranties. As a factory-authorized dealer, Big Water Marine handles all warranty service directly."
          },
          {
                q: "Can you finance a Highfield purchase?",
                a: "Yes! We offer competitive marine financing with terms up to 20 years and rates as low as 5.99% APR for qualified buyers. We work with multiple lenders to find you the best rate and structure."
          },
          {
                q: "What engine options are available?",
                a: "Highfield RIBs can be rigged with Mercury, Yamaha, Suzuki, or BRP outboards depending on model and your preferences. The Velox series features Rotax jet propulsion. We’ll help you select the perfect power package based on your intended use."
          }
    ],
  },

  berkshire: {
    key: "berkshire",
    name: "Berkshire",
    path: "/berkshire/",
    logo: { src: "/bigwatermarine/brands/berkshire-logo.png", width: 1200, height: 115 },
    kind: "pontoon",
    kindPlural: "pontoons",
    metaTitle: "Berkshire Pontoons for Sale on Lake Texoma | Berkshire Dealer in Pottsboro, TX",
    metaDescription:
      "Berkshire pontoons at Big Water Marine on Lake Texoma. LE, STS and CTS series with performance packages and refined interiors, plus Sport and Margaritaville Chill. Pottsboro, TX.",
    eyebrow: "Luxury. Performance. Family. Craftsmanship.",
    headline: ["Built for a better day", "on the water."],
    lede: "Berkshire pontoons combine luxurious comfort, advanced construction, and uncompromising performance. Discover why Berkshire is the choice for boaters who want elegance without limits.",
    hero: berkshireHero,
    heroAlt: "A Berkshire pontoon cruising under a bright summer sky",
    differenceKicker: "The Berkshire difference",
    differenceTitle: ["Luxury meets", "lasting performance."],
    differenceIntro:
      "Berkshire pontoons are engineered for strength, comfort, and lasting beauty. From their durable full-length under-deck performance packages to plush furniture and refined details, Berkshire delivers the ride quality, style, and reliability that serious lake lovers expect.",
    points: [
      { title: "Refined Interiors", body: "Premium upholstery, stainless hardware, and rich textures—every Berkshire feels handcrafted for your comfort." },
      { title: "Performance Packages", body: "Optional triple-toon and performance lifting strakes deliver smooth handling and higher top speeds with precision control." },
      { title: "Built to Last", body: "Heavy-gauge aluminum construction, under-deck protection, and meticulous quality assurance make Berkshire a long-term investment in lake life." },
    ],
    videoTitle: "Berkshire Life on the Water",
    videoBody: "See Berkshire in action: walkthroughs, features and real days on the lake.",
    fleetIntro: "From the entry-level LE Series to the ultra-luxurious STS and CTS lines, Berkshire offers a pontoon for every lifestyle and budget.",
    series: [
      { name: "LE Series", body: "Affordable luxury with quality construction and thoughtful layouts—perfect for first-time pontoon owners.", href: "https://www.berkshirepontoon.com/le-series/" },
      { name: "CTS Series", body: "Elevated design, enhanced performance, and options for every lifestyle—from cruising to tow sports.", href: "https://www.berkshirepontoon.com/cts-series/" },
      { name: "STS Series", body: "The pinnacle of Berkshire luxury—exclusive styling, digital helm options, and premium performance packages.", href: "https://www.berkshirepontoon.com/sts-series/" },
      { name: "Sport Series", range: "26′ – 31′ | Max 1500 HP", body: "The Berkshire Sport Series is built for boaters who demand both luxury and performance without compromise. Its sleek, athletic design and refined interior create a bold presence on the water, while advanced helm technology and performance-tuned construction deliver a smooth, exhilarating ride.", href: "https://berkshirepontoon.com/berkshire-sport" },
      { name: "Margaritaville Chill", range: "22′ – 25′ | 250 HP", body: "The Margaritaville Chill Series captures the easygoing spirit of island life with a perfect mix of comfort, style, and fun. Spacious seating, flexible layouts, and thoughtful amenities make every cruise feel like a getaway.", href: "https://berkshirepontoon.com/margaritaville-chill" },
    ],
    gallery: [
      { src: berkshireA, alt: "A Berkshire STS pontoon with under-deck lighting at dusk" },
      { src: berkshireB, alt: "A Berkshire LE pontoon full of friends on the lake" },
      { src: berkshireC, alt: "A Margaritaville Chill pontoon cruising past green hills" },
      { src: berkshireD, alt: "A Berkshire sport pontoon throwing spray" },
    ],
    site: "https://www.berkshirepontoon.com/",
    youtube: "https://www.youtube.com/@ForestRiverMarine",
    youtubeLabel: "Watch Berkshire on YouTube",
    whyIntro:
      "As Lake Texoma’s exclusive Berkshire dealer, Big Water Marine offers expert sales, certified service, and personal delivery to ensure your ownership experience is flawless.",
    whyUs: [
      { title: "Factory Warranty Support", body: "Authorized Berkshire warranty and service center for worry-free ownership." },
      { title: "Certified Technicians", body: "Our marine techs know Berkshire pontoons inside and out for precise, dependable service." },
      { title: "White-Glove Delivery", body: "Every boat arrives fully rigged, detailed, and ready for your first cruise." },
      { title: "Ongoing Support", body: "From service to storage, Big Water Marine is your partner for life on the lake." },
    ],
    faqs: [
          {
                q: "What makes Berkshire pontoons stand out?",
                a: "Berkshire pontoons combine premium craftsmanship, advanced performance packages, and luxurious design. Every model is built with heavy-gauge aluminum, full under-deck performance shields, and high-end finishes that define comfort and reliability."
          },
          {
                q: "Which Berkshire series should I choose?",
                a: "The LE Series delivers entry-level luxury at a great value, CTS adds upscale style and enhanced performance, and STS represents Berkshire’s top-of-the-line luxury and technology. Each is available in popular layouts like RC, F, VL, and DC configurations to match your lifestyle."
          },
          {
                q: "Are Berkshire pontoons good for Lake Texoma?",
                a: "Absolutely—Berkshire’s performance toons handle Texoma’s chop with ease while offering the comfort and versatility families love for cruising, watersports, and entertaining."
          },
          {
                q: "Can you finance a Berkshire?",
                a: "Yes, we offer competitive marine financing with flexible terms and quick approvals to make your Berkshire ownership effortless."
          },
          {
                q: "What are the differences of the models (LE, CTS, STS, Sport)?",
                a: "Berkshire offers four distinct series to fit every boater’s lifestyle. The LE Series delivers exceptional value with quality construction and classic styling—perfect for families and first-time pontoon owners. The CTS Series adds upscale features, enhanced performance options, and refined comfort for those who want a step up in luxury. The STS Series represents Berkshire’s premium line, combining top-tier materials, cutting-edge technology, and superior ride quality for an uncompromising experience. Finally, the Sport Series is the boldest of all, merging luxury and performance with sleek, athletic styling, advanced helm systems, and performance-tuned handling for those who want to make every day on the water exhilarating."
          }
    ],
  },
};

export const BRAND_KEYS = Object.keys(BRANDS) as BrandKey[];

/** Customer reviews shown on the brand pages (verbatim from the current site). */
export const BRAND_REVIEWS = [
  { name: "Corey H", text: "My dad just purchased a boat from these guys and there customer service is unmatched very impressive!" },
  { name: "Johnny S", text: "Went on some test drives on their pontoons and was very pleased with the customer service and time on the water. Will definitely be going with them on my outboard repowers as well." },
  { name: "Justin S", text: "I was a remote buyer and cold-called Big Water marine based on a boat they showed on their website that matched what I was looking for. They were super responsive in communication, fair on price, and worked with me to secure very favorable shipping costs. Was also great that their website showed accurate inventory (my experience when looking was that most shops do not keep their site up to date)" },
  { name: "Gary S", text: "My family just purchased a boat from Big Water Marine last weekend. I can’t say enough good things about them. Extremely friendly, helpful, and accommodating. Highly recommend them!" },
  { name: "Stephen C", text: "Great easy buying experience . I drove 7 hours from out of state to purchase an Excel boat . Everything was simple and smooth" },
  { name: "Christopher K", text: "Big Water Marine and their staff Elie and Michael were awesome!! They made the whole process easy and worry free!! I love my new Highfield Sport 660 and can’t wait to get it out on the water. If you’re in the market for Boat, Motor, Service do yourself a favour and visit Big Water Marine. They have the absolute best prices too! No hidden fees." },
];

/** Financing and trade-in details from the current brand pages. */
export const FINANCING = {
  financing: ["Rates as low as 5.99% APR*", "Terms up to 20 years", "Same-day approval available"],
  trade: ["Fast, fair valuations", "We handle all paperwork", "Trade any make or model"],
};
