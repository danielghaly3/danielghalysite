-- Adds the metadata used by the section-based Home/Projects CMS editor.
-- Run this in the Supabase SQL Editor after the earlier CMS migrations.

alter table if exists public.page_sections
  add column if not exists metadata jsonb default '{}'::jsonb;

update public.page_sections
set metadata = '{}'::jsonb
where metadata is null;

alter table if exists public.page_sections
  alter column metadata set default '{}'::jsonb,
  alter column metadata set not null;

update public.page_sections
set metadata = metadata || jsonb_build_object(
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
set metadata = metadata || jsonb_build_object(
  'educationLabel', 'Education',
  'imageAlt', 'Portrait of Daniel Ghaly'
)
where page = 'home' and section_key = 'about';

update public.page_sections
set metadata = metadata || jsonb_build_object(
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
  }'::jsonb
)
on conflict (page, section_key) do update set
  label = excluded.label,
  order_index = excluded.order_index,
  active = excluded.active,
  metadata = public.page_sections.metadata || excluded.metadata;

notify pgrst, 'reload schema';
