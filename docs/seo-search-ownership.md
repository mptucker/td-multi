# Search Topic Ownership & SEO Migration Plan

Principle: the hub owns **category** queries ("Lake Texoma cabins"); each brand owns its **name** and its **unique proposition**. Brand sites link up to the hub for the category; the hub links down to the brand for the story. They reinforce, never compete.

## Ownership matrix

| Query family | Owner | Supporting |
|---|---|---|
| lake texoma cabins / rv camping / tent camping / glamping (generic) | **Hub** `/where-to-stay/*` | brand /stay pages link up |
| lake texoma boat rentals / pontoon rental | **Hub** `/things-to-do/boat-rentals` | lighthouseresort.com /stay#boats |
| lake texoma dinner cruise / sunset cruise / boat tours | **fastrac.com** (strong standalone category) | hub `/properties/fastrac` |
| lake texoma water taxi | **texomawatertaxi.com** | fastrac.com |
| lake texoma marina / boat slips / fuel dock | **lighthouseresort.com** /stay#marina | hub `/lighthouse-marina` |
| lighthouse resort (& marina) lake texoma | **lighthouseresort.com** | hub property page |
| paradise on lake texoma / paradise texoma glamping | **paradisetexoma.com** | hub |
| sundance camp lake texoma / group camp / retreat texoma | **sundancetexoma.com** | hub |
| lake texoma beach / island view / day use | **islandviewtexoma.com** | hub `/properties/island-view` |
| tackle box pottsboro / live bait lake texoma / texoma fishing license | **tackleboxtexoma.com** | hub |
| boater education texoma / on-water boating course | **boaterwise.com** | hub `/tap` |
| striper fishing guides lake texoma | **Hub** `/things-to-do#/fishing` | lighthouse, tackle box |
| texoma adventure pass / TAP | **Hub** `/tap` (until a TAP site exists) | all brand sites link |
| lake texoma events / weddings / venues | **Hub** `/events` | lighthouse /groups-and-events |

## Migration checklist
- [ ] Inventory every indexed URL, traffic and backlinks per domain (GSC + Ahrefs) — template in `url-inventory-and-redirects.md`
- [ ] 308 redirects deployed and tested for every legacy URL (`src/config/redirects.ts`)
- [ ] Unique copy on every brand site — done; no paragraph is shared with the hub or another brand
- [ ] Consistent NAP on brand site, hub `/companies`, GBP, Facebook: use `content/facts.json` as the source
- [ ] JSON-LD `Resort`/`Campground`/`Beach`/`TouristAttraction`/`SportingGoodsStore`/`EducationalOrganization`/`TaxiService` with `parentOrganization` → hub `Organization` — done on brand sites; hub to add its own
- [ ] Google Business Profile: website → brand domain; "Book" link → hub deep link with UTMs
- [ ] One GTM container across brands; GA4 cross-domain list includes all brand domains + hub; UTMs stamped on every hub link
- [ ] Remove `noindex` from boaterwise.com; ensure hub noindexes `/reserve/*`, `/guestguide`, `/tap-confirmation`
- [ ] Retire per-domain `/reserve/` app instances, `reserve.texomadestinations.com`, discovertexoma.com hot-links
- [ ] Title/description per page (done in content JSON) — keep brand name + "Lake Texoma" in every title
- [x] Per-host `sitemap.xml` and `robots.txt` (preview hosts disallowed) — submit in GSC per property
- [ ] Monitor: GSC coverage + top queries per domain weekly for 8 weeks post-cutover
