# URL Inventory & Redirect Map

Every URL discovered on the legacy sites (nav, footer, `sitemap.xml`, WP REST) and where it goes after cutover. Implemented in `src/config/redirects.ts` (exact + prefix matches, 308). **Before cutover:** pull Search Console → Performance → Pages for each domain and Ahrefs/Semrush backlinks; any URL with clicks or links that is not listed here must be added.

Legend: **→ brand** = same-domain page on the new site · **→ hub** = texomadestinations.com · **keep** = URL unchanged.

## lighthouseresort.com
| Legacy | New |
|---|---|
| `/` | keep |
| `/cabins/` | → brand `/stay#cabins` |
| `/camping/` (RV) | → brand `/stay#rv` |
| `/boat-rentals/`, `/activity/pontoon-boat-rental/` | → hub `/things-to-do/boat-rentals` |
| `/marina`, `/boat-slips/`, `/fuel-dock-general-store/` | → brand `/stay#marina`, `#slips`, `#fuel-dock` |
| `/amenities/`, `/recreation/`, `/fishing/` | → brand `/stay` (+anchor) |
| `/experiences/`, `/activity/{sunset-cruise,dinner-cruise,lake-tour,lake-day}/` | → hub `/things-to-do#/charters-cruises` |
| `/activity/{kayak-rental,paddleboard-rental}/` | → hub `/things-to-do#/kayaks-sups` |
| `/activity/island-view/` | → islandviewtexoma.com |
| `/professional-guide-service/`, `/?page_id=2578` | → hub `/things-to-do#/fishing` |
| `/property-map`, `/contact/` | → brand `/plan-your-visit#map`, `#contact` |
| `/about-us/` | → brand `/#story` |
| `/lake-texoma-events/` | → brand `/packages` |
| `/event-space/`, `/lighthouse-lodge` | → brand `/groups-and-events` (+`#lodge`) |
| `/rules/` | keep (`/rules`) |
| `/reserve/`, `/reserve/cart/*`, `/reserve/account/*` | → hub equivalents (`/where-to-stay/cabins#/lighthouse`, `/reserve/cart`, …) |

## paradisetexoma.com
| Legacy | New |
|---|---|
| `/`, `/stay/`, `/rules/` | keep |
| `/stay/{paradise-express,cabin-3,cabin-4,kima-*,kabana-*,kasita-*,rv-site-*}` (65) | → brand `/stay#glamping` (prefix) |
| `/stay/primitive-camping` | → brand `/stay#primitive` |
| `/things-to-do/` | → brand `/stay#things-to-do` |
| `/location/`, `/property-map/`, `/contact/` | → brand `/plan-your-visit` |
| `/search?type=*`, `/reserve/*` | → hub `/where-to-stay/cabins#/paradise` etc. |
| `/luau/`, `/vintage/` | → brand `/packages` |
| `/test-page/` | → `/` |

## sundancetexoma.com
| Legacy | New |
|---|---|
| `/`, `/rules/` | keep |
| `/property/` | → brand `/stay` |
| `/cabin-1/` … `/cabin-7/` | → brand `/stay#cabins` (prefix) |
| `/property-map/` | → brand `/plan-your-visit#map` |
| `/siesta/` | → `/` |
| `/reserve/*` | → hub `/where-to-stay/cabins#/sundance` etc. |

## islandviewtexoma.com
| Legacy | New |
|---|---|
| `/`, `/rules/` | keep |
| `/property-map/` | → brand `/plan-your-visit#map` |
| `/reserve/`, `/reserve/cart/add/islandview-day-pass` | → hub `/things-to-do#/beach-access`, `/reserve/cart/add/islandview-day-pass` |

## fastrac.com
| Legacy | New |
|---|---|
| `/`, `/rules/` | keep |
| `/public-cruises/`, `/themed-cruises/`, `/experiences/`, `/search/` | → brand `/stay` (+anchor) |
| `/private-charters/` | → brand `/groups-and-events` |
| `/events/` | → brand `/packages` |
| `/contact/` | → brand `/plan-your-visit#contact` |
| `/cruises/{16 posts}` | → brand `/stay` (prefix) — *consider keeping the 4 highest-traffic as anchors on /stay* |
| `/cruises/water-taxi/`, `/water-taxi/` | → texomawatertaxi.com |
| `/product/*`, `/shop/` | → brand `/stay` · hub `#/charters-cruises` (Woo gift cards retire) |
| `/cart/`, `/checkout/`, `/my-account/` | → hub `/reserve/cart`, `/reserve/account/profile` |
| `/reserve/*` | → hub `/things-to-do#/charters-cruises` |
| `/booking/` | **keep live on fastrac.com** until hub offers water-taxi/Lake Day booking (chbs plugin) |

## tackleboxtexoma.com
| Legacy | New |
|---|---|
| `/` | keep |
| `/2015/03/03/hello-world-2/` | → `/` |
| `shoponline.tackleboxtexoma.com` | DNS dead — remove links or restore |

## boaterwise.com, texomawatertaxi.com
| Legacy | New |
|---|---|
| `/` | keep (remove `noindex` on BoaterWise) |
| texomawatertaxi.com `/map/` | → brand `/plan-your-visit#map` |

## Cutover checklist (per domain)
1. Export Search Console pages + backlinks; add any missing URLs above.
2. Deploy; add apex + www to Vercel; verify each redirect with `curl -I`.
3. Update Google Business Profile website URL and booking link (hub deep link).
4. Submit new sitemap in Search Console; monitor Coverage for 4 weeks.
5. Remove the WordPress site from the shared host once 404s in GSC drop to zero.
