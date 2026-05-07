-- Optional seed data based on the current hardcoded portfolio content.
-- Run after 001_cms_schema.sql if you want the CMS populated immediately.
--
-- This file only seeds tables that 001 creates AND that no later migration owns:
--   site_settings, about_content, projects, services, skills.
-- Seeds for page_sections, process_steps, faq_items, and gallery_items live in
-- 005_page_cms_sections.sql so the source of truth for those is in one place.

insert into public.site_settings (key, value) values
  ('name', to_jsonb('Daniel Ghaly'::text)),
  ('tagline', to_jsonb('Design that works hard so brands do not have to.'::text)),
  ('email', to_jsonb('danielghaly3@gmail.com'::text)),
  ('phone', to_jsonb('+1 647 570 0334'::text)),
  ('location', to_jsonb('Mississauga, ON, CA'::text)),
  ('instagram_url', to_jsonb('https://www.instagram.com/graphxify/'::text)),
  ('linkedin_url', to_jsonb('https://www.linkedin.com/in/danielghalyx/'::text)),
  ('github_url', to_jsonb('https://github.com/'::text)),
  ('resume_url', to_jsonb(''::text)),
  ('seo_default_title', to_jsonb('Daniel Ghaly, Designer and Builder'::text)),
  ('seo_default_description', to_jsonb('Designer and cofounder of Graphxify. Brand identity, web design, and frontend builds for ventures that want to ship.'::text)),
  ('default_og_image', to_jsonb('/opengraph-image'::text))
on conflict (key) do update set value = excluded.value;

insert into public.about_content (
  headline,
  subheadline,
  bio,
  image_url,
  resume_url,
  location,
  email,
  phone,
  instagram_url,
  linkedin_url,
  github_url
)
select
  'Designing clean digital experiences with purpose.',
  'Designer and Web Developer',
  'I''m Daniel Ghaly, a designer and web developer focused on building modern brand identities, websites, and digital experiences that feel clean, sharp, and useful.' || E'\n\n' ||
  'My work combines visual design, front end development, and AI assisted workflows to help businesses move faster without losing quality.',
  '/images/daniel-studio-portrait.png',
  '',
  'Mississauga, ON, CA',
  'danielghaly3@gmail.com',
  '+1 647 570 0334',
  'https://www.instagram.com/graphxify/',
  'https://www.linkedin.com/in/danielghalyx/',
  'https://github.com/'
where not exists (select 1 from public.about_content);

-- page_sections, process_steps, faq_items, and gallery_items seeds live in
-- 005_page_cms_sections.sql to keep them in one place.

insert into public.projects (
  title,
  slug,
  subtitle,
  short_description,
  full_description,
  category,
  role,
  client_name,
  year,
  status,
  featured,
  cover_image_url,
  thumbnail_url,
  gallery_images,
  technologies,
  order_index,
  process
) values
  (
    'Boss Med Clinic',
    'boss-med-clinic',
    'Healthcare Website',
    'A clean, professional website for a medical clinic focused on building trust and streamlining patient intake with modern design and responsive layout.',
    'Boss Med Clinic needed a digital presence that would establish credibility with patients and simplify the intake process. The design focuses on clear hierarchy, calming tones, and straightforward navigation so patients can find what they need without friction.',
    'Healthcare Website',
    'Designer and Developer',
    'Boss Med Clinic',
    '2024',
    'published',
    false,
    '/images/healthcare.png',
    '/images/healthcare.png',
    array['/images/healthcare.png', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop'],
    array['Web Design', 'Web Development', 'UI Design'],
    10,
    '{"sticky_gallery_layout":"hero-split"}'::jsonb
  ),
  (
    'Pharmacy On King',
    'pharmacy-on-king',
    'Pharmacy Website',
    'A polished digital presence for a local pharmacy, designed to communicate reliability and make essential services easy to find.',
    'This project involved creating a professional yet approachable website for a community pharmacy. The goal was to highlight core services, build local trust, and ensure the site ranks well in search.',
    'Pharmacy Website',
    'Designer and Developer',
    'Pharmacy On King',
    '2024',
    'published',
    false,
    '/images/daniel-hero.png',
    '/images/daniel-hero.png',
    array['/images/daniel-hero.png', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&auto=format&fit=crop'],
    array['Web Design', 'Web Development', 'SEO'],
    20,
    '{"sticky_gallery_layout":"mosaic-left"}'::jsonb
  ),
  (
    'King Medical Arts Pharmacy',
    'king-medical-arts-pharmacy',
    'Healthcare Website',
    'A modern healthcare website with clear navigation, patient resources, and a visual identity that inspires confidence.',
    'King Medical Arts Pharmacy required a website that balances professionalism with warmth. The design system uses clean typography, structured layouts, and a calming color palette to create an experience that feels trustworthy.',
    'Healthcare Website',
    'Designer and Developer',
    'King Medical Arts Pharmacy',
    '2024',
    'published',
    false,
    '/images/healthcare.png',
    '/images/healthcare.png',
    array['/images/healthcare.png', 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop'],
    array['Web Design', 'UI Design', 'SEO'],
    30,
    '{"sticky_gallery_layout":"bento"}'::jsonb
  ),
  (
    'FlyUp Line',
    'flyup-line',
    'Travel Brand and Website',
    'A confident brand identity and conversion focused website for a travel agency built around speed, price transparency, and a clean booking flow.',
    'FlyUp Line needed a brand and website that could compete in a crowded travel market. The solution combines a bold visual identity with a streamlined booking experience.',
    'Travel Brand and Website',
    'Brand Designer and Developer',
    'FlyUp Line',
    '2024',
    'published',
    true,
    '/images/flyup-line.png',
    '/images/flyup-line.png',
    array['/images/flyup-line.png', 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop'],
    array['Brand Identity', 'Web Design', 'Web Development'],
    40,
    '{"sticky_gallery_layout":"editorial"}'::jsonb
  ),
  (
    'Luka Hair Salon',
    'luka-hair-salon',
    'Salon Website',
    'An elegant, visually driven website for a hair salon that puts the craft front and center with rich imagery and effortless booking.',
    'Luka Hair Salon wanted a website that reflects the artistry and premium feel of their services. The design uses large imagery, elegant typography, and seamless booking integration.',
    'Salon Website',
    'Designer and Developer',
    'Luka Hair Salon',
    '2024',
    'published',
    false,
    '/images/luka-salon.png',
    '/images/luka-salon.png',
    array['/images/luka-salon.png', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop'],
    array['Web Design', 'UI Design', 'Brand Identity'],
    50,
    '{"sticky_gallery_layout":"featured-left"}'::jsonb
  ),
  (
    'Maven',
    'maven',
    'Brand Identity',
    'A premium brand identity system including logo, typography, color direction, and visual guidelines for a fashion forward venture.',
    'Maven is a fashion brand that needed a visual identity as refined as its products. The brand system includes a custom logotype, color palette, typographic hierarchy, and guidelines.',
    'Brand Identity',
    'Brand Designer',
    'Maven',
    '2024',
    'published',
    false,
    '/images/maven-fashion.png',
    '/images/maven-fashion.png',
    array['/images/maven-fashion.png', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop'],
    array['Brand Identity', 'Web Design'],
    60,
    '{"sticky_gallery_layout":"featured-right"}'::jsonb
  ),
  (
    'Graphxify',
    'graphxify',
    'Brand Identity and Website',
    'A full brand identity and portfolio website for a creative studio, built around bold visuals, clean typography, and a modern dark aesthetic.',
    'Graphxify is the creative studio behind this portfolio. The brand was built from the ground up with a dark modern aesthetic, bold blue accents, and a component driven website.',
    'Brand Identity and Website',
    'Creative Director and Developer',
    'Graphxify',
    '2025',
    'published',
    true,
    '/images/daniel-hero.png',
    '/images/daniel-hero.png',
    array['/images/daniel-hero.png', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop'],
    array['Brand Identity', 'Web Design', 'Web Development'],
    70,
    '{"sticky_gallery_layout":"magazine"}'::jsonb
  ),
  (
    'Fav For Pet',
    'fav-for-pet',
    'Retail Brand and E-commerce',
    'A warm, approachable brand and online store for a pet supply company, designed to build trust and drive conversions with pet owners.',
    'Fav For Pet needed a brand that felt friendly and trustworthy while also being conversion focused. The identity pairs warm tones with a clean e-commerce layout.',
    'Retail Brand and E-commerce',
    'Brand Designer and Developer',
    'Fav For Pet',
    '2024',
    'published',
    true,
    '/images/luka-salon.png',
    '/images/luka-salon.png',
    array['/images/luka-salon.png', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop'],
    array['Brand Identity', 'E-commerce', 'UI Design'],
    80,
    '{"sticky_gallery_layout":"zigzag"}'::jsonb
  ),
  (
    'Bella Vita',
    'bella-vita',
    'Restaurant Website',
    'An elegant, visually rich website for a high end restaurant focused on showcasing the dining experience, menu, and reservation flow.',
    'Bella Vita is a fine dining restaurant that needed a website worthy of its culinary craft. The design leans into rich imagery, elegant spacing, and a seamless reservation experience.',
    'Restaurant Website',
    'Designer and Developer',
    'Bella Vita',
    '2024',
    'published',
    false,
    '/images/maven-fashion.png',
    '/images/maven-fashion.png',
    array['/images/maven-fashion.png', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop'],
    array['Web Design', 'UI Design', 'SEO'],
    90,
    '{"sticky_gallery_layout":"showcase"}'::jsonb
  )
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  category = excluded.category,
  role = excluded.role,
  client_name = excluded.client_name,
  year = excluded.year,
  status = excluded.status,
  featured = excluded.featured,
  cover_image_url = excluded.cover_image_url,
  thumbnail_url = excluded.thumbnail_url,
  gallery_images = excluded.gallery_images,
  technologies = excluded.technologies,
  order_index = excluded.order_index,
  process = excluded.process;

insert into public.services (title, slug, description, icon, features, starting_price, order_index, active) values
  ('Brand Identity Design', 'brand-identity-design', 'Clean, memorable brand identities including logos, color systems, typography, visual direction, and brand assets.', '/images/maven-fashion.png', array['Logo Design', 'Typography', 'Visual Direction'], null, 10, true),
  ('Web Design', 'web-design', 'Polished, responsive websites with strong layout, clear messaging, smooth user experience, and a premium visual style.', '/images/flyup-line.png', array['UI Design', 'Responsive Design', 'Landing Pages'], null, 20, true),
  ('Web Development', 'web-development', 'Fast responsive websites built with React, Next.js, Tailwind CSS, Supabase, and Vercel.', '/images/daniel-hero.png', array['Next.js', 'Tailwind CSS', 'Supabase'], null, 30, true),
  ('AI Assisted Design and Development', 'ai-assisted-design-and-development', 'Modern AI workflows for research, design exploration, coding, content planning, and website production.', '/images/daniel-studio-portrait.png', array['Claude', 'ChatGPT', 'Codex'], null, 40, true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  features = excluded.features,
  order_index = excluded.order_index,
  active = excluded.active;

insert into public.skills (name, category, icon, level, order_index, active)
select *
from (
  values
    ('Adobe Illustrator', 'Design', '/icons/tools/adobe-illustrator.svg', 95, 10, true),
    ('Adobe Photoshop', 'Design', '/icons/tools/adobe-photoshop.svg', 90, 20, true),
    ('Figma', 'Design', '/icons/tools/figma.svg', 95, 30, true),
    ('Next.js', 'Development', '/icons/tools/next-js.svg', 90, 40, true),
    ('React', 'Development', '/icons/tools/react.svg', 90, 50, true),
    ('TypeScript', 'Development', '/icons/tools/typescript.svg', 85, 60, true),
    ('Tailwind CSS', 'Development', '/icons/tools/tailwind-css.svg', 95, 70, true),
    ('Supabase', 'Development', '/icons/tools/supabase.svg', 80, 80, true),
    ('Vercel', 'Development', '/icons/tools/vercel.svg', 85, 90, true),
    ('Claude', 'AI workflow', '/icons/tools/claude.svg', 90, 100, true),
    ('ChatGPT', 'AI workflow', '/icons/tools/chatgpt.svg', 90, 110, true),
    ('Codex', 'AI workflow', '/icons/tools/codex.svg', 85, 120, true)
) as seed(name, category, icon, level, order_index, active)
where not exists (select 1 from public.skills);
