# Legacy Site Audit — Batch A
**Sites:** lighthouseresort.com · paradisetexoma.com · islandviewtexoma.com · sundancetexoma.com
**Audit date:** 2026-09-03
**Method:** WebFetch crawl of homepage, nav/footer links, robots.txt, sitemap.xml, WordPress REST API (`/wp-json/wp/v2/*`, `/wp-json/tribe/events/v1/*`), plus attempted curl and Wayback Machine.

> **Environment caveats (affect what could be verified):**
> - `curl` from the audit sandbox is blocked by an org egress allowlist for **all four hosts** (`CONNECT tunnel failed, response 403`, body: `Host not in allowlist`). Only the WebFetch proxy could reach the sites, so raw HTTP status codes / headers / TLS chain details could not be captured independently.
> - `web.archive.org` is blocked by the WebFetch proxy (`PROXY_REJECTED 403`). `archive.org/wayback/available` (the availability API) **is** reachable — see Sundance section.
> - WebFetch converts HTML → markdown, so `wp-content/themes/<name>` paths, Google Fonts and CSS hex colors are not visible in its output. Platform hints below come from meta generators, REST namespaces, post types and shortcodes.
> - Every site's robots.txt is identical: `User-agent: SemrushBot` / `Disallow: /` (nothing else blocked).

---

## Cross-site facts (shared network)

All four sites share a network header bar linking to the same six "Texoma Destinations" properties and the same booking plugin:

| Item | Value |
|---|---|
| Network bar links (all sites) | `https://texomadestinations.com`, `https://discovertexoma.com`, `https://lighthouseresort.com`, `https://paradisetexoma.com` ("this is Paradise"), `https://fastrac.com` ("Fastrac Cruises"), `https://islandviewtexoma.com` ("Island View") |
| Network logo image (hot-linked cross-domain on every site) | `https://discovertexoma.com/wp-content/uploads/2017/01/td_brand.png` |
| Booking engine | Custom WP plugin `wp-content/plugins/td-reservations/` rendering `[tdr_reservations]` at `/reserve/`, `/reserve/cart/`, `/reserve/cart/add/<sku>`, `/reserve/account/profile` on **each** domain (bookings are per-domain, not centralized) |
| Alternate booking host referenced in Island View footer | `http://reserve.texomadestinations.com` → **302 → `https://texomadestinations.com/`** (i.e. dead/placeholder subdomain) |
| TAP Pass link (nav on Paradise, Island View, Sundance) | `https://discovertexoma.com/tap/` → **302 → `https://texomadestinations.com/tap`** |
| TAP page (texomadestinations.com/tap) says | Program is called **"Texoma Access Package (TAP)"** on that page (legacy sites call it "TAP Pass" / "Annual Pass"); tiers: **TAP Explorer** ("Best for locals looking to save at Island View Park"), **TAP Adventurer** ("For a family of four…"), **TAP Navigator** ("Maximum Savings"), **Big Water Boat Club**; includes day use at Island View Park and Paradise (2–4 people by tier), unlimited boat launch at Lighthouse and Paradise, 5–10% off kayak/SUP rentals, Big Water Club 50% off pontoons, 5–15% off Fastrac cruises, 5–15% off stays at Lighthouse & Paradise, 5–10% retail, fuel 5–10¢/gal off; "Valid … for a period of 12 months from your signup date"; purchase CTA `https://texomadestinations.com/reserve`; phone 903.361.8500. **No prices listed on the TAP page** (Island View homepage claims "$99–$199/year"). |
| Events venue page linked from Lighthouse + Sundance | `https://texomadestinations.com/events/` — "How to Plan an Event on Lake Texoma"; Lighthouse Lodge cap. **80**, Cove Point cap. **50**, Lighthouse Fireside cap. **25**; Reservation Office 903.361.8500; Events Director 903.200.1408 |
| Shared promo banner (stale) | "Sneak Away This May 🌿 Use code MAYGETAWAY — limited-time 10% off (excludes Memorial Day Weekend)" — on **every page** of Lighthouse and Paradise as of Sept 2026 |
| Shared policy boilerplate | Lighthouse and Paradise `/rules/` pages are near-identical templates (quiet hours 11p–7a, 2-night peak min Apr 1–Oct 31, 3-night holiday min, min age 25, $35 pet fee, $250 deep-clean fee, $250 cash deposit, 14-day "Pay at Check-In" cancel window, "Pay Now & Save" non-refundable, 3-day package cancel, 3+ properties non-refundable) |
| Central phone | **903.361.8500** appears on all four sites (Paradise, Island View, Sundance as primary; Lighthouse as "alternative") |
| Social handles shared | Twitter `twitter.com/discovertexoma`, YouTube `youtube.com/discovertexoma` used by Lighthouse and Paradise; Instagram `instagram.com/texomadestinations` used by Lighthouse |

---

# 1. lighthouseresort.com — Lighthouse Resort & Marina

## Status & platform
- **Status:** UP. All crawled pages returned 200 via WebFetch. `https://lighthouseresort.com/sitemap.xml` → **404**; `/sitemap_index.xml` → **404** (no XML sitemap exposed). `/wp-json/wp/v2/pages?per_page=100` → **read timeout** (slow REST; media endpoint worked).
- **Platform:** WordPress. Meta generator **Slider Revolution 5.4.8.3** (very old — RevSlider 5.x, 2018-era; the other three sites run 7.1.4). Custom `td-reservations` plugin; `tec-api-origin`/`tec-api-version: v1` meta tags; The Events Calendar (`tribe/events/v1` — returns **0 events**); `[calendar id="52005"]` / `[calendar id="52006"]` shortcodes on events page (a separate calendar plugin whose shortcode is **rendering as literal text** — see Problems). Google Tag Manager **GTM-M25TCFTW**. Theme is Uncode-style (Visual Composer `[vc_row]` markup on sibling sites; not directly confirmed here).
- **SSL:** loads over https without WebFetch error (chain not independently verified).

## Discovered URLs (nav, footer, activity pages)
```
https://lighthouseresort.com/
https://lighthouseresort.com/cabins/
https://lighthouseresort.com/camping/            (labelled "RV Sites")
https://lighthouseresort.com/boat-rentals/
https://lighthouseresort.com/marina              (no trailing slash in nav)
https://lighthouseresort.com/boat-slips/
https://lighthouseresort.com/fuel-dock-general-store/
https://lighthouseresort.com/amenities/
https://lighthouseresort.com/experiences/
https://lighthouseresort.com/property-map        (no trailing slash in nav)
https://lighthouseresort.com/contact/
https://lighthouseresort.com/about-us/
https://lighthouseresort.com/lake-texoma-events/ (title "Events")
https://lighthouseresort.com/rules/
https://lighthouseresort.com/event-space/
https://lighthouseresort.com/lighthouse-lodge    (no trailing slash)
https://lighthouseresort.com/recreation/
https://lighthouseresort.com/fishing/
https://lighthouseresort.com/professional-guide-service/
https://lighthouseresort.com/?page_id=2578       (un-pretty "guide list" link from /fishing/)
https://lighthouseresort.com/activity/pontoon-boat-rental/
https://lighthouseresort.com/activity/kayak-rental/
https://lighthouseresort.com/activity/paddleboard-rental/
https://lighthouseresort.com/activity/sunset-cruise/
https://lighthouseresort.com/activity/dinner-cruise/
https://lighthouseresort.com/activity/lake-tour/
https://lighthouseresort.com/activity/lake-day/
https://lighthouseresort.com/activity/island-view/
https://lighthouseresort.com/reserve/
https://lighthouseresort.com/reserve/cart/
https://lighthouseresort.com/reserve/cart/add/pontoon
https://lighthouseresort.com/reserve/cart/add/smallboat
https://lighthouseresort.com/reserve/account/profile
https://lighthouseresort.com/robots.txt
```

## Business identity
| Field | As written |
|---|---|
| Name | **Lighthouse Resort & Marina** (also "Lighthouse Resort and Marina", "Lighthouse Marina") |
| Legal entity (footer) | "Cornerstone Marine Group, LLC dba Lighthouse Resort and Marina © 2017-2019 All Rights Reserved" |
| Address | **300 Lighthouse Drive, Pottsboro, TX 75076** |
| Phones | Toll-Free **877-289-9652** / 877.289.9652; Reservations **903-361-5070** / 903.361.5070; Fuel Dock **903-786-2250** / 903.786.2250; Events **903.200.1408** (event-space page); Fastrac Charters **903.361.0775** (cruise pages); 903-361-8500 (network "Call Us") |
| Email | **info@lighthouseresort.com** |
| Hours | "Off-Peak — Main Office & Reservations: 9a-5p Mon-Sun; Fueldock and Rentals: 9a-5p Mon-Sun" (no peak hours published) |
| Social | Facebook `https://facebook.com/lighthousetexoma`; Instagram `https://instagram.com/texomadestinations`; Twitter `https://twitter.com/discovertexoma`; YouTube `https://youtube.com/discovertexoma` |
| Map links | `https://goo.gl/maps/kKybVCHLPgK2` (homepage), `https://goo.gl/maps/FbAdHuLeNUkVW1Ak7` (property map), `https://www.google.com/maps/place/Lighthouse+Resort+%26+Marina` (contact) |
| Tagline | "Lake Texoma's Family Fun Spot!" |

## Factual claims (exact figures)
**Lodging**
- "**35 Furnished Cabins**"; "35 Cabins that sleep from 1 – 16 People"; "small one-room waterfront lake escapes to 6 bedroom homes"
- Cabin inclusions: "cable television, towels, linens, basic dishes, cookware and utensils, a BBQ grill, refrigerator, coffee pot, and a microwave"
- "We have a few cabins that are pet friendly" (not all)
- "eight original Corps of Engineers cabins, among the oldest structures remaining on the lake" (about page)
- "**20 Waterfront RV Sites**"; "30 & 50 amp RV hookups with water"; "picnic table and firering"; dump station available
- "We do not have any tent camping facilities at Lighthouse Resort but do offer it at our other properties on Lake Texoma."
- **No cabin names, per-unit pricing, or bed configs on the site** (all pushed to `/reserve/`)

**Marina**
- "20′-50′ Monthly Covered Boat Slips with Electricity and Water Included"; "Covered slips and fully enclosed boathouses"; "No Hidden Fees!"
- Slips: month-to-month, 30-day written notice; discounts for 3/6/12-month prepay; vessel insurance required; no refunds on prepaid rent; "**We currently have a waiting list for boat slips**" (waitlist form)
- Location: "Little Mineral Arm near the dam"
- Nightly transient slip: **$40** (cabins page) vs **"$25.00 per night (covered)"** (rules page) — **CONFLICT**
- Cabin guests may not access boathouses/docks except fuel dock and fishing dock on Boathouse 3
- Fuel: "**ValvTect Marine Fuel**" (ethanol-free not stated); Fuel dock phone 903.786.2250
- Store stock: marine oil/supplies, tackle/rods/reels, groceries, candy, chips, condiments, sandwiches, breakfast items, fountain drinks, sodas, juices, beer, wine, gifts, apparel, ice, charcoal, firewood; **fishing licenses sold**; Lake Texoma license **$12**, valid through Dec 31
- Boat launch: "Ramp & PWC Ramp"; Covered Boat & PWC Slips

**Boat rentals**
- Pontoons/Tritoons: 18′, 20′, 24′, "up to 12 people"; half day "approximately 4-6 hours", full day "up to 12 hours", multi-day; min age **21**; **$50 reservation fee**, **$500 damage deposit**; late return **$100 per hour**; fuel: "Boats will be sent out with full fuel and refueled when you return. You will pay for the fuel used"; **$10 agent fee if booked by phone**; no pets on rental boats; arrive 30 min early; 30+ min late = no-show full charge; return by dark or fuel dock close; cancel: 2 weeks to keep $50; within 3 days = full rate; weather = pro-rated refund
- Contradiction on same page: "Pontoon Boats — Hourly, first-come first-served (no advance reservations)" vs "Tritoon … Booking: Online only"
- Kayaks: 1-person **$25**, 2-person **$40**, fishing kayak **$25** (hourly; "discounts for 4+ hours"; group discounts); min age 14 single / 10 tandem with adult; contract signer 18+; life jackets required; "must stay within sight of Lighthouse Marina" without waterproof phone case
- SUPs: Hobie DuraSUP **$25**, YOLO Board **$25** hourly; min age 14; "Lessons Available"; "Stable for Beginnners" (typo on site)
- "Hobie sailboats, tubes" listed on fuel dock page; "Sailboats, Lake Toys" on amenities
- "Big Water Boat Club partnership offers 50% off the normal rental rate"

**Experiences (all operated by Fastrac Charters, sold on lighthouseresort.com/reserve)**
- Sunset Cruise: **$35** adult, **$35** child (3–12); 1.5 hours; up to 25; vessel "Sight-Sea-Er II"; **departs Highport Marina** ("confirm via confirmation email"); Friday & Saturday evenings; BYOB; cancel 2 days prior. (Sundance itinerary says the sunset cruise "departs Lighthouse Resort & Marina" — **CONFLICT**)
- Dinner Cruise: adults **$49–$60**, children 3–12 **$34–$40**; "1.5 Hr Sunset Dinner Cruise"; up to 48; vessel "Island Girl"; menus "Texas BBQ, Mexican Fajita Fiesta, Southern Comfort"; meal choice by noon day-of
- Lake Tour: scheduled ticket **$19–$25**; private **$150–$230** (6–8 ppl) + **$22/pp** after; "90 Minute"; 1–36 ppl; boxed lunch **+$10**; BYOB
- Lake Day Experience: "**4hr Lake Day (up to 35 people): $1,800**"; private vessel w/ kitchen, climate control, restroom; 14-day cancel; `https://fastrac.com/lake-day-experience/`
- Island View Day Use (as listed on Lighthouse): **$7/person, "kids under 3 free"**; shelter **$20–$40**; 9am–Sunset; gate closes 30 min after sunset. (Island View's own site says "kids 7 and under free" and shelter "$40/day" — **CONFLICT**)

**Event space**
- Lighthouse Lodge: "2400 sq ft" total = 1600 sq ft indoor + 800 sq ft covered porch, "up to 75 people" (lodge page) **vs** 1,600 sq ft interior + **1,200 sq ft deck** (event-space page) **vs** capacity **80** (texomadestinations.com/events) — **CONFLICT**; two restrooms, full kitchen, bar, propane grill, three bay doors; bartender included; catering via Dreamland Catering
- Cove Point: "Approximately 2 acres fenced grassy area", gazebo, waterfront (cap. 50 on texomadestinations)
- Fireside at Lighthouse: "Up to approximately 36 people" (**vs 25** on texomadestinations) — **CONFLICT**; small stage, large firepit, covered deck
- Pricing "hourly, half-day, full-day blocks" — no amounts; "Venue / Vessel showings are by appointment only"

**Recreation / fishing**
- Lakefront playground; pavilion; fishing pier; fish cleaning station; shoreline fishing
- Species: Striper, Sand Bass, Blue & Channel Catfish, Crappie, Black Bass; "Striper Capital of the World"
- Bag limits published (Black Bass 14"/5; Striper 10 daily/20 possession, only 2 ≥20"; White Bass 25; Catfish 12"/15; Crappie 10"/37; Walleye 18"/5) — regulatory content that can go stale
- Guide table (7 guides, with phones/emails/domains): Dale Bestwina 214-668-6421; Rex Bridges 800-211-7808 / 903-814-8400; Gerald Costner 214-384-9682; Jodey Whitmire 903-271-1559; Capt. Steve Barnes 940-841-0910; Capt. John Brett 903-786-9279; Jason Harrelson 903-821-4971 — with disclaimer "Lighthouse Resort and Texoma Destinations are not directly affiliated with the guides below."
- No pool, WiFi, laundry, bathhouse mentioned anywhere

**Policies (rules page)**
- Check-in **3pm**, check-out **11am** (cabins & RV); late checkout via Marina Office (fee)
- Peak season **April 1–October 31**: 2-night min; Spring Break 2 nights; holiday weekends/special events 3 nights
- Min renter age **25** (must be present); pontoon renter **21**
- Credit card required; cash bookings **$250 security deposit**; full payment at check-in
- Cancellation: "Pay at Check-In" — 14 days notice or one night charged; "Pay Now & Save" — non-refundable, no changes except adding days; 3+ properties — full payment, non-refundable; packages — 3-day; "Cancellations must be made via phone (903.361.5070)"; no refunds for early checkout/weather
- Pets: pet-friendly cabins only; **$35.00** non-refundable pet fee; **$250 deep cleaning fee** if pet in non-pet cabin; leash at all times; no pets on rental boats
- Fees: towel/linen **$10.00 per item**; excessive dirt **$250.00**; keys **$25.00 per key**; quiet-hour violation **$75** first warning; smoking in cabin **$250**
- Quiet hours **11p–7am**; RV max occupancy **6 per site (no more than 4 adults)**; "Golf Carts by licensed drivers only. No ATVs or Side-By-Sides allowed."

**History (about page)**
- Originated as "Preston Fishing Camp", "one of the first commercial marinas after Lake Texoma's impoundment in 1944"; Preston Point peninsula; Flood Control Act June 28, 1938; "over 50 years as a popular destination"; year-round

**Seasonal / promo / events**
- Banner on every page: "Sneak Away This May 🌿 Use code MAYGETAWAY — limited-time 10% off (excludes Memorial Day Weekend)" → `https://lighthouseresort.com/reserve` — **stale (May promo showing in September 2026)**
- Events page: no events; tribe events API total 0
- TAP: not mentioned by name on Lighthouse pages (only via "Big Water Boat Club" 50% rental discount); TAP page on texomadestinations lists Lighthouse for unlimited boat launch and 5–15% stay discounts

## Outbound links & booking CTAs
| Target | Exact URL |
|---|---|
| Primary booking (all "Book Online"/"Book Now") | `https://lighthouseresort.com/reserve/` (banner uses `https://lighthouseresort.com/reserve` no slash) |
| Cart / account | `https://lighthouseresort.com/reserve/cart/`, `https://lighthouseresort.com/reserve/account/profile` |
| Pontoon add-to-cart | `https://lighthouseresort.com/reserve/cart/add/pontoon` |
| Kayak/SUP add-to-cart | `https://lighthouseresort.com/reserve/cart/add/smallboat` |
| Events coordinator | `https://texomadestinations.com/events/` |
| Catering | `https://dreamlandcatering.com` |
| Fastrac | `http://fastrac.com` (http, not https), `https://fastrac.com/lake-day-experience/` |
| Network | `https://texomadestinations.com`, `https://discovertexoma.com`, `https://paradisetexoma.com`, `https://fastrac.com`, `https://islandviewtexoma.com` |
| Guide sites | dbestguide.com, rexbridges.com, striperman.com, txfishingguide.com, texomastriperfishing.com |
| Island View (as activity) | `https://islandviewtexoma.com` |
| Discover Texoma fishing guides | referenced ("comprehensive list… via Discover Texoma") |

## Brand voice / visual
- Voice: family-friendly, service-forward, fishing-heritage ("Lake Texoma's Family Fun Spot!", "breathtaking sunrises", "Striper Capital of the World"); heavy use of testimonials (8 named reviews: Bill Finner, Tammy Ash DiPasquale, Taneisha Matthews, Taylor Statham, Kimberly Truelove, Janet Ellis, Brad Harper, Meg Nethercutt); target audiences explicitly: "fishing trips, families looking for a weekend getaway, company retreats, family reunions, recreational boaters".
- Logo: `https://lighthouseresort.com/wp-content/uploads/2016/08/NewLighthouse200.png`; site icon `https://lighthouseresort.com/wp-content/uploads/2016/08/cropped-NewLighthouseLogoLogo512-270x270.png`
- Colors/fonts: not extractable via WebFetch (markdown conversion strips CSS).

## Problems
1. Copyright "© 2017-2019" (7 years stale).
2. "MAYGETAWAY" May promo banner on every page in September.
3. Slider Revolution **5.4.8.3** (unsupported, known-vulnerable line) vs 7.1.4 on sister sites.
4. Events page renders raw shortcodes `[calendar id="52005″]` / `[calendar id="52006″]` (note curly quote `″` — broken plugin/shortcode); Events Calendar API has 0 events.
5. No XML sitemap (`/sitemap.xml` 404); REST `pages` endpoint times out.
6. Fact conflicts: nightly slip $40 vs $25; Lodge capacity 75 vs 80, porch 800 vs deck 1,200 sq ft; Fireside 36 vs 25; Island View kids "under 3 free" vs "7 and under free", shelter $20–$40 vs $40; sunset cruise departs Highport Marina (not Lighthouse).
7. Pontoon page says both "first-come first-served, no advance reservations" and "Booking: Online only; $10 agent fee if booked by phone".
8. Inconsistent URL forms (`/marina`, `/property-map`, `/lighthouse-lodge` without trailing slash; `?page_id=2578` raw link).
9. Mixed domains: logo hot-linked from discovertexoma.com; `http://fastrac.com` non-https link.
10. Typos: "Beginnners"; "Fueldock" vs "Fuel Dock".
11. Static bag-limit/license regulations ($12) will drift from TPWD rules.

## Hero images worth reusing
- `https://lighthouseresort.com/wp-content/uploads/2017/12/Marina15-copy-1024x439.jpg` (homepage marina panorama)
- `https://lighthouseresort.com/wp-content/uploads/2018/03/DTF_DiscoverTexoma-0088-1024x683.jpg`
- `https://lighthouseresort.com/wp-content/uploads/2018/03/DTF_DiscoverTexoma-0179-1024x683.jpg`
- `https://lighthouseresort.com/wp-content/uploads/2018/03/DTF_Texoma-76-1024x683.jpg`
- `https://lighthouseresort.com/wp-content/uploads/2017/09/31c6a7bba776144672bfb903d7e15bf8-1024x683.jpg`
- `https://lighthouseresort.com/wp-content/uploads/2021/05/1a8ad75079f75b92d7cee054dc82d3b2.jpg` (1920×1440, newest cabin set 2021)
- `https://lighthouseresort.com/wp-content/uploads/2023/06/IMG_5121.jpeg` (1280×960, newest upload)
- Also: `/wp-content/uploads/2017/05/Map170504.jpg` (property map), `/wp-content/uploads/2014/10/lodge.jpg`, `/wp-content/uploads/2014/10/camping.jpg`, `/wp-content/uploads/2016/07/Pontoon.jpg`, `/Kayak.jpg`, `/Sup.jpg`, `/wp-content/uploads/2017/04/IMG_5051-860x496.jpg` (sunset cruise), `/wp-content/uploads/2017/04/IMG_3911-860x496.jpg` (dinner cruise)

---

# 2. paradisetexoma.com — Paradise on Lake Texoma ("this is Paradise")

## Status & platform
- **Status:** UP. `/things-to-do/` front-end returns content WebFetch reports as "binary data" (unparseable) — content recovered via REST `uncodeblock/57355`. Sitemap present.
- **Platform:** WordPress + **Uncode theme** (confirmed by `uncodeblock` post type and `[vc_row][vc_column][uncode_block id="57355"]` markup = WPBakery/Visual Composer), **Slider Revolution 7.1.4**, The Events Calendar (`tribe_events`, `tribe_venue`, `tribe_organizer`, `tec_calendar_embed` post types; API returns **0 events**), `portfolio` post type, `td-reservations` plugin. GTM **GTM-MP7S92SB**. Site icon "thisisparadsise_siteicon" (typo in filename).
- Homepage lastmod **2025-05-08** (the May 2025 promo edit); `/rules/` 2024-08-22; `/stay/primitive-camping/` 2025-04-18.

## Discovered URLs
Nav/footer:
```
https://paradisetexoma.com/
https://paradisetexoma.com/stay/
https://paradisetexoma.com/things-to-do            (nav, no slash) / https://paradisetexoma.com/things-to-do/
https://paradisetexoma.com/location/               ("our location")
https://paradisetexoma.com/property-map/
https://paradisetexoma.com/contact/
https://paradisetexoma.com/rules/                  ("info")
https://paradisetexoma.com/reserve/  /reserve  /reserve/cart/  /reserve/account/profile
https://paradisetexoma.com/search/  ?type=glamping  ?type=rv  ?type=cabin
https://paradisetexoma.com/stay/primitive-camping  (homepage link, no slash)
https://paradisetexoma.com/robots.txt
https://paradisetexoma.com/sitemap.xml → wp-sitemap-posts-page-1.xml, wp-sitemap-users-1.xml
```
Sitemap-only pages (65 URLs) — unit pages under `/stay/`:
- `paradise-express`, `cabin-3`, `cabin-4`
- `kima-1` … `kima-8`, `kima-19`, `kima-20` (10 Kimas)
- `kabana-9` … `kabana-12` (4 Kabanas)
- `kasita-13` … `kasita-18` (6 Kasitas)
- `rv-site-1`, `rv-site-22` … `rv-site-42`, `rv-site-44` … `rv-site-50` (29 RV pages; **no page for sites 2–21 or 43**)
- Orphans: `https://paradisetexoma.com/luau/` (Texoma Beach Luau, 2019), `https://paradisetexoma.com/vintage/` (Vintage Camper Week, March 22–29, **2020**), `https://paradisetexoma.com/test-page/` (empty "Test Page" — indexed)
- `wp-sitemap-users-1.xml` exposes author archives.

## Business identity
| Field | As written |
|---|---|
| Name | **Paradise on Lake Texoma**; brand lockup "**this is Paradise** on Lake Texoma"; footer "© 2017-2019 Paradise on Lake Texoma Campground"; Google Maps listing named "**Paradise Cove Resort & Camp**" |
| Address | "**503 Paradise Park Dr., Pottsboro, TX 75076**" (homepage/contact) — also written "503 Paradise Park **Rd.**" (property-map) and "503 Paradise Park **Road**" (location page) — **inconsistent** |
| Phones | **903.419.1009** (listed "reservations"/"main"), **903.361.8500** ("Call Us" nav); `tel:19035361500` on `/luau/` (**typo — wrong number**) |
| Email | none published |
| Hours | none published (office WiFi noted; day-use 9am–Sunset) |
| Social | Facebook `http://facebook.com/paradisetexoma`; Instagram `http://instagram.com/paradisetexoma`; Twitter `http://twitter.com/discovertexoma`; YouTube `http://youtube.com/discovertexoma` (all `http://`) |
| Map | `https://www.google.com/maps/place/Paradise+Cove+Resort+%26+Camp/@33.795484,-96.785531,13z/...` (GPS 33.795484, -96.785531) |

## Factual claims
**Glamping (homepage)**
- "**4 waterfront Kabanas (sleep 2)**"; "**6 waterview Kasitas (sleep 2 adults + 2 kids)**"; amenities "HVAC, electrical outlets, USB power, fire pit, outdoor sink, barbecue grill, linens provided, shared bathroom/shower"
- **Kimas are not mentioned on the homepage** but 10 Kima unit pages exist (Kima #1: "Single-room tiny home with lake views", 1 Full Bed, sleeps 2, Bluetooth speaker, outdoor kitchen w/ BBQ, AC, USB, kettle, 0 bathrooms, "Linens provided (towels not included)")
- Kabana #9: "waterfront, single-room tiny homes", 1 Queen, sleeps 2, small fridge, Bluetooth speaker, fire-pit, outdoor kitchen, 0 bathrooms, BYO towels, "Sunday-Thursday is always discounted"
- Kasita #13: sleeps 4, "1 King Daybed + 1 Full loft (for small children)", AC, USB, fire pit, outdoor sink, grill, coffee press, lake view, 0 bathrooms
- Rules page occupancy: "Glamping (Kasitas/Kabanas/Kimas): 2-4 persons"

**Cabins**
- "Multiple units including 1920s train car conversion"; kitchen, satellite TV, porch, fire pit, grill, linens
- **Paradise Express**: "1920s Train Car with Vintage Appeal", sleeps 6, 2 bedrooms (1 Queen; 2 Full), 2 bathrooms, boat ramp, charcoal grill, lake view, fire-pit, pet friendly, no smoking
- **Cabin 3**: "Rustic duplex", sleeps 6, 3 bedrooms each 1 full bed, 1 bathroom, lake view, covered deck, firepit, charcoal grill, fridge/coffee/microwave, towels & linens; "communal hammock garden and group firepit"
- Cabin 4 page exists (not crawled)
- Pricing: "Rates vary by cabin, use the Quote tool to find a rate for specific date"

**RV**
- Homepage: "**40 total sites** (many with full hook-up, 50amp available)"; "South Loop (sites 22-50): larger campers"; "West Loop (sites 1-21): up to 24′"; "All waterfront or waterview; rock/grass pads, picnic table, grill/firepit"
- Stay page: "**$50/night (avg)** Pay At Check-In *refundable*"; "**$40/night (avg)** Pay Now and Save *non-refundable*"; "Holiday weekends may cost more; November-February may offer discounts"; "Sites 33-50 require extended hoses (100' water, 25' sewer)"; "Free WiFi at office only"
- RV Site #22 page: "Maximum Length: **34 ft**", "**30 amp**", "**Water only**" hookups — **conflicts with homepage's "full hook-up, 50amp"** claim for many sites and with "Sites 33-50 … 25' sewer"
- Max 6 persons / 4 adults; 2 vehicles; "No tents allowed in RV sites"

**Primitive camping**
- "**$30 per tent per night**" (Walk-In); "no restrooms, showers, or picnic tables at the primitive site"; hike "approximately 1/3 to 1/2 mile"; "VEHICLES ARE NOT ALLOWED BEYOND THE FENCE… $250 fine and removal"; fires in provided firepits only; quiet 11p–7a; **"checkout at 11 PM"** (sic — typo for 11 AM); leashed pets OK; Leave No Trace; access to Hammock Garden, Community Bar, kayak/SUP rentals

**Things to do (hidden uncode block 57355)**
- Kayak & paddleboard rentals via office/text; Hammock Garden + community bar + group firepit; boat launch "for guests and TAP Pass members"; playground; **Day Use Area "$10 per person or purchase a TAP Pass"** (rules page says day visitors **"$7 per person"**, 9am–Sunset — **CONFLICT**); large groups (reunions, seminars, meetings)
- Dining list (with addresses): Lynch and Teel Tackle and Grill (23 Paradise Cove Rd, ~3 min), Brookshire's (11205 N TX-289), The Tackle Box (83924 TX-289), BAY at the Lake (50055 TX-289), Franks (80841 N. TX-289), Arroyos (TX-289 #108), Island Bar & Grill (120 Texoma Harbor Dr)
- Trails: Eisenhower State Park 6.5 mi Easy; Hagerman NWR 3.5 mi Easy; Juniper Point/Cross Timbers 14.2 mi Hard
- Area: Fastrac Charters; Hidden Hanger Winery (Denison, 35 min); 903 Brewery (Sherman, 35 min); Sherman Farmers Market (Sat 9am–noon)

**Policies (rules page — same template as Lighthouse)**
- Check-in **3p** (gate code sent at check-in; online or office check-in); check-out **11a**; "Stay-N-Play" late checkout on request
- Cancellation: Pay at Check In 14 days / 1 night; Pay Now and Save non-refundable; packages 3-day; 3+ properties non-refundable
- Pet fee **$35.00**; **$250 deep cleaning fee**; leash; barking/unleashed = eviction
- Quiet **11pm–7am**; peak Apr 1–Oct 31 & Spring Break 2 nights; holidays 3 nights
- "No site may have more than 10 people at anytime"; golf carts licensed drivers, roads only
- Day visitors "$7 per person", "9am until Sunset", overflow parking

**Promo / events**
- Banner every page: "Sneak Away This May 🌿 Use code MAYGETAWAY — limited-time 10% off (excludes Memorial Day Weekend)" — stale
- `/vintage/`: "Vintage Camper Week at Paradise", "March 22-29, 2020", "$100 for the week", "Airstreams & Vintage Campers built before 1980", promo code VCW2020 — **6 years stale, still live & in sitemap**
- `/luau/`: "Texoma Beach Luau" → Eventbrite `https://eventbrite.com/tickets-external?eid=65284747437&ref=etckt` (2019 event) — stale
- Newsletter: "we will never share your info"
- TAP: nav "TAP Pass" → `https://discovertexoma.com/tap/`; boat launch & day-use tied to TAP

## Outbound links & CTAs
- Booking: `https://paradisetexoma.com/reserve/`, `/reserve` ("Book it!"), `/reserve/cart/`, `/reserve/account/profile`; category searches `https://paradisetexoma.com/search?type=glamping`, `?type=rv`, `?type=cabin`
- TAP: `https://discovertexoma.com/tap/` (→ texomadestinations.com/tap)
- Network: texomadestinations.com, discovertexoma.com, lighthouseresort.com, fastrac.com, islandviewtexoma.com
- Eventbrite (luau); Google Maps
- Logo hot-link: `https://discovertexoma.com/wp-content/uploads/2017/01/td_brand.png`

## Brand voice / visual
- Voice: laid-back, escapist ("Escape the hustle and bustle of the modern world and kick your feet up, roast some marshmallows, and enjoy the serenity and peace that is Paradise on Lake Texoma."); lowercase nav ("stay", "things to do", "our location", "info"); "Glamping in Style"; playful K-names (Kabana/Kasita/Kima).
- Site icon: `https://paradisetexoma.com/wp-content/uploads/2021/01/cropped-thisisparadsise_siteicon-1-270x270.jpg`
- Colors/fonts not extractable.

## Problems
1. Copyright "© 2017-2019".
2. Stale MAYGETAWAY banner; stale 2020 Vintage Camper Week and 2019 Luau pages indexed; `/test-page/` indexed.
3. `/things-to-do/` front-end unparseable by fetcher ("binary data") — verify in browser; content lives in Uncode block.
4. Inventory mismatch: homepage claims 4 Kabanas + 6 Kasitas (no Kimas) but 10 Kima pages exist; "40 RV sites" but only 29 site pages (1, 22–42, 44–50); site 43 missing; West Loop 2–21 have no pages.
5. Hookup conflict: "full hook-up, 50amp" (home) vs RV #22 "30 amp, water only".
6. Day-use price $10 (things-to-do) vs $7 (rules).
7. Address suffix Dr./Rd./Road inconsistent; Google listing name "Paradise Cove Resort & Camp" ≠ brand.
8. Wrong phone `tel:19035361500` on luau page; primitive page says "checkout at 11 PM".
9. Social links are `http://`; logo cross-domain from discovertexoma.com.
10. No email address published; no office hours.
11. Users sitemap exposed (`wp-sitemap-users-1.xml`).

## Hero images worth reusing
- `https://paradisetexoma.com/wp-content/uploads/2025/04/AdobeStock_217820697-scaled.jpeg` (2560×1709 — **stock photo**, "Night summer camping on shore")
- `https://paradisetexoma.com/wp-content/uploads/2025/04/AdobeStock_204814719-scaled.jpeg` (2560×1375 — **stock**)
- `https://paradisetexoma.com/wp-content/uploads/2023/05/6c9e75dcf014f1825e9e66150220e9dd.jpg` (1920×1440, 2023 unit photo)
- `https://paradisetexoma.com/wp-content/uploads/2023/05/07977c3b2a2cf59c5f02ba3f725c296a.jpg` (1920×1441)
- `https://paradisetexoma.com/wp-content/uploads/2018/08/25b1900c16fe2d1bf303042f8e0f7654.jpg` (Kasita)
- `https://paradisetexoma.com/wp-content/uploads/2017/07/22b5797c8f4af0596f6b5a080dbaee7d.jpg` (Paradise Express)
- `https://paradisetexoma.com/wp-content/uploads/2017/07/21ff232ad5d59e1b00c4c0c85b1a2b61.jpg` (RV)
- Map: `https://paradisetexoma.com/wp-content/uploads/2017/06/ParadisePropertyMap.jpg` (612×792)

---

# 3. islandviewtexoma.com — Island View Day Use Area

## Status & platform
- **Status:** UP; freshest site of the four (homepage lastmod **2026-03-20**, copyright **© 2026**).
- **Platform:** WordPress; generator **Site Kit by Google 1.186.0**; `td-reservations` plugin (`wp-content/plugins/td-reservations/dist/assets/images/dt_logo.png`); GTM **GTM-5MW77L52**; canonical `https://islandviewtexoma.com/`.
- Sitemap: `wp-sitemap-posts-page-1.xml` (4 pages), `wp-sitemap-users-1.xml`.

## Discovered URLs
```
https://islandviewtexoma.com/
https://islandviewtexoma.com/reserve/
https://islandviewtexoma.com/reserve/cart/
https://islandviewtexoma.com/reserve/cart/add/islandview-day-pass   (primary CTA)
https://islandviewtexoma.com/reserve/account/profile
https://islandviewtexoma.com/property-map/
https://islandviewtexoma.com/rules/
https://islandviewtexoma.com/robots.txt
https://islandviewtexoma.com/sitemap.xml
```

## Business identity
| Field | As written |
|---|---|
| Name | "**Island View Day Use Area – Lake Texoma**" / "Island View Park" / "Island View" |
| Address | **87426 Preston Bend Rd, Pottsboro, TX 75076** |
| Phones | **903.419.1008** (primary), **903.361.8500** |
| Email | **info@islandviewtexoma.com** |
| Hours | "**9am to Sunset, Daily**" year-round; "WE CLOSE THE GATE 30 MINUTES AFTER SUNSET" |
| Social | Facebook `https://facebook.com/islandviewtexoma` only |
| Map | `https://goo.gl/maps/aWSiD8YZsR62`; `https://www.google.com/maps/place/87426+Preston+Bend+Rd%2C+Pottsboro%2C+TX+75076` |

## Factual claims
- "Lake Texoma's Most Popular Beach"; "Lake Texoma's Best Beach Access and Day Use Area"; "perfect day-trip from DFW"; sandy beach; wildlife "500+ bird species"
- **Day Pass $7 per person (kids 7 and under free)**
- **Covered Shelter $40/day** (includes shelter, table, BBQ grill); "Shelters by reservation only (See Staff to check availability)"
- **Annual Pass (TAP) $99–$199/year** → `https://discovertexoma.com/tap`
- Kayak: **Single $25/hr, Double $40/hr** (life jackets & paddles included); SUP **$25/hr**
- **Private Guided Paddle Trips $150 up to 6 people; $49 each additional**; 1.5 hours; solo kayak/SUP age 8+, all ages on double with adult
- Private beachside picnic boat trips via Fastrac Cruises; corporate events, weddings, reunions → `https://texomadestinations.com/events/`
- Rules: no glass; pets leashed, "No aggressive breeds"; parking designated (yellow) areas; no firearms/fireworks/open fires; "NO LIFEGUARD OR DESIGNATED SWIM AREA, SWIM AT YOUR OWN RISK"; pick up after yourself
- Refunds (from Lighthouse's Island View page): "no refunds for late arrivals or early departures… no refund for adverse or inclement weather"
- Seasonal banner: "IT'S ISLAND VIEW SEASON!👉 The best spots don't wait. Book early. Show up ready. Enjoy every second." (undated)
- Property map page: "Media not available" placeholder (map image `https://islandviewtexoma.com/wp-content/uploads/2023/07/property-map-islandview.png` exists in media library but is not rendering)

## Outbound links & CTAs
- `https://islandviewtexoma.com/reserve/cart/add/islandview-day-pass`; `/reserve/`
- `https://discovertexoma.com/tap` (Annual Pass)
- `https://texomadestinations.com/events/`
- `http://reserve.texomadestinations.com` (footer "Book Online" alt — redirects to texomadestinations.com home)
- Network six + `https://dreamlandcatering.com`
- Logo hot-link from discovertexoma.com

## Brand voice / visual
- Voice: punchy, urgent, beach-party ("The best spots don't wait."), ALL-CAPS rule lines.
- Logo: `https://islandviewtexoma.com/wp-content/uploads/2017/03/IslandViewLogoNEW-uai-258x133.png`; full-size `https://islandviewtexoma.com/wp-content/uploads/2017/03/cropped-IslandViewLogoNEW.png` (1541×514); icon `.../cropped-IslandViewLogoNEW-270x270.jpg`
- Colors/fonts not extractable.

## Problems
1. Fact conflicts with Lighthouse's Island View page (kids free age 7 vs 3; shelter $40 vs $20–$40).
2. TAP price "$99–$199" not corroborated on the TAP page (no prices there).
3. Property map "Media not available".
4. Dead alt-booking host `reserve.texomadestinations.com`.
5. Mixed http/https footer links; users sitemap exposed.
6. Only 4 pages — thin content; rules duplicated between homepage and /rules/.

## Hero images worth reusing
- `https://islandviewtexoma.com/wp-content/uploads/2021/01/IMG_9357-scaled-LVsxUI.tmp_.jpg` (2560×1707)
- `https://islandviewtexoma.com/wp-content/uploads/2020/03/9F1B2F49-4306-471F-95F9-541B6D33507F-scaled-1.jpeg` (2560×1707)
- `https://islandviewtexoma.com/wp-content/uploads/2020/03/IMG-0372-scaled-1.jpg` (2560×1920)
- `https://islandviewtexoma.com/wp-content/uploads/2019/10/IMG_3439.jpg` (1920×1280)
- `https://islandviewtexoma.com/wp-content/uploads/2019/10/IMG_0312.jpg` (1920×1440)
- Homepage tiles: `https://islandviewtexoma.com/wp-content/uploads/2017/08/IMG_0595-1024x768.jpg`, `.../2017/08/IMG_0414-1024x768.jpg`, `.../2017/08/IMG_6422-1024x683.jpg`, `.../2017/08/2651-1024x683.jpg`, `.../2017/08/265-1024x683.jpg`, `.../2017/03/IV_Six-1024x768.jpeg`
- Map: `https://islandviewtexoma.com/wp-content/uploads/2023/07/property-map-islandview.png` (1236×1600)

---

# 4. sundancetexoma.com — Sundance Camp

## Status — exactly what happened
| Probe | Result |
|---|---|
| `https://sundancetexoma.com` (WebFetch) | Fetch completes but content is reported as **"[binary data]"** — unparseable; no title, no status surfaced. Same for `https://www.sundancetexoma.com/`, `/?nocache=1`, and `/?p=65941` (the homepage post ID). |
| `http://sundancetexoma.com` (WebFetch) | WebFetch auto-upgrades to https → same binary result. |
| curl `https://` / `http://` / `www.` (sandbox) | Blocked by org egress proxy: `curl: (56) CONNECT tunnel failed, response 403` / `HTTP 403 Host not in allowlist: sundancetexoma.com`. **DNS resolves:** `sundancetexoma.com` and `www.sundancetexoma.com` → **64.225.10.7** (DigitalOcean range). No independent status code obtainable. |
| `https://sundancetexoma.com/property/` | **200 OK**, renders normally (title "Property – Sundance Camp::Texoma's Glamping and Tiny Cabin Village"). |
| `/rules/`, `/reserve/`, `/cabin-1/`, `/?s=cabin` | **200 OK**, render normally. |
| `/robots.txt`, `/sitemap.xml`, `/wp-json/` | **200 OK**. |
| `/wp-json/wp/v2/settings` | 401 (expected, auth-only). |
| Wayback availability API `archive.org/wayback/available?url=sundancetexoma.com&timestamp=20251231` and `…=20250701` | Both return closest snapshot **`http://web.archive.org/web/20260309123845/https://sundancetexoma.com/`**, timestamp **20260309123845**, status **200** — i.e. **no 2025 snapshot is the closest; the nearest archived copy is 2026-03-09 and it captured a 200**. Fetching the snapshot itself (`web.archive.org`) is blocked by the proxy (403), so snapshot *content* could not be read. |

**Interpretation:** The server, DNS and WordPress are up; **only the homepage (post 65941) fails to deliver parseable HTML** — every other front-end page is fine. This is consistent with a homepage-specific fatal (e.g. the 8 Slider Revolution sliders `header/heading/stay/accommodations/photos/activities/events/contact` on that page, or an output-buffer/encoding fault), not a whole-site outage. Note `paradisetexoma.com/things-to-do/` exhibits the identical "binary data" symptom, so it may also be a fetcher/compression artifact — **needs a manual browser check of the homepage before declaring it a 500.** All homepage content below was recovered from the WordPress REST API (`/wp-json/wp/v2/pages/65941`).

## Platform
WordPress; **Uncode theme** (Visual Composer `[vc_row][vc_column]`, `uncode_block`, `back_image` attrs); **Slider Revolution 7.1.4**; Contact Form 7; The Events Calendar (`tribe/events/v1`, `tec/v1`, `tec/v2` — 0 events); WP 2FA (`wp-2fa-methods/v1`, `wp-2fa-passkeys/v1`); Site Kit; `td-reservations` (`[tdr_reservations]`); GTM **GTM-P84RW98N**. Site title: "**Sundance Camp::Texoma's Glamping and Tiny Cabin Village**"; tagline "The perfect escape for authentic Lake Texoma adventures". Homepage last modified **2021-06-25**; newest edit `/property/` **2022-05-24**.

## Discovered URLs
Nav: `https://sundancetexoma.com/` (Home) · `/property/` · `/rules/` (labelled "Policies") · `/reserve/` (Book Online) · `https://discovertexoma.com/tap/` (TAP Pass) · `/reserve/cart/` · `/reserve/account/profile`
Sitemap index `https://sundancetexoma.com/sitemap.xml` →
- `wp-sitemap-posts-page-1.xml`: `/reserve/` (2022-03-17), `/rules/` (2022-05-14), `/property/` (2022-05-24), `/` (2021-06-25), **`/siesta/`** (2021-04-02), `/property-map/` (2021-06-25)
- `wp-sitemap-posts-post-1.xml`: `/cabin-1/` … `/cabin-7/` (2021-07-09 / 2022-04-01)
- `wp-sitemap-taxonomies-category-1.xml`, `wp-sitemap-users-1.xml`
Footer: six network links (texomadestinations, discovertexoma, lighthouseresort, paradisetexoma, fastrac, islandviewtexoma).

## Business identity
| Field | As written |
|---|---|
| Name | **Sundance Camp** / "Sundance Camp on Lake Texoma"; footer "© 2019 Sundance Camp :: a member of Texoma Destinations" |
| Address | "**295 Glen Eden Drive, Pottsboro, TX 75076**" (property-map page); "approximately 15 minutes North of Pottsboro, TX on State Highway 289"; "at the tip of Preston Point"; GPS **33.877832, -96.636237**; `https://goo.gl/maps/7raH3tg6LpHN5yai7`; rules page map link `https://goo.gl/maps/iyRmbABrLzn` |
| Phones | **(903) 361-8500** (footer); **`tel:19033618810`** on `/reserve/` (**different number — 903-361-8810**) |
| Email | **info@sundancecamp.com** (note: **sundancecamp.com**, not sundancetexoma.com) |
| Hours | none; "Check-in at Lighthouse Resort & Marina after 3pm" |
| Social | Instagram `http://instagram.com/sundancetexoma` only |

## Factual claims
**Property**
- "Where Rustic Meets Luxury"; "Explore Lake Texoma with Sundance Camp"
- "Sundance Camp is **80 acres** of magnificent waterfront beauty… The property has a village of **7 tiny cabins**, **7 wooded and secluded rv sites**, and a primtive camping area." (sic)
- "Even though the property is 80 acres, its small number of cabins and RV sites – seven of each – lend a feeling of being totally disconnected."
- "The beachy shoreline has large fire pits and a sand volleyball court. Just a step away from the Tiny Cabin Village is a modern bathhouse and pavilions can be found throughout the park."
- "We can sleep groups of **50+** within the Tiny Cabin Village, RV Sites, and Primitive Camping Areas and host gatherings for up to **100**."
- "We can arrange (for a fee) locally-sourced meals such as Campfire Dinners, Beachside Picnics, & Breakfast." ("Chef-Crafted Meals Available")
- Footer descriptor: "An exclusive escape in a secluded and gated setting on the shores of Lake Texoma. A Camping, Glamping, Tiny Home Village and Outdoor Event Space Destination."
- Concierge: in-room massages; golf cart rentals; kayak/SUP rentals "Lighthouse Marina, Island View Park"

**Tiny cabins (7) — from posts**
| # | Name | Beds | Sleeps | Notes |
|---|---|---|---|---|
| 1 | Pecos | King | 2 | small fridge, coffee pot, rustic |
| 2 | Glorietta | King | 2 | shabby chic |
| 3 | Rosa Linda | King | 2 | bright & airy |
| 4 | Arroyo | 2 Full | 4 | rustic |
| 5 | Pinion House | Queen | 2 adults | small fridge, microwave, modern |
| 6 | Ponderosa | 4 Twin | 4 | treehouse/fort design |
| 7 | Cottonwood | Full + Twin | 2 adults, 1 child | |
- All: "Bathroom Nearby"; AC/heat, filtered water, microwave, nearby showers
- Pricing: "**Starting at $159/night**" (property) vs "**$150-$400/night**" (rules); rollaway **+$100** (cabins 1–3 only); children under 6 free; pets **$35/pet**, max 2, no aggressive breeds

**RV sites (7)**
- "Starting at **$45/night**" (property) vs "**$40-$240/night**" (rules); 30A electric, water, picnic table, fire pit, rock pad; **max 30-foot RV**; "up to 4 adults, 6 persons maximum" (property) vs "Max Occupancy at RV Sites is 4 people" (rules) — **CONFLICT**; no tents in RV area; pets leashed, max 2

**Primitive camping**
- "**$20/night per person**" (strictly enforced); no designated sites; min 100 ft from shoreline/cliffs; max 8-person tents; fire rings only; tents min 100 ft from cabins/RV sites

**Check-in / out**
- Property page: "Check-in: After **3pm Friday**"; "Check-out: **11am Sunday**"; "Stay-N-Play" **$50** extends checkout to 6pm
- Rules page: "Check-in at Lighthouse Resort & Marina after 3pm"; "Check-Out time is **12pm**, except Sundays where late checkout is **5p**" — **CONFLICT** with property page
- $250 deposit for cash; full payment at check-in; 2-night min peak (Apr–Oct, spring break); 3-night holidays; min age **25**
- Cancellation: "Once booked, your are responsible for your entire stay. No refunds or changes may be made." (sic); 3+ properties non-refundable; no refunds for weather/mechanical/emergencies/pests
- Rules: quiet 11p–7am; max 2 vehicles/site; registered guests only, no outside visitors; no inflatable/portable pools; golf carts OK, no ATVs/SxS

**Sample weekend itinerary (property page — priced)**
- Fri: Sunset Cruise **$35pp** ("departs Lighthouse Resort & Marina" — Lighthouse's page says Highport Marina); campfire w/ gourmet s'mores package **$125**
- Sat: Breakfast **$19pp** (8–9am); Beach Picnic **$34pp** (noon); Campfire Dinner **$39pp** (heat-and-eat); s'mores **$125**
- Sun: Early Bird Breakfast **$12pp** (breakfast burrito); check-out 11am
- Fastrac: Lake History & Sightseeing Tour (90 min); boat rides hourly 2–16 ppl; Romantic Dinner Cruise "Four Course Meal" → `https://fastrac.com/cruises/`
- Fishing guides → `https://discovertexoma.com/lake-texoma/fishing-guide/`

**Siesta page (`/siesta/`)** — "We're almost ready for **2021 launch!** … Stay tuned… Until then, join us at one of our other properties on Texoma." Links to paradisetexoma.com and lighthouseresort.com. **Still published and in sitemap (5 years stale).**

**TAP** — nav "TAP Pass" → `https://discovertexoma.com/tap/`; no TAP text in page content.

## Outbound links & CTAs
- Booking: `https://sundancetexoma.com/reserve/` (all cabin "Book Now"), `/reserve/cart/`, `/reserve/account/profile`; phone CTA `tel:19033618810`
- `https://texomadestinations.com/events/` (homepage events CTA)
- `https://discovertexoma.com/tap/`; `https://discovertexoma.com/lake-texoma/fishing-guide/`
- `https://fastrac.com/cruises/`
- `https://paradisetexoma.com`, `https://lighthouseresort.com` (siesta page)
- Network six in footer; logo hot-linked from discovertexoma.com

## Brand voice / visual
- Voice: boutique/"glamping" luxury-rustic, exclusivity, curated ("Where Rustic Meets Luxury", "feeling of exclusivity", "Chef-Crafted Meals", "concierge", "Secluded and Private Escape", "Activity Options Abound"); Southwestern cabin names (Pecos, Glorietta, Rosa Linda, Arroyo, Pinion, Ponderosa, Cottonwood).
- Logo: none of its own found — uses the network `td_brand.png`. Reserve page background image ID 66063 = `https://sundancetexoma.com/wp-content/uploads/2019/04/IMG_4357_Facetune_28-01-2019-17-49-02.jpg` (drone shot).
- Colors/fonts not extractable.

## Problems
1. **Homepage does not deliver parseable HTML** (all other pages fine) — top priority to verify/repair; treat as effectively down for first-time visitors.
2. Copyright "© 2019"; content last touched 2022; `/siesta/` "2021 launch" page still live.
3. Email domain mismatch `info@sundancecamp.com`; phone mismatch 903-361-8500 vs `tel:19033618810`.
4. Pricing/policy conflicts between `/property/` and `/rules/` (cabin $159 vs $150–$400; RV $45 vs $40–$240; checkout 11am Sun vs 12pm/5pm Sun; RV occupancy 4 vs 6/4 adults).
5. Sunset cruise departure point conflicts with Lighthouse site.
6. Check-in physically at Lighthouse Resort (different property, ~different address) — must be explicit on any new landing page.
7. Typos: "primtive", "your are responsible".
8. No own logo; `/property-map/` map images are attachment IDs 65817/65816 (`SundanceMap-copy.jpg`, `SundanceTinyHomeVillage.png`).
9. Users sitemap exposed; `wp-sitemap-taxonomies-category-1.xml` present.

## Hero images worth reusing
- `https://sundancetexoma.com/wp-content/uploads/2019/04/IMG_4357_Facetune_28-01-2019-17-49-02.jpg` (drone/aerial, reserve page background)
- `https://sundancetexoma.com/wp-content/uploads/2021/05/1-1-scaled.jpg` (2560×1920) … through `1-16-scaled.jpg` (2021 gallery set, e.g. `1-5-scaled.jpg` 2560×1707, `1-10-scaled.jpg` 2560×1706, `1-11-scaled.jpg`, `1-13-scaled.jpg`)
- `https://sundancetexoma.com/wp-content/uploads/2019/02/Pecos.jpg` (1284×962)
- `https://sundancetexoma.com/wp-content/uploads/2019/02/Cottonwood.jpg` (1284×856)
- `https://sundancetexoma.com/wp-content/uploads/2019/04/IMG_2005.jpg` (Ponderosa), `.../2019/04/IMG_1988-2.jpg` (Arroyo), `.../2019/04/78270.jpg` (Rosa Linda), `.../2019/04/99318.jpg` (Glorietta), `.../2019/02/IMG_1141.jpg` (Pinion House)
- Maps: `https://sundancetexoma.com/wp-content/uploads/2019/03/SundanceMap-copy.jpg`, `https://sundancetexoma.com/wp-content/uploads/2019/03/SundanceTinyHomeVillage.png`

---

## Fact-reconciliation hot list (conflicts to resolve before consolidation)
| Fact | Source A | Source B |
|---|---|---|
| Lighthouse nightly transient slip | $40 (`/cabins/`) | $25.00 covered (`/rules/`) |
| Lighthouse Lodge capacity / deck | 75 ppl, 800 sq ft porch (`/lighthouse-lodge`) | 1,200 sq ft deck (`/event-space/`); 80 ppl (texomadestinations.com/events) |
| Fireside capacity | ~36 (`/event-space/`) | 25 (texomadestinations.com/events) |
| Island View kids free age | 7 and under (islandviewtexoma.com) | under 3 (lighthouseresort.com/activity/island-view/) |
| Island View shelter | $40/day (islandviewtexoma.com) | $20–$40 (lighthouseresort.com) |
| Paradise day-use fee | $7 (`/rules/`) | $10 (things-to-do block) |
| Paradise RV hookups | "full hook-up, 50amp available" (home) | RV #22: 30 amp, water only |
| Paradise glamping inventory | 4 Kabanas + 6 Kasitas (home) | +10 Kimas (unit pages) |
| Paradise RV count | 40 sites (home) | 29 site pages; #43 absent |
| Paradise address suffix | "Dr." | "Rd." / "Road" |
| Sundance cabin price | from $159 (`/property/`) | $150–$400 (`/rules/`) |
| Sundance RV price | from $45 | $40–$240 |
| Sundance checkout | 11am Sunday (`/property/`) | 12pm; Sunday 5pm (`/rules/`) |
| Sundance RV occupancy | 6 max / 4 adults | "4 people" |
| Sundance phone | (903) 361-8500 | tel:19033618810 |
| Sundance email domain | sundancecamp.com | (site is sundancetexoma.com) |
| Sunset cruise departure | Highport Marina (Lighthouse) | Lighthouse Resort & Marina (Sundance) |
| TAP price | $99–$199/yr (Island View) | not stated (texomadestinations.com/tap) |
| TAP name | "TAP Pass" / "Texoma Adventure Pass" (legacy) | "Texoma Access Package" (texomadestinations.com/tap) |
| Primitive camping price | Paradise $30/tent | Sundance $20/person |
