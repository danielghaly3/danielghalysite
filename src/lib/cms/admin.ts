export type CmsFieldType = "text" | "textarea" | "number" | "checkbox" | "date" | "select" | "list" | "json";

export type CmsFieldConfig = {
  name: string;
  label: string;
  type: CmsFieldType;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: { label: string; value: string }[];
  help?: string;
};

export type CmsResourceConfig = {
  id: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  displayField: string;
  subtitleField?: string;
  thumbnailField?: string;
  slugField?: string;
  slugSourceField?: string;
  orderField?: string;
  statusField?: string;
  fields: CmsFieldConfig[];
};

const seoFields: CmsFieldConfig[] = [
  { name: "seo_title", label: "SEO title", type: "text" },
  { name: "seo_description", label: "SEO description", type: "textarea", rows: 3 },
  { name: "og_image_url", label: "OG image URL", type: "text" }
];

export const cmsResources: CmsResourceConfig[] = [
  {
    id: "projects",
    table: "projects",
    label: "Projects",
    singular: "project",
    description: "Case studies, project metadata, galleries, and publication state.",
    displayField: "title",
    subtitleField: "category",
    thumbnailField: "thumbnail_url",
    slugField: "slug",
    slugSourceField: "title",
    orderField: "order_index",
    statusField: "status",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "short_description", label: "Short description", type: "textarea", required: true, rows: 3 },
      { name: "full_description", label: "Full description", type: "textarea", rows: 6 },
      { name: "category", label: "Category", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "client_name", label: "Client name", type: "text" },
      { name: "year", label: "Year", type: "text" },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
          { label: "Archived", value: "archived" }
        ]
      },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "cover_image_url", label: "Cover image URL", type: "text" },
      { name: "thumbnail_url", label: "Thumbnail URL", type: "text" },
      { name: "gallery_images", label: "Gallery image URLs", type: "list", help: "One URL per line. Add alt text using a pipe: https://... | Alt text" },
      { name: "live_url", label: "Live URL", type: "text" },
      { name: "github_url", label: "GitHub URL", type: "text" },
      { name: "figma_url", label: "Figma URL", type: "text" },
      { name: "technologies", label: "Technologies", type: "list", help: "One technology or service per line." },
      { name: "problem", label: "Problem", type: "textarea", rows: 4 },
      { name: "solution", label: "Solution", type: "textarea", rows: 4 },
      { name: "results", label: "Results", type: "textarea", rows: 4 },
      {
        name: "process",
        label: "Process JSON",
        type: "json",
        rows: 5,
        help: "Use {\"sticky_gallery_layout\":\"showcase\"} to control the project gallery layout."
      },
      { name: "order_index", label: "Order index", type: "number" },
      ...seoFields
    ]
  },
  {
    id: "blog_posts",
    table: "blog_posts",
    label: "Blog Posts",
    singular: "blog post",
    description: "Markdown posts, tags, publish state, and SEO metadata.",
    displayField: "title",
    subtitleField: "excerpt",
    thumbnailField: "cover_image_url",
    slugField: "slug",
    slugSourceField: "title",
    statusField: "published",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3 },
      { name: "content", label: "Markdown content", type: "textarea", rows: 12 },
      { name: "cover_image_url", label: "Cover image URL", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "tags", label: "Tags", type: "list", help: "One tag per line." },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "reading_time", label: "Reading time", type: "number" },
      ...seoFields
    ]
  },
  {
    id: "services",
    table: "services",
    label: "Services",
    singular: "service",
    description: "Public services shown in the homepage carousel.",
    displayField: "title",
    subtitleField: "description",
    thumbnailField: "icon",
    slugField: "slug",
    slugSourceField: "title",
    orderField: "order_index",
    statusField: "active",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 5 },
      { name: "icon", label: "Image or icon URL", type: "text" },
      { name: "features", label: "Features", type: "list" },
      { name: "starting_price", label: "Starting price", type: "text" },
      { name: "order_index", label: "Order index", type: "number" },
      { name: "active", label: "Active", type: "checkbox" }
    ]
  },
  {
    id: "skills",
    table: "skills",
    label: "Skills / Tools",
    singular: "skill",
    description: "Tool logos and skill categories shown in the marquee.",
    displayField: "name",
    subtitleField: "category",
    thumbnailField: "icon",
    orderField: "order_index",
    statusField: "active",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "icon", label: "Icon URL", type: "text" },
      { name: "level", label: "Level", type: "number" },
      { name: "order_index", label: "Order index", type: "number" },
      { name: "active", label: "Active", type: "checkbox" }
    ]
  },
  {
    id: "page_sections",
    table: "page_sections",
    label: "Page Sections",
    singular: "page section",
    description: "Editable copy, CTA, image, and visibility for Home and Projects page sections.",
    displayField: "label",
    orderField: "order_index",
    statusField: "active",
    fields: [
      {
        name: "page",
        label: "Page",
        type: "select",
        required: true,
        options: [
          { label: "Home", value: "home" },
          { label: "Projects", value: "projects" }
        ]
      },
      { name: "section_key", label: "Section key", type: "text", required: true },
      { name: "label", label: "Admin label", type: "text", required: true },
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "body", label: "Body", type: "textarea", rows: 5 },
      { name: "cta_label", label: "CTA label", type: "text" },
      { name: "cta_href", label: "CTA href", type: "text" },
      { name: "image_url", label: "Image URL", type: "text" },
      { name: "order_index", label: "Order index", type: "number" },
      { name: "active", label: "Active", type: "checkbox" },
      {
        name: "metadata",
        label: "Section metadata JSON",
        type: "json",
        rows: 8,
        help: "Extra section fields such as image alt text, detail labels, and SEO overrides."
      }
    ]
  },
  {
    id: "process_steps",
    table: "process_steps",
    label: "Process Steps",
    singular: "process step",
    description: "Homepage process accordion steps, details, images, and ordering.",
    displayField: "title",
    subtitleField: "blurb",
    thumbnailField: "image_url",
    orderField: "order_index",
    statusField: "active",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "blurb", label: "Short blurb", type: "textarea", rows: 3 },
      { name: "detail", label: "Expanded detail", type: "textarea", rows: 6 },
      { name: "image_url", label: "Image URL", type: "text" },
      { name: "order_index", label: "Order index", type: "number" },
      { name: "active", label: "Active", type: "checkbox" }
    ]
  },
  {
    id: "gallery_items",
    table: "gallery_items",
    label: "Gallery Items",
    singular: "gallery item",
    description: "Homepage auto-slider images, captions, alt text, and ordering.",
    displayField: "caption",
    subtitleField: "alt",
    thumbnailField: "image_url",
    orderField: "order_index",
    statusField: "active",
    fields: [
      { name: "caption", label: "Caption", type: "text" },
      { name: "image_url", label: "Image URL", type: "text", required: true },
      { name: "alt", label: "Alt text", type: "text" },
      { name: "order_index", label: "Order index", type: "number" },
      { name: "active", label: "Active", type: "checkbox" }
    ]
  },
  {
    id: "faq_items",
    table: "faq_items",
    label: "FAQ Items",
    singular: "FAQ item",
    description: "Homepage FAQ questions, answers, and ordering.",
    displayField: "question",
    orderField: "order_index",
    statusField: "active",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, rows: 5 },
      { name: "order_index", label: "Order index", type: "number" },
      { name: "active", label: "Active", type: "checkbox" }
    ]
  },
  {
    id: "site_settings",
    table: "site_settings",
    label: "Settings Records",
    singular: "setting",
    description: "Global identity, navigation, footer, contact, social, and SEO JSON values.",
    displayField: "key",
    fields: [
      { name: "key", label: "Key", type: "text", required: true },
      { name: "value", label: "Value", type: "json", required: true, rows: 4, help: "Use a JSON string, number, boolean, object, or array." }
    ]
  },
  {
    id: "logo_marquee_items",
    table: "logo_marquee_items",
    label: "Logo Marquee Items",
    singular: "logo",
    description: "Tool and brand logos shown in the moving marquee under the hero.",
    displayField: "name",
    subtitleField: "alt",
    thumbnailField: "image_url",
    orderField: "order_index",
    statusField: "active",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "image_url", label: "Logo image URL", type: "text", required: true, help: "SVG or PNG path. White-on-dark icons work best." },
      { name: "alt", label: "Alt text", type: "text" },
      { name: "height", label: "Render height (px)", type: "number", help: "Visual height in the marquee. Default 42." },
      { name: "link_url", label: "Optional link URL", type: "text" },
      { name: "order_index", label: "Order index", type: "number" },
      { name: "active", label: "Active", type: "checkbox" }
    ]
  },
  {
    id: "education_items",
    table: "education_items",
    label: "Education Items",
    singular: "education entry",
    description: "Programs and schools shown in the About section education block.",
    displayField: "program",
    subtitleField: "school",
    orderField: "order_index",
    statusField: "active",
    fields: [
      { name: "program", label: "Program", type: "text", required: true },
      { name: "school", label: "School", type: "text", required: true },
      { name: "year", label: "Year or date", type: "text" },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
      { name: "order_index", label: "Order index", type: "number" },
      { name: "active", label: "Active", type: "checkbox" }
    ]
  },
  {
    id: "about_content",
    table: "about_content",
    label: "About / Profile",
    singular: "profile",
    description: "Headline, biography, profile image, resume, and contact profile fields.",
    displayField: "headline",
    subtitleField: "subheadline",
    thumbnailField: "image_url",
    fields: [
      { name: "headline", label: "Headline", type: "text" },
      { name: "subheadline", label: "Subheadline", type: "text" },
      { name: "bio", label: "Bio", type: "textarea", rows: 8, help: "Separate paragraphs with a blank line." },
      { name: "image_url", label: "Image URL", type: "text" },
      { name: "resume_url", label: "Resume URL", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "instagram_url", label: "Instagram URL", type: "text" },
      { name: "linkedin_url", label: "LinkedIn URL", type: "text" },
      { name: "github_url", label: "GitHub URL", type: "text" }
    ]
  }
];

export function getCmsResource(id: string) {
  return cmsResources.find((resource) => resource.id === id);
}
