-- Adds the fields needed by the section-based Home/Projects CMS editor.
-- Run this in the Supabase SQL Editor after the earlier CMS migrations.

alter table if exists public.page_sections
  add column if not exists content jsonb not null default '{}'::jsonb;

alter table if exists public.projects
  add column if not exists image_alt text;

alter table if exists public.services
  add column if not exists subtitle text,
  add column if not exists image_alt text;

alter table if exists public.skills
  add column if not exists wide boolean not null default false;

alter table if exists public.process_steps
  add column if not exists image_alt text;

update public.page_sections
set content = content || jsonb_build_object(
  'imageAlt', 'Dark directional brand image for Daniel Ghaly''s portfolio',
  'seoTitle', 'Daniel Ghaly - Designer and Web Developer',
  'seoDescription', 'Designer and Web Developer. Design that works hard so brands do not have to.',
  'ogTitle', 'Daniel Ghaly - Designer and Web Developer',
  'ogDescription', 'Designer and Web Developer. Design that works hard so brands do not have to.',
  'ogImage', '/opengraph-image',
  'twitterTitle', 'Daniel Ghaly - Designer and Web Developer',
  'twitterDescription', 'Designer and Web Developer. Design that works hard so brands do not have to.',
  'twitterImage', '/opengraph-image',
  'canonicalUrl', '/'
)
where page = 'home' and section_key = 'hero';

update public.page_sections
set content = content || jsonb_build_object(
  'educationLabel', 'Education',
  'imageAlt', 'Portrait of Daniel Ghaly'
)
where page = 'home' and section_key = 'about';

update public.page_sections
set content = content || jsonb_build_object(
  'imageAlt', 'Editorial brand visual for the Daniel Ghaly projects archive',
  'seoTitle', 'Projects',
  'seoDescription', 'A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.',
  'ogTitle', 'Projects',
  'ogDescription', 'A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.',
  'ogImage', '/images/daniel-hero.png',
  'twitterTitle', 'Projects',
  'twitterDescription', 'A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.',
  'twitterImage', '/images/daniel-hero.png',
  'canonicalUrl', '/projects'
)
where page = 'projects' and section_key = 'hero';

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
  content,
  metadata
) values (
  'projects',
  'detail',
  'Project Detail Template',
  null,
  null,
  null,
  null,
  null,
  null,
  30,
  true,
  '{
    "backLabel": "All Projects",
    "clientLabel": "Client",
    "roleLabel": "Role",
    "yearLabel": "Year",
    "technologiesLabel": "Technologies",
    "servicesLabel": "Services",
    "linksLabel": "Links",
    "liveLabel": "View live",
    "githubLabel": "Source code",
    "figmaLabel": "Figma file",
    "overviewLabel": "Overview",
    "problemLabel": "The Problem",
    "solutionLabel": "The Solution",
    "resultsLabel": "Results",
    "previousLabel": "Previous",
    "nextLabel": "Next"
  }'::jsonb,
  '{}'::jsonb
)
on conflict (page, section_key) do update set
  label = excluded.label,
  order_index = excluded.order_index,
  active = excluded.active,
  content = public.page_sections.content || excluded.content;

update public.services
set subtitle = case slug
  when 'brand-identity' then 'Visual systems for businesses that need to look premium and trusted.'
  when 'web-design' then 'Modern websites designed to convert visitors into customers.'
  when 'web-development' then 'Fast responsive websites built with modern tools.'
  when 'ai-workflow' then 'Smarter workflows using modern AI tools.'
  else subtitle
end
where subtitle is null;

update public.services
set image_alt = case slug
  when 'brand-identity' then 'Brand identity design visual'
  when 'web-design' then 'Modern website design visual'
  when 'web-development' then 'Web development workspace visual'
  when 'ai-workflow' then 'AI assisted workflow visual'
  else image_alt
end
where image_alt is null;

update public.skills
set wide = true
where lower(name) = 'lovable';

update public.process_steps
set image_alt = title || ' process step visual'
where image_alt is null;
