-- Adds logo marquee items, education repeater, the home/about page section,
-- and the nav_links site setting so every visible piece of the public site
-- (homepage + projects page) can be edited from the CMS dashboard.

create extension if not exists pgcrypto;

-- ─── logo_marquee_items ──────────────────────────────────────────────
create table if not exists public.logo_marquee_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  alt text,
  height integer,
  link_url text,
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists logo_marquee_items_public_idx
  on public.logo_marquee_items (active, order_index);

-- ─── education_items ─────────────────────────────────────────────────
create table if not exists public.education_items (
  id uuid primary key default gen_random_uuid(),
  program text not null,
  school text not null,
  year text,
  description text,
  order_index integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists education_items_public_idx
  on public.education_items (active, order_index);

-- ─── updated_at triggers ─────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_logo_marquee_items_updated_at on public.logo_marquee_items;
create trigger set_logo_marquee_items_updated_at before update on public.logo_marquee_items
for each row execute function public.set_updated_at();

drop trigger if exists set_education_items_updated_at on public.education_items;
create trigger set_education_items_updated_at before update on public.education_items
for each row execute function public.set_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────────────
alter table public.logo_marquee_items enable row level security;
alter table public.education_items enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.logo_marquee_items, public.education_items to anon, authenticated;
grant insert, update, delete on public.logo_marquee_items, public.education_items to authenticated;

drop policy if exists "public can read active logo marquee items" on public.logo_marquee_items;
create policy "public can read active logo marquee items"
on public.logo_marquee_items
for select
to anon, authenticated
using (active = true);

drop policy if exists "admins can manage logo marquee items" on public.logo_marquee_items;
create policy "admins can manage logo marquee items"
on public.logo_marquee_items
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

drop policy if exists "public can read active education items" on public.education_items;
create policy "public can read active education items"
on public.education_items
for select
to anon, authenticated
using (active = true);

drop policy if exists "admins can manage education items" on public.education_items;
create policy "admins can manage education items"
on public.education_items
for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

-- ─── Seed: logo marquee items (matches the previous hardcoded list) ──
insert into public.logo_marquee_items (name, image_url, alt, height, order_index, active)
select *
from (values
  ('Figma',         '/icons/tools/figma.svg',              'Figma',             44, 10,  true),
  ('React',         '/icons/tools/react.svg',              'React',             42, 20,  true),
  ('Next.js',       '/icons/tools/next-js.svg',            'Next.js',           40, 30,  true),
  ('TypeScript',    '/icons/tools/typescript.svg',         'TypeScript',        42, 40,  true),
  ('Tailwind CSS',  '/icons/tools/tailwind-css.svg',       'Tailwind CSS',      38, 50,  true),
  ('Adobe Illustrator', '/icons/tools/adobe-illustrator.svg', 'Adobe Illustrator', 44, 60, true),
  ('Adobe Photoshop',   '/icons/tools/adobe-photoshop.svg',   'Adobe Photoshop',   44, 70, true),
  ('Supabase',      '/icons/tools/supabase.svg',           'Supabase',          42, 80,  true),
  ('Vercel',        '/icons/tools/vercel.svg',             'Vercel',            38, 90,  true),
  ('GitHub',        '/icons/tools/github.svg',             'GitHub',            42, 100, true),
  ('Claude',        '/icons/tools/claude.svg',             'Claude',            42, 110, true),
  ('Framer',        '/icons/tools/framer.svg',             'Framer',            42, 120, true),
  ('Shopify',       '/icons/tools/shopify.svg',            'Shopify',           44, 130, true),
  ('WordPress',     '/icons/tools/wordpress.svg',          'WordPress',         42, 140, true)
) as seed(name, image_url, alt, height, order_index, active)
where not exists (select 1 from public.logo_marquee_items);

-- ─── Seed: education items ───────────────────────────────────────────
insert into public.education_items (program, school, year, description, order_index, active)
select *
from (values
  ('Graphic Design and Advertising', 'Humber College',   ''::text, ''::text, 10, true),
  ('Digital Design',                 'Sheridan College', ''::text, ''::text, 20, true)
) as seed(program, school, year, description, order_index, active)
where not exists (select 1 from public.education_items);

-- ─── New page_sections row: home/about (only if table exists) ────────
-- The page_sections table is created by migration 005. This block silently
-- skips the seed if you haven't run 005 yet, so 006 can run standalone.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'page_sections'
  ) then
    insert into public.page_sections (
      page, section_key, label, eyebrow, title, body, cta_label, cta_href, image_url,
      order_index, active, metadata
    ) values (
      'home', 'about', 'About', 'About',
      'Designing clean digital experiences with purpose.',
      null, null, null, null,
      30, true, '{}'::jsonb
    )
    on conflict (page, section_key) do nothing;
  end if;
end $$;

-- ─── Seed: nav_links + footer copy site_settings (only if table exists)
-- The site_settings table is created by migration 001. Same defensive guard.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'site_settings'
  ) then
    insert into public.site_settings (key, value)
    values (
      'nav_links',
      '[
        {"iconKey":"home","label":"Home","href":"/","sectionId":"top"},
        {"iconKey":"about","label":"About","href":"/#about","sectionId":"about"},
        {"iconKey":"work","label":"Work","href":"/projects"},
        {"iconKey":"services","label":"Services","href":"/#services","sectionId":"services"},
        {"iconKey":"contact","label":"Contact","href":"/#contact","sectionId":"contact"}
      ]'::jsonb
    )
    on conflict (key) do nothing;

    insert into public.site_settings (key, value) values
      ('footer_heading', '"Contact"'::jsonb),
      ('footer_subtitle', '"Let''s build something clean, modern, and useful together."'::jsonb)
    on conflict (key) do nothing;
  end if;
end $$;
