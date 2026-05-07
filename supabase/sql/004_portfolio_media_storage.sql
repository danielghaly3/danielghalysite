-- Optional if you already ran 001_cms_schema.sql before uploads were added.
-- Creates the public portfolio media bucket and admin-only upload policies.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read portfolio media" on storage.objects;
create policy "public can read portfolio media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-media');

drop policy if exists "admins can upload portfolio media" on storage.objects;
create policy "admins can upload portfolio media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-media'
  and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);

drop policy if exists "admins can update portfolio media" on storage.objects;
create policy "admins can update portfolio media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
)
with check (
  bucket_id = 'portfolio-media'
  and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);

drop policy if exists "admins can delete portfolio media" on storage.objects;
create policy "admins can delete portfolio media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);
