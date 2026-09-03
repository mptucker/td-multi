# Hub Audit: texomadestinations.com

Audited 2026-09-03 via full HTML crawl (curl) of every sitemap URL plus all discovered internal links, the WP REST API page list, the Google Maps marker feed, and the reservation app's public JSON endpoints. Sister-property domains were spot-checked with WebFetch only (this container's proxy blocks direct curl to them).

---

## 0. Executive summary

- **Platform:** WordPress (Uncode theme + child theme, Yoast SEO, Site Kit by Google 1.186.0, WP Google Maps, Contact Form 7, WPForms, Autoptimize, GTM `GTM-K9PSTVWW`, Meta Pixel, reCAPTCHA v3, Whistle chat plugin). No blog/posts (`/wp-json/wp/v2/posts` returns `[]`), no news feed.
- **Booking system:** a first-party Angular SPA, WordPress plugin `td-reservations` (bundle version **3.12.0**), mounted at `/reserve/*` (full app) and embedded as a widget on Where-to-Stay / Things-to-Do / TAP pages. Backend API is same-origin: `/api/v1/texomadestinations/*` (nginx, Laravel-style XSRF; session cookie `td_reservations_api`). **No third-party booking domain** (no Campspot/Newbook/RMS/etc.). Fastrac cruises on the Texie page book on `fastrac.com/reserve/...` (same app, different tenant).
- **Property scoping in booking URLs:** yes, via path segment and hash, not query string:
  - Widget deep links: `/where-to-stay/cabins#/lighthouse`, `/where-to-stay/cabins#/paradise`, `/where-to-stay/cabins#/sundance`, `/where-to-stay/rv-sites#/lighthouse|paradise|sundance`, `/things-to-do#/boats|kayaks-sups|charters-cruises|fishing|beach-access|picnics`.
  - Full app: `/reserve/a/boat-rental/at/lighthouse/cart/add/tritoon` (pattern `/reserve/a/{type}/at/{location}/...`). Location slugs used by the API: `lighthouse`, `paradise`, `sundance`, `islandview`, `fastrac`.
  - Map deep links: `/properties-map?m=lighthouse|paradise|sundance|islandview|fastrac|tacklebox`.
- **Strongest hub pages:** Lighthouse (`/properties/lighthouse` + `/lighthouse-marina` + `/things-to-do/boat-rentals`). **Weakest:** Island View (thin), Tackle Box (no booking), Water Taxi (no page at all; only a link out), BoaterWise (no page; one logo link on `/tap`), Sundance (no rentals/booking beyond cabins/RV).
- **Notable defects:** nav item "Our Event Calendar" → `/?page_id=502` → **404**; `/properties` index page is live with **Lorem ipsum**; "What's Up, Texoma?" events block on home/property pages is an **empty heading with no events**; homepage "Texoma striper" link → `/map-location/tackle-box-outfitters` **404**; Fastrac page link "Lighthouse Resort & Marina" → `/map-location/lighthouse-resort-marina` **404**; `shoponline.tackleboxtexoma.com` (linked from 2 pages) **does not resolve (DNS)**; Lighthouse cabin/RV counts disagree between page copy (34 cabins / 19 RV) and the booking widget (35 cabins / 20 RV); Guest Guide + TAP-confirmation pages still describe the retired "TAP-Individual / TAP-Family" model.

---

## 1. Site map

### 1a. Technical
| Item | Value |
|---|---|
| robots.txt | Allows all; disallows `/wp-content/uploads/wpforms/`; sitemap `https://texomadestinations.com/sitemap_index.xml` |
| Sitemap index | one child: `https://texomadestinations.com/page-sitemap.xml` (19 URLs, lastmod 2026-08-24). No post/category/image sitemaps. |
| Generator | Site Kit by Google 1.186.0 (WordPress). Theme: Uncode 2.12.7 + `uncode-child` (custom fonts BrittanySignature, BigNoodleTitling) |
| Analytics/tags | GTM `GTM-K9PSTVWW`; Meta Pixel (`fbevents.js`); reCAPTCHA v3 site key `6Lf3s4AUAAAAAPhdnP449pyD-AfOsqrUGVzJtSjm`; `plugins.trywhistle.com` chat |
| Forms | CF7 "Drop Us a Line" (form id 6) in every footer; CF7 event inquiry (id 947) on `/events`; WPForms on `/jobs` (id 19900) and `/texie` |
| WP REST | `/wp-json/wp/v2/pages` is open (28 pages incl. unlisted ones); posts = 0 |
| Booking API | `/api/v1/texomadestinations/{ping, cart, pontoons, smallboats, search-config-boatrental, search-config-cruise, search-config-dayuse, search-config-primitivecamp, search-lodging (POST, 401 without session), search-cruise (POST), event-search, tap-subscription-config, property/{type}/{id}, package/{slug}, rates-fetch, promo-code, coupon-apply, checkout, login (last_name+phone+SMS code), reservations, tap-lookup, itinerary-lookup, concierge-lookup, highwater-notify, ...}` |
| Error monitoring | Bugsnag (in the reservation bundle) |
| Media CDN | `s3.amazonaws.com/texoma-media/` and `s3.amazonaws.com/texomalighthousemedia/` (boat photos, login logos, TAP wallet assets) |

### 1b. All URLs (HTTP 200) grouped by section

**Home & core**
| URL | `<title>` | In sitemap |
|---|---|---|
| `/` | Best Lake Texoma Camping – Cabin & RV \| Texoma Destinations | yes |
| `/reserve` | Reservations - Texoma Destinations (Angular full app; server HTML is empty shell) | yes |
| `/myvacation` | My Vacation - Texoma Destinations ("Digital Concierge" app: online check-in, add cruises/rentals) | no |
| `/legal` | Legal - Texoma Destinations (Privacy / Terms / UGC tabs) | no |
| `/jobs` | Jobs - Texoma Destinations | yes |
| `/companies` | Companies (per-property directory: map, FB, Google review, phone, website) | no (unlisted) |
| `/guestguide` | Guest Guide (WiFi, checkout, rules, delivery pricing, TV guides) | no (unlisted) |
| `/properties-map` (+`?m=slug`) | Properties Map - Texoma Destinations (WP Google Maps, 7 markers) | no |
| `/properties` | Properties - Texoma Destinations — **placeholder page with Lorem ipsum** | no |
| `/tap-confirmation` | TAP Confirmation (post-purchase page; **stale Individual/Family copy**) | no |

**Properties** (`/properties/*`)
| URL | `<title>` |
|---|---|
| `/properties/lighthouse` | Best Family Resort in Texas \| Lighthouse Resort on Lake Texoma |
| `/lighthouse-marina` | #1 Lake Texoma Marina for Fueling Family Fun \| Lighthouse Marina |
| `/properties/paradise` | Lake Texoma Glamping with Boundless Amenities \| Paradise |
| `/properties/sundance` | One of the Most Secluded Lake Texoma Campgrounds \| Sundance |
| `/properties/island-view` | The Most Popular Lake Texoma Beach Destination \| Island View |
| `/properties/fastrac` | Best Lake Texoma Dinner Cruises & Boat Tours \| Fastrac Charters |
| `/properties/the-tackle-box` | Best Lake Texoma Fishing Gear & Guides \| Tackle Box Outfitters |

**Where to Stay**
| URL | `<title>` | Note |
|---|---|---|
| `/where-to-stay/cabins` | Best Lake Texoma Cabins & Cabin Resorts \| Texoma Destinations | embeds booking widget; `#/lighthouse`, `#/paradise`, `#/sundance` |
| `/where-to-stay/rv-sites` | Best Lake Texoma RV Camping & Resorts \| Texoma Destinations | widget; same hashes |
| `/where-to-stay/tents` | Lake Texoma Tent Camping, Primitive Camping \| Texoma Destinations | widget (Paradise, Sundance only) |
| `/where-to-stay` | (same as cabins; canonical → `/where-to-stay/cabins`) | duplicate |
| `/cabins`, `/rv` | aliases of cabins / rv-sites (200, canonical to the /where-to-stay/ URLs) | duplicates |

**Things to Do**
| URL | `<title>` | Note |
|---|---|---|
| `/things-to-do` | Things to Do at Lake Texoma: Camping, Fishing, Kayaks & More! | widget; sections `#/boats`, `#/kayaks-sups`, `#/charters-cruises`, `#/fishing`, `#/beach-access`, `#/picnics` |
| `/things-to-do/boat-rentals` | Lake Texoma's Best Boat Rentals at Lighthouse Resort & Marina - Texoma Destinations | new (Mar 2026) long-form sales page; anchors `#lhm-pricing`, `#lhm-how` |
| `/boat-rentals` | alias (canonical → `/things-to-do/boat-rentals`) | duplicate |

**Events / TAP / Texie**
| URL | `<title>` |
|---|---|
| `/events` | How to Plan an Event on Lake Texoma \| Texoma Destinations |
| `/things-to-do/events` | alias of `/events` (canonical → `/events`) |
| `/tap` | Texoma Access Package - Texoma Destinations |
| `/my-tap-pass` | redirects into app → `/reserve/account/my-tap-pass` |
| `/texie` | Texie The Dragon - Lake Texoma's Mascot - Join the Journey - Texoma Destinations |
| `/texie/story` | Texie The Dragon - Lake Texoma's Mascot - Texie's Story - Texoma Destinations |

**Reservation app routes (all `<title>` "Reservations - Texoma Destinations", canonical `/reserve`)**
`/reserve`, `/reserve/login`, `/reserve/logout`, `/reserve/cart`, `/reserve/cart/add/{type}[/{id}]`, `/reserve/cart/add/tritoon`, `/reserve/cart/add/smallboat`, `/reserve/cart/add/primitivecamp`, `/reserve/cart/add/islandview-day-pass`, `/reserve/cart/add/tap-pass`, `/reserve/cart/addons`, `/reserve/cart/enhance`, `/reserve/cart/experience-questionnaire`, `/reserve/checkout/cart`, `/reserve/checkout/profile`, `/reserve/checkout/success`, `/reserve/account/profile`, `/reserve/account/reservations`, `/reserve/account/reservations/view/{id}`, `/reserve/account/reservations/check-in/{id}`, `/reserve/account/reservations/delivery/{id}`, `/reserve/account/my-tap-pass`, `/reserve/a/{cabin|boat-rental|beach-day|cruise|primitive-campsite}`, `/reserve/a/{type}/at/{location}`, `/reserve/a/boat-rental/at/lighthouse/cart/add/tritoon`, `/reserve/a/cruise/cart/add`.
Other Angular route names present in the bundle (used by sister tenants): `cabins`, `cabins/:id`, `camping`, `camping/:id`, `stay`, `stay/:id`, `search`, `search-private`, `cruises/:slug`, `public-cruises`, `private-charters`, `events`, `experiences`, `tap`, `myvacation`. Query params consumed by the app: `tap`, `sig`, `itin`, `resume`, `section`, `tag`, `type`, `v`.

**404s encountered** (nothing exists at): `/things-to-do/cruises`, `/packages`, `/policies`, `/contact`, `/faq`, `/blog`, `/about`, `/camping`, `/tent-camping`, `/cruises`, `/properties/texoma-water-taxi`, `/properties/water-taxi`, `/properties/boaterwise`, `/sitemap`, `/privacy-policy`, `/terms`, `/rules`, `/cancellation-policy`, `/search`, `/stay`, and the two **linked-from-live-pages** 404s: `/?page_id=502` (nav "Our Event Calendar") and `/map-location/tackle-box-outfitters`, `/map-location/lighthouse-resort-marina`.

### 1c. Global navigation (identical on all pages)
- Things to Do → `/things-to-do`; children Boats `#/boats`, Kayaks & SUPs `#/kayaks-sups`, Charters & Cruises `#/charters-cruises`, Fishing `#/fishing`, Beach Access `#/beach-access`, Picnics `#/picnics`
- Where to Stay → `/where-to-stay/cabins`; children Cabins, RV Sites `/where-to-stay/rv-sites`, Tents `/where-to-stay/tents`
- Properties (no landing) → Lighthouse, Paradise, Sundance, Fastrac, Island View, The Tackle Box (`/properties/*`)
- Events → `/events`; children Plan Your Own Event `/events`, **Our Event Calendar `/?page_id=502` (404)**
- Marina → `/lighthouse-marina`; TAP → `/tap`
- Account → Log In `/reserve/login`, My Reservations, Guest Profile, My TAP Pass, Log Out; Cart `/reserve/cart`; Call Us `tel:+19033618500`
- Hero CTA "Book Your Fun Now!" → `/reserve`

**Footer (all pages):** "Texoma Destinations Companies" → lighthouseresort.com, paradisetexoma.com, sundancetexoma.com, fastrac.com, islandviewtexoma.com, tackleboxtexoma.com, bigwatermarine.com, towboatuslaketexoma.com "(links to external site)"; Legal → `/legal#tab-1687356549-1-58` (Privacy), `#tab-1687356549-2-22` (Terms), `#tab-1687356573179-2-9` (UGC); newsletter signup; Texie badge → `/texie/`; socials facebook.com/texomadestinations, instagram.com/texomadestinations.
**Footer hours/address block:** "Reservation Office: Open 7 Days a week from 9am-6pm **From May-Sep open until 9pm on Fri — 21 Tackle Box Dr, Pottsboro, TX 75076 — 903.361.8500 — Store Hours vary by location". © 2026 Texoma Destinations.

---

## 2. Booking system & deep-link spec

### 2a. How booking works
- **Cabins / RV / tents:** inline Angular widget (`<div id="tdr_app" class="tdr-app-widget"><app-root class="tdr-app-widget tdr-app-embedded">`) on `/where-to-stay/*`. Property CTAs "Browse Cabins"/"Browse RV Sites" link to `/where-to-stay/cabins#/{slug}` and `/where-to-stay/rv-sites#/{slug}` — the hash selects the property card inside the widget (client-side; the server HTML is identical regardless of hash — validate in a browser).
- **Boats / kayaks / cruises / day passes / picnics:** widget on `/things-to-do` with section hashes. Fastrac "Book Now" buttons → `/things-to-do#/charters-cruises`; Island View "Reserve Now" → `/things-to-do#/beach-access` and `#/kayaks-sups`; Paradise kayaks → `/things-to-do#/kayaks-sups`; Tackle Box "Find a Guide" → `/things-to-do#/fishing`.
- **Direct-to-cart:** `/things-to-do/boat-rentals` → `https://texomadestinations.com/reserve/a/boat-rental/at/lighthouse/cart/add/tritoon` (adds a tritoon at Lighthouse). `/lighthouse-marina` "Reserve Now" → `/reserve/a/boat-rental`. TAP "Reserve Now" → `/reserve`.
- **Cross-tenant:** `/texie` "book now" → `https://fastrac.com/reserve/cart/add/cruise/3009` and `https://fastrac.com/cruises/texie-cruise` (Fastrac's own instance of the same app; Texie cruise listed there at $19.44/person, 1.5 hrs).
- **Login:** phone + last name + SMS code (`/api/v1/.../login`). Account pages: `/reserve/account/{profile|reservations|my-tap-pass}`.
- **Payments:** TAP subscriptions mention **Square** invoices; Privacy Policy mentions **PayPal**; app has "pay now and save" vs "pay at check-in" rate types (`is_pay_immediately`).
- **Cart add types:** `cabin`/`rv` (lodging), `primitivecamp`, `tritoon`/`pontoon`, `smallboat`, `cruise`, `islandview-day-pass`, `tap-pass`, packages/addons.

### 2b. Location config exposed by the API (verbatim)
`GET /api/v1/texomadestinations/search-config-boatrental`
- `lighthouse` — title "Lighthouse Resort & Marina", short "Lighthouse Resort", coords 33.860318,-96.661881, description: "Lighthouse Resort & Marina is family-oriented and committed to making your vacation memorable and affordable. We cater to individuals coming to Texoma for a fishing trip, families looking for a weekend getaway, company retreats, family reunions, recreational boaters, and anyone looking for an affordable place to stay." item_types: `tritoon` ("Tritoons"), `smallboat` ("Kayaks/SUPs" — info: Un/Loading Dock, Marina Views, Small Groups). Logo `https://s3.amazonaws.com/texoma-media/login/login_logo_lighthouse.png`.
- `islandview` — "Island View Park", coords 33.861519,-96.668861; description "Island View Park, the most popular beach destination on Lake Texoma! Open daily from 9am-Sunset year-round, offering a great Sandy Beach, Picnic Tables, Covered Shelters, Kayak & SUP Rentals. The lake access and beautiful views of Lake Texoma all make it an ideal day-trip or hang out spot for families." item_types: `smallboat` (info: Day Use + Beach Access, Lake Views, Small - Medium Groups).

`GET .../search-config-primitivecamp`
- `paradise` — "Paradise on Lake Texoma", coords 33.794138,-96.788876; description: "Paradise on Lake Texoma is a beautiful **200-acre** family getaway with breathtaking sunsets, beautiful wooded sites RV Sites, and cabins. The property has **over 50 RV and Tent camping sites**, all with water view and several waterfront sites. There are also several cabins on-site that accommodate groups of all sizes. Paradise is the perfect place to get away to Lake Texoma for campers, family reunions, or those just looking to escape it all the most peaceful and serene location on Lake Texoma." item `primitive-campsite` (count 0 at query time).
- `sundance` — "Sundance Camp", coords 33.877646,-96.636744; description: "Sundance Camp is a group camping and event facility great for large groups. The beautifully maintained location has **7 cabins** with camp-style restroom and shower facilities, **3 group camping areas**, rv spots, a **400 yard sandy swimming area**, boat ramp and pavillions. With **over 80+ acres** of beautiful lakefront, Sundance Camp is the perfect place for group events, weddings, gatherings, family reunions and corporate retreats. Non-Profit Groups such as Scouts and Church Groups are welcome!"

`GET .../search-config-cruise` — attributes: featured, private (Private Charters), public (Public Cruises), watertaxi (Water Taxi). Categories: Friends & Family 1–6, Romantic 2–4, Small Group 6–18, Medium Group 12–24, Large Group 25–60. Catering options: Breakfast, Brunch, Lunch, Appetizers/Hors d'Oeuvres, Casual Dinner, Formal Dinner. Event tags: Birthday, Anniversary, Wedding, Elopement, Reception, Family Reunion, Family Fun, Themed Party, Company Outing, Sunset, Romantic, Proposal, Tubing.

`GET .../event-search` → `[]` (no events in the system). `GET .../smallboats` → `null` (needs location context).

### 2c. Live tritoon inventory & pricing (`GET .../pontoons`, 2026-09-04 start date)
| Boat class | Boats | Cap. | Full Day | AM Half | PM Half | TAP/Boat Club price (50%) |
|---|---|---|---|---|---|---|
| tritoon-t2 Berkshire/Trifecta 24' 140–150HP | #9, #11, #12, #13, #14, #15 (6) | 12 | $700 | $500 | $500 | $350 / $250 / $250 |
| tritoon-t1 Trifecta 24' 115HP | #7 (1) | 11 | $600 | $450 | $450 | $300 / $225 |
| tritoon-t4 Berkshire 24' 200HP | #16, #17 (2) | 11 | $750 | $600 | $600 | $375 / $300 |
| tritoon-t5 Highfield SP460 60HP (RIB) | 1 | 4 | $750 | $600 | $600 | $375 / $300 |
Time blocks: Full Day start slots 8:15am–12:00pm, return 7:15pm; AM Half 8:15am–12:00pm start, return 2:00pm; PM Half 3:00–6:30pm start, return 7:15pm. `recommend_tube: true`. (Note the `/things-to-do/boat-rentals` page advertises "from $300" half-day and "from $500" full day — those are the 50%-off member prices, not the public rates in the API.)

### 2d. TAP plans (`GET .../tap-subscription-config`, verbatim benefits)
| Plan id | Name | Price | Benefits |
|---|---|---|---|
| `tap-explorer-annual` | TAP Explorer | $99.00/yr | Free Day Use for TWO at Island View Park or Paradise on Lake Texoma; Free Boat Ramp access at Lighthouse Resort & Marina and Paradise on Lake Texoma; Access to Exclusive Events |
| `tap-adventurer-annual` | TAP Adventurer | $199.00/yr | Everything in Explorer; Free Day Use for FOUR; $5 off shelter rentals at Island View Park; 5% off all Resort Stays (cabins, glamping, rv sites, primitive camping)*; 5% off Kayak and Paddleboard Rentals; 5% off all Fastrac Public Cruises*; 5% off retail at Lighthouse Fuel Dock and Tackle Box; 5¢/gal off gas at Lighthouse Fuel Dock and Tackle Box; Exclusive Special Offers / Early-Bird Access to Special Events and Cruises; Special Birthday Month Discounts; Lighthouse Tenants receive 50¢ off fuel at Lighthouse Resort & Marina and 10% off Resort Stays* |
| `tap-navigator-annual` | TAP Navigator | $399.00/yr | Everything in Adventurer; Free Shelters weekdays at Island View Park; 15% off Weekday and 10% off Weekend Resort Stays*; 15% off Fastrac Public Cruises, 10% off Fastrac Private Cruises*; 10% off retail at Lighthouse Fuel Dock and Tackle Box; 10% off boat rentals at Lighthouse*; 10¢/gal off gas; 10% off BoaterWise On-Water Training courses; Last Minute Deals; Free Upgrades on reservations and boat rentals (subject to availability); VIP Access to Special Events and Cruises |
| `tap-boatclub-quarterly` | Big Water Boat Club | $50.00/month billed quarterly + one-time $500 initiation fee** | Everything in Navigator; 50% off all rentals at Lighthouse Marina (No exclusions, no blackout dates); VIP Boat Rental Experience; Free boater training from BoaterWise; Access to Member-Only boats |
Footnotes: "* Excluding major holiday weekends and certain other special events"; "** For New Members only, Re-Initiation Fee is $1,000 for previous members with an inactive/canceled subscription".

---

## 3. Per-property facts (verbatim from hub pages)

### 3.1 Lighthouse Resort & Marina
- **Hub pages:** `/properties/lighthouse` (H1 "Lighthouse Resort & Marina Amenities"; hero tag "The Most Exciting"), `/lighthouse-marina`, `/things-to-do/boat-rentals`, plus Lighthouse sections on `/where-to-stay/cabins` and `/where-to-stay/rv-sites`, `/events` venues.
- **Names as written:** "Lighthouse Resort & Marina", "Lighthouse Marina", "Lighthouse Family Resort and Marina", "The Lighthouse Resort", "Lighthouse Lodge".
- **Address:** 300 Lighthouse Drive, Pottsboro, TX 75076 (map marker; Fastrac page "Charter Dock 300 Lighthouse Drive Pottsboro TX, 75076"). Map coords 33.860666,-96.662635 (WP map) / 33.860318,-96.661881 (API).
- **Phones:** 903.361.5070 (Companies page, Lighthouse); fuel dock/rentals 903.786.2250 (`/lighthouse-marina`, boat-rentals page "Call Us — We're Real People"); hub reservations 903.361.8500; after-hours 972.294.7123; guest text line 903.414.6050.
- **Description (property page):** "Lake living meets modern conveniences at Lighthouse Resort & Marina. With fully-furnished cabins, lakefront RV sites, a marina with nightly boat slips and a host of watercraft for rent, Lighthouse is a family resort that makes family getaways in Texas fun!"
- **Cabins:** property page: "Fully Furnished, 1-6 Bedrooms, Climate Controlled, Nightly Slip Rentals, Waterview Options, Appliances". Cabins page: "Discover **34 water view cabins** nestled near the Lighthouse marina"; "Cabin Options for 1 to 16 Guests"; "One-Room Waterfront to 6 BR Cabins"; "Lodge for up to 80 Guests"; all cabins include Cable Television, Basic Dishes & Utensils, Coffee Pot*, Towels & Linens, BBQ Grill, Microwave* (*unless otherwise specified). **Booking widget copy (hard-coded in JS bundle): "35 Cabins That Sleep From 1-16 People".** → discrepancy 34 vs 35.
- **RV:** property page: "waterfront or grassy area RV sites just steps from the shore and marina" — 30A - 50A Hookups, Picnic Table, RV Dump Station, Fire Ring, Water Hookups. RV page: "Discover **19 Waterfront RV Sites**"; 30 or 50 Amp, Picnic Table, Water and Electric Hookups, Firepit and Grill, Dump Station on Site, Lake View, Pet Friendly, Graveled Sites; Boat Ramp; Marina. **Widget copy: "20 Waterfront RV Sites".** → discrepancy 19 vs 20.
- **Tents:** none at Lighthouse.
- **Marina / slips:** "Marine Fuel Dock; General Store with Lake Supplies, Drinks, Beer, Snacks & Souvenirs; Boats, Kayaks, SUPs, Lake Toy Rentals & More; 20'-50' Monthly Covered Boat Slips with Electricity and Water Included; Boat Launch & Transient Guest Slips". Slips: "month-to-month with no long-term commitment", "20' - 50' Covered Slips, Electricity & Water Included, Nightly or Monthly Slips, Competitively Priced Marine Fuel, Excellent Location Near Dam and Striper Fishing, No Annual Contract or Hidden Fees". `/lighthouse-marina`: "the only Lake Texoma marina that offers both pre-paid and month-to-month boat slip leases"; "We currently have a waitlist" → Join Waitlist `https://lighthouseresort.com/boat-slips/`. Fuel dock: "One of the only Lake Texoma marina fuel docks open year-round", Marine Supplies & Accessories, Marine Fuel, Boat & Personal Watercraft Oil, Competitive Prices. Store: Fishing Bait & Tackle, Beer & Wine, Rods & Reels, Ice/Charcoal/Firewood, Groceries & Condiments, Gifts & Apparel, Candy/Chips/Snacks/Sandwiches, Fountain Drinks/Sodas/Juices.
- **Slip rate table (`/lighthouse-marina`, "CHECK OPTIONS, PRICING & AVAILABILITY")** — Slip# / Size / Monthly / 3-mo / 6-mo / 12-mo:
  BH 1-1 36×12 $375.00 $1,085.63 $1,968.75 $3,667.50 · BH 1-2 29×10 $250.00 $723.75 $1,312.50 $2,445.00 · BH 2 Odd 29×12 $315.00 $911.93 $1,653.75 $3,080.70 · BH 2 Even 30×12 $320.00 $926.40 $1,680.00 $3,129.60 · BH 2-19 38×15 $505.00 $1,461.98 $2,651.25 $4,938.90 · BH 2 20 & 22 40×16 $570.00 $1,650.15 $2,992.50 $5,574.60 · BH 3 26×10 $220.00 $636.90 $1,155.00 $2,151.60 · BH 3-13 Hoist 26×10 $295.00 $854.03 $1,548.75 $2,885.10 · BH 4 1-5 30×14 $290.00 $839.55 $1,522.50 $2,836.20 · BH 4-6 26×12 $260.00 $752.70 $1,365.00 $2,542.80 · BH 4 7-9 30×10 $245.00 $709.28 $1,286.25 $2,396.10 · BH 4-10 26×11.5 $250.00 $723.75 $1,312.50 $2,445.00 · BH 4-11 33×15 $285.00 $825.08 $1,496.25 $2,787.30 · BH 4-12 20×8 $160.00 $463.20 $840.00 $1,564.80 · BH 4-13 20×9 $165.00 $477.68 $866.25 $1,613.70 · BH 5 1-2 32×14 $400.00 $1,158.00 $2,100.00 $3,912.00 · BH 5-3 30×10 $270.00 $781.65 $1,417.50 $2,640.60 · BH 7 26×10 $220.00 $636.90 $1,155.00 $2,151.60 · BH 7-8 Hoist 26×10 $355.00 $1,027.73 $1,863.75 $3,471.90 · BH 7-14 Hoist 26×10 $270.00 $781.65 $1,417.50 $2,640.60 · BH 8 – End Tie 26×10 $290.00 $839.55 $1,522.50 $2,836.20 · BH 8 32×14 $345.00 $998.78 $1,811.25 $3,374.10 · BH 9-1 12×9 $220.00 $636.90 $1,155.00 $2,151.60 · BH 9-2 26×14.5 $325.00 $940.88 $1,706.25 $3,178.50 · BH 10-1 43.5×19 $540.00 $1,563.30 $2,835.00 $5,281.20 · BH 10 2-3 34×16 $400.00 $1,158.00 $2,100.00 $3,912.00 · BH 10 4-5 26×11 $230.00 $665.85 $1,207.50 $2,249.40 · BH 4A 28×11 $315.00 $911.93 $1,653.75 $3,080.70 · BH 4B 19×8.5 $230.00 $665.85 $1,207.50 $2,249.40 · BH 99 1-3 Jet Ski Lifts 24×10 $315.00 $911.93 $1,653.75 $3,080.70 · BH 99-4 24×10 $200.00 $579.00 $1,050.00 $1,956.00 · Trailer Storage $25.00 $75.00 $150.00 $250.00. (Prepay discounts = 3.5% / 12.5% / 18.5%.)
- **HydroHoist lift rentals:** "$250 Monthly Lease Fee; New HydroHoist 5000 or 6600 UL2 with 1 Year Commitment; You Only Pay Installation Cost ($675 - $975)"; extras "$975 A Pair of Centering Guides; $344 Boat Protection Package (2 Corner Guides & 1 Bow Guide); $845+ Side Plank Kits; $600 Back-In Option".
- **Rentals:** Tritoons, Tubes, Kayaks, SUPs ("Reserve Now" → `/things-to-do/`). Boat-rentals page claims: "Newest Fleet on the Lake", "Rated 4.9★ on Google — 200+ Google Reviews", "Club Members Save 50%", "Full-day summer rentals run nearly 11 hours. On water by 8:30 AM. Back 30 min before sunset", "Fuel included — no surprises" (pricing cards) **contradicted by FAQ on the same page: "You pay for the fuel you use during your rental."** Prices shown: Half Day AM "from $300", Half Day PM "from $300", Full Day "from $500". Tube rental add-on. Dealership: "Big Water Marine … Berkshire, Scout, Veranda, and Highfield". Testimonials attributed to "Sarah M. July 2025", "Jason R. August 2025", "Kendra T. June 2025".
- **Cruises (via Fastrac):** Sunset and Dinner Cruises, Lake Tours, Private Beach Destinations, Seasonal Cruises, Specialty Cruises, Water Taxi Service, Corporate / Groups, Private Charters.
- **Activities:** Playground for Kiddos, Bands and Musical Acts, Community Fire Pit, Fishing Dock. Property map PNG `…/2023/07/property-map-lighthouse.2023.1.png`.
- **Events/venues (from `/events`):** Lighthouse Lodge — "1,600 sq ft of interior space with a full bar, plus a huge deck … three large bay doors", "80 People Max, Formal Seating for 40 People, Live Music Options, Catering & Bar Service Available". Cove Point — "50 People Max, Gazebo, Open Vendor, Grass Lawn, Elopements & Gatherings, Lake View & Access". Lighthouse Fireside — "25 People Max, Gazebo, Open Vendor, Electricity". Property page: "Lodge that can serve up to 80 people, plus group stay options available, large pavilion".
- **Fishing:** "home base to many of the top fishing guides … 'Striper Capital of the World'": Sand Bass, Crappie, Black Bass, Blue Catfish, Striped Bass (Striper), Channel Catfish.
- **Concierge:** Cabin Decorations, Sundries, Pre-Packaged Meals, Firepit Supplies.
- **Rules (verbatim):** "See each cabin's page to see how many it may sleep. / We love pets! Our cabins are pet-friendly and we have a fee of **$35 per pet**. / We don't allow aggressive breeds and no more than **two pets per cabin**. Please be kind and keep your pet leashed and clean up after them. / Park in designated parking spaces and areas only. / **Check-in is at 3p and Checkout is 11a.** / **Free Wifi on property.** / No Off-Roading Vehicles or Side by Sides are permitted on the property. / **Quiet Hours are from 11p-7a.**" Guest Guide WiFi: network "Lighthouse Guest", password "discovertexoma" ("some cabins may not have access or may have poor signal").
- **Cancellation policy:** see §4 (Cabins & RV + "Motorized and Small Boat Rentals": weather cancellations pro-rated at return; within 3 days = full rate).
- **Hero/OG images:** OG `…/2023/07/Q0A5887-hero.jpg`; also `…/2023/06/DJI_0936.jpg`, `…/2023/07/dji_fly_20230527_150310_138_1685217802826.jpg`, `…/2023/07/marina-boat-slips.jpg`, `…/2023/06/Q0A9286.jpg`, `…/2023/07/IMG_2461.jpg`, `…/2023/06/Q0A8658-hero.jpg` (marina OG), `…/2023/06/Q0A8377.jpg`, `…/2023/06/Q0A2122.jpg`, `…/2023/07/Q0A9779-2.jpg` (home OG), `…/2026/03/IMG_2113-Port.jpeg`, `…/2026/03/IMG_33751-1-scaled.jpg`, `…/2023/05/Berkshire_STS_250CL-2-1.jpg` (boat-rentals OG). (All prefixed `https://texomadestinations.com/wp-content/uploads/`.)

### 3.2 Paradise on Lake Texoma
- **Hub page:** `/properties/paradise` (H1 "Paradise on Lake Texoma Amenities"; tag "The Most Relaxing"). Sections on cabins/rv/tents pages.
- **Address:** 503 Paradise Park Road, Pottsboro, TX (map marker; coords 33.7948778,-96.7871514). **Phone:** 903.419.1009 (Companies page); gate-code text line 903.414.6050 (`/tap`). Site: paradisetexoma.com.
- **Description:** "Escape the hustle and bustle of the modern world and kick your feet up, roast some marshmallows, and enjoy the serenity and peace that is Paradise on Lake Texoma. We offer Lake Texoma glamping experiences in cabins and tiny homes, and you're also welcome to bring your tents, RVs, campers, you name it. We especially like vintage campers…" API: "200-acre", "over 50 RV and Tent camping sites, all with water view".
- **Cabins & Glamping:** Furnished, 1-3 Bedrooms, Climate Controlled, Waterview, Waterfront Options, Pet Friendly for a Fee. Cabins page: "Cabin Options for 1 to 6 Guests; One-Room Waterfront to 3 BR Cabins; Secluded and Gated Property; Pet Friendly for a Small Fee; Communal Areas and Hammock Garden"; includes Coffee Pot or Press, Basic Dishes & Utensils*, Firepit, Microwave*, Basic Cookware*, BBQ Grill, Refrigerator*, Towels & Linens*, Bluetooth Speaker. **No cabin count given on the hub.**
- **RV:** "waterfront or shaded lake view RV site" — 30A - 50A Hookups, Picnic Table, RV Dump Station, Pet Friendly, Fire Ring, Water Hookups, Water View, Waterfront Options, Gravel Pad. **No RV site count given** (API says 50+ RV+tent combined).
- **Boat ramp:** "accessible anytime to overnight guests. Located near the RV sites, it's designed for **26-foot vessels and smaller**. … plenty of trailer parking … beach your vessel on the shoreline at your own risk." TAP: ramp "only available between 9am and Sunset daily".
- **Tent camping:** "Geared towards backpackers and tent campers" — Primitive, Firepit, Lake View, Lake Access; tents page: No Electricity or Water, Secluded Area, Lake Access, Restroom Facility, Firepits, Pet Friendly. Primitive map `…/2023/07/property-map-paradise-primitive.2023.1.png`.
- **Rentals:** 1-2 Person Kayaks, Stand up Paddleboards (Reserve Now → `/things-to-do#/kayaks-sups`). Note: API boat-rental config does **not** list Paradise as a rental location (only lighthouse, islandview) — possible inconsistency.
- **Hangouts:** Day Use Area, Hammock Garden, Community Pavilion, Large Firepit ("free to all registered guests"). Day use via TAP (9am–Sunset).
- **Rules (verbatim):** "See each tiny cabin's page to see how many it may sleep. / We love pets! … fee of **$35 per pet**. / …no more than two pets per cabin… / Park in designated parking spaces and areas only. **No grass parking or side-of-the-road parking.** / **Check-in is at 3p and check-out is at 11a.** / **Visitor Fee and Visiting Hours.** / **Free Wifi is available at the office only.** / No Off-Roading Vehicles or Side by Sides… / **Quiet Hours are from 11p-7a.**" Guest Guide WiFi: "Paradise Guest" / "discovertexoma".
- **Cancellation:** §4 — same lodging text (heading "Cabins, RV Sites, and Tent Camping") + "Small Boat Rentals: Cancellations due to inclement weather will be **refunded or rescheduled**… within three (3) days … full rental rate."
- **Images:** OG `…/2023/06/Q0A5430-hero.jpg` (also used as OG for RV page); `…/2023/06/Q0A0862.jpg`, `…/2023/06/Q0A1286.jpg`, `…/2023/06/Q0A1916.jpg`, `…/2023/06/Q0A5513.jpg`, `…/2023/07/IMG_9070.jpg`, `…/2023/06/Q0A4518.jpg` (RV page), `…/2023/07/IMG_8306.jpg` & `…/2023/07/IMG_9916.jpg` (tents), map `…/2023/07/property-map-paradise.2023.1.png`.

### 3.3 Sundance Camp
- **Hub page:** `/properties/sundance` (H1 "Sundance Camp Amenities"; tag "The Most Peaceful").
- **Address:** 295 Glen Eden Drive, Pottsboro, TX (marker 33.8784503,-96.6363588). "Located at the tip of Preston Point". **Phone:** 903.419.1011. Site: sundancetexoma.com.
- **Description/figures (verbatim):** "Even though the property is **80 acres**, its small number of cabins and RV sites – **seven cabins, six RV sites** – lend a feeling of being totally disconnected… Just a step away from the Tiny Cabin Village is a modern bathhouse and pavilions… Sundance Camp has a primitive group camping area." Cabins page: "**7 Themed Cabins That Sleep 2-4**; Secluded and Gated Property; Pet Friendly for a Small Fee; Pre-Packaged Meals Available; Perfect for Parties, Intimate Weddings and Corporate Retreats; Large Campfire Pit; Covered Pavilion with Bench Tables"; cabins include Filtered Water Dispenser, French Press & Kettle, Towels & Linens, Cups & Wine Glasses, Microwave, Small Fire Pit, Small Fridge, BBQ Grill Areas Nearby. API: "3 group camping areas", "400 yard sandy swimming area", "boat ramp and pavillions".
- **Glamping:** Furnished, Open Room, Climate Controlled, Wooded View, Pet Friendly for a Fee. "Each cabin is furnished and decorated differently."
- **RV:** "six shaded and spacious RV sites" — 30A Hookups (only), Picnic Table, Fire Ring, Water Hookups, Wooded View, Pet Friendly, Gravel Pad; RV page adds "Dump Station Close By", "Private Beach".
- **Tents:** "designed for small or large groups" — Primitive, Firepit, Lake View; tents page: No Electricity or Water, Picnic Tables, Lake View, Firepits, Restroom Facility, Close to Cabins and RV Sites, Pet Friendly.
- **Rentals:** none listed. **No booking CTAs other than Browse Cabins/RV.**
- **Rules (verbatim):** "See each tiny cabin's page… / **A rollaway bed may be added (tiny cabins 1, 2, & 3) at an additional cost of $100.** / **Children under 6 may sleep in the king bed (tiny cabins 1, 2, and 3) with their parents at no additional cost.** / pets $35 per pet, max two, no aggressive breeds / **Check-in is 3p and Checkout is 11a.** / Park in designated… / No Off-Roading… / **Registered Overnight Guests Only.** / **No Wifi on the property.** / Quiet Hours are from 11p-7a."
- **Cancellation:** §4 lodging text only (heading "Cancellation Policy for our Lake Texoma Campgrounds"); no rental clause.
- **Images:** OG `…/2023/07/Q0A5874-hero.jpg`; `…/2023/07/Q0A5873.jpg`, `…/2023/07/IMG_0166.jpg`, `…/2023/07/IMG_7617.jpg`, map `…/2023/06/property-map-sundance.jpg`.

### 3.4 Island View Park
- **Hub page:** `/properties/island-view` (H1 "Island View Park Amenities"; tag "The Most Fun") — thin (≈3.5 KB text).
- **Address:** 87426 Preston Bend Rd, Pottsboro, TX (marker 33.8594498,-96.67116). **Phone:** 903.419.1008. Site: islandviewtexoma.com. FB facebook.com/islandviewtexoma.
- **Description:** "The most popular Lake Texoma beach destination! **Open daily from 9 am-Sunset year-round**, offering a great sandy beach, picnic tables, covered shelters, and kayak & SUP rentals."
- **Offer:** Day Passes (Reserve Now → `/things-to-do#/beach-access`; app package slug `islandview-day-pass`); Kayaks/SUPs (`#/kayaks-sups`); Shelters — "Covered Shelter, Picnic Table perfect for 6-10 people, Charcoal BBQ Grill", "Shelters by reservation only (see front gate)"; Events — "Group pricing, Boat Rentals, and Catering options"; Activities — Volleyball Court, Outdoor Showers, Changing Rooms, Store. **No prices on hub** (TAP-confirmation page implies day use "$7 per person"). Map `…/2023/07/property-map-islandview.png`.
- **Rules (verbatim):** "We close the gate 30 minutes after sunset. / No lifeguard or designated swim area, swim at your own risk. / For your safety, no glass bottles or containers. / If you're bringing your pet, keep them leashed, please. / Parking in designated areas only. / No firearms, fireworks, or open fires. / Please clean up after yourselves and your pets. / Shelters by reservation only (see front gate). / Please be courteous and safe. / Most importantly, have fun!!!"
- **No cancellation policy, no lodging.**
- **Images:** OG `…/2023/06/Q0A3656-hero.jpg`; `…/2023/06/Q0A3704.jpg`, `…/2023/07/IMG_2008.jpg`, `…/2023/07/Q0A2236.jpg`, `…/2023/07/events-table-night.jpg`.

### 3.5 Fastrac Charters & Cruises (incl. Texoma Water Taxi)
- **Hub page:** `/properties/fastrac` (H1 "Fastrac Charters & Cruises"; tag "The Most Amazing"). Name variants: "Fastrac Cruises" (nav/footer), "Fastrac Charters", "Fastrac Charters & Cruises".
- **Address:** 300 Lighthouse Drive, Pottsboro, TX (marker 33.858662,-96.661691). "All cruises depart from Lighthouse Resort & Marina – Charter Dock 300 Lighthouse Drive Pottsboro TX, 75076 **unless specified elsewhere." **Phone:** 903.361.0775. Site fastrac.com; FB facebook.com/fastraccharters.
- **Description:** "We feature Lake Texoma dinner cruises, sunset cruises, boat tours, themed parties, and private charters. We also offer Water Taxi Service from anywhere on Lake Texoma, Lake History Tours, and day trips… Our fleet of boats can accommodate groups of just about any size."
- **Public cruises:** Dinner, Sunset, Lake History, Murder Mystery, Specialty. **Private charters:** Dinner, Wedding, Sightseeing, Lake Day, Boat Rides & Picnics, Memorial, Murder Mystery. All "Book Now" → `/things-to-do#/charters-cruises`.
- **Vessels:** *Island Girl* — "Seating for 38 Downstairs, Seating for 28 Upstairs, Umbrella Table Seating Upstairs, No Swimming, No Pets, Handicapped Accessible, Climate Controlled Interior, Catering Partners & Rotating Menus, **Capacity for 70 people**, Bathrooms Aboard, Themes/DJs/Live Music, Crew and Wait Service, Public and Private Options, BYOB". *Sight-Sea-Er* and *Mellow Yellow* — Lake Days: "4 Hours, Captain & Crew, Catering Available, Water Toy Rentals, Cruise & Beach Time, Great for Groups of 6-36". Boat Rides: "1-6 Hours, Captain, Boat, and Gas Included, Add-Ons, Catering Available, Water Toy Rentals, Great for Groups of 1-6".
- **Water Taxi:** "We'll pick you up at any marina or at your dock as long as it's in our service area." Destinations: Highport Marina / Island Bar & Grill; Grandpappy Marina; Pelican's Landing @ Cedar Bayou; Island View Day Use Area; Lighthouse Resort & Marina (→ broken `/map-location/lighthouse-resort-marina`); Marina Del Rey; Buncombe Creek Marina; Flowing Wells Marina; Alberta Creek Marina; East/West Burns Run; Catfish Bay Marina; The Islands (North, Treasure, Wood). Service area map `…/2023/07/water-taxi-map.jpg`. Other trips: Drop Off or Pick Up to Your Boat; **Sightseeing Trips ($180/hr for 6 people)**; Overnight Island Camping Trips; Private Charters; A Ride to Other Cruises; Delivery of Beverages from Stores. CTA "Water Taxi Service" → `https://texomawatertaxi.com/` (live: "Texoma Water Taxi by Fastrac – It's like Uber on the water", books at fastrac.com/booking/, phone 903-361-0775).
- **Cancellation (verbatim):** "Our cancellation policy for private charters requires **14 days advance notice** to cancel your charter without penalty. Cancellations received less than 14 days prior to departure are subject to forfeiture of total payment. / Cruises depart rain or shine. Should the captain, at their sole discretion, choose to cancel the cruise due to adverse weather (such as high winds, and lightning) you will be issued a full refund for the cruise, less any expenses that occurred."
- **FAQ (verbatim):** BYOB for adult beverages; "Leashed Pets are allowed on the Water Taxi and Lake Day Experiences only"; "Kids 12 and under are required to wear a life jacket on swimming cruises and smaller vessels such as the Water Taxi"; no bareboat charters; "We do not do overnight cruises. All vessels have a return time to dock at 11p"; dress "casual to semi-casual".
- **Picnics (on `/things-to-do`):** "Boat Ride + Island Picnic for 2 - **$350**" (2 hrs; blanket/basket/pillows, boat ride, sparkling water, meal + small cooler, Bluetooth radio, set up/tear down); "Beach Picnic for 2 - **$250**" (2 hrs; custom color theme, fresh floral, decor, umbrella…); "Add Boat Ride for **$150 per hour**". Events contact 903.200.1408.
- **Images:** OG `…/2023/06/DJI_0886-hero.jpg`; `…/2023/06/Q0A3022.jpg`, `…/2023/07/Q0A3330.jpg`, `…/2023/07/boat-ride.jpg`, `…/2023/07/lake-day.jpg`, `…/2026/06/texie_cruises_header-1024x768.jpg`.

### 3.6 Tackle Box Outfitters
- **Hub page:** `/properties/the-tackle-box` (H1 "Tackle Box Outfitters"; tag "The Most Fishing"). Name variants: "The Tackle Box" (nav/footer), "Tackle Box Outfitters", "Tacklebox Texoma" (Texie page).
- **Address:** 21 Tackle Box Dr(ive), Pottsboro, TX 75076 (same as Texoma Destinations HQ marker 33.834293,-96.678798); "Conveniently located on SH 289 as you approach Lighthouse Resort & Marina". **Phone:** 903.786.9010. Site tackleboxtexoma.com; FB facebook.com/tackleboxoutfitters; online shop link `https://shoponline.tackleboxtexoma.com/` (**DNS does not resolve — dead link on 2 pages**).
- **Facts:** "Lake Texoma fishing license at the Tackle Box for just **$12** (both residents and non-residents)"; "about two-thirds of the lake lies in Oklahoma"; "The only live bait store within 25 miles of the Lighthouse Resort"; propane: "one of the only propane refill spots on the Peninsula. We refill cylinders and RVs with prior scheduling."
- **Inventory lists:** Tackle (lures, rods & reels, soft plastics/swimbaits, "Caset Nets" [sic] & landing nets, tackle boxes); One-stop shop (snacks/drinks/coffee, firewood & starters, boat repair & safety equipment, beer & tobacco, propane refills, RV repair items & hoses, ice & coolers, apparel/life jackets/water shoes, souvenirs/beach toys); Bait (shiners in season, frozen bait & livers, black salties, bait tanks, worms incl. glow worms, bass and crappie minnows); Wildlife mounts (striper, bucks, largemouth, turkey, blue cats, bobcat; "feed Bob Jr, our bass!"); Guides → `/things-to-do#/fishing`; "Shop Deals".
- **No hours, prices (other than license), rules, or booking.**
- **Images:** OG `…/2023/06/Texoma_Day30786-hero.jpg`; `…/2023/06/Q0A1466.jpg`, `…/2023/06/Q0A6245.jpg`, `…/2023/06/Q0A8880.jpg`, `…/2023/06/Texoma_Day30672.jpg`, `…/2023/05/Photo-Jun-01-2019-4-14-44-PM.jpg`, `…/2023/07/shutterstock_2292442931.jpg` (stock).

### 3.7 Texoma Water Taxi — **no hub page.** Covered only as a section on `/properties/fastrac` and a "Water Taxi Service" link on `/things-to-do` and `/properties/fastrac` to `https://texomawatertaxi.com/`. Also referenced in the reservation bundle (`https://texomawatertaxi.com/` string) and as cruise attribute `watertaxi`.

### 3.8 BoaterWise — **no hub page.** One unlabeled logo link on `/tap` (`…/2023/07/boaterwise2.png` → `https://boaterwise.com/`), mentioned in TAP Navigator ("10% off BoaterWise On-Water Training courses") and Boat Club ("Free boater training from BoaterWise"). Site live: "BoaterWise – Your Course to On-Water Training" (NSBC-certified on-water courses).

### 3.9 Fishing guide list (`/things-to-do`, "VIEW GUIDE LIST", with disclaimer that TD is not affiliated)
Dale Bestwina 214-668-6421 dale.bestwina@verizon.net dbestguide.com · Rex Bridges 903-814-8400 rex@rexbridges.net rexbridges.com · Gerald Costner 214-384-9682 striper1man@yahoo.com striperman.com · Jodey Whitmire 903-271-1559 jodeywhitmire@gmail.com · Capt. John Brett 903-786-9279 jbrett1201@gmail.com texomastriperfishing.com · Jason Harrelson 903-821-4971 jasondharrelson@yahoo.com.

### 3.10 Directory summary (from `/companies` + map markers)
| Property | Address | Phone | Website | Google review placeid |
|---|---|---|---|---|
| Texoma Destinations (HQ) | 21 Tackle Box Drive, Pottsboro, TX 75076 | 903.361.8500 (after-hours 972.294.7123; text 903.414.6050) | texomadestinations.com | ChIJCdGR6DOSTIYRagK9tM4q-1w |
| Lighthouse Resort & Marina | 300 Lighthouse Drive, Pottsboro, TX 75076 | 903.361.5070 (fuel dock 903.786.2250) | lighthouseresort.com | ChIJFXA3G2CRTIYRSjf5qs2Ca0A |
| Paradise on Lake Texoma | 503 Paradise Park Road, Pottsboro, TX | 903.419.1009 | paradisetexoma.com | ChIJmxDwC3vtTIYRBBjuaHpwXx0 |
| Fastrac Charters & Cruises | 300 Lighthouse Drive, Pottsboro, TX | 903.361.0775 | fastrac.com | ChIJnaMTG1iSTIYRXUTXmkTMjXY |
| Island View Park | 87426 Preston Bend Rd, Pottsboro, TX | 903.419.1008 | islandviewtexoma.com | ChIJ073apd2TTIYR2N8yOjqBCg4 |
| Tackle Box Outfitters | 21 Tackle Box Drive, Pottsboro, TX | 903.786.9010 | tackleboxtexoma.com | ChIJR8aUezOSTIYR4SBFbnMFwXA |
| Sundance Camp | 295 Glen Eden Drive, Pottsboro, TX | 903.419.1011 | sundancetexoma.com | ChIJ_fGSOzGRTIYRoVhxEhLtAW8 |
Events line: 903.200.1408. Property-map links on `/companies` go to `{sistersite}/property-map/` on each sister domain.

---

## 4. Policies (full text)

### 4a. Lodging cancellation policy (identical text on Lighthouse, Paradise, Sundance property pages; heading varies: "Cabins and RV Sites" / "Cabins, RV Sites, and Tent Camping" / "Cancellation Policy for our Lake Texoma Campgrounds")
> A valid credit card is required to hold the reservation. For 'Pay at Check In' full payment is required upon Check-In. For 'Pay Now and Save' full payment is taken at the time of the booking. We accept Mastercard, Visa, American Express, Discover, or Cash as forms of payment. We're sorry, but we currently cannot accept Checks unless a prior arrangement is made. 'Pay at Check In' rates booking within the cancellation period (see below), your credit card will be charged for one night at the time of the booking.
>
> For 'Pay at Check In' rates, we require 14 days advance notice to avoid being charged a cancellation fee equivalent to one night's stay.
>
> For 'Pay Now and Save' rates, Once confirmed, reservations are non-refundable and no changes (except adding days) can be made. Additionally, our reservation agents cannot access your reservation or make changes or cancellations. Any modifications must be done online through your account.
>
> All packages (such as The Family Fun Package, Delivery Firewood, etc) have a 3-day cancellation.
>
> Large bookings for three or more cabins and/or RV sites require full payment at the time of booking and this payment is non-refundable and non-changeable.
>
> Once you have checked in, you are responsible for payment for your entire stay. If you need to depart prior to your original check-out date, please let us know. No refunds will be made for early checkout, cancellations due to weather, road conditions, acts of nature, mechanical/electrical failure or malfunctions with TVs or other equipment, family emergencies, sightings of insects and rodents, or other circumstances beyond our control.

**Lighthouse — "Motorized and Small Boat Rentals":** "Cancellations due to inclement weather will be pro-rated at the time of return. All weather cancellations and pro-rates are determined by the staff at the time of the rental. Cancellations made within three (3) days of the rental will be charged the full rental rate."
**Paradise — "Small Boat Rentals":** "Cancellations due to inclement weather will be refunded or rescheduled. All weather cancellations and rescheduling are determined by the staff at the time of the rental. Cancellations made within three (3) days of the rental will be charged the full rental rate."
**Fastrac — charters:** see §3.5.
**"Pay Now and Save" promo:** referenced in the policy and on `/tap-confirmation`: "you must book online and choose the 'Pay Now and Save' rate to receive the $30 per night rate (advance reservations required). If you choose the 'Pay at Check-In' rate or call our reservation team… the rate charged is $40 per night" (RV/tent, TAP context — stale page). No other discounts/promos on the hub besides TAP.

### 4b. Pet policy
Lighthouse / Paradise / Sundance: "$35 per pet", max "two pets per cabin", "no aggressive breeds", leashed, clean up. RV sites listed "Pet Friendly" (no fee stated). Island View: leashed. Fastrac: pets only on Water Taxi and Lake Day. Guest Guide: "Leashed pets welcome except in non-pet friendly cabins."

### 4c. Check-in / out & quiet hours
Check-in 3p / check-out 11a (all three lodging properties). Quiet hours 11p–7a (all; Guest Guide spells "Quite hours"). Guest Guide check-out procedure: "Check Out time is 11am (unless you have Stay-N-Play) / Clean any dishes… / Pickup any trash… / Turn the A/C to 76 (Heat to 64 in winter) / Notify office of any issues… / Leave the Keys on the Table and lock the door / Take the trash to the dumpster… If the above steps are not followed, or the cabin is dirty beyond normal use, an excessive cleaning fee of **$250** may be applied." Stay-N-Play late checkout "only available Sunday through Wednesday and subject to availability".

### 4d. Guest Guide general rules (`/guestguide`, verbatim)
"Obey staff members, signs, and pay attention. Respect your neighbors. Quite hours are from 11p-7a. Leashed pets welcome except in non-pet friendly cabins. Please don't litter… Day Use, Camping, Fishing, and Vehicles in designated areas only. No open fires, firearms, or fireworks are permitted. Observe burn bans." Links to `{lighthouseresort|paradisetexoma|islandviewtexoma|sundancetexoma}.com/rules`. Delivery ("Enhance Your Stay", 8am–8pm): Firewood (45 lb bag) $30; Ice (7 lb) $5; Charcoal (6-8 lb) $12; Lighter Fluid (32 oz) $8.00; Lighter (Grill) $5. TV guides: Vyve Business channel lineup PDF (Lighthouse), Dish channel lineup PDF (Paradise). **Stale:** TAP described as "free cruise tickets, free kayak rentals… Individual and Family plans".

### 4e. `/legal`
Three tabs: **Privacy Statement** (generic Shopify-derived text, Sections 1–8; references PayPal as payment gateway; contact admin@texomadestinations.com, "Texoma Destinations, LLC 21 Tackle Box Dr, Pottsboro, TX, 75076"); **Terms of Service** (generic 20-section e-commerce ToS; refers to a "Returns Policy" that doesn't exist; Section 20 contact admin@texomadestinations.com); **User-Generated Content Policy** ("Last updated August 2020"). No reservation-specific terms, no deposit/damage policy. Page has no meta description and no canonical tag.

### 4f. TAP fine print (`/tap`) — see §2d for benefits; verbatim terms:
12 months from signup; benefits subject to availability; "*Exclusions apply for the '3 Major Holiday Days' which are the days surrounding Memorial Day, Fourth of July, and Labor Day"; no exclusions for Boat Club on rentals; signee must be present; non-transferable, non-refundable; auto-renews; cancel via "My TAP Pass" page before renewal; declined card → Square invoice, 3 days to pay; "We cannot process TAP Pass Subscriptions, Cancellations, or Payment Information via phone"; Boat Club billed quarterly. Day use/ramp hours 9am–Sunset. Paradise gate code by text 903.414.6050.

---

## 5. Events / packages / TAP structure

- **`/events`** is a *group-event sales page* (not a calendar): event types list, "Memorable Moments" (anniversaries, elopement, proposals…), three Lighthouse venues (Lodge 80 / Cove Point 50 / Fireside 25), CF7 inquiry form (fields: name, email, phone, Type of Event, Date, flexible?, guests, how heard: Facebook/Instagram/Internet Search/Friend, message), phone **903.200.1408**. No dates or prices.
- **Event calendar:** nav "Our Event Calendar" → `/?page_id=502` **404** (page 502 no longer exists; note WP page id 499 = `/events`). The reservation app has `events`/`experiences` routes and `event-search` API, which returns `[]`. The "What's Up, Texoma?" band (home, property pages, events page) renders only a heading + sentence — **no event content**. → Stale event infrastructure.
- **Only dated event content on the hub:** `/texie` — "Join us Saturday, **September 5th** for a magical kids' cruise" → Discovering Texie Cruise for Kids, Fastrac at Lighthouse Marina, Sept 5 (book: `https://fastrac.com/reserve/cart/add/cruise/3009`). Past events listed: May 23rd 2026 Discover Texie Cruise for Kids; April 10–12 2026 Lake Texoma Boat Show, Durant OK; March 21 2026 Texie Watching Breakfast Cruise. Texie plush sold at Lighthouse Fuel Dock Store, Tacklebox Texoma, Big Water Marine, Flowing Wells Resort & Marina. Spotify playlist link. "Texie The Dragon™ is a registered trademark… © 2026 Texoma Destinations, LLC." (Texie sightings list runs Oct 2025 → June 2026.)
- **Packages:** no packages page. Mentioned only: "The Family Fun Package", "Delivery Firewood" (cancellation text), picnic packages ($350/$250/+$150/hr), Guest Guide delivery items, "Stay-N-Play" late checkout, Boat Club. App cart supports `packages`/`addons`/`enhance`.
- **TAP:** `/tap` (tier cards Explorer/Adventurer/Navigator/Big Water Boat Club; benefit grid; fine print; embedded signup widget → `/reserve/cart/add/tap-pass`; "TAP Partners" logos link to http://islandviewtexoma.com, http://paradisetexoma.com, http://lighthouseresort.com, http://fastrac.com, facebook.com/tackleboxoutfitters, boaterwise.com — note **http://** not https on four of them). `/tap` has **no meta description**. `/tap-confirmation` and `/guestguide` still describe the old **TAP-Individual ($343 value) / TAP-Family ($621 value)** model with credits ($30/night RV via Pay Now and Save vs $40) — stale vs the current $99/$199/$399 tiers.
- **Old event infrastructure / other domains:** no links to eventbrite, discovertexoma.com, or any ticketing domain anywhere on the hub (searched all HTML and the JS bundle). "discovertexoma" survives only as the guest WiFi password. discovertexoma.com is live as a separate Lake Texoma tourism site.

---

## 6. Cross-links (every outbound link to sister/partner domains)

| Target | Source page(s) | Anchor |
|---|---|---|
| https://lighthouseresort.com/ | footer on all 35 pages | "Lighthouse Resort & Marina" |
| http://lighthouseresort.com , https://lighthouseresort.com | `/tap` | TAP partner logo |
| https://lighthouseresort.com/boat-slips/ | `/lighthouse-marina` | "Join Waitlist" |
| https://lighthouseresort.com/property-map/, /rules, /boat-rentals | `/companies`, `/guestguide` | Property Map / Rules / Boat Rentals |
| https://paradisetexoma.com/ | footer (all) ; http:// variant on `/tap` | "Paradise on Lake Texoma" |
| https://paradisetexoma.com/property-map/, /rules | `/companies`, `/guestguide` | |
| https://islandviewtexoma.com/ | footer (all); http:// on `/tap` | "Island View Park" |
| https://islandviewtexoma.com/property-map/, /rules | `/companies`, `/guestguide` | |
| https://sundancetexoma.com/ | footer (all) | "Sundance Camp" |
| https://sundancetexoma.com/property-map/, /rules | `/companies`, `/guestguide` | |
| https://tackleboxtexoma.com/ | footer (all) | "The Tackle Box" |
| https://tackleboxtexoma.com/property-map/ | `/companies` | |
| https://shoponline.tackleboxtexoma.com/ | `/properties/the-tackle-box` ("Shop/Order Now"), `/things-to-do` ("Shop The Tackle Box Online") | **dead (NXDOMAIN)** |
| https://fastrac.com/ | footer (all); http:// on `/tap` | "Fastrac Cruises" |
| https://fastrac.com/property-map | `/companies` | |
| https://fastrac.com/cruises/texie-cruise | `/texie` | "Book Now" |
| https://fastrac.com/reserve/cart/add/cruise/3009 | `/texie` | "book now" |
| https://texomawatertaxi.com/ | `/properties/fastrac`, `/things-to-do` | "Water Taxi Service" |
| https://boaterwise.com/ | `/tap`, `/tap-confirmation` | logo (no text) |
| https://bigwatermarine.com/ | footer (all); `/lighthouse-marina` | "Big Water Marine & Boat Club" / dealership |
| https://bigwatermarine.com/boatclub | `/lighthouse-marina`, `/things-to-do/boat-rentals` | Boat Club |
| https://bigwatermarine.com/keepboating | `/things-to-do/boat-rentals` | "Browse New Boats" |
| https://towboatuslaketexoma.com/ | footer (all); home; `/lighthouse-marina` | TowBoatUS |
| https://berkshirepontoon.com/ | `/lighthouse-marina` | "Berkshire Pontoons" |
| discovertexoma.com | **none** | — |
| Social: facebook.com/texomadestinations, instagram.com/texomadestinations (all pages); facebook.com/{lighthousetexoma, paradisetexoma, fastraccharters, islandviewtexoma, tackleboxoutfitters, sundancetexoma} (`/companies`); open.spotify.com playlist (`/texie`) | | |

---

## 7. Structured data & SEO

| URL | Title | Meta description | Canonical | OG image | JSON-LD @types |
|---|---|---|---|---|---|
| `/` | Best Lake Texoma Camping – Cabin & RV \| Texoma Destinations | Our Lake Texoma camping resorts are some of the best in Texas. Enjoy luxury glamping cabins, RV campgrounds, cruises & more on Lake Texoma! | `/` | 2023/07/Q0A9779-2.jpg (1600×1200) | WebPage, ImageObject, BreadcrumbList, WebSite (SearchAction `/?s=`), Organization (logo 2023/07/logo-td.png 400×129) |
| `/properties/lighthouse` | Best Family Resort in Texas \| Lighthouse Resort on Lake Texoma | Lake Texoma's Lighthouse Resort & Marina caters to those looking for the best family resort in Texas. Affordable Lake Texoma family getaway. | self | 2023/07/Q0A5887-hero.jpg | WebPage, ImageObject, BreadcrumbList, WebSite, Organization |
| `/lighthouse-marina` | #1 Lake Texoma Marina for Fueling Family Fun \| Lighthouse Marina | Welcome to Lighthouse Marina, the best Lake Texoma marina. Stock up, refill, slip in or head out on the lake for year-round fun & relaxation. | self | 2023/06/Q0A8658-hero.jpg | same |
| `/properties/paradise` | Lake Texoma Glamping with Boundless Amenities \| Paradise | Enjoy serenity and peace at Paradise on Lake Texoma. We offer Lake Texoma glamping in cabins and tiny homes. Also, bring your tents & RVs. | self | 2023/06/Q0A5430-hero.jpg | same |
| `/properties/sundance` | One of the Most Secluded Lake Texoma Campgrounds \| Sundance | Sundance Camp, one of the most secluded Lake Texoma campgrounds, gets you outside together. Stunning night skies, beautiful beach & luxurious cabins. | self | 2023/07/Q0A5874-hero.jpg | same |
| `/properties/island-view` | The Most Popular Lake Texoma Beach Destination \| Island View | Everyone loves this Lake Texoma beach! Open 9 am-Sunset year-round. Sandy beach, picnic tables, covered shelters, kayak & SUP rentals. | self | 2023/06/Q0A3656-hero.jpg | same |
| `/properties/fastrac` | Best Lake Texoma Dinner Cruises & Boat Tours \| Fastrac Charters | The best Lake Texoma dinner cruises and boat tours. Water Taxi Service from anywhere on Lake Texoma. Our fleet hosts parties, reunions, weddings, and more. | self | 2023/06/DJI_0886-hero.jpg | same |
| `/properties/the-tackle-box` | Best Lake Texoma Fishing Gear & Guides \| Tackle Box Outfitters | The Tackle Box in Pottsboro TX is your foremost Lake Texoma fishing outfitter. We've got you covered for the most successful striper fishing. | self | 2023/06/Texoma_Day30786-hero.jpg | same |
| `/where-to-stay/cabins` | Best Lake Texoma Cabins & Cabin Resorts \| Texoma Destinations | Lake Texoma cabins range from fishing cabins to comfy glamping cabins. Stay close to the action on Lake Texoma in our Texoma cabin resorts! | self | 2023/06/Texoma_Day30901.jpg | same |
| `/where-to-stay/rv-sites` | Best Lake Texoma RV Camping & Resorts \| Texoma Destinations | Three beautiful Lake Texoma RV sites to experience great Lake Texoma RV camping. Wooded views or lakefront, you'll find the perfect spot. | self | 2023/06/Q0A5430-hero.jpg | same |
| `/where-to-stay/tents` | Lake Texoma Tent Camping, Primitive Camping \| Texoma Destinations | Two beautiful sites for Lake Texoma tent camping. We provide the land. You provide the tent. Both are primitive. A true camping experience! | self | 2023/07/IMG_9916.jpg | same |
| `/things-to-do` | Things to Do at Lake Texoma: Camping, Fishing, Kayaks & More! | Choose your adventure with so many things to do at Lake Texoma. Camping, fishing, kayaks, beaches, and whatever else floats your boat! | self | 2023/06/Q0A4702.jpg | same |
| `/things-to-do/boat-rentals` | Lake Texoma's Best Boat Rentals at Lighthouse Resort & Marina - Texoma Destinations | **none** | self | 2023/05/Berkshire_STS_250CL-2-1.jpg | same |
| `/events` | How to Plan an Event on Lake Texoma \| Texoma Destinations | From romantic escapes to big corporate outings, Texoma Destinations is the best place to plan an event on Lake Texoma. Stress-free & special. | self | 2023/06/Beach-Dinner-hero.jpg | same |
| `/tap` | Texoma Access Package - Texoma Destinations | **none** | self | 2024/05/DescribeTheFauna_TexomaDestinations_Q0A8092-Edit-scaled.jpg | same |
| `/texie` | Texie The Dragon - Lake Texoma's Mascot - Join the Journey - Texoma Destinations | **none** | self | 2026/06/texie_cruises_header-1024x768.jpg | same |
| `/texie/story` | …Texie's Story - Texoma Destinations | none | self | none | WebPage, BreadcrumbList, WebSite, Organization |
| `/reserve` (+all app routes) | Reservations - Texoma Destinations | none | `/reserve` | none | WebPage, BreadcrumbList, WebSite, Organization |
| `/jobs`, `/legal`, `/properties`, `/companies`, `/guestguide`, `/myvacation`, `/properties-map`, `/tap-confirmation` | generic "X - Texoma Destinations" | none | `/legal` and `/properties` have **no canonical** | none | WebPage… |

Observations: every page's schema is Yoast default (WebPage/Organization/BreadcrumbList) — **no LodgingBusiness, Campground, Resort, LocalBusiness, TouristAttraction, Product/Offer, Event, or FAQPage schema** anywhere; no per-property address/phone/geo in schema. `robots` meta = `index, follow, max-image-preview:large…` on all pages including `/reserve/*`, `/properties` (Lorem ipsum), `/tap-confirmation`, `/guestguide` (contains WiFi password). Duplicate-URL aliases (`/cabins`, `/rv`, `/boat-rentals`, `/where-to-stay`, `/things-to-do/events`) are handled by canonical tags. `article:modified_time` on home = 2025-12-21.

---

## 8. Gaps vs. Lighthouse (hub-page depth)

| Property | Hub page(s) | Booking path from hub | Key data present | Gaps |
|---|---|---|---|---|
| **Lighthouse** | property page + marina page + boat-rentals page + cabin/RV sections + events venues + guest guide | Browse Cabins/RV (widget hash), tritoon direct-to-cart, marina Reserve Now | counts (34/35 cabins, 19/20 RV), sleeps 1–16, slip price table, hoist pricing, rental pricing (API), rules, cancellation, venues, fishing, phone 903.786.2250 | count mismatches page vs widget; boat page says "fuel included" and "pay for fuel you use"; no cabin-level pricing on hub; no address on property page itself (only map); no schema |
| **Paradise** | property page + sections | Browse Cabins/RV, kayak → things-to-do | acreage/site count only in API (200 ac, 50+ RV+tent), ramp 26 ft, rules, cancellation, hangouts | **no cabin count, no RV count, no prices**; kayak rentals claimed but not in rental API config; "Visitor Fee and Visiting Hours" rule has no details; no address/phone on page |
| **Sundance** | property page + sections | Browse Cabins/RV only | 80 ac, 7 cabins, 6 RV, sleeps 2–4, rollaway $100, no wifi | no rentals, no tent booking CTA on property page, no prices, no address/phone on page; API mentions boat ramp + 400-yd beach not on page |
| **Island View** | thin property page | Reserve Now → things-to-do hashes | hours 9am–sunset, shelter 6–10 ppl, rules | **no day-pass, shelter or kayak prices; no address/phone; no cancellation**; ~1/3 the content of Lighthouse |
| **Fastrac** | property page (good depth) | Book Now → `/things-to-do#/charters-cruises` (widget), Texie cruise → fastrac.com | vessels, capacities, taxi routes, $180/hr, cancellation, FAQ | no public cruise schedule/prices on hub; dead internal link to Lighthouse map; name inconsistency (Cruises vs Charters) |
| **Tackle Box** | property page | none (dead online-shop link) | license $12, bait/propane facts, phone | **dead shop domain**, no hours, no schema, "Caset Nets" typo, no product prices |
| **Water Taxi** | **none** | external only | in Fastrac page | needs own hub page / deep link; domain link on 2 pages only |
| **BoaterWise** | **none** | external only | TAP benefit mentions | needs own hub page; only a logo link |
| **TAP** | `/tap` | widget → `/reserve/cart/add/tap-pass` | tiers/prices/benefits (API + page) | no meta description; stale Individual/Family copy on `/tap-confirmation` and `/guestguide`; http:// partner links |
| **Events** | `/events` sales page | inquiry form | venues + capacities | calendar nav link 404; empty "What's Up, Texoma?" sections; `event-search` API empty |
| **Properties index** | `/properties` | — | — | **Lorem ipsum placeholder, indexable** |

### Recommended fixes for the hub developer (short list)
1. Remove/repoint "Our Event Calendar" (`/?page_id=502`) and the two `/map-location/*` links; delete or noindex `/properties` placeholder.
2. Reconcile Lighthouse counts (34 vs 35 cabins; 19 vs 20 RV) — widget copy is hard-coded in `td-reservations` `main.*.js`.
3. Resolve `shoponline.tackleboxtexoma.com` (DNS dead) or drop the CTAs.
4. Fix "Fuel included" vs "You pay for the fuel you use" on `/things-to-do/boat-rentals`; clarify "from $300/$500" are 50%-member prices vs $450–$750 public.
5. Update `/tap-confirmation` + `/guestguide` TAP copy to the Explorer/Adventurer/Navigator/Boat Club model; switch `/tap` partner links to https.
6. Add meta descriptions to `/tap`, `/things-to-do/boat-rentals`, `/texie`; add canonical to `/legal`, `/properties`; noindex `/reserve/*`, `/guestguide`, `/tap-confirmation`, `/myvacation`.
7. Add per-property LocalBusiness/Campground/Resort schema with the addresses/phones in §3.10.
8. Create hub pages (or at least sections with deep links) for Texoma Water Taxi and BoaterWise; expand Island View (prices, address) and Paradise (counts).
9. Deep-link spec to reuse: `/where-to-stay/cabins#/{lighthouse|paradise|sundance}`, `/where-to-stay/rv-sites#/{…}`, `/where-to-stay/tents` (paradise/sundance), `/things-to-do#/{boats|kayaks-sups|charters-cruises|fishing|beach-access|picnics}`, `/reserve/a/boat-rental/at/lighthouse/cart/add/tritoon`, `/reserve/cart/add/{tritoon|smallboat|primitivecamp|islandview-day-pass|tap-pass}`, `/properties-map?m={lighthouse|paradise|sundance|islandview|fastrac|tacklebox}`, `/companies#{td|lh|px|fc|iv|tb|sc}`, `/legal#tab-1687356549-1-58|-2-22|…573179-2-9`. No `?property=` query-param filtering exists; location scoping is hash/path only (client-side — validate in a browser).
