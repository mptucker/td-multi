-- Texoma Destinations brand sites — central content store
-- Run in the Supabase SQL editor. Public (anon) role may READ published rows only;
-- writes go through the /admin UI using the service-role key on the server.

create extension if not exists "pgcrypto";

-- Brand slugs are validated in the app; keep as text[] for flexibility.
create table if not exists brand_content (
  brand text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

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
  show_on_sites text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  foreach t in array array['brand_content','events','packages','alerts','facts'] loop
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

-- Optional: Database Webhook on events/packages/alerts/facts → POST https://<site>/api/revalidate?secret=...
