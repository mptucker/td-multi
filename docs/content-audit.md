# Content Audit — legacy brand sites vs. texomadestinations.com

Audit date: 2026-09-03. Method: full crawl of every legacy site (nav, footer, sitemaps, WP REST) and the hub (sitemap, REST, booking API). Raw crawl notes are in `docs/audit-raw/`.

## 1. State of each legacy site

| Site | Status | Platform | Last real update | Verdict |
|---|---|---|---|---|
| lighthouseresort.com | Up. 30+ pages, no sitemap, REST pages endpoint times out | WP + Slider Revolution 5.4.8.3 (2018), td-reservations | © 2017-2019; "MAYGETAWAY" promo still live in Sept; events page shows raw `[calendar]` shortcodes | Most content & search value; migrate **last** |
| paradisetexoma.com | Up. 65 unit pages + 2019/2020 event pages still indexed | WP + Uncode + RevSlider 7.1.4 | 2025-05; © 2017-2019 | Strong personality, drifting facts; **pilot candidate** |
| islandviewtexoma.com | Up. 4 pages; freshest of the set (© 2026, banner 2026-03) | WP + Site Kit | 2026-03 | Thin; prices only live here, not on hub |
| sundancetexoma.com | **Homepage fails to render** (unparseable response); every other page 200 | WP + Uncode + RevSlider 7.1.4 | 2021-06; `/siesta/` "2021 launch" page still live | **Pilot candidate** — smallest, already broken |
| fastrac.com | Up. 16 cruise posts, WooCommerce shop, chbs booking form | WP + Uncode + Woo + Chauffeur Booking | © 2017 hard-coded; Instagram feed broken | Most search value after Lighthouse; 3 booking systems |
| tackleboxtexoma.com | Up. 1 page + "Hello World" post | WP + Uncode | 2018-10 | Shop-online domain **dead (NXDOMAIN)**; two phone numbers |
| boaterwise.com | Up. 1 page | WP + Uncode + Square | 2023-12 | **`noindex,nofollow` site-wide**; no sitemap; 3 of 6 offerings unpriced |
| texomawatertaxi.com | Up. 2 pages | WP + Uncode | 2022-06 | Main CTA links to `fastrac.com/water-taxi/` which serves the fastrac homepage |

Cross-site: every legacy site hot-links the network logo from **discovertexoma.com**, links TAP to `discovertexoma.com/tap/` (302 → hub), and runs its **own** `/reserve/` instance of the booking app — so today *nothing* books through the hub except TAP. `reserve.texomadestinations.com` (linked from 3 sites) is a dead redirect. All sites expose `wp-sitemap-users-*.xml`.

## 2. Fact conflicts to resolve before launch

Owner = who confirms the value. "Published as" = what the new brand sites currently show (hub value wins by default; unresolved values are not published).

| # | Fact | Source A | Source B | Published as | Owner |
|---|---|---|---|---|---|
| 1 | Lighthouse cabins | 35 (legacy + hub widget JS) | 34 (hub page copy) | 34 | Lighthouse GM |
| 2 | Lighthouse RV sites | 20 (legacy + widget) | 19 (hub page) | 19 | Lighthouse GM |
| 3 | Lighthouse transient slip | $40 (legacy /cabins) | $25 (legacy /rules) | "ask at check-in" | Marina Mgr |
| 4 | Lighthouse Lodge capacity | 75 / 800 sq ft porch (legacy) | 80 / 1,200 sq ft deck (hub) | 80 | Events Dir |
| 5 | Fireside capacity | ~36 (legacy) | 25 (hub) | 25 | Events Dir |
| 6 | Boat rental fuel | "Fuel included" (hub pricing card) | "Pay for fuel you use" (hub FAQ + legacy) | pay for fuel used | Marina Mgr |
| 7 | Boat rental prices | "from $300/$500" (hub page = member rate) | $450–$750 (hub API public) | ranges from API | Marina Mgr |
| 8 | Paradise glamping | 4 Kabanas + 6 Kasitas (homepage) | +10 Kima unit pages | 3 styles, all named | Paradise Mgr |
| 9 | Paradise RV count | 40 (copy) | 29 unit pages; "50+ RV & tent" (API) | 40 | Paradise Mgr |
| 10 | Paradise RV hookups | "full hookup / 50A" | RV #22 "30A water only" | per-site on hub | Paradise Mgr |
| 11 | Paradise day-use fee | $7 (rules) | $10 (things-to-do) | not published | Paradise Mgr |
| 12 | Paradise address | "Paradise Park **Dr.**" | "Paradise Park **Road**" (hub) · GBP "Paradise Cove Resort & Camp" | Road | Marketing |
| 13 | Sundance RV sites | 7 (legacy) | 6 (hub) | 6 | Sundance Mgr |
| 14 | Sundance cabin price | from $159 | $150–$400 | none (live on hub) | Reservations |
| 15 | Sundance checkout | 11am (property) | 12pm / Sun 5pm (rules) | 11am (hub) | Reservations |
| 16 | Sundance RV occupancy | 6 (4 adults) | 4 | 4 (hub) | Sundance Mgr |
| 17 | Sundance phone/email | (903) 361-8500 · info@sundancecamp.com | tel:19033618810 | 903.419.1011 (hub directory) | Marketing |
| 18 | Sunset cruise departs | Highport Marina (Lighthouse legacy) | Lighthouse Marina (fastrac + hub) | Lighthouse | Fastrac Ops |
| 19 | Island Girl capacity | 86 (fastrac vessel page) | 70 (hub + fastrac elsewhere) | 70 | Fastrac Ops |
| 20 | Sight-Sea-Er capacity | 37 | 36 | 36 | Fastrac Ops |
| 21 | Water taxi per-person | $25 | $20 "on Jolt" (Woo shop) | $25 | Fastrac Ops |
| 22 | Private boat hourly | $100 (taxi) · $150 (Boat Ride) · $180 (sightseeing) · $200/90 min (Lake Tour) | — | each labelled by product | Fastrac Ops |
| 23 | Island View kids free | 7 & under (Island View) | under 3 (Lighthouse legacy) | 7 & under | Island View Mgr |
| 24 | Island View shelter | $40/day | $20–$40 (Lighthouse legacy) | $40 | Island View Mgr |
| 25 | Primitive camping price | $30/tent (Paradise) | $20/person (Sundance) | none (live on hub) | Reservations |
| 26 | TAP name | "TAP Pass" / "Annual Pass $99–$199" | "Texoma Access Package" $99/$199/$399 | hub | Marketing |
| 27 | Tackle Box phone | 903.786.9010 (display) | tel:903-361-8500 (link) | 903.786.9010 | Marketing |
| 28 | Fastrac legal name | "Fastrac Charters and Cruises" | "Fastrac Cruises" (nav) | Charters & Cruises | Marketing |
| 29 | Min booking age / min stay | 25 · 2 nights peak (legacy rules only) | not on hub | published, flagged for hub | Reservations |
| 30 | Sunset cruise food | "outside food prohibited" | "small cooler fine" (rules) | BYOB + small cooler | Fastrac Ops |

## 3. Dead / broken things found

* `shoponline.tackleboxtexoma.com` — NXDOMAIN (linked from tackleboxtexoma.com and 2 hub pages)
* `reserve.texomadestinations.com` — 302 to hub homepage
* `fastrac.com/water-taxi/` — serves the homepage (texomawatertaxi.com's main CTA)
* Hub: `/?page_id=502`, `/map-location/tackle-box-outfitters`, `/map-location/lighthouse-resort-marina` — 404
* Hub `/properties` — Lorem ipsum, indexable
* Lighthouse `/lake-texoma-events/` — raw `[calendar id="52005"]` shortcodes
* Fastrac Instagram feed → placeholder images; TripAdvisor link → tripadvisor.com root
* Paradise `/things-to-do/` — unparseable response (like Sundance homepage)
* Sundance homepage — unparseable; `/siesta/` "almost ready for 2021 launch!"
* boaterwise.com — `noindex,nofollow`
* Weather widget (Lighthouse) — non-functional; MAYGETAWAY banner on all Lighthouse + Paradise pages in September

## 4. Hub depth by property

| Property | Hub pages | Booking path | Gaps |
|---|---|---|---|
| Lighthouse | property + marina + boat-rentals + cabin/RV sections + venues | widget hash, tritoon cart, marina | count mismatch, fuel copy |
| Paradise | property + sections | widget hash | no counts, no prices, no address on page |
| Sundance | property + sections | Browse cabins/RV only | no tents CTA, no prices, no address |
| Island View | thin property page | `#/beach-access`, `#/kayaks-sups` | **no prices**, no address/phone |
| Fastrac | property (good) | `#/charters-cruises`; Texie → fastrac.com | no schedule/prices on hub |
| Tackle Box | property | none (dead shop link) | no hours, no schema |
| Water Taxi | **none** | fastrac.com/booking | needs hub page |
| BoaterWise | **none** | Square | needs hub page |

## 5. Recommendations (sequenced)

1. **Confirm the 30 facts above** with the named owners; record in `content/facts.json` with `last_verified`. (1 week, parallel with build QA.)
2. **Hub fixes** in `docs/hub-deep-link-spec.md` §3 — especially #1–#7. (Hub developer.)
3. **Pilot Sundance** (already broken) then **Paradise**: point DNS at Vercel, verify redirects with the URL inventory, update GBP website links, submit sitemaps.
4. Island View, Tackle Box, BoaterWise, Water Taxi (thin sites, low risk).
5. **Fastrac**, then **Lighthouse** last — after hub adds schedule/prices for cruises and reconciles Lighthouse counts.
6. Decide TAP's home: keep on hub `/tap` (recommended for now; every brand site links there) or spin out `texomaadventurepass.com` later — the brand-site link is one line.
7. Retire discovertexoma.com dependencies (logo hot-link, TAP redirect) and the per-domain `/reserve/` instances once each brand cuts over.
