const writableColumns = {
  about_content: [
    "headline",
    "subheadline",
    "bio",
    "image_url",
    "resume_url",
    "location",
    "email",
    "phone",
    "instagram_url",
    "linkedin_url",
    "github_url"
  ],
  blog_posts: [
    "title",
    "slug",
    "excerpt",
    "content",
    "cover_image_url",
    "category",
    "tags",
    "published",
    "featured",
    "reading_time",
    "seo_title",
    "seo_description",
    "og_image_url"
  ],
  education_items: ["program", "school", "year", "description", "order_index", "active"],
  faq_items: ["question", "answer", "order_index", "active"],
  gallery_items: ["caption", "image_url", "alt", "order_index", "active"],
  logo_marquee_items: ["name", "image_url", "alt", "height", "link_url", "order_index", "active"],
  page_sections: [
    "page",
    "section_key",
    "label",
    "eyebrow",
    "title",
    "body",
    "cta_label",
    "cta_href",
    "image_url",
    "order_index",
    "active",
    "metadata"
  ],
  process_steps: ["title", "blurb", "detail", "image_url", "order_index", "active"],
  projects: [
    "title",
    "slug",
    "subtitle",
    "short_description",
    "full_description",
    "category",
    "role",
    "client_name",
    "year",
    "status",
    "featured",
    "cover_image_url",
    "thumbnail_url",
    "gallery_images",
    "live_url",
    "github_url",
    "figma_url",
    "technologies",
    "problem",
    "solution",
    "results",
    "process",
    "order_index",
    "seo_title",
    "seo_description",
    "og_image_url"
  ],
  services: ["title", "slug", "description", "icon", "features", "starting_price", "order_index", "active"],
  site_settings: ["key", "value"],
  skills: ["name", "category", "icon", "level", "order_index", "active"]
} as const;

export type CmsWritableTable = keyof typeof writableColumns;

export function isCmsWritableTable(table: string): table is CmsWritableTable {
  return table in writableColumns;
}

export function writableColumnNames(table: string) {
  return isCmsWritableTable(table) ? [...writableColumns[table]] : [];
}

export function sanitizeCmsPayload<T extends Record<string, unknown>>(table: string, payload: T) {
  if (!isCmsWritableTable(table)) return payload;

  const allowed = new Set<string>(writableColumns[table]);
  return Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.has(key)));
}
