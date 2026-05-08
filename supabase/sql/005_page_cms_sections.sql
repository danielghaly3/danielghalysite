-- Optional if you already ran the earlier CMS SQL before page section editing was added.
-- Adds editable Home/Projects page sections plus homepage process, FAQ, and gallery tables.

create extension if not exists pgcrypto;

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
  content jsonb not null default '{}'::jsonb,
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
  image_alt text,
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

alter table public.page_sections enable row level security;
alter table public.process_steps enable row level security;
alter table public.faq_items enable row level security;
alter table public.gallery_items enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.page_sections, public.process_steps, public.faq_items, public.gallery_items to anon, authenticated;
grant insert, update, delete on public.page_sections, public.process_steps, public.faq_items, public.gallery_items to authenticated;

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

insert into public.page_sections (
  page,
  section_key,
  label,
  eyebrow,
  title,
  body,
  cta_label,
  cta_href,
  image_url,
  order_index,
  active,
  metadata
) values
  ('home', 'hero', 'Hero', 'Hey, I''m', 'Daniel Ghaly', 'Designer and Web Developer. Design that works hard so brands do not have to.', 'See the work', '#work', '/images/daniel-hero.png', 10, true, '{}'::jsonb),
  ('home', 'logo_marquee', 'Logo Marquee', null, 'Brands Trusted Me', null, null, null, null, 20, true, '{}'::jsonb),
  ('home', 'featured_work', 'Featured Work', 'Selected work', 'Recent projects, real outcomes.', null, 'View case study', null, null, 40, true, '{}'::jsonb),
  ('home', 'toolkit', 'Toolkit', 'Toolkit', 'Skills and Tools I Use', null, null, null, null, 50, true, '{}'::jsonb),
  ('home', 'services', 'Services', 'What I Offer', 'Services', null, null, null, null, 60, true, '{}'::jsonb),
  ('home', 'process', 'Process', 'Process', 'From first call to shipped, in five steps.', null, null, null, null, 70, true, '{}'::jsonb),
  ('home', 'gallery', 'Gallery', 'More work', 'Other things I''ve made.', 'Snippets, side projects, and brand explorations.', 'Browse all Projects.', '#work', null, 80, true, '{}'::jsonb),
  ('home', 'faq', 'FAQ', 'FAQ', 'Questions worth answering.', 'The basics before we get into scope, timelines, and the shape of the work.', 'Still have questions? Email me', 'mailto:danielghaly3@gmail.com', null, 90, true, '{}'::jsonb),
  ('projects', 'hero', 'Projects Hero', 'Selected work', 'Projects', 'A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.', 'Browse the work', '#projects-grid', '/images/daniel-hero.png', 10, true, '{}'::jsonb),
  ('projects', 'grid', 'Projects Grid', null, 'Explore the Work', 'Browse through selected brand, web, and digital projects.', null, null, null, 20, true, '{}'::jsonb)
on conflict (page, section_key) do update set
  label = excluded.label,
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  body = excluded.body,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  image_url = excluded.image_url,
  order_index = excluded.order_index,
  active = excluded.active,
  metadata = excluded.metadata;

insert into public.process_steps (title, blurb, detail, image_url, order_index, active)
select *
from (
  values
    ('Discovery', 'We talk. I learn the business, the audience, the constraint. You learn how I work and what''s realistic.', 'A 45 minute call (or async if you prefer), a short brief I send back for sign off, and a fixed scope document. No surprises after this point.', '/images/daniel-hero.png', 10, true),
    ('Strategy', 'Positioning, messaging, and creative direction agreed before any pixel moves.', 'Competitor scan, positioning statement, tone of voice notes, and a moodboard. We lock the strategic spine of the project here.', '/images/maven-fashion.png', 20, true),
    ('Design', 'Identity, components, and screens. Iterations, shared in Figma, with weekly check ins.', 'Two design rounds with structured feedback. You see real type, real grid, real motion, not generic mockups in a deck.', '/images/flyup-line.png', 30, true),
    ('Build and ship', 'I hand off or build it myself. Frontend that''s fast, accessible, and SEO clean from day one.', 'Hand coded Next.js, Lighthouse 95+, semantic HTML, alt text, sitemap, and a 30 minute walkthrough so your team can run it.', '/images/healthcare.png', 40, true),
    ('Aftercare', 'Two weeks of post launch tweaks included. Ongoing retainer optional.', 'Bug fixes, copy edits, and small UI tweaks for two weeks at no extra cost. After that, jump on a monthly retainer or pay per task.', '/images/luka-salon.png', 50, true)
) as seed(title, blurb, detail, image_url, order_index, active)
where not exists (select 1 from public.process_steps);

insert into public.faq_items (question, answer, order_index, active)
select *
from (
  values
    ('How long does a brand project take?', 'Most identity projects run 2 to 4 weeks. Brand and site runs 4 to 8 weeks. I give you a fixed timeline before we start, not after.', 10, true),
    ('Do you offer payment plans?', 'Yes. Default is 50% to start, 50% on delivery. For larger scopes I split it into 3 milestone payments.', 20, true),
    ('Can you also build the website?', 'Yes. I design and build sites in Next.js with hand written frontend. Fast, accessible, and properly indexed. I do not do WordPress builds.', 30, true),
    ('Do you work with international clients?', 'Always. I''m in Mississauga, Ontario, and most of my clients are remote. I''m comfortable async and can meet in any reasonable timezone.', 40, true),
    ('What do I need to get started?', 'A rough idea of the brief, a deadline, and a budget range. If you do not have those yet, send what you do have and we''ll figure it out on a call.', 50, true),
    ('Who actually does the work?', 'Me. For Graphxify projects I lead design, my partner leads development. For solo projects under my own name, it''s all me.', 60, true)
) as seed(question, answer, order_index, active)
where not exists (select 1 from public.faq_items);

insert into public.gallery_items (caption, image_url, alt, order_index, active)
select *
from (
  values
    ('Brand explorations', '/images/daniel-hero.png', 'Brand explorations placeholder', 10, true),
    ('Packaging study', '/images/maven-fashion.png', 'Packaging study placeholder', 20, true),
    ('Website systems', '/images/flyup-line.png', 'Website systems placeholder', 30, true),
    ('Identity sketches', '/images/healthcare.png', 'Identity sketches placeholder', 40, true),
    ('Retail direction', '/images/luka-salon.png', 'Retail direction placeholder', 50, true),
    ('Editorial tests', '/images/daniel-studio-portrait.png', 'Editorial tests placeholder', 60, true),
    ('Motion studies', '/images/daniel-hero.png', 'Motion studies placeholder', 70, true)
) as seed(caption, image_url, alt, order_index, active)
where not exists (select 1 from public.gallery_items);
