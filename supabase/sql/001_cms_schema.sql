-- Daniel Ghaly portfolio CMS schema.
-- Run this file in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

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

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  subtitle text,
  short_description text not null,
  full_description text,
  category text,
  role text,
  client_name text,
  year text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  cover_image_url text,
  thumbnail_url text,
  gallery_images text[] not null default '{}',
  live_url text,
  github_url text,
  figma_url text,
  technologies text[] not null default '{}',
  problem text,
  solution text,
  results text,
  process jsonb not null default '{}'::jsonb,
  order_index integer not null default 0,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  category text,
  tags text[] not null default '{}',
  published boolean not null default false,
  featured boolean not null default false,
  reading_time integer,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  icon text,
  features text[] not null default '{}',
  starting_price text,
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  icon text,
  level integer check (level is null or (level >= 0 and level <= 100)),
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page text not null check (page in ('home', 'projects')),
  section_key text not null,
  label text not null,
  eyebrow text,
  title text,
  body text,
  cta_label text,
  cta_href text,
  image_url text,
  order_index integer not null default 0,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page, section_key)
);

create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  blurb text,
  detail text,
  image_url text,
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  caption text,
  image_url text not null,
  alt text,
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '""'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_content (
  id uuid primary key default gen_random_uuid(),
  headline text,
  subheadline text,
  bio text,
  image_url text,
  resume_url text,
  location text,
  email text,
  phone text,
  instagram_url text,
  linkedin_url text,
  github_url text,
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_idx on public.projects (status, featured, order_index);
create index if not exists blog_posts_public_idx on public.blog_posts (published, featured, created_at desc);
create index if not exists services_public_idx on public.services (active, order_index);
create index if not exists skills_public_idx on public.skills (active, order_index);
create index if not exists page_sections_public_idx on public.page_sections (page, active, order_index);
create index if not exists process_steps_public_idx on public.process_steps (active, order_index);
create index if not exists faq_items_public_idx on public.faq_items (active, order_index);
create index if not exists gallery_items_public_idx on public.gallery_items (active, order_index);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_skills_updated_at on public.skills;
create trigger set_skills_updated_at before update on public.skills
for each row execute function public.set_updated_at();

drop trigger if exists set_page_sections_updated_at on public.page_sections;
create trigger set_page_sections_updated_at before update on public.page_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_process_steps_updated_at on public.process_steps;
create trigger set_process_steps_updated_at before update on public.process_steps
for each row execute function public.set_updated_at();

drop trigger if exists set_faq_items_updated_at on public.faq_items;
create trigger set_faq_items_updated_at before update on public.faq_items
for each row execute function public.set_updated_at();

drop trigger if exists set_gallery_items_updated_at on public.gallery_items;
create trigger set_gallery_items_updated_at before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_about_content_updated_at on public.about_content;
create trigger set_about_content_updated_at before update on public.about_content
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.services enable row level security;
alter table public.skills enable row level security;
alter table public.page_sections enable row level security;
alter table public.process_steps enable row level security;
alter table public.faq_items enable row level security;
alter table public.gallery_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.about_content enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.projects, public.blog_posts, public.services, public.skills, public.page_sections, public.process_steps, public.faq_items, public.gallery_items, public.site_settings, public.about_content to anon, authenticated;
grant select on public.admin_users to authenticated;
grant insert, update, delete on public.projects, public.blog_posts, public.services, public.skills, public.page_sections, public.process_steps, public.faq_items, public.gallery_items, public.site_settings, public.about_content to authenticated;

drop policy if exists "admin users can read their own row" on public.admin_users;
create policy "admin users can read their own row"
on public.admin_users
for select
to authenticated
using ((select auth.uid()) = user_id);

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

drop policy if exists "public can read published projects" on public.projects;
create policy "public can read published projects"
on public.projects
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "admins can read all projects" on public.projects;
create policy "admins can read all projects"
on public.projects
for select
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "admins can insert projects" on public.projects;
create policy "admins can insert projects"
on public.projects
for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "admins can update projects" on public.projects;
create policy "admins can update projects"
on public.projects
for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "admins can delete projects" on public.projects;
create policy "admins can delete projects"
on public.projects
for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read published posts" on public.blog_posts;
create policy "public can read published posts"
on public.blog_posts
for select
to anon, authenticated
using (published = true);

drop policy if exists "admins can read all posts" on public.blog_posts;
create policy "admins can read all posts"
on public.blog_posts
for select
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "admins can insert posts" on public.blog_posts;
create policy "admins can insert posts"
on public.blog_posts
for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "admins can update posts" on public.blog_posts;
create policy "admins can update posts"
on public.blog_posts
for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "admins can delete posts" on public.blog_posts;
create policy "admins can delete posts"
on public.blog_posts
for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read active services" on public.services;
create policy "public can read active services"
on public.services
for select
to anon, authenticated
using (active = true);

drop policy if exists "admins can manage services" on public.services;
create policy "admins can manage services"
on public.services
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read active skills" on public.skills;
create policy "public can read active skills"
on public.skills
for select
to anon, authenticated
using (active = true);

drop policy if exists "admins can manage skills" on public.skills;
create policy "admins can manage skills"
on public.skills
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read active page sections" on public.page_sections;
create policy "public can read active page sections"
on public.page_sections
for select
to anon, authenticated
using (active = true);

drop policy if exists "admins can manage page sections" on public.page_sections;
create policy "admins can manage page sections"
on public.page_sections
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read active process steps" on public.process_steps;
create policy "public can read active process steps"
on public.process_steps
for select
to anon, authenticated
using (active = true);

drop policy if exists "admins can manage process steps" on public.process_steps;
create policy "admins can manage process steps"
on public.process_steps
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read active FAQ items" on public.faq_items;
create policy "public can read active FAQ items"
on public.faq_items
for select
to anon, authenticated
using (active = true);

drop policy if exists "admins can manage FAQ items" on public.faq_items;
create policy "admins can manage FAQ items"
on public.faq_items
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read active gallery items" on public.gallery_items;
create policy "public can read active gallery items"
on public.gallery_items
for select
to anon, authenticated
using (active = true);

drop policy if exists "admins can manage gallery items" on public.gallery_items;
create policy "admins can manage gallery items"
on public.gallery_items
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "admins can manage site settings" on public.site_settings;
create policy "admins can manage site settings"
on public.site_settings
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read about content" on public.about_content;
create policy "public can read about content"
on public.about_content
for select
to anon, authenticated
using (true);

drop policy if exists "admins can manage about content" on public.about_content;
create policy "admins can manage about content"
on public.about_content
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
