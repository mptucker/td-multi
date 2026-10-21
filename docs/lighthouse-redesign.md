# Lighthouse redesign — October 2026

The Lighthouse front door now has seven explicit guest journeys: `/property`, `/cabins`, `/rv-sites`, `/boat-slips`, `/boat-rentals`, `/property-map`, and `/rules`. The homepage introduces the whole resort, then leads into boat rentals, stays, marina life, and arrival planning. Existing stay, arrival, groups, and package routes remain available.

The pages still receive `getContent()` / Supabase-backed brand content through `loadPage()`. Cabin, RV, rental, marina, recreation, and rules detail copy comes from the existing content sections. Brand contact information, announcements, events, packages, TAP settings, and the shared Texoma network retain their existing data sources. `propertyMap` is an optional image field in brand content; the published map is the fallback. New editorial journey titles and compositions live in `src/components/lighthouse/data.ts` and the Lighthouse components.

All booking actions use the existing `hubUrl()` contract and `data-intent` tracking. Sitewide analytics, organization JSON-LD, preview noindex, and canonical metadata remain in the shared layout. The new journey routes publish their own canonical metadata and breadcrumbs; the shared brand page registry adds them to the host-specific sitemap. Legacy redirects that would intercept the new pages have been removed or redirected to the appropriate journey.

Production browser QA also exposed a pre-existing syntax error in the shared click-tracking script: an escaped slash in a regular expression was consumed by the enclosing template string. `String.raw` now preserves the generated expression. A generated-script execution check verifies phone, Google Maps, Apple Maps, and boat-booking click classification.

## Image provenance

These are existing official Lighthouse / Texoma Destinations images, downloaded on October 21, 2026. No generated resort photography is used. Filenames in the previous content did not always match their descriptions; the used images were visually inspected and assigned accurate descriptions.

| Local asset | Official source |
| --- | --- |
| `hero.jpg` | `https://texomadestinations.com/wp-content/uploads/2023/07/Q0A5887-hero.jpg` — entrance lighthouse |
| `marina-panorama.jpg` | `https://lighthouseresort.com/wp-content/uploads/2017/12/Marina15-copy.jpg` — marina and shoreline |
| `cabins.jpg` | `https://texomadestinations.com/wp-content/uploads/2023/06/Texoma_Day30901.jpg` — family arriving at cabin |
| `rv-waterfront.jpg` | `https://texomadestinations.com/wp-content/uploads/2023/07/dji_fly_20230527_150310_138_1685217802826.jpg` |
| `tritoon.jpg` | `https://texomadestinations.com/wp-content/uploads/2023/05/Berkshire_STS_250CL-2-1.jpg` |
| `boat-current.jpg` | `https://texomadestinations.com/wp-content/uploads/2026/03/IMG_33751-1-scaled.jpg` — parent and child at the helm |
| `kayaking.jpg` | `https://texomadestinations.com/wp-content/uploads/2023/06/Q0A4702.jpg` |
| `fishing.jpg` | `https://texomadestinations.com/wp-content/uploads/2023/06/Q0A9286.jpg` |
| `slips.jpg` | `https://texomadestinations.com/wp-content/uploads/2023/07/marina-boat-slips.jpg` |
| `cruise.jpg` | `https://texomadestinations.com/wp-content/uploads/2023/06/DJI_0936.jpg` — Island Girl, not a resort aerial |
| `property-map.png` | `https://texomadestinations.com/wp-content/uploads/2023/07/property-map-lighthouse.2023.1.png` |

## Content cautions

- The property map is the official published 2023 edition. The page identifies the edition and asks guests to confirm assignments and access with the office.
- Existing anonymous testimonials had no verifiable individual source links. They are omitted from the redesign and the local reviews array is empty.
- No new prices, occupancy figures, testimonials, or availability claims were invented. Existing operational details remain owned by the content/facts registry and booking system.
- Existing cruise information contains differing departure descriptions. The property page asks guests to confirm their departure dock when booking.
- A populated Supabase `brand_content` row still overrides the local JSON by design. Deploying code does not overwrite that row; editorial hero copy and the new map field may be synchronized through the existing CMS workflow.

## Interaction and accessibility

The trip picker uses native radios and updates a labeled booking link. Mobile navigation exposes its expanded state, closes on navigation, and supports Escape with focus return. The map has labeled zoom/reset controls, an accessible scroll region, and an original-size link. Policies use native disclosure elements. Motion does not hide content and is disabled for reduced-motion preferences. A skip link and visible keyboard focus are included.

## Verification

- `npm run typecheck`, `npm run build` (106 generated pages), and `git diff --check` pass.
- Production HTTP checks return 200 for the homepage and all seven journeys. The Lighthouse sitemap includes all seven canonical URLs. `/camping` redirects to `/rv-sites`; a Lighthouse-only journey under another brand returns 404.
- Desktop and 390px mobile browser checks show no document overflow. Trip selection, mobile navigation, map zoom/reset, rules disclosures, and the shared Texoma network panel work.
- All homepage images load successfully. The final production reload has no new browser console errors after the analytics fix.
- Preview screenshots: `/private/tmp/lighthouse-qa/home-desktop.jpg`, `/private/tmp/lighthouse-qa/home-mobile.jpg`, and `/private/tmp/lighthouse-qa/home-full.jpg`.
