import { cookies } from "next/headers";
import type { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";
import { allProjects, type Project } from "@/content/projects";
import { featuredProjects as fallbackFeaturedProjects } from "@/content/work";
import {
  fallbackAboutContent,
  fallbackEducationItems,
  fallbackFaqItems,
  fallbackGalleryItems,
  fallbackLogoMarqueeItems,
  fallbackNavLinks,
  fallbackPageSections,
  fallbackProcessSteps,
  fallbackServiceItems,
  fallbackSiteSettings,
  fallbackToolkitItems
} from "@/content/cms-fallbacks";
import type { ServiceCarouselItem } from "@/components/ui/service-card-carousel";
import type { HoverBrandLogoItem } from "@/components/ui/hover-brand-logo";
import type { GalleryLayout } from "@/components/ui/sticky-gallery";
import type {
  AboutContent,
  AboutContentRecord,
  BlogPost,
  BlogPostRecord,
  EducationItem,
  EducationItemRecord,
  FaqItem,
  FaqItemRecord,
  GalleryItem,
  GalleryItemRecord,
  Json,
  LogoMarqueeItem,
  LogoMarqueeItemRecord,
  NavLinkIconKey,
  NavLinkItem,
  PageSection,
  PageSectionRecord,
  ProjectRecord,
  ProcessStep,
  ProcessStepRecord,
  ServiceRecord,
  SiteSettingRecord,
  SiteSettings,
  SkillRecord
} from "@/types/cms";

type SupabaseClient = Awaited<ReturnType<typeof getSupabase>>;

const galleryLayouts = new Set<GalleryLayout>([
  "hero-split",
  "mosaic-left",
  "bento",
  "editorial",
  "featured-left",
  "featured-right",
  "magazine",
  "zigzag",
  "showcase"
]);

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

async function getSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

async function withCms<T>(fallback: T, run: (supabase: SupabaseClient) => Promise<T>): Promise<T> {
  if (!isSupabaseConfigured()) return fallback;

  try {
    const supabase = await getSupabase();
    return await Promise.race([
      run(supabase),
      new Promise<T>((resolve) => {
        setTimeout(() => resolve(fallback), 2500);
      })
    ]);
  } catch {
    return fallback;
  }
}

function stringValue(value: Json | undefined, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function readProcessLayout(process: Json): GalleryLayout {
  if (process && typeof process === "object" && !Array.isArray(process)) {
    const layout = process.sticky_gallery_layout;
    if (typeof layout === "string" && galleryLayouts.has(layout as GalleryLayout)) {
      return layout as GalleryLayout;
    }
  }

  return "showcase";
}

function safeImage(src: string | null | undefined, fallback: string) {
  return src?.trim() || fallback;
}

function projectFromRecord(row: ProjectRecord): Project {
  const image = safeImage(row.thumbnail_url ?? row.cover_image_url, "/images/daniel-hero.png");
  const projectGalleryImages = row.gallery_images?.map((src) => src.trim()).filter(Boolean) ?? [];
  const sourceGalleryImages = projectGalleryImages.length ? projectGalleryImages : [image];
  const galleryImages = Array.from({ length: Math.max(9, sourceGalleryImages.length) }, (_, index) => {
    return sourceGalleryImages[index % sourceGalleryImages.length] ?? image;
  });

  return {
    slug: row.slug,
    name: row.title,
    category: row.category ?? row.subtitle ?? "Selected Work",
    description: row.short_description,
    tags: row.technologies?.length ? row.technologies : row.category ? [row.category] : [],
    image,
    alt: row.image_alt ?? `${row.title} project image`,
    year: row.year ?? undefined,
    client: row.client_name ?? undefined,
    role: row.role ?? undefined,
    overview: row.full_description ?? row.short_description,
    problem: row.problem ?? undefined,
    solution: row.solution ?? undefined,
    results: row.results ?? undefined,
    technologies: row.technologies?.length ? row.technologies : undefined,
    liveUrl: row.live_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    figmaUrl: row.figma_url ?? undefined,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    ogImageUrl: row.og_image_url ?? undefined,
    gallery: galleryImages.map((src, index) => ({ src, alt: `${row.title} gallery image ${index + 1}` })),
    stickyGallery: {
      layout: readProcessLayout(row.process),
      images: galleryImages
    }
  };
}

function featuredProjectFromProject(project: Project) {
  return {
    slug: project.slug,
    name: project.name,
    description: project.description,
    tags: project.tags,
    image: project.image,
    alt: project.alt
  };
}

function blogFromRecord(row: BlogPostRecord): BlogPost {
  const excerpt = row.excerpt ?? "";
  const coverImageUrl = safeImage(row.cover_image_url, "/images/daniel-hero.png");

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt,
    content: row.content ?? "",
    coverImageUrl,
    category: row.category ?? "Writing",
    tags: row.tags ?? [],
    featured: row.featured,
    readingTime: row.reading_time ?? estimateReadingTime(row.content ?? excerpt),
    seoTitle: row.seo_title ?? row.title,
    seoDescription: row.seo_description ?? excerpt,
    ogImageUrl: safeImage(row.og_image_url, coverImageUrl),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function serviceFromRecord(row: ServiceRecord): ServiceCarouselItem {
  return {
    id: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? (row.starting_price ? `Starting at ${row.starting_price}` : "Portfolio service"),
    description: row.description,
    tags: row.features ?? [],
    image: row.icon?.startsWith("/") || row.icon?.startsWith("http") ? row.icon : "/images/flyup-line.png",
    alt: row.image_alt ?? `${row.title} service visual`
  };
}

function skillFromRecord(row: SkillRecord): HoverBrandLogoItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? "Skill",
    icon: row.icon || "/icons/tools/ui-design.svg",
    wide: row.wide || undefined
  };
}

function pageSectionFromRecord(row: PageSectionRecord): PageSection {
  return {
    id: row.id,
    page: row.page,
    sectionKey: row.section_key,
    label: row.label,
    eyebrow: row.eyebrow ?? "",
    title: row.title ?? "",
    body: row.body ?? "",
    ctaLabel: row.cta_label ?? "",
    ctaHref: row.cta_href ?? "",
    imageUrl: row.image_url ?? "",
    orderIndex: row.order_index,
    active: row.active,
    content: row.content ?? {},
    metadata: row.metadata ?? {}
  };
}

function processStepFromRecord(row: ProcessStepRecord): ProcessStep {
  return {
    id: row.id,
    title: row.title,
    blurb: row.blurb ?? "",
    detail: row.detail ?? "",
    image: safeImage(row.image_url, "/images/daniel-hero.png"),
    imageAlt: row.image_alt ?? `${row.title} process step visual`
  };
}

function faqItemFromRecord(row: FaqItemRecord): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer
  };
}

function logoMarqueeItemFromRecord(row: LogoMarqueeItemRecord): LogoMarqueeItem {
  return {
    id: row.id,
    name: row.name,
    image: safeImage(row.image_url, "/icons/tools/ui-design.svg"),
    alt: row.alt ?? row.name,
    height: row.height ?? 42,
    href: row.link_url ?? ""
  };
}

function educationItemFromRecord(row: EducationItemRecord): EducationItem {
  return {
    id: row.id,
    program: row.program,
    school: row.school,
    year: row.year ?? "",
    description: row.description ?? ""
  };
}

const NAV_ICON_KEYS = new Set<NavLinkIconKey>(["home", "about", "work", "services", "contact"]);

function isNavIconKey(value: unknown): value is NavLinkIconKey {
  return typeof value === "string" && NAV_ICON_KEYS.has(value as NavLinkIconKey);
}

function parseNavLinks(value: Json): NavLinkItem[] | null {
  if (!Array.isArray(value)) return null;
  const parsed: NavLinkItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const record = entry as Record<string, Json | undefined>;
    const iconKeyValue = record.iconKey ?? record.icon_key;
    const labelValue = record.label;
    const hrefValue = record.href;
    if (!isNavIconKey(iconKeyValue)) continue;
    if (typeof labelValue !== "string" || !labelValue.trim()) continue;
    if (typeof hrefValue !== "string" || !hrefValue.trim()) continue;
    const sectionId = record.sectionId ?? record.section_id;
    parsed.push({
      iconKey: iconKeyValue,
      label: labelValue,
      href: hrefValue,
      sectionId: typeof sectionId === "string" && sectionId ? sectionId : undefined
    });
  }
  return parsed.length ? parsed : null;
}

function galleryItemFromRecord(row: GalleryItemRecord): GalleryItem {
  return {
    id: row.id,
    caption: row.caption ?? "",
    image: safeImage(row.image_url, "/images/daniel-hero.png"),
    alt: row.alt ?? row.caption ?? "Portfolio gallery image"
  };
}

function aboutFromRecord(row: AboutContentRecord): AboutContent {
  return {
    headline: row.headline ?? fallbackAboutContent.headline,
    subheadline: row.subheadline ?? fallbackAboutContent.subheadline,
    bio: (row.bio ?? "").split(/\n{2,}/).map((entry) => entry.trim()).filter(Boolean),
    image_url: safeImage(row.image_url, fallbackAboutContent.image_url),
    resume_url: row.resume_url ?? "",
    location: row.location ?? fallbackAboutContent.location,
    email: row.email ?? fallbackAboutContent.email,
    phone: row.phone ?? fallbackAboutContent.phone,
    instagram_url: row.instagram_url ?? fallbackAboutContent.instagram_url,
    linkedin_url: row.linkedin_url ?? fallbackAboutContent.linkedin_url,
    github_url: row.github_url ?? fallbackAboutContent.github_url
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return withCms(fallbackSiteSettings, async (supabase) => {
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error || !data?.length) return fallbackSiteSettings;

    return data.reduce<SiteSettings>((settings, row) => {
      const key = (row as Pick<SiteSettingRecord, "key">).key as keyof SiteSettings;
      if (key in settings) {
        settings[key] = stringValue((row as Pick<SiteSettingRecord, "value">).value, settings[key]);
      }
      return settings;
    }, { ...fallbackSiteSettings });
  });
}

export async function getAboutContent(): Promise<AboutContent> {
  return withCms(fallbackAboutContent, async (supabase) => {
    const { data, error } = await supabase.from("about_content").select("*").limit(1).maybeSingle();
    if (error || !data) return fallbackAboutContent;
    const about = aboutFromRecord(data as AboutContentRecord);
    return about.bio.length ? about : { ...about, bio: fallbackAboutContent.bio };
  });
}

export async function getPublishedProjects(): Promise<Project[]> {
  return withCms(allProjects, async (supabase) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return allProjects;
    return (data as ProjectRecord[]).map(projectFromRecord);
  });
}

export async function getFeaturedProjects() {
  return withCms(fallbackFeaturedProjects, async (supabase) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .eq("featured", true)
      .order("order_index", { ascending: true })
      .limit(3);

    if (error || !data) return fallbackFeaturedProjects;
    return (data as ProjectRecord[]).map(projectFromRecord).map(featuredProjectFromProject);
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const fallback = allProjects.find((project) => project.slug === slug) ?? null;

  return withCms(fallback, async (supabase) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return fallback;
    return projectFromRecord(data as ProjectRecord);
  });
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return withCms([], async (supabase) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return (data as BlogPostRecord[]).map(blogFromRecord);
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return withCms(null, async (supabase) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return null;
    return blogFromRecord(data as BlogPostRecord);
  });
}

export async function getServices(): Promise<ServiceCarouselItem[]> {
  return withCms(fallbackServiceItems, async (supabase) => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (error || !data) return fallbackServiceItems;
    return (data as ServiceRecord[]).map(serviceFromRecord);
  });
}

export async function getSkills(): Promise<HoverBrandLogoItem[]> {
  return withCms(fallbackToolkitItems, async (supabase) => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (error || !data) return fallbackToolkitItems;
    return (data as SkillRecord[]).map(skillFromRecord);
  });
}

export async function getPageSections(page: string): Promise<PageSection[]> {
  const fallback = fallbackPageSections
    .filter((section) => section.page === page && section.active)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return withCms(fallback, async (supabase) => {
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page", page)
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (error || !data) return fallback;
    return (data as PageSectionRecord[]).map(pageSectionFromRecord);
  });
}

export async function getPageSection(page: string, sectionKey: string): Promise<PageSection | undefined> {
  const fallback = fallbackPageSections.find((section) => section.page === page && section.sectionKey === sectionKey);

  return withCms(fallback, async (supabase) => {
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page", page)
      .eq("section_key", sectionKey)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return fallback;
    return pageSectionFromRecord(data as PageSectionRecord);
  });
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return withCms(fallbackProcessSteps, async (supabase) => {
    const { data, error } = await supabase
      .from("process_steps")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (error || !data) return fallbackProcessSteps;
    return (data as ProcessStepRecord[]).map(processStepFromRecord);
  });
}

export async function getFaqItems(): Promise<FaqItem[]> {
  return withCms(fallbackFaqItems, async (supabase) => {
    const { data, error } = await supabase
      .from("faq_items")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (error || !data) return fallbackFaqItems;
    return (data as FaqItemRecord[]).map(faqItemFromRecord);
  });
}

export async function getLogoMarqueeItems(): Promise<LogoMarqueeItem[]> {
  return withCms(fallbackLogoMarqueeItems, async (supabase) => {
    const { data, error } = await supabase
      .from("logo_marquee_items")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (error || !data) return fallbackLogoMarqueeItems;
    return (data as LogoMarqueeItemRecord[]).map(logoMarqueeItemFromRecord);
  });
}

export async function getEducationItems(): Promise<EducationItem[]> {
  return withCms(fallbackEducationItems, async (supabase) => {
    const { data, error } = await supabase
      .from("education_items")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (error || !data) return fallbackEducationItems;
    return (data as EducationItemRecord[]).map(educationItemFromRecord);
  });
}

export async function getNavLinks(): Promise<NavLinkItem[]> {
  return withCms(fallbackNavLinks, async (supabase) => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "nav_links")
      .maybeSingle();

    if (error || !data) return fallbackNavLinks;
    const parsed = parseNavLinks((data as Pick<SiteSettingRecord, "value">).value);
    return parsed ?? fallbackNavLinks;
  });
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return withCms(fallbackGalleryItems, async (supabase) => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("active", true)
      .order("order_index", { ascending: true });

    if (error || !data) return fallbackGalleryItems;
    return (data as GalleryItemRecord[]).map(galleryItemFromRecord);
  });
}

export async function getSitemapEntries(siteUrl: string): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getPublishedProjects(), getPublishedBlogPosts()]);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
