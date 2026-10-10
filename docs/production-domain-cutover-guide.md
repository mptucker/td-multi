# Production Domain Cutover Guide

## Texoma Destinations brand sites on Vercel

**Audience:** IT / DNS administrator  
**Vercel project:** `td-multi`  
**GitHub repository:** `mptucker/td-multi`  
**Production branch:** `master`  
**Prepared:** October 6, 2026

This guide moves the first five completed brand sites from the shared Vercel preview URL to their public domains:

| Brand | Application slug | Canonical domain | GA4 measurement ID |
|---|---|---|---|
| Tackle Box Outfitters | `tackle-box` | `tackleboxtexoma.com` | `G-MW3EGLZLL2` |
| Sundance Camp | `sundance` | `sundancetexoma.com` | `G-58NHSD0MEH` |
| Texoma Water Taxi | `water-taxi` | `texomawatertaxi.com` | `G-C34MP392N2` |
| BoaterWise | `boaterwise` | `boaterwise.com` | `G-R80L5GXLFR` |
| Island View Park | `island-view` | `islandviewtexoma.com` | `G-RD3J8HD3JT` |

## Important architecture decision

Do **not** create a separate Vercel project for each brand.

All five domain pairs must be attached to the existing **`td-multi`** Vercel project. The application reads the incoming hostname and internally routes it to the correct brand site. This preserves one codebase, one deployment pipeline, one CMS, shared announcement bars, shared TAP/footer content, and the existing per-brand SEO and analytics configuration.

For each brand, both the apex and `www` hostname must be added:

- `example.com`
- `www.example.com`

The application currently declares the **apex domain** as canonical. Configure `www` to redirect to the apex domain. Do not make `www` primary without a corresponding code change to canonical URLs.

## Change window and ownership

Assign these roles before starting:

| Role | Responsibility |
|---|---|
| Vercel administrator | Adds and verifies domains on `td-multi`; checks deployment and SSL status |
| DNS administrator | Changes only the website DNS records; preserves email and verification records |
| Website reviewer | Checks content, forms/links, mobile display, redirects, sitemap, and robots |
| Analytics reviewer | Confirms the correct GA4 property receives production traffic |
| Cutover lead | Approves launch and rollback decisions |

Move **one domain at a time**. Complete the acceptance checklist for one brand before beginning the next. Recommended launch order:

1. Tackle Box Outfitters
2. Sundance Camp
3. Texoma Water Taxi
4. BoaterWise
5. Island View Park

## Phase 1 — At least 24 hours before cutover

### 1. Confirm the production deployment

In Vercel:

1. Open the Texoma Destinations team.
2. Open the project named **`td-multi`**.
3. Confirm the latest deployment from the `master` branch is marked **Production** and is healthy.
4. Confirm no production deployment is currently building or failing.
5. Do not change the project's framework, build command, output directory, environment variables, or Git branch during the domain cutover.

### 2. Review each site on the current deployment

Use these QA paths before touching DNS:

| Brand | QA URL |
|---|---|
| Tackle Box | `https://td-multi.vercel.app/sites/tackle-box` |
| Sundance | `https://td-multi.vercel.app/sites/sundance` |
| Texoma Water Taxi | `https://td-multi.vercel.app/sites/water-taxi` |
| BoaterWise | `https://td-multi.vercel.app/sites/boaterwise` |
| Island View Park | `https://td-multi.vercel.app/sites/island-view` |

These `/sites/...` QA URLs are intentionally marked `noindex`. GA4 is also intentionally disabled on preview hosts, so the lack of analytics activity during this step is expected.

For every site, review desktop and mobile and verify:

- Logo, photography, typography, navigation, footer, and TAP section
- Phone, SMS, maps, booking, reservation, and external links
- Current address, phone number, hours, policies, and prices
- Announcement bar behavior
- No broken images or visible errors
- All CMS-controlled content expected for the brand is present

### 3. Back up the current DNS zone

At the existing DNS provider, export the complete zone or take screenshots of every record. Record the current values for:

- Apex (`@`) A, AAAA, ALIAS, or CNAME-flattening records
- `www` CNAME or A records
- MX records
- SPF, DKIM, and DMARC TXT records
- Google, Microsoft, Meta, and other verification TXT records
- Any subdomains in active use
- CAA records

**Do not delete or replace MX, DKIM, SPF, DMARC, verification, or unrelated subdomain records.** A website cutover should not interrupt email.

Unless there is a separately approved DNS migration, keep the current authoritative nameservers. Only the apex and `www` web records need to change.

### 4. Lower DNS TTL

Reduce the TTL on the current apex and `www` web records to **300 seconds** at least 24 hours before launch. Do not lower the TTL on unrelated records.

### 5. Complete the SEO URL check

Before replacing an existing site:

1. Export the domain's landing pages from Google Search Console.
2. Export any known backlink landing pages from the available SEO tool.
3. Compare them with `docs/url-inventory-and-redirects.md`.
4. If a live or linked legacy URL is missing, pause the cutover and have development add its redirect.

Changing hosting while keeping the same domain does **not** require Google's Change of Address tool.

## Phase 2 — Add the domains to Vercel

Complete this for one brand at a time.

### Vercel dashboard method

1. Open **Vercel → `td-multi` → Settings → Domains**.
2. Click **Add Domain**.
3. Add the apex domain, such as `tackleboxtexoma.com`.
4. Add its `www` hostname, such as `www.tackleboxtexoma.com`.
5. If Vercel says the domain belongs to another Vercel account or project, complete the displayed TXT ownership verification. Do not forcibly move a domain until its current assignment is understood.
6. Open the `www` domain settings and configure it to redirect to the apex domain.
7. Confirm the apex domain is assigned to the production deployment of `td-multi`, not a preview branch.

Repeat with the exact pairs below:

```text
tackleboxtexoma.com
www.tackleboxtexoma.com

sundancetexoma.com
www.sundancetexoma.com

texomawatertaxi.com
www.texomawatertaxi.com

boaterwise.com
www.boaterwise.com

islandviewtexoma.com
www.islandviewtexoma.com
```

### Optional CLI method

The dashboard method is preferred because it clearly displays verification and DNS requirements. If IT uses the Vercel CLI, the pattern is:

```bash
vercel domains add example.com td-multi
vercel domains add www.example.com td-multi
vercel domains inspect example.com
vercel domains inspect www.example.com
```

Use the exact DNS targets returned by Vercel. Do not assume a generic target when the project provides a project-specific value.

## Phase 3 — Configure DNS and SSL

### 1. Pre-generate the certificate when available

For the cleanest cutover, use Vercel's **Pre-generate SSL Certificate** option before changing public web traffic. Add the TXT challenge record Vercel supplies, wait for it to propagate, and verify the certificate.

This is especially useful when the domain is currently serving a live website elsewhere. Vercel's certificate must cover both the apex and `www` hostname.

If the domain has CAA records, ensure they permit Let's Encrypt. Do not remove other required CAA entries without review.

### 2. Change only the web records

Use the exact values displayed under **Vercel → `td-multi` → Settings → Domains**:

- Apex domain: normally an A record or provider-supported ALIAS/flattened CNAME
- `www`: normally a CNAME

Remove or replace conflicting apex/`www` records, including obsolete AAAA records. Vercel does not currently serve custom domains over an IPv6 AAAA target.

If Cloudflare manages DNS, leave the records **DNS only** during verification and initial launch. Do not place another proxy in front of Vercel unless that architecture has been separately tested and approved.

### 3. Wait for Vercel verification

In the Vercel Domains screen, wait until both hostnames show a valid configuration and the certificate is active. DNS propagation may be quick with the lowered TTL, but do not proceed based only on the DNS-provider screen.

## Phase 4 — Validate the live domain

Run every check below before declaring the brand launched.

### DNS and transport

Replace `example.com` with the brand domain:

```bash
dig +short A example.com
dig +short CNAME www.example.com
curl -I https://example.com/
curl -I https://www.example.com/
```

Required results:

- Apex resolves to the target Vercel specifies.
- `www` resolves to Vercel and redirects to `https://example.com/`.
- HTTPS loads without a certificate warning.
- The apex homepage returns `200`.
- There is no redirect loop.

Test from a second network, such as a phone with Wi-Fi disabled, to avoid relying on one DNS cache.

### Correct brand routing

The public apex domain must display the matching brand—not the directory and not another brand. Check the logo, page title, phone number, main call to action, and footer.

### SEO endpoints

Open:

```text
https://example.com/robots.txt
https://example.com/sitemap.xml
```

Required results:

- `robots.txt` allows the public site and references that same domain's sitemap.
- `sitemap.xml` contains only that brand's canonical URLs.
- Page source contains an apex-domain canonical URL.
- The live public domain is indexable.
- `/sites/<brand>` remains `noindex` and is not submitted to search engines.

### Legacy redirects

Test all existing paths listed for the brand in `docs/url-inventory-and-redirects.md`. At minimum, verify these implemented routes:

| Brand | Legacy-path checks |
|---|---|
| Tackle Box | `/2015/03/03/hello-world-2` |
| Sundance | `/property`, `/property-map`, `/siesta`, `/reserve`, `/reserve/cart`, `/reserve/account/profile`, and a sample `/cabin-*` URL |
| Texoma Water Taxi | `/map` |
| BoaterWise | No code-defined legacy redirects; validate against the Search Console export before launch |
| Island View | `/property-map`, `/reserve`, `/reserve/cart`, `/reserve/cart/add/islandview-day-pass`, `/reserve/account/profile` |

Expected redirect status is `308` unless the destination is served directly. Preserve query strings where applicable.

### Analytics

1. Open the site's GA4 property in Realtime or DebugView.
2. Visit the public apex domain in a private browser window.
3. Confirm a `page_view` reaches the correct measurement ID from the table at the top of this guide.
4. Click a phone, booking, or external link and confirm `brand_conversion_click` is received.
5. Confirm no other brand's GA4 stream receives the test visit.

Analytics intentionally starts only when the request hostname is the configured apex or `www` domain.

### Content and conversion

- Submit or follow every primary CTA through to its intended Texoma Destinations booking page.
- Confirm UTM parameters include the originating brand domain.
- Verify phone and SMS links on a mobile device.
- Verify Google Maps links.
- Confirm announcement bars can be published and dismissed.
- Check at least one CMS edit or confirm the current CMS content appears on the production domain.

## Phase 5 — Search and business listings

After the domain passes validation:

1. In Google Search Console, verify or retain the Domain property.
2. Submit `https://example.com/sitemap.xml`.
3. Inspect the homepage and request indexing once.
4. Update the website link in the matching Google Business Profile if it points anywhere else.
5. Keep booking buttons pointed to the correct Texoma Destinations deep link with UTMs.
6. Update Facebook, Instagram, directory listings, and campaign links if they still use a temporary or legacy URL.
7. Do not remove the old hosting account immediately; retain it through the stabilization period if practical.

## Monitoring

### First hour

- Watch Vercel production logs for elevated 4xx/5xx errors.
- Confirm the homepage and primary conversion path every 15 minutes.
- Check Vercel Domains for SSL or configuration warnings.
- Confirm GA4 Realtime traffic.

### First 48 hours

- Review 404s and add redirects for legitimate legacy URLs.
- Check DNS from multiple networks/resolvers.
- Confirm email remains operational for the domain.
- Monitor Search Console indexing and sitemap status.

### First eight weeks

- Review Search Console pages, queries, indexing, and crawl errors weekly.
- Compare organic traffic and conversions with the pre-launch baseline.
- Keep valid legacy redirects in place permanently.

After 48 stable hours, the DNS TTL can be returned to the organization's normal value.

## Rollback procedure

Rollback if the wrong brand loads, HTTPS is invalid, primary booking links fail, there is a widespread 5xx error, or another business-critical service is affected.

1. Restore the previous apex and `www` web-record values from the DNS backup.
2. Leave MX, TXT, and unrelated records untouched.
3. Wait for the five-minute cutover TTL to expire and confirm the old site is serving again.
4. In Vercel, leave the domain configuration intact while the issue is diagnosed unless the configuration itself is causing a conflict.
5. If the fault is a new code deployment rather than DNS, use Vercel's production deployment rollback/promote feature to restore the prior known-good deployment.
6. Record the failure, time, affected domain, resolver results, screenshots, and Vercel request/error details before retrying.

## Per-domain completion record

Copy this checklist for each brand:

```text
Domain:
Date/time:
Cutover lead:
DNS provider:
Previous apex value:
Previous www value:
Vercel apex target:
Vercel www target:

[ ] DNS zone backed up
[ ] TTL reduced in advance
[ ] Search Console/backlink URLs reviewed
[ ] Apex added to td-multi
[ ] www added to td-multi
[ ] www redirects to apex
[ ] SSL active for both hostnames
[ ] Correct brand loads
[ ] Mobile and desktop checked
[ ] robots.txt correct
[ ] sitemap.xml correct
[ ] Canonical URL correct
[ ] Legacy redirects tested
[ ] Booking, phone, SMS, and maps links tested
[ ] Correct GA4 Realtime property confirmed
[ ] CMS/announcement content confirmed
[ ] Search Console sitemap submitted
[ ] Monitoring owner assigned
[ ] Rollback values retained
```

## Reference documentation

- [Vercel: Setting up a custom domain](https://vercel.com/docs/domains/set-up-custom-domain)
- [Vercel: Adding and configuring a custom domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Vercel: Deploying and redirecting domains](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting)
- [Vercel: Pre-generate SSL certificates](https://vercel.com/docs/domains/pre-generating-ssl-certs)
- [Vercel: Working with SSL certificates](https://vercel.com/docs/domains/working-with-ssl)
- [Vercel: Troubleshooting domains](https://vercel.com/docs/domains/troubleshooting)
- Repository redirect inventory: `docs/url-inventory-and-redirects.md`
- Repository SEO ownership plan: `docs/seo-search-ownership.md`

