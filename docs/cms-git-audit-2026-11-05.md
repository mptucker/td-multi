# CMS ↔ Git content audit — November 5, 2026

## Finding

Production site pages were rendering the Git fallback while `/admin` was
editing Supabase. The public server looked only for the sensitive
`NEXT_PUBLIC_SUPABASE_*` variables; Vercel exposed the equivalent server-side
variables, but the site content client did not use them. This made successful
CMS saves appear disconnected from the live sites.

At the same time, several stored `brand_content` rows were complete copies from
before later site redesigns. Enabling those rows without reconciling them would
have rolled newer Git copy and photography backward.

## Reconciliation

- Git remains the complete versioned content model and the public runtime source.
- CMS `brand_content` records become small, versioned private editing drafts.
- Publishing a site commits the reviewed document to Git; Supabase no longer
  overrides the public page.
- Legacy full documents are ignored unless converted, preventing accidental
  rollback.
- The pre-conversion documents are backed up to `content_revisions`.
- Lighthouse's only unpublished editor change—the newly uploaded hero image—is
  preserved as a draft override.
- The later Water Taxi route and surcharge copy is folded into
  `content/water-taxi.json` before the Git-authoritative publish flow is enabled.
- Paradise, BoaterWise, TowBoatUS North Texas, and Texoma Collective legacy rows
  are reset to the current Git baseline.
- Anonymous reads can access the published patch but no longer the unpublished
  `draft_content` column.

Run `supabase/20261105000000_convert_brand_content_to_patches.sql` before the
corresponding application deployment.

## Shared collections

- Packages: CMS and Git match.
- Events: CMS and Git match; timestamps differ only by equivalent UTC/offset
  formatting.
- Announcement: CMS and Git match; timestamps differ only by equivalent
  UTC/offset formatting.
- FAQs: no published CMS rows, so the Git FAQs remain active.
- Facts: two stale CMS rows are corrected by the migration:
  - `sundance.rollaway` removes the retired rollaway price.
  - `watertaxi.rates` updates private service from $100/hour to $150/hour.
- Shared `tap`, `footer`, and `dockline_widget` records exist and remain CMS
  owned.

## Verification

- `npm run typecheck`
- `npm run build`
- production-environment `npm run build`
- `git diff --check`

Use `scripts/audit-cms-content.mjs` for future comparisons. Pass
`--collections` for the shared operational tables and `--values` when reviewing
non-sensitive field differences.
