import type { RepeaterFieldConfig } from "@/components/dashboard/RepeaterField";

export type SectionEditorPage = "home" | "projects";
export type SectionFieldSource = "column" | "metadata";
export type SectionFieldType = "text" | "textarea" | "checkbox";

export type SectionEditorField = {
  name: string;
  label: string;
  type: SectionFieldType;
  source: SectionFieldSource;
  rows?: number;
  required?: boolean;
  help?: string;
};

export type SectionRelatedResource = {
  label: string;
  href: string;
  createHref?: string;
  canCreate?: boolean;
  description: string;
};

export type SectionRepeaterConfig = {
  table: string;
  label: string;
  description?: string;
  addLabel?: string;
  fields: RepeaterFieldConfig[];
  newItem: Record<string, unknown>;
  itemTitleField: string;
  itemSubtitleField?: string;
  detailHref: string;
};

export type SectionEditorSchema = {
  page: SectionEditorPage;
  sectionKey: string;
  title: string;
  description: string;
  fields: SectionEditorField[];
  relatedResources?: SectionRelatedResource[];
  repeater?: SectionRepeaterConfig;
  publicAnchor?: string;
};

const sectionSystemFields: SectionEditorField[] = [
  { name: "label", label: "Dashboard label", type: "text", source: "column", required: true },
  { name: "order_index", label: "Sort order", type: "text", source: "column" },
  { name: "active", label: "Show this section", type: "checkbox", source: "column" }
];

const seoFields: SectionEditorField[] = [
  { name: "seoTitle", label: "SEO title", type: "text", source: "metadata" },
  { name: "seoDescription", label: "SEO description", type: "textarea", source: "metadata", rows: 3 },
  { name: "ogTitle", label: "OG title", type: "text", source: "metadata" },
  { name: "ogDescription", label: "OG description", type: "textarea", source: "metadata", rows: 3 },
  { name: "ogImage", label: "OG image URL", type: "text", source: "metadata" },
  { name: "twitterTitle", label: "Twitter title", type: "text", source: "metadata" },
  { name: "twitterDescription", label: "Twitter description", type: "textarea", source: "metadata", rows: 3 },
  { name: "twitterImage", label: "Twitter image URL", type: "text", source: "metadata" },
  { name: "canonicalUrl", label: "Canonical URL", type: "text", source: "metadata" }
];

const headerFields: SectionEditorField[] = [
  { name: "eyebrow", label: "Eyebrow", type: "text", source: "column" },
  { name: "title", label: "Heading", type: "text", source: "column" },
  { name: "body", label: "Description", type: "textarea", source: "column", rows: 4 }
];

const ctaFields: SectionEditorField[] = [
  { name: "cta_label", label: "Button label", type: "text", source: "column" },
  { name: "cta_href", label: "Button link", type: "text", source: "column" }
];

const imageFields: SectionEditorField[] = [
  { name: "image_url", label: "Image URL", type: "text", source: "column" },
  { name: "imageAlt", label: "Image alt text", type: "text", source: "metadata" }
];

export const homeSectionSchemas: SectionEditorSchema[] = [
  {
    page: "home",
    sectionKey: "hero",
    title: "Hero",
    description: "Main eyebrow, name/title, intro copy, CTA, hero image, image alt text, and homepage SEO.",
    fields: [...sectionSystemFields, ...headerFields, ...ctaFields, ...imageFields, ...seoFields],
    publicAnchor: "/"
  },
  {
    page: "home",
    sectionKey: "logo_marquee",
    title: "Logo Marquee",
    description: "The visible marquee label plus the repeated logo entries underneath the hero.",
    publicAnchor: "/#logo-marquee",
    fields: [...sectionSystemFields, { name: "title", label: "Marquee label", type: "text", source: "column" }],
    repeater: {
      table: "logo_marquee_items",
      label: "Marquee logos",
      description: "Each logo row is rendered in the auto-scrolling strip below the hero.",
      addLabel: "Add logo",
      detailHref: "/dashboard/logo_marquee_items",
      itemTitleField: "name",
      itemSubtitleField: "image_url",
      fields: [
        { name: "name", label: "Name", type: "text", placeholder: "Brand name", required: true },
        { name: "image_url", label: "Image URL", type: "image", placeholder: "/icons/tools/figma.svg", fullWidth: true, required: true },
        { name: "alt", label: "Alt text", type: "text" },
        { name: "height", label: "Height (px)", type: "number", placeholder: "42" },
        { name: "link_url", label: "Link URL (optional)", type: "text" },
        { name: "order_index", label: "Order", type: "number" },
        { name: "active", label: "Show in marquee", type: "checkbox", placeholder: "Visible" }
      ],
      newItem: { name: "", image_url: "", alt: "", height: 42, link_url: "", order_index: 0, active: true }
    }
  },
  {
    page: "home",
    sectionKey: "about",
    title: "About",
    description: "About eyebrow, heading, portrait override, portrait alt text, and education block label.",
    publicAnchor: "/#about",
    fields: [
      ...sectionSystemFields,
      { name: "eyebrow", label: "Eyebrow", type: "text", source: "column" },
      { name: "title", label: "Heading", type: "textarea", source: "column", rows: 3 },
      { name: "image_url", label: "Portrait override URL", type: "text", source: "column" },
      { name: "imageAlt", label: "Portrait alt text", type: "text", source: "metadata" },
      { name: "educationLabel", label: "Education label", type: "text", source: "metadata" }
    ],
    relatedResources: [
      {
        label: "Edit profile, bio, and contact",
        href: "/dashboard/about_content",
        canCreate: false,
        description: "Controls the about paragraphs, portrait fallback, role text, contact details, and resume URL."
      }
    ],
    repeater: {
      table: "education_items",
      label: "Education entries",
      description: "Programs and schools shown in the education block.",
      addLabel: "Add entry",
      detailHref: "/dashboard/education_items",
      itemTitleField: "program",
      itemSubtitleField: "school",
      fields: [
        { name: "program", label: "Program", type: "text", required: true },
        { name: "school", label: "School", type: "text", required: true },
        { name: "year", label: "Year", type: "text", placeholder: "2024" },
        { name: "description", label: "Description (optional)", type: "textarea", rows: 2 },
        { name: "order_index", label: "Order", type: "number" },
        { name: "active", label: "Show in section", type: "checkbox", placeholder: "Visible" }
      ],
      newItem: { program: "", school: "", year: "", description: "", order_index: 0, active: true }
    }
  },
  {
    page: "home",
    sectionKey: "featured_work",
    title: "Featured Work",
    description: "Selected work heading, optional body copy, case-study button text, and featured project cards.",
    publicAnchor: "/projects",
    fields: [...sectionSystemFields, ...headerFields, { name: "cta_label", label: "Case-study button label", type: "text", source: "column" }],
    relatedResources: [
      {
        label: "Manage project cards",
        href: "/dashboard/projects",
        description: "Featured project cards use project title, short description, tags, image, image alt text, slug, status, and order."
      }
    ]
  },
  {
    page: "home",
    sectionKey: "toolkit",
    title: "Toolkit",
    description: "Toolkit heading plus the animated skills/tools grid.",
    publicAnchor: "/#toolkit",
    fields: [...sectionSystemFields, ...headerFields],
    repeater: {
      table: "skills",
      label: "Tools and skills",
      description: "Each tool appears in the marquee grid. Drag-reorder, hide, or add new ones inline.",
      addLabel: "Add tool",
      detailHref: "/dashboard/skills",
      itemTitleField: "name",
      itemSubtitleField: "category",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "category", label: "Category", type: "text", placeholder: "Design, Development, AI workflow" },
        { name: "icon", label: "Icon URL", type: "image", fullWidth: true },
        { name: "level", label: "Level (0-100)", type: "number" },
        { name: "order_index", label: "Order", type: "number" },
        { name: "active", label: "Show in toolkit", type: "checkbox", placeholder: "Visible" }
      ],
      newItem: { name: "", category: "", icon: "", level: 80, order_index: 0, active: true }
    }
  },
  {
    page: "home",
    sectionKey: "services",
    title: "Services",
    description: "Services heading plus the service card carousel.",
    publicAnchor: "/#services",
    fields: [...sectionSystemFields, ...headerFields],
    repeater: {
      table: "services",
      label: "Service cards",
      description: "Each service shows in the carousel with its title, description, image, and tag list.",
      addLabel: "Add service",
      detailHref: "/dashboard/services",
      itemTitleField: "title",
      itemSubtitleField: "description",
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", helperText: "Lowercase, hyphenated. Used internally.", required: true },
        { name: "description", label: "Description", type: "textarea", rows: 3, fullWidth: true, required: true },
        { name: "icon", label: "Image URL", type: "image", fullWidth: true },
        { name: "features", label: "Tags / features", type: "list", rows: 3, helperText: "One tag per line." },
        { name: "starting_price", label: "Starting price (optional)", type: "text" },
        { name: "order_index", label: "Order", type: "number" },
        { name: "active", label: "Show in carousel", type: "checkbox", placeholder: "Visible" }
      ],
      newItem: { title: "", slug: "", description: "", icon: "", features: [], starting_price: "", order_index: 0, active: true }
    }
  },
  {
    page: "home",
    sectionKey: "process",
    title: "Process",
    description: "Process heading plus the accordion step list.",
    publicAnchor: "/#process",
    fields: [...sectionSystemFields, ...headerFields],
    repeater: {
      table: "process_steps",
      label: "Process steps",
      description: "Each step appears in the accordion. The order here is the order users see.",
      addLabel: "Add step",
      detailHref: "/dashboard/process_steps",
      itemTitleField: "title",
      itemSubtitleField: "blurb",
      fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "blurb", label: "Short blurb", type: "textarea", rows: 2, fullWidth: true },
        { name: "detail", label: "Expanded detail", type: "textarea", rows: 4, fullWidth: true },
        { name: "image_url", label: "Image URL", type: "image", fullWidth: true, required: true },
        { name: "order_index", label: "Order", type: "number" },
        { name: "active", label: "Show step", type: "checkbox", placeholder: "Visible" }
      ],
      newItem: { title: "", blurb: "", detail: "", image_url: "", order_index: 0, active: true }
    }
  },
  {
    page: "home",
    sectionKey: "gallery",
    title: "Gallery",
    description: "Gallery eyebrow, heading, description, CTA, and slider images.",
    publicAnchor: "/#gallery",
    fields: [...sectionSystemFields, ...headerFields, ...ctaFields],
    repeater: {
      table: "gallery_items",
      label: "Gallery images",
      description: "Each image scrolls in the auto-slider gallery.",
      addLabel: "Add image",
      detailHref: "/dashboard/gallery_items",
      itemTitleField: "caption",
      itemSubtitleField: "alt",
      fields: [
        { name: "image_url", label: "Image URL", type: "image", fullWidth: true },
        { name: "caption", label: "Caption", type: "text" },
        { name: "alt", label: "Alt text", type: "text" },
        { name: "order_index", label: "Order", type: "number" },
        { name: "active", label: "Show in gallery", type: "checkbox", placeholder: "Visible" }
      ],
      newItem: { image_url: "", caption: "", alt: "", order_index: 0, active: true }
    }
  },
  {
    page: "home",
    sectionKey: "faq",
    title: "FAQ",
    description: "FAQ eyebrow, heading, description, CTA, and question list.",
    publicAnchor: "/#faq",
    fields: [...sectionSystemFields, ...headerFields, ...ctaFields],
    repeater: {
      table: "faq_items",
      label: "FAQ questions",
      description: "Each question and answer appears in the accordion.",
      addLabel: "Add question",
      detailHref: "/dashboard/faq_items",
      itemTitleField: "question",
      itemSubtitleField: "answer",
      fields: [
        { name: "question", label: "Question", type: "text", fullWidth: true, required: true },
        { name: "answer", label: "Answer", type: "textarea", rows: 4, fullWidth: true, required: true },
        { name: "order_index", label: "Order", type: "number" },
        { name: "active", label: "Show question", type: "checkbox", placeholder: "Visible" }
      ],
      newItem: { question: "", answer: "", order_index: 0, active: true }
    }
  }
];

export const projectsSectionSchemas: SectionEditorSchema[] = [
  {
    page: "projects",
    sectionKey: "hero",
    title: "Projects Hero",
    description: "Projects page eyebrow, title, intro copy, CTA, image, image alt text, and page SEO.",
    fields: [...sectionSystemFields, ...headerFields, ...ctaFields, ...imageFields, ...seoFields],
    publicAnchor: "/projects"
  },
  {
    page: "projects",
    sectionKey: "grid",
    title: "Projects Grid Intro",
    description: "Heading and body copy above the projects carousel.",
    fields: [
      ...sectionSystemFields,
      { name: "title", label: "Heading", type: "text", source: "column" },
      { name: "body", label: "Description", type: "textarea", source: "column", rows: 4 }
    ],
    publicAnchor: "/projects#projects-grid",
    relatedResources: [
      {
        label: "Manage project cards",
        href: "/dashboard/projects",
        description: "The carousel uses project title, category, slug, image, image alt text, status, and order."
      }
    ]
  },
  {
    page: "projects",
    sectionKey: "detail",
    title: "Project Detail Template",
    description: "Shared labels used by every project/case-study detail page.",
    fields: [
      ...sectionSystemFields,
      { name: "backLabel", label: "Back link label", type: "text", source: "metadata" },
      { name: "clientLabel", label: "Client label", type: "text", source: "metadata" },
      { name: "roleLabel", label: "Role label", type: "text", source: "metadata" },
      { name: "yearLabel", label: "Year label", type: "text", source: "metadata" },
      { name: "technologiesLabel", label: "Technologies label", type: "text", source: "metadata" },
      { name: "servicesLabel", label: "Services label", type: "text", source: "metadata" },
      { name: "linksLabel", label: "Links label", type: "text", source: "metadata" },
      { name: "liveLabel", label: "Live link label", type: "text", source: "metadata" },
      { name: "githubLabel", label: "GitHub link label", type: "text", source: "metadata" },
      { name: "figmaLabel", label: "Figma link label", type: "text", source: "metadata" },
      { name: "overviewLabel", label: "Overview heading", type: "text", source: "metadata" },
      { name: "problemLabel", label: "Problem heading", type: "text", source: "metadata" },
      { name: "solutionLabel", label: "Solution heading", type: "text", source: "metadata" },
      { name: "resultsLabel", label: "Results heading", type: "text", source: "metadata" },
      { name: "previousLabel", label: "Previous project label", type: "text", source: "metadata" },
      { name: "nextLabel", label: "Next project label", type: "text", source: "metadata" }
    ],
    relatedResources: [
      {
        label: "Manage project records",
        href: "/dashboard/projects",
        description: "Each detail page uses project title, category, descriptions, image, alt text, metadata, gallery, links, and SEO fields."
      }
    ]
  }
];

export const pageSectionSchemas = {
  home: homeSectionSchemas,
  projects: projectsSectionSchemas
} satisfies Record<SectionEditorPage, SectionEditorSchema[]>;

export function getSectionEditorSchema(page: SectionEditorPage, sectionKey: string) {
  return pageSectionSchemas[page].find((section) => section.sectionKey === sectionKey);
}
