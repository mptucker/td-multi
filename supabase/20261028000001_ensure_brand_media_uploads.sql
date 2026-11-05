-- Ensure the Brand Publishing CMS has a public media bucket and the policies
-- required for authenticated editors to upload and reuse site photography.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-media',
  'brand-media',
  true,
  15728640,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cms storage read" on storage.objects;
create policy "cms storage read"
on storage.objects for select to authenticated
using (bucket_id = 'brand-media' and cms_is_active());

drop policy if exists "cms storage upload" on storage.objects;
create policy "cms storage upload"
on storage.objects for insert to authenticated
with check (bucket_id = 'brand-media' and cms_can_write());

drop policy if exists "cms storage update" on storage.objects;
create policy "cms storage update"
on storage.objects for update to authenticated
using (bucket_id = 'brand-media' and cms_can_write())
with check (bucket_id = 'brand-media' and cms_can_write());
