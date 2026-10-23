# GA4 analytics in the Brand Page CMS

The authenticated CMS now includes an **Analytics** tab. It reads finalized reporting data from the Google Analytics Data API and limits each user to the brands already assigned to that CMS account.

## Google setup

1. In Google Cloud, enable **Google Analytics Data API** for the Texoma Destinations reporting project.
2. Create a service account and a JSON key.
3. In each GA4 property, open **Admin → Property access management** and add the service-account email with the **Viewer** role.
4. Copy each property's numeric **Property ID** from **Admin → Property details**. This is not the `G-...` web-stream measurement ID.

## Vercel environment variables

Add these as encrypted Production environment variables on the `td-multi` project:

- `GA4_SERVICE_ACCOUNT_JSON`: the complete service-account key JSON.
- `GA4_PROPERTY_IDS`: one JSON object mapping brand slugs to numeric property IDs.

Example shape (use real numeric IDs):

```json
{
  "lighthouse": "123456789",
  "paradise": "123456790",
  "sundance": "123456791",
  "island-view": "123456792",
  "fastrac": "123456793",
  "water-taxi": "123456794",
  "tackle-box": "123456795",
  "boaterwise": "123456796",
  "bigwater": "123456797",
  "towboatus-ntx": "123456798"
}
```

Alternatively, credentials can be provided as `GA4_CLIENT_EMAIL` and `GA4_PRIVATE_KEY`, and property IDs can be supplied individually as `GA4_PROPERTY_ID_LIGHTHOUSE`, `GA4_PROPERTY_ID_PARADISE`, and the corresponding uppercase underscore form for each slug.

Redeploy after adding or changing environment variables. A brand without a mapped property shows a setup message rather than failing the CMS.

## Data and security behavior

- The browser sends the existing Supabase session token only to the authenticated CMS endpoint.
- The endpoint verifies the CMS account and its brand assignment before querying GA4.
- Service-account credentials are server-only and are never returned to the browser.
- Reports are cached in the server process for 15 minutes to limit API use.
- The dashboard offers 7-, 30-, and 90-day ranges and reports through yesterday, avoiding partial same-day totals.
- The dashboard reads users, sessions, page views, engagement, key events, top pages, acquisition channels, devices, and tracked CTA/lead events.

The sites emit `brand_conversion_click` with a `link_intent` event parameter. To break CTA clicks into booking, phone, directions, text, and outbound categories inside GA4 reports, register `link_intent` as an event-scoped custom dimension in each GA4 property. The initial CMS dashboard reports the aggregate event count without depending on that registration.
