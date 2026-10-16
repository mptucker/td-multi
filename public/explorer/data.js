/* Texoma Explorer content.
 * Sources: td-brand-sites (content/*.json, config/brands.ts, config/hub-links.ts) and
 * content/facts.json (last verified 2026-09-03). Every booking link hands off to the
 * existing pages; nothing here shows live availability.
 */
(function () {
  const HUB = "https://texomadestinations.com";

  // Stamp outbound links so the booking funnel can attribute the explorer.
  function link(url, brand, placement) {
    const [base, hash] = url.split("#");
    const u = new URL(base);
    u.searchParams.set("utm_source", "texoma-explorer");
    u.searchParams.set("utm_medium", "map");
    u.searchParams.set("utm_campaign", brand);
    if (placement) u.searchParams.set("utm_content", placement);
    return hash ? `${u}#${hash}` : `${u}`;
  }
  const hub = (path) => HUB + path;

  const BRANDS = {
    lighthouse: {
      name: "Lighthouse Resort & Marina", short: "Lighthouse", logo: "lighthouse.png",
      color: "#0c1854", accent: "#e03c30", cats: ["stay", "water"],
      tagline: "Cabins, waterfront RV sites and a full-service marina",
      photo: "lighthouse.jpg",
      blurb: "Lighthouse began as Preston Fishing Camp, one of the first marinas on the lake after it filled in 1944. Today it's the busiest property in the family: furnished cabins, waterfront RV sites, a year-round fuel dock, covered slips, a fishing pier and a lakefront playground, all on one point in Little Mineral.",
      site: "https://lighthouseresort.com", phone: "903.361.5070",
      address: "300 Lighthouse Drive, Pottsboro, TX 75076",
      hours: "Office & reservations 9am–5pm daily (off-peak)",
      facts: [["Cabins", "34"], ["Guests per cabin", "1–16"], ["Waterfront RV sites", "19"], ["Lodge capacity", "80"]],
      offers: [
        { t: "Cabins", d: "One-room hideaways to six-bedroom lake houses. Linens, grill and fire ring included.", p: "Sleeps 1–16", u: hub("/where-to-stay/cabins#/lighthouse"), cta: "Check dates" },
        { t: "Waterfront RV sites", d: "Gravel pads with 30 or 50 amp, water, table and fire ring. Dump station on site.", p: "19 sites", u: hub("/where-to-stay/rv-sites#/lighthouse"), cta: "Find a site" },
        { t: "Lodge & Fireside events", d: "Reunions, retreats and weddings at the Lodge (80 guests) or Fireside (25).", u: hub("/events"), cta: "Plan an event" },
        { t: "Covered slips", d: "20 to 50 feet, month-to-month or prepaid. Waitlist.", u: hub("/lighthouse-marina"), cta: "Marina details" },
      ],
    },
    fuel: {
      name: "Lighthouse Fuel Dock", short: "Fuel Dock", logo: "lighthouse.png",
      color: "#0c1854", accent: "#4aa3df", cats: ["water"],
      tagline: "Fuel, a lake store and the rental fleet",
      photo: "lighthouse.jpg",
      blurb: "The fuel dock stays open all year, with a store for ice, bait, snacks and firewood. Rent a tritoon for the day, add a tube, or grab kayaks and paddleboards by the hour.",
      site: hub("/lighthouse-marina"), phone: "903.786.2250",
      address: "Lighthouse Marina · 300 Lighthouse Drive",
      hours: "9am–5pm daily (off-peak), extended summer hours",
      facts: [["Full-day tritoon", "$600–$750"], ["Half-day tritoon", "$450–$600"], ["Renter age", "21+"]],
      offers: [
        { t: "Tritoon rental", d: "24-ft Berkshire and Trifecta tritoons for 11–12 guests. You pay for the fuel you use.", p: "From $450", u: hub("/reserve/a/boat-rental/at/lighthouse/cart/add/tritoon"), cta: "Reserve a tritoon" },
        { t: "All boat rentals", d: "Half and full days, tubes and lake toys.", u: hub("/things-to-do/boat-rentals"), cta: "See the fleet" },
        { t: "Kayaks & paddleboards", d: "By the hour, life jackets included.", p: "$25/hr", u: hub("/things-to-do#/kayaks-sups"), cta: "Reserve" },
      ],
    },
    fastrac: {
      name: "Fastrac Cruises", short: "Fastrac", logo: "fastrac.png",
      color: "#24306c", accent: "#48c0e4", cats: ["play", "water"],
      tagline: "Sunset cruises, dinner cruises and private charters",
      photo: "fastrac.jpg",
      blurb: "Lake Texoma's only cruise and charter service, departing the charter dock at Lighthouse Marina. Every cruise is BYOB with a licensed USCG captain. The Island Girl carries up to 70 guests on two decks.",
      site: "https://fastrac.com", phone: "903.361.0775",
      address: "Charter dock, Lighthouse Marina",
      hours: "Public cruises Fri & Sat evenings, May–Sep",
      facts: [["Sunset cruise", "$35"], ["Dinner cruise", "$60 · kids $40"], ["Island Girl", "70 guests"]],
      offers: [
        { t: "Sunset cruise", d: "90 minutes on the Sight-Sea-Er II. Snacks sold aboard.", p: "$35", u: hub("/things-to-do#/charters-cruises"), cta: "See dates" },
        { t: "Dinner cruise", d: "90 minutes on the Island Girl with dinner, dessert and soft drinks.", p: "$60 · $40 kids", u: hub("/things-to-do#/charters-cruises"), cta: "See dates" },
        { t: "Private charter", d: "Your boat, date and menu, for 2 to 70 guests.", p: "From $350/hr", u: "https://fastrac.com", cta: "Request a quote" },
        { t: "Water taxi", d: "Highport to the islands, or pickups anywhere in the service area.", p: "$25 each way", u: "https://fastrac.com/booking/", cta: "Book a ride" },
      ],
    },
    boatclub: {
      name: "Big Water Boat Club", short: "Boat Club", logo: "boat-club.png",
      color: "#0f1923", accent: "#c9a96e", cats: ["water"],
      tagline: "The best boats on the lake, without owning one",
      photo: "lighthouse.jpg",
      blurb: "Members get access to the club fleet from the Lighthouse Fuel Dock with no ownership hassles and no blackout dates. Members also save 50% on Lighthouse boat rentals.",
      site: "https://bigwatermarine.com/boatclub", phone: "903.419.1019",
      address: "At Lighthouse Fuel Dock · 300 Lighthouse Drive",
      facts: [["Based at", "Lighthouse Fuel Dock"], ["Rental discount", "50% for members"]],
      offers: [
        { t: "Membership", d: "Meet the team and see the fleet.", u: "https://bigwatermarine.com/boatclub", cta: "Explore the club" },
      ],
    },
    "island-view": {
      name: "Island View Park", short: "Island View", logo: "island-view.png",
      color: "#1f9fd0", accent: "#f09018", cats: ["play"],
      tagline: "Lake Texoma's most popular sandy beach",
      photo: "island-view.jpg",
      blurb: "Real sand, a gradual entry, covered picnic shelters, a volleyball court, outdoor showers and a store for whatever you forgot. Kayaks and paddleboards rent right off the beach. There is no lifeguard; swim at your own risk.",
      site: "https://islandviewtexoma.com", phone: "903.419.1008",
      address: "87426 Preston Bend Rd, Pottsboro, TX 75076",
      hours: "Daily 9am to sunset, year-round",
      facts: [["Day pass", "$7 · kids 7 & under free"], ["Covered shelter", "$40 per day"], ["Kayak or SUP", "$25 per hour"]],
      offers: [
        { t: "Day pass", d: "Guests 8 and older. Buy ahead and skip the gate line.", p: "$7", u: hub("/reserve/cart/add/islandview-day-pass"), cta: "Buy a day pass" },
        { t: "Covered shelter", d: "Seats 6–10 with a charcoal grill, yours from open to close.", p: "$40/day", u: hub("/things-to-do#/beach-access"), cta: "Reserve a shelter" },
        { t: "Kayaks & paddleboards", d: "Singles, doubles and SUPs, plus 90-minute guided paddles.", p: "From $25/hr", u: hub("/things-to-do#/kayaks-sups"), cta: "Reserve" },
        { t: "Beach picnic", d: "Styled picnics for two and group outings.", u: hub("/things-to-do#/picnics"), cta: "Book a picnic" },
      ],
    },
    sundance: {
      name: "Sundance Camp", short: "Sundance", logo: "sundance.png",
      color: "#456a78", accent: "#c8664f", cats: ["stay"],
      tagline: "A tiny-cabin village at the tip of Preston Point",
      photo: "sundance.jpg",
      blurb: "Eighty acres of post oak with water on three sides. Seven individually decorated tiny cabins share a modern bathhouse, a community fire pit and a 400-yard beach. There is no Wi-Fi on purpose.",
      site: "https://sundancetexoma.com", phone: "903.419.1011",
      address: "295 Glen Eden Drive, Pottsboro, TX 75076",
      hours: "Check-in 3pm · Check-out 11am",
      facts: [["Private acres", "80"], ["Tiny cabins", "7"], ["RV sites", "6"], ["Gatherings", "Up to 100"]],
      offers: [
        { t: "Tiny cabins", d: "Heated and cooled, linens included, bathhouse steps away.", p: "Sleeps 2–4", u: hub("/where-to-stay/cabins#/sundance"), cta: "See availability" },
        { t: "RV sites", d: "Six shaded gravel sites with 30 amp and water.", p: "6 sites", u: hub("/where-to-stay/rv-sites#/sundance"), cta: "Reserve a site" },
        { t: "Group camping", d: "Primitive tent area with fire pits and a restroom facility.", u: hub("/where-to-stay/tents#/sundance"), cta: "Book group camping" },
        { t: "Retreats & gatherings", d: "Rent the whole camp for up to 100 guests.", u: hub("/events"), cta: "Plan a retreat" },
      ],
      cabins: [
        { n: "Pecos", beds: "King", sleeps: 2, img: "sd-pecos.jpg" },
        { n: "Glorietta", beds: "King", sleeps: 2, img: "sd-glorietta.jpg" },
        { n: "Rosa Linda", beds: "King", sleeps: 2, img: "sd-rosa-linda.jpg" },
        { n: "Pinion House", beds: "Queen", sleeps: 2, img: "sd-pinion.jpg" },
        { n: "Cottonwood", beds: "Full + twin", sleeps: 3, img: "sd-cottonwood.jpg" },
        { n: "Arroyo", beds: "Two fulls", sleeps: 4, img: "sd-arroyo.jpg" },
        { n: "Ponderosa", beds: "Four twins · treehouse", sleeps: 4, img: "sd-ponderosa.jpg" },
      ],
    },
    paradise: {
      name: "Paradise on Lake Texoma", short: "Paradise", logo: "paradise.png",
      color: "#5f7784", accent: "#78b4c0", cats: ["stay"],
      tagline: "Glamping, cabins and camping on 200 gated acres",
      photo: "paradise.jpg",
      blurb: "A gated peninsula of shade trees on the quiet western shore. Stay in a waterfront Kabana, a 1920s train car or your own rig, then end up at the community bar and the group firepit watching the sun go down.",
      site: "https://paradisetexoma.com", phone: "903.419.1009",
      address: "503 Paradise Park Road, Pottsboro, TX 75076",
      hours: "Check-in 3pm · Check-out 11am",
      facts: [["Gated acres", "200"], ["RV & camper sites", "40"], ["Glamping", "Kabanas · Kasitas · Kimas"]],
      offers: [
        { t: "Glamping", d: "Kabanas on the water, Kasitas with a kids' loft, snug one-room Kimas.", p: "Sleeps 2–4", u: hub("/where-to-stay/cabins#/paradise"), cta: "See glamping" },
        { t: "Cabins", d: "The Paradise Express train car sleeps 6. Cabin 3 is a rustic three-bedroom duplex.", p: "Sleeps up to 6", u: hub("/where-to-stay/cabins#/paradise"), cta: "Check dates" },
        { t: "RV & camper sites", d: "Two loops. The South Loop is closest to the water, with 50 amp and full hookups.", p: "40 sites", u: hub("/where-to-stay/rv-sites#/paradise"), cta: "Find a site" },
        { t: "Primitive tent camping", d: "Walk-in shoreline sites P1–P6.", u: hub("/where-to-stay/tents#/paradise"), cta: "Explore tent sites" },
      ],
    },
    "tackle-box": {
      name: "The Tackle Box Outfitters", short: "Tackle Box", logo: "tackle-box.png",
      color: "#3b2417", accent: "#a63b2e", cats: ["shop"],
      tagline: "The last stop before the lake",
      photo: "tackle-box.jpg",
      blurb: "Shiners year-round, rods, reels and terminal tackle, the $12 Lake Texoma fishing license, ethanol-free fuel, propane refills, marine supplies, ice, firewood and hot coffee, on Highway 289.",
      site: "https://tackleboxtexoma.com", phone: "903.786.9010",
      address: "83924 N State Hwy 289, Pottsboro, TX 75076",
      hours: "Store hours vary by season",
      facts: [["Lake Texoma license", "$12"], ["Live bait", "Year-round"], ["Fuel", "Unleaded & ethanol-free"]],
      offers: [
        { t: "Fishing guides", d: "Book a trip with a local fishing guide.", u: hub("/things-to-do#/fishing"), cta: "Find a guide" },
        { t: "Visit the store", d: "Hours, directions and what's in stock.", u: "https://tackleboxtexoma.com", cta: "Store details" },
      ],
    },
    td: {
      name: "Texoma Destinations", short: "Texoma Destinations", logo: "texoma-destinations.png",
      color: "#12303a", accent: "#e8703a", cats: ["shop"],
      tagline: "One team for every stay and lake day",
      photo: "tackle-box.jpg",
      blurb: "The reservations and events team behind the family of properties works out of the Tackle Box building. They can put a whole trip together: a cabin, a boat, a cruise and a beach day.",
      site: HUB, phone: "903.361.8500",
      address: "Inside The Tackle Box · Hwy 289, Pottsboro",
      facts: [["TAP Explorer", "$99/yr"], ["TAP Adventurer", "$199/yr"], ["TAP Navigator", "$399/yr"]],
      offers: [
        { t: "TAP annual pass", d: "Year-round perks across every property, from free weekday shelters to rental discounts.", p: "From $99/yr", u: hub("/tap"), cta: "Compare passes" },
        { t: "Group events", d: "Weddings, reunions, corporate outings and picnics.", u: hub("/events"), cta: "Plan an event" },
        { t: "All stays", d: "Search cabins, glamping and RV sites across every property.", u: hub("/where-to-stay/cabins"), cta: "Search stays" },
      ],
    },
    "bwm-service": {
      name: "Big Water Marine · Service", short: "BWM Service", logo: "bigwater-marine.png",
      color: "#0f1923", accent: "#c9a96e", cats: ["shop", "water"],
      tagline: "Service and repair to keep you lake-ready",
      photo: "tackle-box.jpg",
      blurb: "Marine service and repair on Tackle Box Drive, next to The Tackle Box. Talk to the service team about maintenance, winterization and repairs.",
      site: "https://bigwatermarine.com/service/", phone: "903.419.1019",
      address: "33 Tackle Box Drive, Pottsboro, TX 75076",
      facts: [],
      offers: [
        { t: "Schedule service", d: "Maintenance, repair and seasonal prep.", u: "https://bigwatermarine.com/service/", cta: "Service details" },
        { t: "Contact the shop", d: "Questions about your boat or a quote.", u: "https://bigwatermarine.com/contact/", cta: "Contact service" },
      ],
    },
    "bwm-sales": {
      name: "Big Water Marine · Sales", short: "BWM Sales", logo: "bigwater-marine.png",
      color: "#0f1923", accent: "#c9a96e", cats: ["shop", "water"],
      tagline: "Premium boats and genuine care",
      photo: null,
      blurb: "Lake Texoma's destination dealership for new and used boats, on Highway 289 in Pottsboro.",
      site: "https://bigwatermarine.com", phone: "903.419.1019",
      address: "50055 N State Hwy 289, Pottsboro, TX 75076",
      facts: [],
      offers: [
        { t: "Boat inventory", d: "New and pre-owned boats in stock.", u: "https://bigwatermarine.com/inventory/", cta: "Browse boats" },
        { t: "Talk to sales", d: "Trade-ins, financing and sea trials.", u: "https://bigwatermarine.com/contact/", cta: "Contact sales" },
      ],
    },
    towboatus: {
      name: "TowBoatU.S. Lake Texoma", short: "TowBoatU.S.", logo: "towboatus.png",
      color: "#0d2240", accent: "#cc0000", cats: ["water"],
      tagline: "On-water assistance anywhere on the lake, 24/7",
      photo: null,
      blurb: "Towing, jump starts, fuel drops and soft ungroundings across all of Lake Texoma, Texas and Oklahoma sides. Operated by Big Water Cowboys, the local TowBoatUS port.",
      site: "https://towboatuslaketexoma.com", phone: "903.419.0911",
      address: "Serving all of Lake Texoma",
      hours: "24 hours a day, 365 days a year",
      facts: [["Coverage", "Entire lake"], ["Dispatch", "24/7"]],
      offers: [
        { t: "Need a tow now?", d: "Call dispatch, or hail on VHF channel 16.", u: "https://towboatuslaketexoma.com", cta: "Assistance details" },
        { t: "BoatUS membership", d: "Members get on-water towing covered.", u: "https://www.boatus.com/membership", cta: "About membership" },
      ],
    },
  };

  // Physical places on the map. A place can hold several brands.
  // Physical places on the map. A place can hold several brands; each brand sits at its own spot.
  // Spots: brand-site Google Place coordinates where we have them; the Lighthouse fuel dock is placed
  // from the property map scale (~0.24 m/px) relative to the Fastrac charter dock and checked against
  // the end of Lighthouse Drive in OpenStreetMap. BWM Service on Tackle Box Drive is approximate.
  const PLACES = [
    { id: "lighthouse", name: "Lighthouse Point", plan: "lighthouse", area: "Little Mineral", spots: [
      { brands: ["lighthouse"], lat: 33.860666, lng: -96.662635, label: "Resort office" },
      { brands: ["fuel", "boatclub"], lat: 33.85922, lng: -96.66162, label: "Fuel dock & store" },
      { brands: ["fastrac"], lat: 33.858662, lng: -96.661691, label: "Charter dock" },
    ] },
    { id: "island-view", name: "Island View", plan: "island-view", area: "Preston Peninsula", spots: [
      { brands: ["island-view"], lat: 33.8594498, lng: -96.67116 } ] },
    { id: "sundance", name: "Sundance", plan: "sundance", area: "Preston Point", spots: [
      { brands: ["sundance"], lat: 33.8784503, lng: -96.6363588 } ] },
    { id: "tackle", name: "Tackle Box Drive", area: "Hwy 289", spots: [
      { brands: ["tackle-box", "td"], lat: 33.834293, lng: -96.678798, label: "Tackle Box building" },
      { brands: ["bwm-service"], lat: 33.83441, lng: -96.67995, label: "33 Tackle Box Drive", approx: true },
    ] },
    { id: "bwm-sales", name: "Big Water Marine", area: "Pottsboro", spots: [
      { brands: ["bwm-sales"], lat: 33.7965322, lng: -96.677637 } ] },
    { id: "paradise", name: "Paradise", plan: "paradise", area: "Big Mineral", spots: [
      { brands: ["paradise"], lat: 33.7948778, lng: -96.7871514 } ] },
  ];
  PLACES.forEach((p) => {
    p.brands = p.spots.flatMap((s) => s.brands);
    p.lat = p.spots.reduce((a, s) => a + s.lat, 0) / p.spots.length;
    p.lng = p.spots.reduce((a, s) => a + s.lng, 0) / p.spots.length;
  });


  const CATS = [
    { id: "all", label: "Everything" },
    { id: "stay", label: "Stay" },
    { id: "play", label: "Play" },
    { id: "water", label: "On the water" },
    { id: "shop", label: "Shop & service" },
  ];

  // What a click on a plan unit says. Per-unit facts from the reservation system slot in via UNITS[place][id].
  const UNIT_TYPES = {
    lighthouse: {
      cabin: { label: "Cabin", brand: "lighthouse", body: "One of Lighthouse's furnished cabins. Every cabin has linens, basic dishes and cookware, a grill, fridge, microwave and coffee pot. Several are pet friendly for $35 per pet.", tags: ["Climate controlled", "Grill & fire ring", "Wi-Fi"], cta: "Check this cabin's dates", u: hub("/where-to-stay/cabins#/lighthouse") },
      rv: { label: "RV site", brand: "lighthouse", body: "Waterfront gravel site with 30 or 50 amp, water, a picnic table and fire ring. Up to six people (four adults). Pull straight through to the boat ramp.", tags: ["30/50 amp", "Water", "Lake view"], cta: "Reserve this site", u: hub("/where-to-stay/rv-sites#/lighthouse") },
      slip: { label: "Boathouse", brand: "lighthouse", body: "Covered slips from 20 to 50 feet, month-to-month or prepaid. Openings go to the waitlist first.", tags: [], cta: "Slip rental details", u: hub("/lighthouse-marina") },
    },
    paradise: {
      kabana: { label: "Kabana", brand: "paradise", body: "Waterfront glamping for two, the closest units to the lake. Heated and cooled, with USB charging, a fire pit, an outdoor sink and grill, and linens. Shared bathhouse nearby.", tags: ["Sleeps 2", "Waterfront", "Fire pit"], cta: "Book a Kabana", u: hub("/where-to-stay/cabins#/paradise"), img: "pd-kabana.jpg" },
      kasita: { label: "Kasita", brand: "paradise", body: "Waterview glamping with a loft bed for two kids. Heated and cooled, fire pit, outdoor sink and grill, linens. Shared bathhouse nearby.", tags: ["Sleeps 4", "Kids' loft", "Water view"], cta: "Book a Kasita", u: hub("/where-to-stay/cabins#/paradise"), img: "pd-kasita.jpg" },
      kima: { label: "Kima", brand: "paradise", body: "A snug one-room cabin with a full bed, a Bluetooth speaker and an outdoor kitchen. Shared bathhouse nearby.", tags: ["Sleeps 2", "Outdoor kitchen"], cta: "Book a Kima", u: hub("/where-to-stay/cabins#/paradise"), img: "pd-kima.jpg" },
      cabin: { label: "Cabin", brand: "paradise", body: "Towels, linens, dishes and cookware, a grill and a fire pit. Private bath.", tags: ["Private bath"], cta: "Check cabin dates", u: hub("/where-to-stay/cabins#/paradise") },
      rv: { label: "RV site", brand: "paradise", body: "South Loop site with a picnic table, fire ring and a view of the lake. Up to six people and two vehicles. No tents on RV sites.", tags: [], cta: "Reserve this site", u: hub("/where-to-stay/rv-sites#/paradise"), img: "pd-rv.jpg" },
      tent: { label: "Primitive site", brand: "paradise", body: "Walk-in tent site on the shoreline. Designated fire pits only.", tags: ["Walk-in", "Tents only"], cta: "Reserve a tent site", u: hub("/where-to-stay/tents#/paradise"), img: "pd-tent.jpg" },
    },
    "island-view": {
      shelter: { label: "Covered shelter", brand: "island-view", body: "A picnic table and charcoal grill under a roof, reserved for you from open to close. Seats 6–10.", tags: ["Seats 6–10", "Charcoal grill", "$40/day"], cta: "Reserve a shelter", u: hub("/things-to-do#/beach-access") },
    },
  };

  // Individual overrides by unit id, e.g. UNITS.lighthouse.c24 = { beds: "3 BR", sleeps: 8, pets: true }
  const UNITS = {
    paradise: { express: { name: "Paradise Express", short: "Express", note: "A 1920s train car, now two bedrooms and two baths for six, with a full kitchen. Dog friendly.", confirm: true }, "cab34": { name: "Cabin 3", note: "Rustic duplex with three bedrooms and one bath." } },
  };

  window.TX = { BRANDS, PLACES, CATS, UNIT_TYPES, UNITS, link, HUB };
})();
