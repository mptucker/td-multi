-- Texoma Collective curated partner directory and trip-planner map.
-- The public can only read approved, active, public records. CMS users assigned
-- to texomaco can manage the directory; public submissions are intentionally absent.

create table if not exists partner_organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  logo_url text,
  website_url text,
  partnership_tier text not null default 'launch_partner',
  approved boolean not null default false,
  active boolean not null default true,
  public boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists partner_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references partner_organizations(id) on delete cascade,
  slug text not null,
  name text not null,
  description text not null default '',
  address text not null default '',
  area text not null default 'Lake Texoma',
  latitude double precision not null,
  longitude double precision not null,
  categories text[] not null default '{}'::text[],
  image_url text,
  booking_url text,
  contact_url text,
  map_brand_key text,
  map_place_id text,
  active boolean not null default true,
  public boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

drop trigger if exists partner_organizations_updated on partner_organizations;
create trigger partner_organizations_updated before update on partner_organizations for each row execute function set_updated_at();
drop trigger if exists partner_locations_updated on partner_locations;
create trigger partner_locations_updated before update on partner_locations for each row execute function set_updated_at();

alter table partner_organizations enable row level security;
alter table partner_locations enable row level security;

drop policy if exists "public approved partner organizations" on partner_organizations;
create policy "public approved partner organizations" on partner_organizations for select to anon
  using (approved and active and public);
drop policy if exists "public approved partner locations" on partner_locations;
create policy "public approved partner locations" on partner_locations for select to anon
  using (active and public and exists (
    select 1 from partner_organizations o
    where o.id = organization_id and o.approved and o.active and o.public
  ));

drop policy if exists "cms partner organizations" on partner_organizations;
create policy "cms partner organizations" on partner_organizations for select to authenticated
  using (cms_is_active() and cms_can_brand('texomaco'));
drop policy if exists "cms write partner organizations" on partner_organizations;
create policy "cms write partner organizations" on partner_organizations for all to authenticated
  using (cms_can_write() and cms_can_brand('texomaco'))
  with check (cms_can_write() and cms_can_brand('texomaco'));
drop policy if exists "cms partner locations" on partner_locations;
create policy "cms partner locations" on partner_locations for select to authenticated
  using (cms_is_active() and cms_can_brand('texomaco'));
drop policy if exists "cms write partner locations" on partner_locations;
create policy "cms write partner locations" on partner_locations for all to authenticated
  using (cms_can_write() and cms_can_brand('texomaco'))
  with check (cms_can_write() and cms_can_brand('texomaco'));

grant select on partner_organizations, partner_locations to anon;
grant select, insert, update, delete on partner_organizations, partner_locations to authenticated;

insert into partner_organizations (slug, name, description, website_url, partnership_tier, approved, active, public, sort_order) values
  ('lighthouse', 'Lighthouse Resort & Marina', 'Cabins, RV sites, a full-service marina and boat rentals on Little Mineral.', 'https://lighthouseresort.com', 'launch_partner', true, true, true, 10),
  ('paradise', 'Paradise on Lake Texoma', 'A relaxed lakeside stay with cabins, glamping, RV and tent sites.', 'https://paradisetexoma.com', 'launch_partner', true, true, true, 20),
  ('sundance', 'Sundance Camp', 'A tiny-cabin village and gathering place at the tip of Preston Point.', 'https://sundancetexoma.com', 'launch_partner', true, true, true, 30),
  ('island-view', 'Island View Park', 'Lake Texoma beach days, shelters, paddling and easy family fun.', 'https://islandviewtexoma.com', 'launch_partner', true, true, true, 40),
  ('fastrac', 'Fastrac Cruises', 'Public cruises and private charters departing Lighthouse Marina.', 'https://fastrac.com', 'launch_partner', true, true, true, 50),
  ('tackle-box', 'Tackle Box Outfitters', 'Fishing, outdoor gear, fuel and local knowledge on Highway 289.', 'https://tackleboxtexoma.com', 'launch_partner', true, true, true, 60),
  ('texoma-destinations', 'Texoma Destinations', 'One place to plan and book stays and experiences across Lake Texoma.', 'https://texomadestinations.com', 'launch_partner', true, true, true, 70),
  ('big-water-marine', 'Big Water Marine', 'Premium boat sales and marine service in Pottsboro.', 'https://bigwatermarine.com', 'launch_partner', true, true, true, 80),
  ('big-water-boat-club', 'Big Water Boat Club', 'A premium boat fleet without the ownership work.', 'https://bigwatermarine.com/boatclub', 'launch_partner', true, true, true, 90),
  ('towboatus-ntx', 'TowBoatUS North Texas', '24/7 on-water assistance across Lake Texoma.', 'https://towboatusntx.com', 'launch_partner', true, true, true, 100)
on conflict (slug) do update set name=excluded.name, description=excluded.description, website_url=excluded.website_url;

insert into partner_locations (organization_id, slug, name, description, address, area, latitude, longitude, categories, map_brand_key, map_place_id, booking_url, sort_order)
select o.id, v.slug, v.name, v.description, v.address, v.area, v.latitude, v.longitude, v.categories, v.map_brand_key, v.map_place_id, v.booking_url, v.sort_order
from (values
  ('lighthouse','resort','Lighthouse Resort & Marina','Cabins, RV sites and marina services in one lakefront place.','300 Lighthouse Drive, Pottsboro, TX 75076','Little Mineral',33.860666,-96.662635,array['stay','water'],'lighthouse','lighthouse','https://texomadestinations.com/where-to-stay/cabins#/lighthouse',10),
  ('lighthouse','fuel-dock','Lighthouse Fuel Dock','Fuel, lake store, boat rentals and paddling.','300 Lighthouse Drive, Pottsboro, TX 75076','Little Mineral',33.85922,-96.66162,array['water'],'fuel','lighthouse','https://texomadestinations.com/things-to-do/boat-rentals',11),
  ('fastrac','charter-dock','Fastrac Cruises','Sunset cruises, dinner cruises and private charters.','Lighthouse Marina, Pottsboro, TX 75076','Little Mineral',33.858662,-96.661691,array['play','water'],'fastrac','lighthouse','https://texomadestinations.com/things-to-do#/charters-cruises',20),
  ('big-water-boat-club','lighthouse','Big Water Boat Club','Club fleet based at the Lighthouse Fuel Dock.','300 Lighthouse Drive, Pottsboro, TX 75076','Little Mineral',33.85922,-96.66162,array['water'],'boatclub','lighthouse','https://bigwatermarine.com/boatclub',30),
  ('island-view','park','Island View Park','Sandy beach, covered shelters and paddle rentals.','87426 Preston Bend Rd, Pottsboro, TX 75076','Preston Peninsula',33.8594498,-96.67116,array['play'],'island-view','island-view','https://texomadestinations.com/things-to-do#/beach-access',40),
  ('sundance','camp','Sundance Camp','Tiny cabins, RV sites and group gatherings.','295 Glen Eden Drive, Pottsboro, TX 75076','Preston Point',33.8784503,-96.6363588,array['stay'],'sundance','sundance','https://texomadestinations.com/where-to-stay/cabins#/sundance',50),
  ('tackle-box','store','Tackle Box Outfitters','Fishing and outdoor headquarters near Lake Texoma.','83924 N State Hwy 289, Pottsboro, TX 75076','Highway 289',33.834293,-96.678798,array['shop'],'tackle-box','tackle',null,60),
  ('texoma-destinations','office','Texoma Destinations','Local trip planning and booking help.','81750 N State Hwy 289, Suite 106, Pottsboro, TX 75076','Highway 289',33.834293,-96.678798,array['stay','play'],'td','tackle','https://texomadestinations.com',70),
  ('big-water-marine','service','Big Water Marine Service','Marine service and support in Pottsboro.','33 Tackle Box Drive, Pottsboro, TX 75076','Highway 289',33.83441,-96.67995,array['shop'],'bwm-service','tackle','https://bigwatermarine.com/service',80),
  ('big-water-marine','sales','Big Water Marine Sales','Premium new and pre-owned boats.','50055 N State Hwy 289, Pottsboro, TX 75076','Pottsboro',33.7965322,-96.677637,array['shop'],'bwm-sales','bwm-sales','https://bigwatermarine.com',81),
  ('paradise','resort','Paradise on Lake Texoma','Cabins, glamping, RV and tent sites on Big Mineral.','503 Paradise Park Rd, Pottsboro, TX 75076','Big Mineral',33.7948778,-96.7871514,array['stay','play'],'paradise','paradise','https://texomadestinations.com/where-to-stay/cabins#/paradise',90)
) as v(org_slug,slug,name,description,address,area,latitude,longitude,categories,map_brand_key,map_place_id,booking_url,sort_order)
join partner_organizations o on o.slug=v.org_slug
on conflict (organization_id, slug) do update set name=excluded.name, description=excluded.description, address=excluded.address, area=excluded.area, latitude=excluded.latitude, longitude=excluded.longitude, categories=excluded.categories, map_brand_key=excluded.map_brand_key, map_place_id=excluded.map_place_id, booking_url=excluded.booking_url;
