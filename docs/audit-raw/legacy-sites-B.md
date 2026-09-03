# Legacy Site Audit — Batch B
Audited 2026-09-03 via WebFetch (HTML-to-text crawler). Note: direct curl from the audit container was blocked at the egress proxy (403 on CONNECT), so raw CSS/theme paths, hex colors and HTTP headers could not be inspected; "platform hints" below come from meta tags, asset paths and markup surfaced by the fetcher. All four domains resolve to the same IP (64.225.10.7), i.e. one shared host.

Sites covered:
1. https://tackleboxtexoma.com
2. https://fastrac.com
3. https://boaterwise.com
4. https://texomawatertaxi.com

---

## 1. tackleboxtexoma.com — Tackle Box Outfitters on Lake Texoma

### Status / platform
- **Status:** UP (200), HTTPS OK. Single-page site.
- **Platform:** WordPress. Generator meta: `Slider Revolution 7.1.4`. Image sizes with `-uai-258x92` suffix indicate the **Uncode** theme (Undsgn adaptive images) — same fingerprint as fastrac.com and boaterwise.com.
- **robots.txt:** `User-agent: SemrushBot / Disallow: /` only.
- **Sitemap:** `https://tackleboxtexoma.com/sitemap.xml` (WP core sitemap index) → sub-sitemaps:
  - `/wp-sitemap-posts-post-1.xml` → `https://tackleboxtexoma.com/2015/03/03/hello-world-2/` (lastmod 2015-03-02) — default WP "Hello World" post still published
  - `/wp-sitemap-posts-page-1.xml` → `https://tackleboxtexoma.com/` (lastmod **2018-10-21**)
  - `/wp-sitemap-taxonomies-category-1.xml`, `/wp-sitemap-taxonomies-page_category-1.xml`, `/wp-sitemap-users-1.xml` (user sitemap exposed — minor privacy/SEO hygiene issue)

### Discovered URLs (complete)
| URL | Source |
|---|---|
| https://tackleboxtexoma.com/ | home / nav "Home" |
| https://tackleboxtexoma.com/2015/03/03/hello-world-2/ | sitemap (orphan post) |
| https://shoponline.tackleboxtexoma.com/ | nav/CTA "Shop Online" — **DNS does not resolve (NXDOMAIN) — broken** |
| https://reserve.texomadestinations.com/ | nav "Book Online" (302 → https://texomadestinations.com/) |
| tel:19033618500 | nav "Call Us" |
| https://discovertexoma.com/tap/ | nav "TAP Pass" (302 → https://texomadestinations.com/tap) |

### Business identity
- **Name as written:** "Tackle Box Outfitters on Lake Texoma"; tagline "Lake Texoma's Fishing and Outdoor Headquarters"
- **Address:** 21 Tackle Box Dr, Pottsboro, TX 75076
- **Phone (displayed):** 903.786.9010
- **Phone (tel: link in nav):** 1-903-361-8500 (Texoma Destinations main line) — **mismatch** between displayed number and click-to-call number
- **Email:** none
- **Hours:** none listed
- **Social links:** none

### Factual claims (all of them — the page is thin)
- "your one stop Lake Texoma Outfitter for everything you need for a day on the lake"
- "Lake Texoma's Fishing and Outdoor Headquarters"
- Shop Online CTA → shoponline.tackleboxtexoma.com (dead)
- TAP Pass CTA. (TAP page on texomadestinations.com lists "The Tackle Box" retail discounts 5–10% and fuel savings by tier.)
- **No** inventory categories, fuel, live bait, boat rental, guide, or slip info is stated anywhere on the site. All store facts must come from other sources.

### Outbound links / CTAs (exact)
- https://texomadestinations.com (brand bar)
- https://discovertexoma.com (brand bar)
- https://lighthouseresort.com
- https://paradisetexoma.com ("this is Paradise")
- https://fastrac.com ("Fastrac Cruises")
- https://islandviewtexoma.com ("Island View")
- https://reserve.texomadestinations.com/ ("Book Online")
- https://shoponline.tackleboxtexoma.com/ ("Shop Online")
- https://discovertexoma.com/tap/ ("TAP Pass")
- tel:19033618500

### Brand voice / visual
- Voice: terse, utilitarian, "headquarters / one-stop outfitter" framing. Essentially a splash page.
- Logo: https://tackleboxtexoma.com/wp-content/uploads/2016/02/TackleBoxLogo-uai-258x92.png
- Texoma Destinations brand bar image: https://discovertexoma.com/wp-content/uploads/2017/01/td_brand.png (hot-linked cross-domain)
- Colors/fonts: not inspectable via fetcher.

### Problems
1. **Shop Online CTA is dead** — `shoponline.tackleboxtexoma.com` has no DNS record.
2. Two different phone numbers (903.786.9010 shown vs tel:19033618500 linked).
3. Content last modified 2018-10-21; slider images from 2018/02; default "Hello World" post still live.
4. Copyright "© 2026" is auto-generated, masking the staleness.
5. Cross-domain hot-linked brand image from discovertexoma.com; "Book Online" and "TAP" links both bounce through 302 redirects (reserve.texomadestinations.com → texomadestinations.com; discovertexoma.com/tap/ → texomadestinations.com/tap).
6. No hours, no email, no social, no product info, no schema markup — near-zero SEO value.
7. Users sitemap exposed.

### Hero / media worth reusing (Slider Revolution, all 2018/02)
- https://tackleboxtexoma.com/wp-content/uploads/2018/02/TB1-b-1.jpg
- https://tackleboxtexoma.com/wp-content/uploads/2018/02/TB1-b-2.jpg
- https://tackleboxtexoma.com/wp-content/uploads/2018/02/TB1-b-3.jpg
- https://tackleboxtexoma.com/wp-content/uploads/2018/02/TB1-b-4.jpg
- https://tackleboxtexoma.com/wp-content/uploads/2018/02/TB1-22.jpg
- https://tackleboxtexoma.com/wp-content/uploads/2018/02/TB1-21.jpg
- (also TB1-4, -5, -6, -7, -11, -12, -13, -14, -17, -18, -19, -20 .jpg in the same folder)

---

## 2. fastrac.com — Fastrac Charters and Cruises

### Status / platform
- **Status:** UP, HTTPS OK. Most content-rich of the four.
- **Platform:** WordPress + **Uncode** theme (`-uai-` image suffix), Slider Revolution 7.1.4, **WooCommerce** (shop/cart/checkout/my-account, `add-to-cart=` IDs), **Chauffeur Booking System (chbs)** plugin for water-taxi booking (`chbs_vehicle_c` taxonomy; `/booking/` 4-step form with PayPal + Stripe), **Instagram Feed** plugin (Smash Balloon; placeholders rendering), **Search & Filter Pro** (`/search/?_sft_post_tag=`), TripAdvisor widget, **Google Tag Manager `GTM-NL4CPNS4`**, and a **custom Texoma Destinations reservation app** at `/reserve/` (`meta-tec-api-version: v1`, assets under `/td-reservations/dist/assets/images/dt_logo.png`).
- **robots.txt:** `User-agent: SemrushBot / Disallow: /`.
- **Title tag:** "Fastrac Charters and Cruises :: Cruises, Charters, Tours, Experiences on Lake Texoma – Public Cruises and Private Charters, Lake Tours, Water Taxi Service on Lake Texoma"

### Discovered URLs (complete, with sitemap lastmod)
**Pages (`/wp-sitemap-posts-page-1.xml`)**
| URL | lastmod |
|---|---|
| https://fastrac.com/ | 2022-07-16 |
| https://fastrac.com/public-cruises/ | 2025-12-30 |
| https://fastrac.com/private-charters/ | 2022-05-26 |
| https://fastrac.com/experiences/ | 2022-07-12 |
| https://fastrac.com/search/ | 2019-10-17 |
| https://fastrac.com/contact/ | 2021-02-12 |
| https://fastrac.com/events/ | 2019-09-26 |
| https://fastrac.com/themed-cruises/ | 2019-09-24 |
| https://fastrac.com/reserve/ | 2022-05-26 |
| https://fastrac.com/shop/ | 2018-06-27 |
| https://fastrac.com/cart/ | 2018-06-27 |
| https://fastrac.com/checkout/ | 2021-02-07 |
| https://fastrac.com/my-account/ | 2018-06-27 |
| https://fastrac.com/booking/ | 2022-07-08 |
| https://fastrac.com/rules/ | 2019-10-02 |

**Cruise posts (`/wp-sitemap-posts-post-1.xml`)**
| URL | lastmod |
|---|---|
| https://fastrac.com/cruises/texie-cruise/ | 2026-06-13 |
| https://fastrac.com/cruises/eagle-watching-breakfast-cruise/ | 2026-05-19 |
| https://fastrac.com/cruises/lake-tour-experience/ | 2026-03-20 |
| https://fastrac.com/cruises/murder-mystery-cruise/ | 2026-03-18 |
| https://fastrac.com/cruises/cupids-arrow-dinner-cruise/ | 2025-12-30 |
| https://fastrac.com/cruises/lake-day-experience/ | 2025-01-02 |
| https://fastrac.com/cruises/boat-ride/ | 2024-08-02 |
| https://fastrac.com/cruises/mothers-day-brunch-cruise/ | 2024-06-12 |
| https://fastrac.com/cruises/sightsandsips/ | 2024-02-05 |
| https://fastrac.com/cruises/sight-sea-er/ | 2022-07-08 |
| https://fastrac.com/cruises/island-girl/ | 2022-07-08 |
| https://fastrac.com/cruises/last-call-private/ | 2022-07-08 |
| https://fastrac.com/cruises/last-call-romantic/ | 2022-07-08 |
| https://fastrac.com/cruises/water-taxi/ | 2022-06-18 |
| https://fastrac.com/cruises/dinner-cruise-experience/ | 2022-05-26 |
| https://fastrac.com/cruises/sunset-cruise-experience/ | 2022-05-26 |

**WooCommerce products (`/wp-sitemap-posts-product-1.xml`)**
- https://fastrac.com/product/mellow-yellow-water-taxi/ (2020-05-14)
- https://fastrac.com/product/jolt-water-taxi/ (2020-07-02)
- https://fastrac.com/product/dinner-cruise-gift-card/ (2023-12-05)
- https://fastrac.com/product/eagle-watching-cruise-for-two-gift-card/ (2019-11-21)
- https://fastrac.com/product/50-gift-card/ (2019-11-21)
- https://fastrac.com/product/murder-mystery-cruise-for-two-gift-card/ (2019-12-18)

**Other sitemaps:** taxonomies category / post_tag / product_cat / product_tag / page_category / `chbs_vehicle_c` (→ https://fastrac.com/cruises/chbs_vehicle_c/water-taxi/), users-1.xml (exposed).

**Nav/UI links:** https://fastrac.com/experiences/, /public-cruises/, /private-charters/, /cruises/water-taxi/, /events ("Calendar"), /reserve ("Book Online"), /reserve/cart/, /reserve/account/profile, tel:19033618500, tel:9033610775, https://discovertexoma.com/tap/ ("TAP Pass"), https://goo.gl/maps/wvksdupFzYA2 (address map), tag filters https://fastrac.com/search/?_sft_post_tag={romantic|friends|small-group|medium-group|large-group}.
- https://fastrac.com/water-taxi/ (linked from texomawatertaxi.com) serves the **homepage**, not the water-taxi page — soft redirect/misrouted link.

### Business identity
- **Name as written:** "Fastrac Charters and Cruises" (also "Fastrac Charters & Cruises", "Fastrac Cruises", "Fastrac Charters"); legal: "Texoma Destinations, LLC dba Fastrac Charters and Cruises"
- **Tagline:** "Lake Texoma's Cruise, Charter, Tour, & Water Taxi Service"; positioning line: "Fastrac Charters is Lake Texoma's only charter service."
- **Address:** 300 Lighthouse Drive, Suite B, Pottsboro, TX 75076. Departure point: "Lighthouse Marina Charter Dock at 300 Lighthouse Drive, Pottsboro, TX 75076". Alt departure (Boat Ride): Highport Marina, 120 Texoma Harbor Rd, Pottsboro, TX 75076.
- **Phones:** (903) 361-0775 (charter coordinators / primary), (903) 361-8500 (TD main, tel:19033618500), 903.200.1408 (private charter appointments/quotes), text 903-414-6050 (water taxi captain)
- **Email:** none published
- **Hours:** none published; water taxi "sunrise to sunset" (night with surcharge)
- **Social:** https://www.facebook.com/fastraccruises, https://www.facebook.com/fastraccharters, https://www.instagram.com/fastraccruises/, http://instagram.com/fastraccharters, http://instagram.com/discovertexoma, http://twitter.com/discovertexoma, https://www.tripadvisor.com/ (generic, not a listing)
- **Copyright:** "Copyright © 2017 Texoma Destinations, LLC dba Fastrac Charters and Cruises. All Rights Reserved." (**stale hard-coded 2017**)

### Homepage claims
- "We feature sunset & dinner cruises, themed parties, and private charters. We also offer water taxi service from anywhere on Lake Texoma, Lake History tours, anf day trips on the lake lounging." (typo "anf" live on site)
- Featured cards: Discovering Texie Cruise, Eagle Watching Breakfast Cruise, Lake Tour Experience, Murder Mystery Cruise, Cupid's Arrow Dinner Cruise, Lake Day Experience
- Related brands in footer: Texoma Destinations, Discover Texoma, Lighthouse Resort & Marina (http://lighthouseresort.com), this is Paradise (http://paradisetexoma.com), Island View (http://islandviewtexoma.com), Dreamland Catering (http://dreamlandcatering.com) — several footer links are **http://** not https.
- Instagram embeds: https://www.instagram.com/reel/DTL120NiJUu/, /reel/DS5ZMqoCsQS/, /p/DSoIGOmDTcc/, /p/C-TRa5TSOH-/, /p/C-GcBL8SfO3/, /p/C-DgfRjuhZ2/ (feed shows placeholder.png — widget not rendering images)

### Public Cruises page
- "Ticketed Sunset Cruises, Dinner Cruises, & Lake Tours"
- "We have public cruises nearly year-round…"
- Most popular: Sunset Dinner Cruises, Lake History Tours, Eagle Watching Breakfast Cruises
- "Our cruise schedule is updated frequently and most of the time, we post it approximately one month before (April's Cruises are posted in March, etc)."
- "During the Peak Season (May-Sep), we have cruises every Friday and Saturday night" except when pre-scheduled private charters are booked; lake tours nearly year-round depending on captain availability.

### Private Charters page
- For "Corporate Events, Weddings/Receptions, Celebrations, Reunions, Parties"; "choose the date, the time, the menu, and bring as few or as many guests as you choose (depending on the vessel's capacity, of course)."
- Trip types hosted: corporate outings, birthdays, anniversaries, weddings/receptions, team building, prom, fraternity/sorority, lake days with swimming.
- CTA "Private Charter & Event Contact" → https://fastrac.com/contact/ (form: Event Type; Event Location options incl. Lighthouse Resort & Marina, Fastrac Charters, Sundance Camp, Paradise on Lake Texoma, Island View Park; Event Size 1-6 … 200+; Event Date; newsletter opt-in; preferred contact).

### Cruise catalogue — exact figures
| Cruise | Price | Duration / schedule | Vessel / capacity | Included | Age | Cancel | Book CTA |
|---|---|---|---|---|---|---|---|
| Discovering Texie Cruise | $19.44/person (adults & kids) | 1.5 hr | — | storytelling, "Magical Surprises Along the Way", light brunch; Texie the Dragon = "Lake Texoma's official mascot" | family | 72 hr | https://fastrac.com/reserve/ |
| Eagle Watching Breakfast Cruise | $59/person; 3 & under free | 2 hr; Saturdays + select Sundays 8:00–10:00 AM; January–February | climate-controlled vessel | eggs, bacon, biscuits & gravy, fruit, pastries, coffee, hot chocolate, hot apple cider, mimosa & Bloody Mary setups; BYOB; "600+ bird species" | all | 72 hr | javascript:void(0) button (broken/JS) |
| Lake Tour Experience | Ticketed $30/person; Private on Mellow Yellow $200 up to 6 + $20/pp 7–18; Private on Sight-Sea-Er $450 up to 12 + $20/pp 13–36; boxed lunch +$15/pp | 90 min | Mellow Yellow max 18; Sight-Sea-Er max 36 (page says 36; vessel page says 37) | narrated history, marinas, million-dollar homes, Denison Dam, islands; BYOB | all ages, infants count | 72 hr | https://fastrac.com/reserve/ |
| Murder Mystery Cruise | $79/adult | 2 hr (1.5 hr cruise + dinner) | — | dinner + dessert; BYOB; themes: Wall Street Scandal (1980s), Masquerade Murder, Welcome to the Family (1920s mob), Red Carpet Revenge (1940s Hollywood) | adults only | 72 hr | https://fastrac.com/reserve/ |
| Cupid's Arrow Dinner Cruise | $85/person; add-on rose bouquet + sparkling beverage $100; cabins from $100/night | 1.5 hr | — | wedge salad; 14 oz Wagyu NY strip w/ shrimp, or lemon butter garlic chicken w/ shrimp, or vegetarian baked potato; wild rice, broccoli; chocolate cake w/ strawberries; tea/soda/water; BYOB | "sorry, no children" | 72 hr | JS button |
| Dinner Cruise Experience | Adults $60; children 3–12 $40 | 1.5 hr; Friday & Saturday nights | Island Girl | dinner, dessert, iced tea, water, sodas; BYOB; Little Mineral area sunset | 3–12 child rate | 72 hr | https://fastrac.com/reserve/ |
| Sunset Cruise Experience | $35 all ages | 1.5 hr; Saturday nights, "this summer" | Sight-Sea-Er II | BYOB; gourmet sandwiches/snacks sold onboard; **outside food/drink prohibited** (conflicts with BYOB coolers rule) | all | 72 hr | https://fastrac.com/reserve/ |
| Sights & Sips Cruise | Adults $49; 12 & under $39 | 1.5 hr; weekends | — | light snacks, sodas, water, tea; BYOB | — | 72 hr | link loops to same page |
| Mother's Day Brunch Cruise | Adults $59; children 4–12 $39 | 2 hr | — | fruit, mini quiche, biscuits & gravy, sausage, mini pancakes, parfait, bagel bar w/ salmon; coffee, mimosa/Bloody Mary setups; BYOB | 4–12 child rate | 72 hr | https://fastrac.com/reserve/cart/add/cruise/1649 |
| Lake Day Experience (private) | $1,000 up to 12; $40/pp 13–36 | 4 hr, anytime | Sight-Sea-Er or Mellow Yellow; groups 6–36 | secluded beach, USCG captain + crew; add-ons kayaks, catering | — | **14 days** | https://fastrac.com/booking/ |
| Boat Ride Experience (private) | $150/hr up to 6; $20/pp 7–18 | 1–6 hr, daily | — | captain, custom itinerary (celebrity homes, dam, swimming); BYOB; pickup elsewhere for fee | — | 72 hr | https://fastrac.com/booking/ |
| Last Call Private Charter | $900 up to 6 (2 hr); $50/pp 7–10 | 2 hr | "Last Call" 55′ yacht, max 10 | choice Light Appetizers / Texas BBQ / Taco Bar; soda/tea/water; BYOB | — | 14 days | https://fastrac.com/booking/ |
| Last Call Romantic Cruise | $450 | 2 hr, departs ~1 hr before sunset | Last Call, max 2 | 4-course by Bon Appetit Y'all (charcuterie, wedge salad, steak tips/chicken/salmon, 2 sides, focaccia, chocolate bundt); custom songs | couples | 14 days | https://fastrac.com/booking/ |

**Vessel pages**
- **Sight-Sea-Er II** — 55′ Trident Tritoon, up to 37 passengers; small galley, restroom, climate-controlled cabin, front/rear decks. Private charter from **$350/hr** incl. USCG captain, crew, fuel; limited catering menu; 14-day cancel; quotes 903.200.1408. Images: https://fastrac.com/wp-content/uploads/2017/08/IMG_4857-scaled.jpg, .../2017/08/FBEC9A36-3CD3-4510-96DE-5AE4B8E9BE4F_1_105_c.jpeg, .../2017/08/5F76786B-8F1E-429D-9755-31F8C79D212E_1_105_c.jpeg, .../2017/08/180038E3-1612-46B9-8387-13AA8EE9277A_1_105_c.jpeg
- **Island Girl** — "Texoma's Largest Party Boat"; "Up to 86 Passengers", "Table Seating = 48", "Receptions = 60", "Top Deck = 28", but also "70 Passengers Max Capacity" (**internal conflict 86 vs 70**); climate control, multiple restrooms, bar area w/ soft drinks/water/tea/mixers (BYOB); private from **$500/hr** incl. captain, crew, fuel; 14-day cancel. Images: https://fastrac.com/wp-content/uploads/2017/08/IslandGirlUnderway-SM.jpeg, IslandGirl-SM.jpeg, IslandGirlTopDeck-SM.jpeg, IslandGirlInteriorSocial-SM.jpeg, IMG_1020.jpg, IMG_0696.jpg, .../2017/07/DSC00724-scaled.jpg, .../2017/07/IMG_3911.jpg
- **Mellow Yellow** — covered, bench seating, "larger (and slower) boat than Jolt"; max 18.
- **Jolt** — fast, max 6 (water taxi page) / "Min: 1 Max: 8 Pax" (WooCommerce product) — **conflict**.
- **Last Call** — 55′ yacht, max 10, sound system, galley, restroom.

### Water Taxi page (https://fastrac.com/cruises/water-taxi/)
- "Like Uber... On the Water. On-demand service anywhere on Texoma. Texoma's only Water Taxi Service."
- "From HIGHPORT MARINA to/from THE ISLANDS: $25 per person (each way, all ages, sunrise to sunset)"
- "ANYWHERE ON THE LAKE: $100 per hour (up to 6) from the time we leave our dock, to the time we [return]" dock-to-dock, sunrise to sunset
- "$20 nighttime surcharge" per trip (sunset to sunrise); "$5 per person" holiday surcharge (Memorial Day, July 4th, Labor Day weekends)
- Groups >6: multiple trips or private charter; "we can accommodate groups up to 18 people"
- Boats: Jolt (max 6), Mellow Yellow
- Destinations named: Highport Marina, Island Bar & Grill, Pelican's Landing, Marina Del Rey, Flowing Wells Marina, Burns Run, Party Island, Grandpappy Marina, Island View, Lighthouse Resort, Buncombe Creek Marina, Alberta Creek Marina, Treasure Island, Wood Island
- Book: call 903.361.0775 / 903-361-8500, text 903-414-6050, online https://fastrac.com/booking/
- "Your captain can take credit card, venmo, or cash on the boat and tips are appreciated"
- "We do allow pets on Jolt, Mellow Yellow on private trips."; "Cruises depart rain or shine."; 72-hour cancellation; "Drop off or pick up at your boat"; "Overnight island camping trips"
- Images: https://fastrac.com/wp-content/uploads/2017/07/DSC04274-scaled.jpg, .../2018/06/IMG_3269-scaled.jpg, .../2017/07/DSC02236-scaled.jpg, .../2017/07/IMG_3273-scaled.jpg

### Water-taxi booking form (https://fastrac.com/booking/, chbs plugin)
4 steps: Ride Details (date, time, waypoint, pickup, drop-off, one-way/return, adults/children, extra time 0–4 hr) → Choose a Vessel → Contact Details → Summary; PayPal + Stripe. Location dropdown (verbatim): Alberta Creek Marina, Big Mineral Marina, Bridgeview Resort, Buncombe Creek Marina, Butterfly Cove, Caney Creek, Catfish Bay Marina, Cedar Bayou Marina, Cedar Mills/Pelican's Landing, Colbert Boat Club, Dam Site Boat Ramp, East Burns Run, Flowing Wells Marina, Grandpappy Point Marina, Highport Marina, Hog Island, Island View Park, Johnson Creek, Lakeside Recreation Area, Lighthouse Resort & Marina, Little Glasses Marina, Little Mineral Marina, Marina Del Rey, Mill Creek Marina, Newberry Creek, North (Party) Island, Paradise on Lake Texoma, Platter Flats Public Use Area, Rock Creek Marina, Russwood, Sanders Island View, Sunset Beach, Taylor's Island View, Texins, Texoma Marina, Treasure Island, West Beach, West Burns Run, Willow Springs Marina, Wood Island.

### WooCommerce shop (https://fastrac.com/shop/) — legacy, partly stale
- $50 Cruise Gift Card — $50.00
- Dinner Cruise for Two – Gift Card — $127.50
- Eagle Watching Breakfast Cruise for Two – Gift Card — $125.38 (2019 price; 2×$59 = $118 today)
- Murder Mystery Cruise for Two – Gift Card — $146.63 (2019 price; 2×$79 = $158 today)
- Jolt Water Taxi (Min: 1 Max: 8 Pax) — "$20 per person"; "larger boats are $25pp, some destinations have a distance surcharge"; $20 nighttime surcharge; round trip = two bookings
- Mellow Yellow Water Taxi (Min: 9 Max: 18 Pax) — $25/person; may substitute vessels/adjust times
- **Conflict:** shop says water taxi "starting at $20 per person"; water-taxi page and texomawatertaxi.com say $25 per person.

### Rules page (https://fastrac.com/rules/) — verbatim
- "Cruises depart rain or shine. Should the captain, at his sole discretion, choose to cancel the cruise due to adverse weather (such as high winds, lightning) you will be issued a full refund for the cruise, less any expenses occurred."
- Public cruises: "72 hour advance notice to avoid being charged the full amount. Cancellations received less than 72 hours prior to departure are subject to forfeiture of total payment."
- Private charters: "14 days advance notice to cancel your charter without penalty. Cancellations received less than 14 days prior to departure are subject to forfeiture of total payment."
- "The boat leaves promptly at the scheduled departure time. We start boarding 15 minutes prior to departure." Passenger Manifest with emergency contact required.
- "All of our cruises are BYOB for adult beverages. You may bring a small cooler if you wish."
- Lack-of-attendance cancellations by Fastrac → full refund (cruise pages).

### Outbound links / CTAs (exact)
Booking: https://fastrac.com/reserve/ (custom TD reservations app), https://fastrac.com/reserve/cart/, https://fastrac.com/reserve/account/profile, https://fastrac.com/reserve/cart/add/cruise/1649, https://fastrac.com/booking/, http://reserve.texomadestinations.com (footer; **http**, 302 → texomadestinations.com). TAP: https://discovertexoma.com/tap/. Brand: https://texomadestinations.com, https://discovertexoma.com, https://lighthouseresort.com, https://paradisetexoma.com, https://islandviewtexoma.com, http://dreamlandcatering.com. Map: https://goo.gl/maps/wvksdupFzYA2. No FareHarbor/Square detected.

### Brand voice / visual
- Voice: casual, playful, hospitality-forward ("Catch a Sunset, catch some fun", "Like Uber... On the Water", "super sweet and fast Jolt"); repeated superlatives "Lake Texoma's only charter service", "Texoma's Largest Party Boat", "Texoma's only Water Taxi Service".
- Logo: https://fastrac.com/wp-content/uploads/2017/07/cropped-BoatOnlyLogoSQ-270x270.png; footer TD logo https://fastrac.com/wp-content/uploads/2017/07/TD_LogoSmall320x103-uai-258x83.png
- Colors/fonts not inspectable (Uncode theme).

### Problems
1. Hard-coded "Copyright © 2017".
2. "Cruise Calendar" page (/events/) shows no calendar/events.
3. Instagram feed renders placeholder.png; TripAdvisor link goes to tripadvisor.com root.
4. Several "Reserve Tickets" buttons are `javascript:void(0)` (Eagle Watching, Cupid's Arrow, Sight-Sea-Er "Request to Book"); Sights & Sips "Book Tickets" links to itself.
5. Mixed http:// footer links; three booking entry points (/reserve/, /booking/, WooCommerce /shop/) with divergent prices.
6. Capacity conflicts: Island Girl 70 vs 86; Sight-Sea-Er 36 vs 37; Jolt 6 vs 8. Price conflicts: water taxi $20 vs $25 pp; Boat Ride $150/hr vs texomawatertaxi.com sightseeing $180/hr; Lake Tour private $200 flat vs water taxi $100/hr.
7. Sunset Cruise "outside food/drink prohibited" vs Rules "bring a small cooler".
8. Typo "anf" in homepage/experiences copy; "Sight-Sea-Er" vs "Sight-Sea-Er II" naming inconsistency.
9. Users sitemap exposed; SemrushBot-only robots.
10. /water-taxi/ (short URL used by texomawatertaxi.com) serves the homepage.

### Hero / media worth reusing
- https://fastrac.com/wp-content/uploads/2017/11/Photo_6554354_DJI_754_jpg_4715877_0_202268203628_photo_original.jpg-scaled-uai-258x194.jpg (aerial; request full-size)
- https://fastrac.com/wp-content/uploads/2017/07/DJI_0079-copy.jpg (aerial, Lake Day)
- https://fastrac.com/wp-content/uploads/2017/08/IslandGirlUnderway-SM.jpeg
- https://fastrac.com/wp-content/uploads/2017/07/DSC04274-scaled.jpg (water taxi)
- https://fastrac.com/wp-content/uploads/2017/11/IMG_4857-scaled.jpg (Sight-Sea-Er)
- https://fastrac.com/wp-content/uploads/2017/06/IMG_9274-2.jpg (eagle)
- https://fastrac.com/wp-content/uploads/2017/07/DSC02268.jpg (beach)

---

## 3. boaterwise.com — BoaterWise

### Status / platform
- **Status:** UP, HTTPS OK. Single-page site with anchor nav (#courses, #about, #contact).
- **Platform:** WordPress + Uncode theme (`-uai-` images), generator meta "Site Kit by Google 1.186.0", WPForms (contact form), booking via **Square Appointments/Classes**.
- **Meta robots: `noindex, nofollow`** — site is deliberately (or accidentally) de-indexed.
- **robots.txt:** standard WP (`Disallow: /wp-admin/`, `Allow: /wp-admin/admin-ajax.php`, `Disallow: /wp-content/uploads/wpforms/`).
- **Sitemap:** `/sitemap.xml` and `/wp-sitemap.xml` both **404** (consistent with noindex).

### Discovered URLs
| URL | Source |
|---|---|
| https://boaterwise.com/ | home |
| https://boaterwise.com/#courses, #about, #contact | nav anchors |
| https://book.squareup.com/classes/1eh14qy4eggg4k/location/LQRQ7C1M2DRSR/classes | "Book Courses" |
| https://book.squareup.com/appointments/1eh14qy4eggg4k/location/LQRQ7C1M2DRSR/services | "Book Private Classes" |
| https://app.squareup.com/appointments/book/classes/1eh14qy4eggg4k/LQRQ7C1M2DRSR/classes | secondary button |
| https://app.squareup.com/appointments/book/1eh14qy4eggg4k/LQRQ7C1M2DRSR/start | secondary button |
Square merchant ID `1eh14qy4eggg4k`, location `LQRQ7C1M2DRSR`. (Square pages not fetched — require interactive approval.)

### Business identity
- **Name:** BoaterWise; tagline "Your Course to On-Water Confidence"
- **Office:** Texoma Destinations, 21 Tackle Box Drive, Pottsboro, TX 75076
- **Training location:** Lighthouse Resort & Marina, 300 Lighthouse Drive, Pottsboro, TX 75076 (map https://maps.app.goo.gl/wN7EgJjUXuCoed9T6)
- **Phone:** 903-361-0775 (tel:9033610775)
- **Email:** none; **Hours:** none; **Social:** none
- **Copyright:** "© 2026 BoaterWise. All rights reserved"

### Factual claims
- "BoaterWise is part of the Texoma Destinations group of companies. With years of experience on the water, our team is confident, knowledgeable, and pretty fun too."
- Mission (verbatim): "Our mission is to empower individuals with the knowledge, skills, and confidence to navigate the waters safely and enjoyably. We are committed to providing accessible and comprehensive on-water education, ensuring that every boater can embark on their boating adventures with competence and peace of mind. Our dedication to safety, sustainability, and fostering a thriving boating community drives us to continually enhance our resources, support, and guidance for all those who share our passion for life on the water."
- "Your instructors are NSBC Certified and USCG Captains."
- **NSBC Certified On-Water Modules — $199 each, 3 hours, "minimum of 2 students per class and a maximum of 4":**
  1. Module 1 – Intro to Powerboating: pre-departure checklist, centering helm, shifting gears, station holding
  2. Module 2 – Precision Docking & Boat Handling: 180° turnarounds, docking port/starboard, S.C.A.N. procedures
  3. Module 3 – Open Water Boat Handling: trim, planing, ferrying, emergency stops, shoreline approaches
  4. Module 4 – Open Water Advanced Maneuvering: wave/wake crossing, person-overboard retrieval, sharp turns, avoidance
- Certificate of Completion from NSBC requires all 4 modules.
- Other: "Private Instruction on Your Boat" (no price shown); "2 Hour 'Boat Club' Course"; "Trailer like a Boss" (2 hr) — prices not listed on site (Square only).
- "We don't do instruction on boats larger than 32′" — yacht instruction referred to Jobe Marine (http://jobemarine.com).
- Fleet: "We train on 24′ Berkshire Pontoons (with more boat options coming soon)"; "The boats you'll be training on are all sold by Big Water Marine & Boat Club" (https://bigwatermarine.com).
- All training on-water and weather-dependent.
- "In Texas, Boater Education training is recommended for all boat operators and required for those born on or after September 1, 1993." Free online course link: BoatUS Foundation (https://www.boatus.org/, https://boatus.org, https://www.boatus.org/on-water).
- NSBC course reference: https://www.safeboatingcouncil.org/training/on-water-courses/boat-control-on-water-training-course/
- Partner: TowBoatUS Lake Texoma https://towboatuslaketexoma.com
- Contact form: First/Last Name, Email, Phone, Interested In [On-Water Courses / Private Instruction / I have questions (use the space below)], Comments.
- **No TAP mention, no gift cards, no testimonials, no cancellation policy on-site.**

### Outbound links (exact)
https://texomadestinations.com, https://bigwatermarine.com, https://towboatuslaketexoma.com, http://jobemarine.com, https://boatus.org, https://www.boatus.org/, https://www.boatus.org/on-water, https://www.safeboatingcouncil.org/training/on-water-courses/boat-control-on-water-training-course/, https://maps.app.goo.gl/wN7EgJjUXuCoed9T6, the four Square URLs above, tel:9033610775.

### Brand voice / visual
- Voice: warm, confidence-building, safety-first with light humor ("pretty fun too", "Trailer like a Boss").
- Logos: https://boaterwise.com/wp-content/uploads/2023/10/boaterwise_wTag_160-uai-258x38.png (with tagline), https://boaterwise.com/wp-content/uploads/2023/12/boaterwise_WhiteExceptA-uai-258x38.png (white variant → dark header), https://boaterwise.com/wp-content/uploads/2023/12/CaptainsCrest-uai-258x258.png (captain's crest badge), https://boaterwise.com/wp-content/uploads/2023/07/Unknown-1.png (likely NSBC/partner badge).
- Colors/fonts not inspectable.

### Problems
1. `noindex, nofollow` on the whole site — invisible to search.
2. No XML sitemap (404).
3. Prices missing for 3 of 6 offerings; no cancellation/weather policy stated.
4. Two different Square URL families (book.squareup.com and app.squareup.com) for the same actions.
5. Two addresses (office vs training site) can confuse map listings.
6. http:// link to jobemarine.com.

### Hero / media worth reusing (2023, recent)
- https://boaterwise.com/wp-content/uploads/2023/12/IMG_1195-scaled-uai-258x194.jpg
- https://boaterwise.com/wp-content/uploads/2023/12/IMG_0821-scaled-uai-258x194.jpg
- https://boaterwise.com/wp-content/uploads/2023/12/IMG_1233-scaled-e1702912230456-uai-258x301.jpg
- https://boaterwise.com/wp-content/uploads/2023/12/IMG_0129-scaled-uai-258x194.jpg
- https://boaterwise.com/wp-content/uploads/2023/12/CaptainsCrest-uai-258x258.png
(Request full-size originals without the `-uai-258x…` suffix.)

---

## 4. texomawatertaxi.com — Texoma Water Taxi by Fastrac

### Status / platform
- **Status:** UP, HTTPS OK. Two-page microsite; does not redirect, but all CTAs point to fastrac.com.
- **Platform:** WordPress (generator meta reads "WordPress 7.0.4"), Uncode theme (`-uai-` image on /map/). No Slider Revolution.
- **Sitemap:** https://texomawatertaxi.com/sitemap.xml → https://texomawatertaxi.com/wp-sitemap-posts-page-1.xml → `/` (lastmod 2022-06-18), `/map/` (lastmod 2019-10-12).

### Discovered URLs
| URL | Source |
|---|---|
| https://texomawatertaxi.com/ | home |
| https://texomawatertaxi.com/map/ | "Service Area" |
| https://fastrac.com/water-taxi/ | primary link (serves fastrac homepage, not the water-taxi page) |
| https://fastrac.com/booking/ | "book online" |
| https://fastrac.com/private-charters | private charters (no trailing slash) |
| tel:9033610775 | call |
| sms:9034146050 | text |

### Business identity
- **Name:** "Texoma Water Taxi by Fastrac"; tagline "It's like Uber on the water"
- **Phone:** 903-361-0775; **Text:** 903-414-6050
- Address, email, hours, social: none
- **Copyright:** "© 2026 Texoma Water Taxi by Fastrac. All rights reserved"

### Factual claims (verbatim where possible)
- "Want a ride to the islands, a restaurant/bar or back home without the hassle of swimming? We'll pick you up at any marina or at your dock as long as it's in our service area. Text or call when you'd like a ride and we'll get you to your destination ASAP!"
- "$25 per person* *Each Way. from Highport Marina to/from the Islands."
- "$100 per hour** **From the time we leave our dock to the time we return."
- "Sightseeing Trips ($180/hr for 6 people)" — **conflicts** with fastrac.com Boat Ride Experience $150/hr up to 6 and Lake Tour private $200 flat.
- Service points: Highport Marina, Island Bar & Grill, Pelican's Landing, Marina Del Rey, Flowing Wells, Burns Run, Grandpappy Marina, Island View, Lighthouse Resort, Buncombe Creek, Alberta Creek, Catfish Bay, The Islands (North, Treasure, Wood)
- Services: on-demand rides, private charters/group events, boat drop-off/pickup, overnight island camping trips, beverage delivery, wedding/reception cruises, bachelor/bachelorette parties
- No surcharge, capacity, vessel, hours, cancellation or TAP text on this site (all live on fastrac.com).
- /map/ page: only a service-area map image https://texomawatertaxi.com/wp-content/uploads/2019/10/WaterTaxiMap-uai-258x199.jpg, no text.

### Brand voice / visual
- Voice: punchy, informal ("without the hassle of swimming", "Uber on the water").
- Colors/fonts not inspectable; imagery is casual phone photos.

### Problems
1. Depends entirely on fastrac.com; main link https://fastrac.com/water-taxi/ lands on Fastrac homepage rather than the water-taxi page (https://fastrac.com/cruises/water-taxi/).
2. Sightseeing $180/hr contradicts fastrac.com.
3. Content untouched since 2022 (home) / 2019 (map); map image is a small `-uai-258x199` thumbnail.
4. No address, hours, surcharges, or policies — customer must cross-site to find them.
5. Odd generator string "WordPress 7.0.4" (may be a spoof/plugin); verify on server.

### Hero / media worth reusing
- https://texomawatertaxi.com/wp-content/uploads/2019/10/billys-e1652538058543.jpg
- https://texomawatertaxi.com/wp-content/uploads/2019/10/9AEFBCA5-8D48-4DB0-99B0-96EB419AB550-e1652537977964.jpeg
- https://texomawatertaxi.com/wp-content/uploads/2019/10/0B3BAB78-7213-400D-BC18-EF045CF54D87.jpg
- https://texomawatertaxi.com/wp-content/uploads/2019/10/IMG_72471.jpg
- https://texomawatertaxi.com/wp-content/uploads/2019/10/WaterTaxiMap-uai-258x199.jpg (map; get original)

---

## Cross-site reconciliation flags
| Topic | Source A | Source B |
|---|---|---|
| Water taxi per-person rate | fastrac.com/cruises/water-taxi + texomawatertaxi.com: $25 pp each way (Highport↔Islands) | fastrac.com/shop Jolt product: "starting at $20 per person (larger boats are $25pp)" |
| Jolt capacity | water-taxi page: max 6 | Jolt product: Min 1 Max 8 |
| Hourly private boat, ≤6 pax | water taxi: $100/hr | Boat Ride: $150/hr; texomawatertaxi sightseeing: $180/hr; Lake Tour private on Mellow Yellow: $200/90 min |
| Island Girl capacity | "70 Passengers Max Capacity" | "Up to 86 Passengers" |
| Sight-Sea-Er capacity | vessel page: 37 | Lake Tour page: 36 |
| Food policy | Rules: BYOB + "small cooler" OK | Sunset Cruise: "outside food/drink prohibited" |
| Gift card prices | Eagle for Two $125.38; Murder for Two $146.63 (2019) | Current $59 and $79 pp |
| Phone numbers | Tackle Box shows 903.786.9010 | Tackle Box tel: link 903-361-8500; Fastrac/BoaterWise/Water Taxi 903-361-0775; charters 903.200.1408; taxi text 903-414-6050 |
| TAP link | All sites → https://discovertexoma.com/tap/ (302 → https://texomadestinations.com/tap) | TAP page offers Fastrac cruise discounts 5–15% and Tackle Box retail 5–10% + fuel; BoaterWise/water taxi not mentioned |
| Booking entry points | https://fastrac.com/reserve/ (TD custom app), https://fastrac.com/booking/ (chbs water taxi), https://fastrac.com/shop/ (WooCommerce), https://reserve.texomadestinations.com/ (302 → texomadestinations.com), Square (BoaterWise) | consolidation target should be one path via texomadestinations.com |
| Copyright years | Fastrac hard-coded 2017 | Tackle Box / BoaterWise / Water Taxi auto 2026 |
