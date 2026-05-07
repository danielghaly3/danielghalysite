export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProjectStatus = "draft" | "published" | "archived";

export type ProjectRecord = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  short_description: string;
  full_description: string | null;
  category: string | null;
  role: string | null;
  client_name: string | null;
  year: string | null;
  status: ProjectStatus;
  featured: boolean;
  cover_image_url: string | null;
  thumbnail_url: string | null;
  gallery_images: string[];
  live_url: string | null;
  github_url: string | null;
  figma_url: string | null;
  technologies: string[];
  problem: string | null;
  solution: string | null;
  results: string | null;
  process: Json;
  order_index: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  tags: string[];
  published: boolean;
  featured: boolean;
  reading_time: number | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  features: string[];
  starting_price: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type SkillRecord = {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  level: number | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type PageSectionRecord = {
  id: string;
  page: string;
  section_key: string;
  label: string;
  eyebrow: string | null;
  title: string | null;
  body: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  order_index: number;
  active: boolean;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

export type ProcessStepRecord = {
  id: string;
  title: string;
  blurb: string | null;
  detail: string | null;
  image_url: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type FaqItemRecord = {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryItemRecord = {
  id: string;
  caption: string | null;
  image_url: string;
  alt: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSettingRecord = {
  id: string;
  key: string;
  value: Json;
  created_at: string;
  updated_at: string;
};

export type AboutContentRecord = {
  id: string;
  headline: string | null;
  subheadline: string | null;
  bio: string | null;
  image_url: string | null;
  resume_url: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  updated_at: string;
};

export type AdminUserRecord = {
  user_id: string;
  email: string | null;
  created_at: string;
};

export type LogoMarqueeItemRecord = {
  id: string;
  name: string;
  image_url: string;
  alt: string | null;
  height: number | null;
  link_url: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type EducationItemRecord = {
  id: string;
  program: string;
  school: string;
  year: string | null;
  description: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type CmsTableMap = {
  projects: ProjectRecord;
  blog_posts: BlogPostRecord;
  services: ServiceRecord;
  skills: SkillRecord;
  page_sections: PageSectionRecord;
  process_steps: ProcessStepRecord;
  faq_items: FaqItemRecord;
  gallery_items: GalleryItemRecord;
  site_settings: SiteSettingRecord;
  about_content: AboutContentRecord;
  admin_users: AdminUserRecord;
  logo_marquee_items: LogoMarqueeItemRecord;
  education_items: EducationItemRecord;
};

export type SiteSettings = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  instagram_url: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
  seo_default_title: string;
  seo_default_description: string;
  default_og_image: string;
  footer_heading: string;
  footer_subtitle: string;
};

export type AboutContent = {
  headline: string;
  subheadline: string;
  bio: string[];
  image_url: string;
  resume_url: string;
  location: string;
  email: string;
  phone: string;
  instagram_url: string;
  linkedin_url: string;
  github_url: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type PageSection = {
  id: string;
  page: string;
  sectionKey: string;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  orderIndex: number;
  active: boolean;
  metadata: Json;
};

export type ProcessStep = {
  id: string;
  title: string;
  blurb: string;
  detail: string;
  image: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type GalleryItem = {
  id: string;
  caption: string;
  image: string;
  alt: string;
};

export type LogoMarqueeItem = {
  id: string;
  name: string;
  image: string;
  alt: string;
  height: number;
  href: string;
};

export type EducationItem = {
  id: string;
  program: string;
  school: string;
  year: string;
  description: string;
};

export type NavLinkIconKey = "home" | "about" | "work" | "services" | "contact";

export type NavLinkItem = {
  iconKey: NavLinkIconKey;
  label: string;
  href: string;
  sectionId?: string;
};
