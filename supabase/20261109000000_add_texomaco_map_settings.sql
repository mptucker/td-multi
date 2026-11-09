-- CMS-managed Texoma Collective map presentation and precise pin placement.

alter table partner_locations
  add column if not exists is_featured boolean not null default false,
  add column if not exists map_x numeric,
  add column if not exists map_y numeric;

create table if not exists partner_map_settings (
  id text primary key default 'texomaco',
  map_url text not null default '/texomaco/texoma-map.svg',
  show_roads boolean not null default true,
  show_geographic_labels boolean not null default false,
  theme text not null default 'coastal' check (theme in ('coastal', 'chart', 'natural')),
  updated_at timestamptz not null default now()
);

drop trigger if exists partner_map_settings_updated on partner_map_settings;
create trigger partner_map_settings_updated before update on partner_map_settings for each row execute function set_updated_at();

alter table partner_map_settings enable row level security;

drop policy if exists "public partner map settings" on partner_map_settings;
create policy "public partner map settings" on partner_map_settings for select to anon using (true);
drop policy if exists "cms partner map settings" on partner_map_settings;
create policy "cms partner map settings" on partner_map_settings for select to authenticated
  using (cms_is_active() and cms_can_brand('texomaco'));
drop policy if exists "cms write partner map settings" on partner_map_settings;
create policy "cms write partner map settings" on partner_map_settings for all to authenticated
  using (cms_can_write() and cms_can_brand('texomaco'))
  with check (cms_can_write() and cms_can_brand('texomaco'));

grant select on partner_map_settings to anon;
grant select, insert, update, delete on partner_map_settings to authenticated;

update storage.buckets
set allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml']
where id = 'brand-media';

insert into partner_map_settings (id, map_url, show_roads, show_geographic_labels, theme)
values ('texomaco', '/texomaco/texoma-map.svg', true, false, 'coastal')
on conflict (id) do nothing;

-- Illustrator artwork is not a true geographic projection. These percentages
-- align the launch listings with named locations in the supplied vector map.
update partner_locations set map_x = 52.0, map_y = 64.6, is_featured = true
where slug = 'resort' and organization_id = (select id from partner_organizations where slug = 'lighthouse');
update partner_locations set map_x = 52.2, map_y = 65.2
where slug = 'fuel-dock' and organization_id = (select id from partner_organizations where slug = 'lighthouse');
update partner_locations set map_x = 52.4, map_y = 65.8, is_featured = true
where slug = 'charter-dock' and organization_id = (select id from partner_organizations where slug = 'fastrac');
update partner_locations set map_x = 52.3, map_y = 66.4
where slug = 'lighthouse' and organization_id = (select id from partner_organizations where slug = 'big-water-boat-club');
update partner_locations set map_x = 50.1, map_y = 63.8, is_featured = true
where slug = 'park' and organization_id = (select id from partner_organizations where slug = 'island-view');
update partner_locations set map_x = 61.0, map_y = 52.8, is_featured = true
where slug = 'camp' and organization_id = (select id from partner_organizations where slug = 'sundance');
update partner_locations set map_x = 52.6, map_y = 69.1
where slug in ('store', 'office', 'service');
update partner_locations set map_x = 55.0, map_y = 82.0
where slug = 'sales' and organization_id = (select id from partner_organizations where slug = 'big-water-marine');
update partner_locations set map_x = 26.5, map_y = 85.4, is_featured = true
where slug = 'resort' and organization_id = (select id from partner_organizations where slug = 'paradise');
