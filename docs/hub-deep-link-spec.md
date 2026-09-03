# Hub Deep-Link Spec — for the texomadestinations.com developer

**Purpose.** Each brand site (lighthouseresort.com, paradisetexoma.com, …) hands customers to texomadestinations.com ("the hub") at the *exact* property or product page — never the homepage — with the originating brand attributed. This document is the contract between the brand sites and the hub. Verified against the live hub on 2026-09-03.

## 1. What the brand sites link to today (works now)

The hub's `td-reservations` Angular widget scopes by **hash route** inside a WordPress page. These are the URLs the brand sites already use; nothing on the hub needs to change for them to work.

| Intent | URL pattern | Notes |
|---|---|---|
| Cabins at a property | `/where-to-stay/cabins#/{lighthouse\|paradise\|sundance}` | widget preselects the property card |
| RV sites at a property | `/where-to-stay/rv-sites#/{lighthouse\|paradise\|sundance}` | |
| Tents / primitive | `/where-to-stay/tents#/{paradise\|sundance}` | |
| Boat rentals (sales page) | `/things-to-do/boat-rentals` | Lighthouse only |
| Tritoon straight to cart | `/reserve/a/boat-rental/at/lighthouse/cart/add/tritoon` | |
| Kayaks & SUPs | `/things-to-do#/kayaks-sups` | |
| Charters & cruises | `/things-to-do#/charters-cruises` | |
| Fishing guides | `/things-to-do#/fishing` | |
| Island View day pass section | `/things-to-do#/beach-access` | |
| Island View day pass to cart | `/reserve/cart/add/islandview-day-pass` | |
| Picnic packages | `/things-to-do#/picnics` | |
| Plan an event | `/events` | |
| TAP membership | `/tap` · to cart `/reserve/cart/add/tap-pass` | |
| Lighthouse Marina (slips/fuel) | `/lighthouse-marina` | |
| Property page | `/properties/{lighthouse\|paradise\|sundance\|island-view\|fastrac\|the-tackle-box}` | |
| Map with marker | `/properties-map?m={lighthouse\|paradise\|sundance\|islandview\|fastrac\|tacklebox}` | |
| Account | `/reserve/account/reservations` | |
| Legal | `/legal#tab-1687356549-1-58` (privacy) · `#tab-1687356549-2-22` (terms) | fragile — see §3 |

Every link carries: `utm_source={brand-domain}&utm_medium=brand-site&utm_campaign={placement}&property={location-slug}`.

## 2. Requests of the hub (small, high value)

1. **Honour `?property=` as a canonical scoping parameter.** When `/where-to-stay/cabins?property=paradise` (or `rv-sites`, `tents`, `/things-to-do?section=kayaks-sups`) is requested, have the widget select that property/section on load — i.e. treat the query param exactly like the hash. Hash routes are client-only and are dropped by some referrers, analytics tools and email clients; a query param survives everything. Brand sites already send both.
2. **Add per-location entry routes to the reservation app** (already partially there): `/reserve/a/cabin/at/{location}`, `/reserve/a/rv/at/{location}`, `/reserve/a/primitive-campsite/at/{location}`, `/reserve/a/beach-day/at/islandview`, `/reserve/a/cruise`. These become the *preferred* targets once live; brand sites switch in one file (`src/config/hub-links.ts`).
3. **Stable legal anchors:** `/legal#privacy`, `/legal#terms`, `/legal#ugc` instead of Uncode tab IDs.
4. **Create hub pages (or at least widget sections) for Texoma Water Taxi and BoaterWise**, so those brand sites can hand off to the hub like the others. Today Water Taxi books on `fastrac.com/booking/` (Chauffeur Booking System plugin) and BoaterWise on Square — two extra booking systems.
5. **Cross-domain measurement:** the brand sites share one GTM container and push `{brand}` to `dataLayer`. Add all eight brand domains to the hub GA4 property's cross-domain list so `utm_source` isn't overwritten by a `(referral)` session on the hub, and set the GA4 "unwanted referrals" list to include the brand domains.
6. **Referrer-based property preselect (nice to have):** if `document.referrer` host ∈ brand domains and no property is specified, preselect that brand's property.

## 3. Hub defects found during the audit (please fix before brand sites launch)

| # | Issue | Where |
|---|---|---|
| 1 | Nav "Our Event Calendar" → `/?page_id=502` → **404** | global nav |
| 2 | `/properties` index page is live and indexable with **Lorem ipsum** | `/properties` |
| 3 | "What's Up, Texoma?" event band renders an empty heading; `event-search` API returns `[]` | home, property pages |
| 4 | Two links to `/map-location/*` → 404 | home, `/properties/fastrac` |
| 5 | `shoponline.tackleboxtexoma.com` does not resolve (NXDOMAIN) — linked twice | `/properties/the-tackle-box`, `/things-to-do` |
| 6 | Lighthouse counts: page copy 34 cabins / 19 RV vs widget copy (hard-coded in `main.*.js`) 35 / 20 | `/where-to-stay/*` |
| 7 | Boat-rentals page says "Fuel included" in pricing cards and "you pay for the fuel you use" in the FAQ; "from $300/$500" are 50%-member prices, public API rates are $450–$750 | `/things-to-do/boat-rentals` |
| 8 | `/tap-confirmation` and `/guestguide` still describe retired TAP-Individual/Family plans | |
| 9 | `/tap` partner logos link to `http://` (not https) sister sites | `/tap` |
| 10 | Missing meta descriptions on `/tap`, `/things-to-do/boat-rentals`, `/texie`; no canonical on `/legal`, `/properties`; `/reserve/*`, `/guestguide` (contains Wi-Fi password), `/tap-confirmation`, `/myvacation` are indexable | SEO |
| 11 | No `LodgingBusiness`/`Campground`/`Resort`/`LocalBusiness` schema anywhere — only Yoast defaults | SEO |
| 12 | Island View, Paradise, Sundance hub pages carry no address/phone/prices; Paradise has no unit counts | content |
| 13 | `reserve.texomadestinations.com` 302s to the homepage — legacy sites still link to it | DNS |

## 4. Redirects the hub should host

When the legacy sites go dark, these hub-side redirects protect inbound links that point at *hub* URLs which don't exist:

```
/things-to-do/cruises      → /things-to-do#/charters-cruises   (301)
/cruises                   → /things-to-do#/charters-cruises
/packages                  → /things-to-do#/picnics
/policies, /rules, /cancellation-policy → /properties/lighthouse#policies (or a new /policies page)
/contact                   → /companies
/properties/texoma-water-taxi → https://texomawatertaxi.com/
/properties/boaterwise     → https://boaterwise.com/
reserve.texomadestinations.com/* → https://texomadestinations.com/reserve/*
```

## 5. Ownership going forward

| Fact type | System of record | Brand sites show… |
|---|---|---|
| Inventory counts, unit photos, nightly rates, availability | Hub (reservation DB) | approximate counts + "live on texomadestinations.com" |
| Cancellation, payment, pet, quiet-hours policy | Hub policy page (single source) | summary + link to full policy |
| Events & packages | Supabase `events`/`packages` (brand-site CMS) → *and* hub `event-search` if the hub adopts the same feed | filtered by `show_on_sites` |
| NAP (name, address, phone) | `facts` registry / `brands.ts` — mirrored to GBP and hub `/companies` | full NAP + schema |
| TAP tiers & prices | Hub `tap-subscription-config` | link only, no prices duplicated |
