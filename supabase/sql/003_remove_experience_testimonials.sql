-- Optional cleanup if you already ran the earlier CMS schema.
-- This removes the retired Experience and Testimonials CMS tables.

drop table if exists public.experience cascade;
drop table if exists public.testimonials cascade;
