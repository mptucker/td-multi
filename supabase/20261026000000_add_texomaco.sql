-- Texoma Collective registration and shared inquiry intake.
-- Run against the same Supabase project used by td-multi.

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  inquiry_type text not null check (inquiry_type in ('partner','group_event','general')),
  name text not null,
  organization text,
  email text not null,
  phone text,
  town text,
  region text check (region is null or region in ('TX','OK')),
  message text not null,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new','contacted','closed','spam')),
  source_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_brand_created_idx on inquiries (brand, created_at desc);

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists inquiries_updated on inquiries;
create trigger inquiries_updated before update on inquiries for each row execute function set_updated_at();

alter table inquiries enable row level security;

drop policy if exists "cms inquiries" on inquiries;
create policy "cms inquiries" on inquiries for select to authenticated
using (cms_is_active() and cms_can_brand(brand));

drop policy if exists "cms update inquiries" on inquiries;
create policy "cms update inquiries" on inquiries for update to authenticated
using (cms_can_write() and cms_can_brand(brand))
with check (cms_can_write() and cms_can_brand(brand));

insert into brand_settings (brand, street_address, city, region, postal_code, phone, phone_e164)
values ('texomaco', '81750 N State Hwy 289, Suite 106', 'Pottsboro', 'TX', '75076', '903.200.1408', '+19032001408')
on conflict (brand) do nothing;
