-- Texoma Destinations Brand Sites — Seed Data
-- Paste this into Supabase SQL Editor and run it

-- ============================================================================
-- EVENTS
-- ============================================================================
INSERT INTO events (id, slug, title, starts_at, ends_at, location, summary, image, price_text, cta_label, cta_url, show_on_sites, published)
VALUES
  (
    'evt-texie-2026-09-05',
    'discovering-texie-cruise-sep-2026',
    'Discovering Texie Cruise for Kids',
    '2026-09-05T10:00:00-05:00',
    '2026-09-05T11:30:00-05:00',
    'Fastrac Charter Dock, Lighthouse Marina',
    'A 90-minute storytelling cruise with Lake Texoma''s official mascot, Texie the Dragon — magical surprises and a light brunch included.',
    'https://texomadestinations.com/wp-content/uploads/2026/06/texie_cruises_header-1024x768.jpg',
    '$19.44 per person',
    'Get tickets',
    'https://fastrac.com/reserve/cart/add/cruise/3009?utm_source=brand-site&utm_medium=events&utm_campaign=texie',
    ARRAY['fastrac', 'lighthouse', 'paradise', 'island-view', 'tackle-box'],
    true
  ),
  (
    'evt-eagle-2027-01',
    'eagle-watching-breakfast-cruises-2027',
    'Eagle Watching Breakfast Cruises',
    '2027-01-09T08:00:00-06:00',
    '2027-02-27T10:00:00-06:00',
    'Fastrac Charter Dock, Lighthouse Marina',
    'Saturdays and select Sundays in January and February: a hot breakfast, mimosa and Bloody Mary setups, and the best seats on the lake for bald eagle season.',
    'https://texomadestinations.com/wp-content/uploads/2023/06/Q0A3022.jpg',
    '$59 · kids 3 & under free',
    'See dates',
    'https://texomadestinations.com/things-to-do?utm_source=brand-site&utm_medium=events&utm_campaign=eagle#/charters-cruises',
    ARRAY['fastrac', 'lighthouse', 'sundance'],
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  starts_at = EXCLUDED.starts_at,
  ends_at = EXCLUDED.ends_at,
  location = EXCLUDED.location,
  summary = EXCLUDED.summary,
  image = EXCLUDED.image,
  price_text = EXCLUDED.price_text,
  cta_label = EXCLUDED.cta_label,
  cta_url = EXCLUDED.cta_url,
  show_on_sites = EXCLUDED.show_on_sites,
  published = EXCLUDED.published;

-- ============================================================================
-- PACKAGES
-- ============================================================================
INSERT INTO packages (id, slug, title, summary, details, price_text, image, cta_label, cta_intent, show_on_sites, published, sort_order)
VALUES
  (
    'pkg-tap',
    'tap-membership',
    'TAP — Texoma Access Package',
    'One annual membership that pays for itself in a couple of visits: free day use at Island View and Paradise, free boat-ramp access at Lighthouse and Paradise, and 5–15% off stays, rentals and cruises.',
    ARRAY['Explorer $99 · Adventurer $199 · Navigator $399 per year', 'Discounts at the Lighthouse fuel dock and the Tackle Box', 'Early-bird access to special events and cruises'],
    'From $99 / year',
    'https://texomadestinations.com/wp-content/uploads/2024/05/DescribeTheFauna_TexomaDestinations_Q0A8092-Edit-scaled.jpg',
    'Compare TAP tiers',
    'tap',
    ARRAY['lighthouse', 'paradise', 'sundance', 'island-view', 'fastrac', 'tackle-box', 'boaterwise'],
    true,
    1
  ),
  (
    'pkg-picnic-boat',
    'boat-ride-island-picnic',
    'Boat Ride + Island Picnic for Two',
    'Two hours, one secluded beach. We set the blanket, basket and pillows, bring the meal and sparkling water, and handle the boat ride there and back.',
    ARRAY['2 hours · private captain', 'Meal, small cooler and Bluetooth speaker included', 'Set-up and tear-down handled for you'],
    '$350',
    'https://texomadestinations.com/wp-content/uploads/2023/07/boat-ride.jpg',
    'Reserve a picnic',
    'picnics',
    ARRAY['fastrac', 'lighthouse', 'paradise', 'sundance', 'water-taxi'],
    true,
    2
  ),
  (
    'pkg-picnic-beach',
    'beach-picnic-for-two',
    'Beach Picnic for Two',
    'A styled two-hour picnic on the sand — custom color theme, fresh florals, umbrella and décor — perfect for proposals and anniversaries.',
    ARRAY['2 hours on the beach', 'Add a boat ride for $150 per hour'],
    '$250',
    'https://texomadestinations.com/wp-content/uploads/2023/07/events-table-night.jpg',
    'Reserve a picnic',
    'picnics',
    ARRAY['island-view', 'fastrac', 'lighthouse', 'paradise'],
    true,
    3
  ),
  (
    'pkg-stay-n-play',
    'stay-n-play-late-checkout',
    'Stay-N-Play Late Checkout',
    'Keep the cabin until evening and squeeze in one more lake day. Available Sunday through Wednesday, subject to availability — add it in your reservation.',
    NULL,
    'Ask at booking',
    NULL,
    'Manage my reservation',
    'my-reservations',
    ARRAY['lighthouse', 'paradise', 'sundance'],
    true,
    4
  ),
  (
    'pkg-firewood-delivery',
    'campfire-delivery',
    'Campfire Delivery',
    'Firewood, ice, charcoal and lighter fluid delivered to your site between 8am and 8pm so you never leave the fire.',
    ARRAY['Firewood (45 lb) $30 · Ice (7 lb) $5 · Charcoal $12 · Lighter fluid $8'],
    NULL,
    NULL,
    'Add to my stay',
    'my-reservations',
    ARRAY['lighthouse', 'paradise', 'sundance'],
    true,
    5
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  details = EXCLUDED.details,
  price_text = EXCLUDED.price_text,
  image = EXCLUDED.image,
  cta_label = EXCLUDED.cta_label,
  cta_intent = EXCLUDED.cta_intent,
  show_on_sites = EXCLUDED.show_on_sites,
  published = EXCLUDED.published,
  sort_order = EXCLUDED.sort_order;

-- ============================================================================
-- ALERTS
-- ============================================================================
INSERT INTO alerts (id, text, cta_label, cta_url, starts_at, ends_at, show_on_sites, published)
VALUES
  (
    'alert-labor-day-2026',
    'Fall is the best-kept secret on Texoma — cooler evenings, quieter coves, and weekday rates.',
    'Check fall availability',
    'https://texomadestinations.com/where-to-stay/cabins?utm_source=brand-site&utm_medium=alert&utm_campaign=fall-2026',
    '2026-09-01T00:00:00-05:00',
    '2026-10-31T23:59:59-05:00',
    ARRAY['lighthouse', 'paradise', 'sundance'],
    true
  )
ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  cta_label = EXCLUDED.cta_label,
  cta_url = EXCLUDED.cta_url,
  starts_at = EXCLUDED.starts_at,
  ends_at = EXCLUDED.ends_at,
  show_on_sites = EXCLUDED.show_on_sites,
  published = EXCLUDED.published;

-- ============================================================================
-- FACTS
-- ============================================================================
INSERT INTO facts (key, brand, label, value, owner, last_verified, source_url, notes)
VALUES
  ('hub.checkin', 'hub', 'Check-in / check-out', '3pm / 11am', 'Reservations', '2026-09-03', 'https://texomadestinations.com/properties/lighthouse', 'Consistent across hub + all legacy sites (Sundance legacy rules page said 12pm — hub wins).'),
  ('hub.quiet_hours', 'hub', 'Quiet hours', '11pm – 7am', 'Operations', '2026-09-03', 'https://texomadestinations.com/guestguide', NULL),
  ('hub.pet_fee', 'hub', 'Pet fee', '$35 per pet, max 2, no aggressive breeds', 'Reservations', '2026-09-03', 'https://texomadestinations.com/properties/paradise', NULL),
  ('hub.cancel_pay_at_checkin', 'hub', 'Cancellation — Pay at Check-In', '14 days notice or one night charged', 'Reservations', '2026-09-03', 'https://texomadestinations.com/properties/lighthouse', NULL),
  ('hub.cancel_pay_now', 'hub', 'Cancellation — Pay Now & Save', 'Non-refundable; only adding nights allowed; changes online only', 'Reservations', '2026-09-03', NULL, NULL),
  ('hub.min_stay', 'hub', 'Minimum stay', '2 nights peak (Apr 1–Oct 31), 3 nights holiday weekends', 'Reservations', '2026-09-03', 'https://lighthouseresort.com/rules/', 'From legacy rules pages; not stated on hub — hub developer should add.'),
  ('hub.min_age', 'hub', 'Minimum booking age', '25 (21 for boat rentals)', 'Reservations', '2026-09-03', 'https://lighthouseresort.com/rules/', 'Legacy sites only — confirm and publish on hub.'),
  ('hub.tap_prices', 'hub', 'TAP tiers', 'Explorer $99 · Adventurer $199 · Navigator $399 per year', 'Marketing', '2026-09-03', 'https://texomadestinations.com/tap', NULL),

  ('lighthouse.cabin_count', 'lighthouse', 'Cabins', '34', 'Lighthouse GM', '2026-09-03', 'https://texomadestinations.com/where-to-stay/cabins', 'CONFLICT: hub page 34, booking widget copy 35, legacy site 35. Set to hub page value pending GM confirmation.'),
  ('lighthouse.rv_count', 'lighthouse', 'Waterfront RV sites', '19', 'Lighthouse GM', '2026-09-03', 'https://texomadestinations.com/where-to-stay/rv-sites', 'CONFLICT: hub page 19, widget 20, legacy 20.'),
  ('lighthouse.sleeps', 'lighthouse', 'Cabin capacity', '1–16 guests', 'Lighthouse GM', '2026-09-03', NULL, NULL),
  ('lighthouse.slips', 'lighthouse', 'Covered slips', '20''–50'', month-to-month or prepaid, waitlist', 'Marina Manager', '2026-09-03', 'https://texomadestinations.com/lighthouse-marina', NULL),
  ('lighthouse.transient_slip', 'lighthouse', 'Nightly guest slip', 'Confirm at check-in', 'Marina Manager', NULL, NULL, 'CONFLICT: legacy $40 (cabins page) vs $25 (rules page). Not published until confirmed.'),
  ('lighthouse.lodge_capacity', 'lighthouse', 'Lodge capacity', '80', 'Events Director', '2026-09-03', 'https://texomadestinations.com/events', 'Legacy pages said 75.'),
  ('lighthouse.fireside_capacity', 'lighthouse', 'Fireside capacity', '25', 'Events Director', '2026-09-03', NULL, 'Legacy page said ~36.'),
  ('lighthouse.rental_public_rates', 'lighthouse', 'Tritoon public rates', '$600–$750 full day · $450–$600 half day', 'Marina Manager', '2026-09-03', 'https://texomadestinations.com/api/v1/texomadestinations/pontoons', 'Hub boat-rentals page shows ''from $300/$500'' which are 50%-off member prices; fuel: FAQ says pay for fuel used, pricing card says fuel included — needs fix.'),

  ('paradise.glamping', 'paradise', 'Glamping units', '4 Kabanas · 6 Kasitas · Kimas', 'Paradise Manager', '2026-09-03', 'https://paradisetexoma.com/', 'Hub gives no counts. Kimas (10 unit pages) missing from homepage copy.'),
  ('paradise.rv_count', 'paradise', 'RV sites', '40', 'Paradise Manager', '2026-09-03', 'https://paradisetexoma.com/stay/', 'Legacy copy 40; only 29 unit pages exist; API says ''over 50 RV and tent sites''.'),
  ('paradise.acreage', 'paradise', 'Acreage', '200 acres', 'Paradise Manager', '2026-09-03', 'https://texomadestinations.com/api/v1/texomadestinations/search-config-primitivecamp', NULL),
  ('paradise.ramp_limit', 'paradise', 'Boat ramp', 'Vessels 26'' and under; 9am–sunset', 'Paradise Manager', '2026-09-03', 'https://texomadestinations.com/properties/paradise', NULL),
  ('paradise.day_use', 'paradise', 'Day-use fee', 'Confirm', 'Paradise Manager', NULL, NULL, 'CONFLICT: legacy rules $7 vs things-to-do $10. Not published until confirmed.'),
  ('paradise.address', 'paradise', 'Street address', '503 Paradise Park Road', 'Marketing', '2026-09-03', NULL, 'Legacy site mixes ''Dr.'' and ''Rd.'' — GBP shows ''Paradise Cove Resort & Camp''. Standardise everywhere.'),

  ('sundance.cabin_count', 'sundance', 'Tiny cabins', '7', 'Sundance Manager', '2026-09-03', 'https://texomadestinations.com/properties/sundance', NULL),
  ('sundance.rv_count', 'sundance', 'RV sites', '6', 'Sundance Manager', '2026-09-03', 'https://texomadestinations.com/properties/sundance', 'CONFLICT: legacy site says 7.'),
  ('sundance.acreage', 'sundance', 'Acreage', '80 acres', 'Sundance Manager', '2026-09-03', NULL, NULL),
  ('sundance.group_capacity', 'sundance', 'Group capacity', 'Sleeps 50+, gatherings up to 100', 'Events Director', '2026-09-03', 'https://sundancetexoma.com/property/', NULL),
  ('sundance.rollaway', 'sundance', 'Rollaway bed', '$100 (cabins 1–3); kids under 6 free in king', 'Reservations', '2026-09-03', 'https://texomadestinations.com/properties/sundance', NULL),

  ('islandview.hours', 'island-view', 'Hours', '9am to sunset, daily, year-round', 'Island View Manager', '2026-09-03', 'https://texomadestinations.com/properties/island-view', NULL),
  ('islandview.day_pass', 'island-view', 'Day pass', '$7 per person · kids 7 & under free', 'Island View Manager', '2026-09-03', 'https://islandviewtexoma.com/', 'Hub shows no price. Legacy Lighthouse page says ''under 3 free'' — retire.'),
  ('islandview.shelter', 'island-view', 'Covered shelter', '$40 per day, reservation only', 'Island View Manager', '2026-09-03', 'https://islandviewtexoma.com/', NULL),
  ('islandview.kayak', 'island-view', 'Kayak / SUP', '$25/hr single · $40/hr double · SUP $25/hr', 'Island View Manager', '2026-09-03', 'https://islandviewtexoma.com/', NULL),

  ('fastrac.island_girl', 'fastrac', 'Island Girl capacity', '70 passengers · seated dinner 48', 'Fastrac Ops', '2026-09-03', 'https://texomadestinations.com/properties/fastrac', 'CONFLICT: legacy vessel page says up to 86.'),
  ('fastrac.sight_sea_er', 'fastrac', 'Sight-Sea-Er II capacity', '36', 'Fastrac Ops', '2026-09-03', NULL, 'Vessel page says 37; tour page 36.'),
  ('fastrac.cancel_public', 'fastrac', 'Public cruise cancellation', '72 hours', 'Fastrac Ops', '2026-09-03', 'https://fastrac.com/rules/', NULL),
  ('fastrac.cancel_private', 'fastrac', 'Private charter cancellation', '14 days', 'Fastrac Ops', '2026-09-03', 'https://texomadestinations.com/properties/fastrac', NULL),
  ('fastrac.sunset_price', 'fastrac', 'Sunset cruise', '$35', 'Fastrac Ops', '2026-09-03', 'https://fastrac.com/cruises/sunset-cruise-experience/', NULL),
  ('fastrac.dinner_price', 'fastrac', 'Dinner cruise', '$60 adults · $40 kids 3–12', 'Fastrac Ops', '2026-09-03', 'https://fastrac.com/cruises/dinner-cruise-experience/', NULL),

  ('watertaxi.rates', 'water-taxi', 'Rates', '$25/person each way Highport ↔ islands · $100/hr private (up to 6)', 'Fastrac Ops', '2026-09-03', 'https://fastrac.com/cruises/water-taxi/', 'CONFLICT: shop page says $20pp on Jolt; sightseeing $180/hr vs Boat Ride $150/hr.'),
  ('watertaxi.surcharges', 'water-taxi', 'Surcharges', '$20 night trips · $5/person holiday weekends', 'Fastrac Ops', '2026-09-03', NULL, NULL),

  ('tacklebox.license', 'tackle-box', 'Lake Texoma fishing license', '$12 (residents and non-residents)', 'Store Manager', '2026-09-03', 'https://texomadestinations.com/properties/the-tackle-box', NULL),
  ('tacklebox.shop_online', 'tackle-box', 'Online store', 'Offline — shoponline.tackleboxtexoma.com no longer resolves', 'MT', '2026-09-03', NULL, 'Remove or restore before launch; linked from hub in 2 places.'),

  ('boaterwise.module_price', 'boaterwise', 'NSBC on-water module', '$199 · 3 hours · 2–4 students', 'BoaterWise', '2026-09-03', 'https://boaterwise.com/', NULL),
  ('boaterwise.boat_limit', 'boaterwise', 'Boat size limit', 'No instruction on boats over 32''', 'BoaterWise', '2026-09-03', NULL, NULL)
ON CONFLICT (key) DO UPDATE SET
  brand = EXCLUDED.brand,
  label = EXCLUDED.label,
  value = EXCLUDED.value,
  owner = EXCLUDED.owner,
  last_verified = EXCLUDED.last_verified,
  source_url = EXCLUDED.source_url,
  notes = EXCLUDED.notes;

-- Done! You should see:
-- 2 events
-- 5 packages
-- 1 alert
-- 44 facts
