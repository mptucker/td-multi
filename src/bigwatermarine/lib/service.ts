// Service and winterization prices, from the current Winterize page.
// Change a number here and every page (and its structured data) updates.

export const LABOR = { onsite: 165, mobile: 215 };
export const MOBILE_TRAVEL = { minimum: 75, perMile: 2.5 };

export type Package = {
  key: string;
  name: string;
  tagline: string;
  onsite: number;
  mobile: number | null; // null = onsite only
  hours: string;
  includes: string[];
  builds?: string;
  best?: boolean;
};

/** Inboard and sterndrive (I/O) winterization, single-engine, labor only. */
export const WINTER_PACKAGES: Package[] = [
  {
    key: "freezeguard",
    name: "FreezeGuard",
    tagline: "Essential winter protection",
    onsite: 335,
    mobile: 400,
    hours: "About 2 hours",
    includes: [
      "Drain engine block and manifolds; fill with non-toxic antifreeze",
      "Fog engine, add fuel stabilizer, remove drain plug(s)",
      "Disconnect battery cables",
      "Inspect and check lower-unit gear lube",
    ],
  },
  {
    key: "systemshield",
    name: "SystemShield",
    tagline: "Engine, drive and vessel protection",
    onsite: 565,
    mobile: 650,
    hours: "About 3.5 hours",
    builds: "Everything in FreezeGuard, plus:",
    includes: [
      "Change engine oil, oil filter and fuel filter (up to 6 qt oil)",
      "Drain, inspect and refill gear lube (trailer or lift only)",
      "Inspect outdrive, visual and functional",
      "Winterize one head or sink",
    ],
  },
  {
    key: "totallock",
    name: "TotalLock",
    tagline: "Ultimate mechanical and outdrive assurance",
    onsite: 750,
    mobile: 850,
    hours: "About 4.5 hours",
    builds: "Everything in SystemShield, plus:",
    includes: [
      "Grease U-joints, seals and bearings on the drive system",
      "Change impeller; inspect water pump and gasket",
      "Check gimbal bearing and alignment",
      "20-point full vessel inspection with a written summary",
    ],
  },
  {
    key: "securepro",
    name: "SecurePro",
    tagline: "All-inclusive protection, done for you",
    onsite: 1750,
    mobile: null,
    hours: "About 8.5 hours",
    builds: "Everything in TotalLock, plus:",
    includes: [
      "Shrink wrap (boats up to 25 ft)",
      "6 months of secure, uncovered storage at our service center",
      "Spring dewinterization (startup) included",
    ],
    best: true,
  },
];

export type MenuItem = { name: string; hours: string; onsite: string; mobile?: string; note: string };

/** Outboard winterization / seasonal service. */
export const OUTBOARD_MENU: MenuItem[] = [
  { name: "2-stroke basic", hours: "1 hr", onsite: "$165 + materials", mobile: "$215 + materials", note: "Add fuel treatment, check all fluid levels, inspect lower-unit gear lube." },
  { name: "4-stroke basic", hours: "1 hr", onsite: "$165 + materials", mobile: "$215 + materials", note: "Add fuel treatment, check fluids, inspect gear lube and lower-unit seals." },
  { name: "4-stroke enhanced", hours: "2 hrs", onsite: "$330 + materials", mobile: "$380 + materials", note: "Fuel treatment, engine oil and filter change, inspect gear lube and lower unit." },
  { name: "4-stroke ultimate", hours: "3.5 hrs", onsite: "$450 + materials", mobile: "$525 + materials", note: "Full oil and filter service, drain and refill gear lube, 20-point vessel inspection. Trailer or lift only." },
  { name: "PWC (Jet Ski, Sea-Doo, WaveRunner)", hours: "1 hr", onsite: "$165 + materials", mobile: "$215", note: "Stabilize fuel, clear water from the jet drive and engine, run and fill the block with non-toxic antifreeze." },
];

export const ADD_ONS: MenuItem[] = [
  { name: "Dewinterization (spring startup)", hours: "1 hr", onsite: "$165", note: "Flush antifreeze, reconnect systems, verify operation. Required for the winterization guarantee." },
  { name: "Freshwater or ballast system", hours: "1 hr", onsite: "$165 + materials", note: "Drain and fill with non-toxic antifreeze." },
  { name: "Blackwater (holding tanks)", hours: "1 hr", onsite: "$165 + materials", note: "Tank must be empty on arrival." },
  { name: "Shrink wrap", hours: "Varies", onsite: "$25 per foot", note: "White wrap with vents and supports. Done at our service center." },
  { name: "Uncovered storage", hours: "Monthly", onsite: "$2 per foot, per month", note: "Secure outdoor storage for shrink-wrapped boats." },
  { name: "Extra motors, generator, AC, shower, fridge", hours: "1 hr min. each", onsite: `$${LABOR.onsite}/hr`, mobile: `$${LABOR.mobile}/hr`, note: "Billed at labor rate, materials extra." },
];

export const WINTER_NOTES = [
  "All package pricing is labor only, for single-engine boats. Materials (antifreeze, oil, filters, stabilizer, parts) are billed separately, and we won't do additional work without an estimate first.",
  "The winterization guarantee applies when Big Water Marine also performs your spring dewinterization.",
  "Please have the battery charged and keys provided; a dead battery or missing key adds a $25 setup fee.",
  "Lower-unit and outdrive service must be done with the boat on a trailer or lift.",
  "Shrink wrap and storage are available only at our service center in Pottsboro.",
  `Mobile service travel: $${MOBILE_TRAVEL.minimum} minimum, $${MOBILE_TRAVEL.perMile.toFixed(2)} per mile.`,
];

export const INSPECTION_POINTS = [
  "Battery and wiring connections",
  "Navigation and interior lights",
  "Propeller hub and shaft",
  "Steering and tilt/trim",
  "Hull, thru-hulls and fittings",
  "Bilge pump and float switch",
  "Throttle and shift linkages",
  "Fuel lines and primer bulb",
  "Blower, belts, hoses and zincs/anodes",
  "Deck hardware, vents, alignment and safety gear",
];

// Customer reviews from the current Service page (verbatim).
export const REVIEWS = [
  { name: "David A.", text: "I just wanted to thank you all for fixing our pontoon so quickly! The staff was fantastic and kept me updated on all the issues without any price surprises. I really appreciate you coming out to our dock to get the stereo working before the holidays. You guys are awesome—5 stars to the GREAT team!" },
  { name: "Jeff L.", text: "Big Water Marine installed a new Suzuki 200 hp outboard on my pontoon boat. An excellent job all the way around , it was an old boat the cleaned up old wire issues. I’m completely satisfied with the sales and service" },
  { name: "Brett D.", text: "The service manager fixed me up quick. I was going to drop off my Volvo sea water pump to Replaced the bearing and he did it right then. Excellent. Next will be my Merc outboard water pump." },
  { name: "Jeff V.", text: "Big Water Marine was extremely helpful and responsive in fixing our older model boat (engine repairs and seasonal maintenance). They take pride and stand behind their work. Specifically, Brandon answered all of our questions and coordinated with our insurance when needed. The technicians were very thorough and checked out all our boat’s systems. We will be back for all of our future boat needs." },
  { name: "Josh H.", text: "Big Water Marine was such a pleasure to work with. Brandon and his tech team did an excellent job winterizing my boat in a timely manner. They have great prices and exceptional service. I highly recommend this business." },
  { name: "Terry B.", text: "Big Water Marine got me back on the water In no time. Also an excellent price on the parts I needed for my outboard. Vacation saved!" },
  { name: "Robert M.", text: "Big Water Marine is amazing. They treat you like a King and take great care of you and your boats needs. This is the only boat center that treats you with respect and has the best prices. I will always use them for now on. You have to check them out! Hard to find a place like this." },
  { name: "Bo C.", text: "Absolute flawless customer service! I was in a bind on Lake Texoma and they went out of their way to get me back on the water. Great people with great knowledge and dropped what they were doing to help me out. As long as they are in business they will have my support!" },
];

/** Why Big Water Marine for service (from the current Service page). */
export const SERVICE_WHY = [
  { title: "Factory Authorized", body: "Certified for Mercury, Yamaha, Suzuki, and BRP. Your warranty stays intact, and we have direct manufacturer support." },
  { title: "Same-Day Service", body: "For factory service intervals and routine maintenance, we offer same-day turnaround. Less time in the shop, more time on the water." },
  { title: "Expert Technicians", body: "Our team has decades of combined experience and ongoing factory training. They genuinely care about getting it right." },
  { title: "Genuine Care", body: "We’re boaters too. We treat every boat like it’s our own and every customer like they’re part of the Big Water Marine family." },
];

/** Additional services offered with service work. */
export const SERVICE_ADDONS = [
  "Interior boat detailing ($20 per sq ft)",
  "Exterior boat detailing ($20 per sq ft)",
  "Ceramic coating",
  "Acid wash for toons (pontoons $18 per ft, tritoons $25 per ft)",
  "Custom paint / wrap",
  "Stereo, AV and electronics install",
];

/** Additional services offered with winterization. */
export const WINTER_DETAILING = [
  "Interior boat detailing ($10 per ft)",
  "Exterior boat detailing ($8 per ft)",
  "Ceramic coating",
  "Acid wash for toons (pontoons $18 per ft, tritoons $25 per ft)",
];

/** Shop policies from the current service and winterization forms. */
export const SHOP_POLICIES = [
  "Big Water Marine is not responsible for any pre-existing damage, damage caused by conditions outside of our control, or any incidental damages that may occur during the repair, transportation, or storage of the boat, including damage to boat plugs, covers, or other accessories. We recommend you take pictures when you drop off your boat.",
  "Big Water Marine is not responsible for boat plugs or covers.",
  "Service boats will be parked outside until pulled inside to be worked on. Once complete, they will be outside.",
  "Storage charges of $15/day will be charged after 10 days of service completion.",
  "Leave the key in the boat at time of drop-off.",
  "We are not responsible for theft of personal items.",
];
