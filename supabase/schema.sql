-- Texoma Destinations brand sites — central content store
-- Run in the Supabase SQL editor. Public (anon) role may READ published rows only;
-- writes go through the /admin UI using the service-role key on the server.

create extension if not exists "pgcrypto";

-- Brand slugs are validated in the app; keep as text[] for flexibility.
create table if not exists brand_content (
  brand text primary key,
  content jsonb not null,
  draft_content jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table brand_content add column if not exists draft_content jsonb;
alter table brand_content add column if not exists published_at timestamptz;

-- CMS staff are authenticated by Supabase Phone OTP. Authorization is deliberately
-- separate from auth.users so access can be revoked without deleting an identity.
create table if not exists cms_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  phone text,
  role text not null default 'viewer' check (role in ('admin','director','site_manager','editor','viewer')),
  active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cms_user_sites (
  user_id uuid not null references cms_users(user_id) on delete cascade,
  brand text not null,
  primary key (user_id, brand)
);

create table if not exists cms_access_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  phone text,
  requested_at timestamptz not null default now()
);

create or replace function normalize_us_phone() returns trigger language plpgsql as $$
declare digits text;
begin
  if new.phone is null then return new; end if;
  digits := regexp_replace(new.phone, '[^0-9]', '', 'g');
  if length(digits) = 10 then
    new.phone := '+1' || digits;
  elsif length(digits) = 11 and left(digits, 1) = '1' then
    new.phone := '+' || digits;
  else
    raise exception 'Phone number must be a valid 10-digit US number';
  end if;
  return new;
end $$;
drop trigger if exists cms_users_normalize_phone on cms_users;
create trigger cms_users_normalize_phone before insert or update of phone on cms_users for each row execute function normalize_us_phone();
drop trigger if exists cms_requests_normalize_phone on cms_access_requests;
create trigger cms_requests_normalize_phone before insert or update of phone on cms_access_requests for each row execute function normalize_us_phone();
update cms_users set phone = phone where phone is not null;
update cms_access_requests set phone = phone where phone is not null;

create table if not exists brand_settings (
  brand text primary key,
  street_address text,
  city text,
  region text,
  postal_code text,
  phone text,
  phone_e164 text,
  email text,
  facebook text,
  instagram text,
  tiktok text,
  updated_at timestamptz not null default now()
);

create table if not exists global_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists faqs_brand_idx on faqs (brand, sort_order);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  brand text,
  storage_path text unique not null,
  public_url text not null,
  filename text not null,
  mime_type text not null,
  width int,
  height int,
  alt_text text not null,
  caption text,
  focal_x numeric not null default .5,
  focal_y numeric not null default .5,
  archived boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  brand text,
  snapshot jsonb not null,
  action text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists content_revisions_entity_idx on content_revisions(entity_type, entity_id, created_at desc);

create table if not exists cms_audit_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  brand text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists cms_audit_created_idx on cms_audit_log(created_at desc);

create table if not exists conversion_clicks (
  id bigint generated always as identity primary key,
  brand text not null,
  event_name text not null,
  entity_type text,
  entity_id text,
  destination text,
  campaign text,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('brand-media', 'brand-media', true, 15728640, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true;

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text not null default '',
  summary text not null default '',
  image text,
  price_text text,
  capacity text,
  cta_label text,
  cta_url text,
  show_on_sites text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists events_sites_idx on events using gin (show_on_sites);
create index if not exists events_starts_idx on events (starts_at);

create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null default '',
  details text[],
  price_text text,
  promo_code text,
  terms text,
  image text,
  cta_label text,
  cta_url text,
  cta_intent text,
  valid_from date,
  valid_to date,
  show_on_sites text[] not null default '{}',
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists packages_sites_idx on packages using gin (show_on_sites);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  cta_label text,
  cta_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  promo_code text,
  dismissible boolean not null default true,
  priority int not null default 0,
  show_on_sites text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table events add column if not exists capacity text;
alter table packages add column if not exists promo_code text;
alter table packages add column if not exists terms text;
alter table alerts add column if not exists promo_code text;
alter table alerts add column if not exists dismissible boolean not null default true;
alter table alerts add column if not exists priority int not null default 0;

-- Facts registry: every operational number with an owner and a "last verified" date.
create table if not exists facts (
  key text primary key,
  brand text not null,
  label text not null,
  value text not null,
  owner text,
  last_verified date,
  source_url text,
  notes text,
  updated_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
do $$ declare t text;
begin
  foreach t in array array['brand_content','events','packages','alerts','facts','cms_users','brand_settings','global_settings','faqs','media_assets'] loop
    execute format('drop trigger if exists %I_updated on %I', t, t);
    execute format('create trigger %I_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- Row-level security: anon can read published rows; all writes via service role.
alter table brand_content enable row level security;
alter table events enable row level security;
alter table packages enable row level security;
alter table alerts enable row level security;
alter table facts enable row level security;
alter table cms_users enable row level security;
alter table cms_user_sites enable row level security;
alter table cms_access_requests enable row level security;
alter table brand_settings enable row level security;
alter table global_settings enable row level security;
alter table faqs enable row level security;
alter table media_assets enable row level security;
alter table content_revisions enable row level security;
alter table cms_audit_log enable row level security;
alter table conversion_clicks enable row level security;

create or replace function cms_is_active() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from cms_users where user_id = auth.uid() and active)
$$;
create or replace function cms_is_leader() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from cms_users where user_id = auth.uid() and active and role in ('admin','director'))
$$;
create or replace function cms_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from cms_users where user_id = auth.uid() and active and role = 'admin')
$$;
create or replace function cms_can_write() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from cms_users where user_id = auth.uid() and active and role <> 'viewer')
$$;
create or replace function cms_can_brand(target text) returns boolean
language sql stable security definer set search_path = public as $$
  select cms_is_leader() or exists(select 1 from cms_user_sites where user_id = auth.uid() and brand = target)
$$;
create or replace function cms_can_sites(targets text[]) returns boolean
language sql stable security definer set search_path = public as $$
  select cms_is_leader() or (coalesce(array_length(targets, 1), 0) > 0 and not exists (
    select 1 from unnest(targets) s where not cms_can_brand(s)
  ))
$$;
create or replace function cms_touch_login() returns void
language sql security definer set search_path = public as $$
  update cms_users set last_login_at = now() where user_id = auth.uid() and active
$$;
grant execute on function cms_touch_login() to authenticated;

drop policy if exists "anon read brand_content" on brand_content;
create policy "anon read brand_content" on brand_content for select to anon using (true);
drop policy if exists "anon read published events" on events;
create policy "anon read published events" on events for select to anon using (published);
drop policy if exists "anon read published packages" on packages;
create policy "anon read published packages" on packages for select to anon using (published);
drop policy if exists "anon read published alerts" on alerts;
create policy "anon read published alerts" on alerts for select to anon using (published);
drop policy if exists "anon read facts" on facts;
create policy "anon read facts" on facts for select to anon using (true);
drop policy if exists "anon read brand settings" on brand_settings;
create policy "anon read brand settings" on brand_settings for select to anon using (true);
drop policy if exists "anon read global settings" on global_settings;
create policy "anon read global settings" on global_settings for select to anon using (true);
drop policy if exists "anon read published faqs" on faqs;
create policy "anon read published faqs" on faqs for select to anon using (published);
drop policy if exists "anon read media" on media_assets;
create policy "anon read media" on media_assets for select to anon using (not archived);

-- Staff access is enforced by role and brand assignment even not by the interface.
drop policy if exists "cms own profile" on cms_users;
create policy "cms own profile" on cms_users for select to authenticated using (user_id = auth.uid() or cms_is_admin());
drop policy if exists "cms admin profiles" on cms_users;
create policy "cms admin profiles" on cms_users for all to authenticated using (cms_is_admin()) with check (cms_is_admin());
drop policy if exists "cms assignments" on cms_user_sites;
create policy "cms assignments" on cms_user_sites for select to authenticated using (user_id = auth.uid() or cms_is_admin());
drop policy if exists "cms manage assignments" on cms_user_sites;
create policy "cms manage assignments" on cms_user_sites for all to authenticated using (cms_is_admin()) with check (cms_is_admin());
drop policy if exists "request cms access" on cms_access_requests;
create policy "request cms access" on cms_access_requests for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "read cms access requests" on cms_access_requests;
create policy "read cms access requests" on cms_access_requests for select to authenticated using (user_id = auth.uid() or cms_is_admin());
drop policy if exists "manage cms access requests" on cms_access_requests;
create policy "manage cms access requests" on cms_access_requests for delete to authenticated using (cms_is_admin());

drop policy if exists "cms brand content" on brand_content;
create policy "cms brand content" on brand_content for select to authenticated using (cms_can_brand(brand));
drop policy if exists "cms write brand content" on brand_content;
create policy "cms write brand content" on brand_content for update to authenticated using (cms_can_write() and cms_can_brand(brand)) with check (cms_can_write() and cms_can_brand(brand));

drop policy if exists "cms events" on events;
create policy "cms events" on events for all to authenticated using (cms_is_active() and cms_can_sites(show_on_sites)) with check (cms_can_write() and cms_can_sites(show_on_sites));
drop policy if exists "cms packages" on packages;
create policy "cms packages" on packages for all to authenticated using (cms_is_active() and cms_can_sites(show_on_sites)) with check (cms_can_write() and cms_can_sites(show_on_sites));
drop policy if exists "cms alerts" on alerts;
create policy "cms alerts" on alerts for all to authenticated using (cms_is_active() and cms_can_sites(show_on_sites)) with check (cms_can_write() and cms_can_sites(show_on_sites));
drop policy if exists "cms facts" on facts;
create policy "cms facts" on facts for all to authenticated using (cms_is_active() and (brand = 'hub' or cms_can_brand(brand))) with check (cms_can_write() and (brand = 'hub' or cms_can_brand(brand)));
drop policy if exists "cms faqs" on faqs;
create policy "cms faqs" on faqs for all to authenticated using (cms_can_brand(brand)) with check (cms_can_write() and cms_can_brand(brand));
drop policy if exists "cms brand settings" on brand_settings;
create policy "cms brand settings" on brand_settings for all to authenticated using (cms_can_brand(brand)) with check (cms_can_write() and cms_can_brand(brand));
drop policy if exists "cms global settings" on global_settings;
create policy "cms global settings" on global_settings for select to authenticated using (cms_is_active());
drop policy if exists "cms write global settings" on global_settings;
create policy "cms write global settings" on global_settings for all to authenticated using (cms_is_leader()) with check (cms_is_leader());
drop policy if exists "cms media" on media_assets;
create policy "cms media" on media_assets for select to authenticated using (cms_is_active() and (brand is null or cms_can_brand(brand)));
drop policy if exists "cms write media" on media_assets;
create policy "cms write media" on media_assets for all to authenticated using (cms_can_write() and (brand is null or cms_can_brand(brand))) with check (cms_can_write() and (brand is null or cms_can_brand(brand)));
drop policy if exists "cms revisions" on content_revisions;
create policy "cms revisions" on content_revisions for select to authenticated using (cms_is_active() and (brand is null or cms_can_brand(brand)));
drop policy if exists "cms add revisions" on content_revisions;
create policy "cms add revisions" on content_revisions for insert to authenticated with check (cms_can_write() and created_by = auth.uid() and (brand is null or cms_can_brand(brand)));
drop policy if exists "cms audit read" on cms_audit_log;
create policy "cms audit read" on cms_audit_log for select to authenticated using (cms_is_active() and (brand is null or cms_can_brand(brand)));
drop policy if exists "cms audit add" on cms_audit_log;
create policy "cms audit add" on cms_audit_log for insert to authenticated with check (cms_is_active() and user_id = auth.uid() and (brand is null or cms_can_brand(brand)));
drop policy if exists "public click insert" on conversion_clicks;
create policy "public click insert" on conversion_clicks for insert to anon, authenticated with check (true);
drop policy if exists "leaders read clicks" on conversion_clicks;
create policy "leaders read clicks" on conversion_clicks for select to authenticated using (cms_is_leader());

drop policy if exists "cms storage read" on storage.objects;
create policy "cms storage read" on storage.objects for select to authenticated using (bucket_id = 'brand-media' and cms_is_active());
drop policy if exists "cms storage upload" on storage.objects;
create policy "cms storage upload" on storage.objects for insert to authenticated with check (bucket_id = 'brand-media' and cms_can_write());
drop policy if exists "cms storage update" on storage.objects;
create policy "cms storage update" on storage.objects for update to authenticated using (bucket_id = 'brand-media' and cms_can_write()) with check (bucket_id = 'brand-media' and cms_can_write());

update brand_content set draft_content = content where draft_content is null;

insert into global_settings (key, value) values
  ('tap', '{"enabled":true,"image":"/brands/tap-pass.png","heading":"Get more from every Texoma trip.","body":"TAP members unlock day-use access and savings on stays, rentals, cruises and experiences across the Texoma Destinations family.","button_label":"Explore TAP membership","button_url":"https://texomadestinations.com/tap"}'::jsonb),
  ('footer', '{"family_heading":"The Texoma Destinations family","hub_label":"Book everything at texomadestinations.com","hub_url":"https://texomadestinations.com/","bigwater_heading":"BigWater.co — Premium Marine Lifestyle","bigwater_url":"https://bigwater.co/","marine_label":"Big Water Marine","marine_url":"https://bigwatermarine.com/","tow_label":"TowBoatUS North Texas","tow_url":"https://towboatusntx.com/"}'::jsonb)
on conflict (key) do nothing;

-- Optional: Database Webhook on events/packages/alerts/facts → POST https://<site>/api/revalidate?secret=...
