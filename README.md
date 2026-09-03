# Texoma Destinations — Brand Gateway Sites

One Next.js codebase that serves every Texoma Destinations brand front door from its own domain, with shared components, per-brand design tokens, unique copy, and every call-to-action deep-linking into the exact booking page on **texomadestinations.com** (the hub).

| Brand | Domain | Pages |
|---|---|---|
| Lighthouse Resort & Marina | lighthouseresort.com | Home · Stay & Experience · Plan Your Visit · Groups & Events · Rules · Packages |
| Paradise on Lake Texoma | paradisetexoma.com | Home · Stay · Plan · Groups · Rules · Packages |
| Sundance Camp | sundancetexoma.com | Home · Stay · Plan · Groups · Rules · Packages |
| Island View Park | islandviewtexoma.com | Home · The Beach · Plan · Rules · Packages |
| Fastrac Charters & Cruises | fastrac.com | Home · Cruises & Charters · Plan · Groups · Rules · Packages |
| Tackle Box Outfitters | tackleboxtexoma.com | Home · Visit the Store · Rules |
| BoaterWise | boaterwise.com | Home · Courses & Schedule · Policies |
| Texoma Water Taxi | texomawatertaxi.com | Home · Routes & Rates · Rider Policies |

## How it works

```
request → src/middleware.ts
          ├─ host → brand   (src/config/brands.ts: domains[])
          ├─ legacy URL?    (src/config/redirects.ts → 308 to new page or hub)
          └─ rewrite        /stay  →  /sites/<brand>/stay

/sites/[brand]/layout.tsx   fonts + CSS tokens + header/footer + JSON-LD + GTM
/sites/[brand]/*/page.tsx   six page templates shared by every brand
src/lib/content.ts          brand copy (content/<brand>.json) + events/packages/alerts/facts
                            from Supabase when configured, else content/*.json
src/config/hub-links.ts     THE deep-link contract — every CTA resolves here (+UTM)
```

* **Design system:** Tailwind v4 + CSS variables. Each brand sets `theme` (colors, Google Fonts, radius, header style) in `src/config/brands.ts`; components never hard-code a color.
* **Content:** unique, hand-written copy per brand lives in `content/<brand>.json` (typed by `BrandContent` in `src/config/types.ts`). Events, packages, alert bars and the facts registry are shared tables with a **"show on sites"** array — the "choose which sites this displays on" requirement.
* **Facts registry:** every operational number (cabin counts, prices, hours) has a key, owner and `last_verified` date (`content/facts.json` / `facts` table). Rules pages show the verification date.
* **Booking:** never re-implemented. `hubUrl(intent, brand)` builds the exact hub URL (e.g. `/where-to-stay/cabins#/paradise`) and stamps `utm_source=<brand domain>&utm_medium=brand-site&utm_campaign=<placement>&property=<slug>`.
* **SEO:** per-brand `<title>`/description/OG, canonical to the brand domain, `LocalBusiness`-family JSON-LD with NAP + `parentOrganization`, 308 redirects for every legacy URL, no duplicated property descriptions between brands or the hub.
* **Admin (`/admin`):** password-gated CRUD for events, packages, alert bars and facts, plus a "Hub deep links" QA table. Writes use the Supabase service-role key server-side; reads use anon + RLS.

## Run locally

```bash
cp .env.example .env.local      # optional — runs from JSON with no env at all
npm install
npm run dev
# open http://localhost:3000/?brand=paradise   (or paradise.localhost:3000)
# every brand:  http://localhost:3000/          → directory
# admin:        http://localhost:3000/admin     (set ADMIN_PASSWORD)
```

## Deploy (Vercel)

1. Import the repo; framework preset Next.js; no build changes.
2. Add env vars from `.env.example` (`NEXT_PUBLIC_GTM_ID`, Supabase keys, `ADMIN_PASSWORD`, `REVALIDATE_SECRET`).
3. Add each brand domain (apex + www) to the same Vercel project. Middleware maps host → brand; nothing else to configure.
4. Preview deployments: `https://<preview>.vercel.app/?brand=sundance` or `/sites/sundance`.

## Supabase (optional, recommended)

```bash
# 1. run supabase/schema.sql in the SQL editor
# 2. seed from the JSON files
NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… npm run seed
# 3. (optional) Database Webhook on events/packages/alerts/facts → POST https://<domain>/api/revalidate?secret=$REVALIDATE_SECRET
```

Without Supabase the sites are fully static from `content/*.json` (ISR every 60 s is a no-op).

## Adding or changing things

* **New event/package/alert:** `/admin` → pick sites → publish. Live within 60 s (instantly with the webhook).
* **Change a phone number / count:** edit `content/facts.json` **and** `src/config/brands.ts` NAP (or the `facts` table + a PR). Update `last_verified`.
* **Change where a CTA lands:** `src/config/hub-links.ts` — one place, all sites.
* **New brand:** add to `BrandSlug`, `BRANDS`, `REDIRECTS`, drop a logo in `public/brands/`, write `content/<slug>.json`.
* **Retire a legacy URL:** add it to `src/config/redirects.ts`.

## Docs

* `docs/hub-deep-link-spec.md` — the contract to hand to the texomadestinations.com developer.
* `docs/content-audit.md` — legacy-site and hub audit, fact conflicts, ownership.
* `docs/url-inventory-and-redirects.md` — every indexed legacy URL and its destination.
* `docs/seo-search-ownership.md` — which site owns which query; migration checklist.
* `docs/brand-guides/` — style guide + voice for every brand.
