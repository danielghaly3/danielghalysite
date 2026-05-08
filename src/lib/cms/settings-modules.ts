import {
  Linkedin,
  Mail,
  MapPin,
  Navigation,
  Palette,
  SearchCheck,
  type LucideIcon
} from "lucide-react";
import type { Json, NavLinkIconKey } from "@/types/cms";

export type SettingFieldType = "text" | "email" | "tel" | "url" | "textarea" | "image" | "navLinks";

export type SettingFieldConfig = {
  key: string;
  label: string;
  type: SettingFieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
};

export type SettingsModuleConfig = {
  slug: string;
  title: string;
  actionLabel: string;
  eyebrow: string;
  description: string;
  completionLabel: string;
  Icon: LucideIcon;
  fields: SettingFieldConfig[];
};

export type SettingRow = {
  key: string;
  value: Json;
  updated_at?: string;
};

export type NavLinkEditorItem = {
  iconKey: NavLinkIconKey;
  label: string;
  href: string;
  sectionId: string;
};

export const navIconOptions: { label: string; value: NavLinkIconKey }[] = [
  { label: "Home", value: "home" },
  { label: "About", value: "about" },
  { label: "Work", value: "work" },
  { label: "Services", value: "services" },
  { label: "Contact", value: "contact" }
];

export const settingsModules: SettingsModuleConfig[] = [
  {
    slug: "site-identity",
    title: "Site Identity",
    actionLabel: "Edit site identity",
    eyebrow: "Identity",
    description: "Set the public name, tagline, and location used across the portfolio.",
    completionLabel: "Identity fields complete",
    Icon: Palette,
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Daniel Ghaly" },
      {
        key: "tagline",
        label: "Tagline",
        type: "textarea",
        required: true,
        placeholder: "Designer and Web Developer...",
        helperText: "Used in overview copy, fallbacks, and places where a compact positioning line is needed."
      },
      { key: "location", label: "Location", type: "text", required: true, placeholder: "Mississauga, Ontario" }
    ]
  },
  {
    slug: "contact-info",
    title: "Contact Info",
    actionLabel: "Edit contact info",
    eyebrow: "Contact",
    description: "Primary email, phone, and resume URL used by footer/contact surfaces.",
    completionLabel: "Contact fields complete",
    Icon: Mail,
    fields: [
      { key: "email", label: "Email", type: "email", required: true, placeholder: "hello@example.com" },
      { key: "phone", label: "Phone", type: "tel", placeholder: "+1 647 570 0334" },
      { key: "resume_url", label: "Resume URL", type: "url", placeholder: "https://..." }
    ]
  },
  {
    slug: "social-links",
    title: "Social Links",
    actionLabel: "Edit social links",
    eyebrow: "Social",
    description: "External profile URLs used by the footer and profile/contact UI.",
    completionLabel: "Social links complete",
    Icon: Linkedin,
    fields: [
      { key: "instagram_url", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/..." },
      { key: "linkedin_url", label: "LinkedIn URL", type: "url", required: true, placeholder: "https://linkedin.com/in/..." },
      { key: "github_url", label: "GitHub URL", type: "url", placeholder: "https://github.com/..." }
    ]
  },
  {
    slug: "navigation",
    title: "Navigation",
    actionLabel: "Edit navigation",
    eyebrow: "DockNav",
    description: "Manage the public dock nav labels, links, icons, and homepage section targets.",
    completionLabel: "Navigation items complete",
    Icon: Navigation,
    fields: [
      {
        key: "nav_links",
        label: "Dock navigation items",
        type: "navLinks",
        required: true,
        helperText: "Section target is used for active-state detection on the homepage. Leave it blank for normal pages."
      }
    ]
  },
  {
    slug: "footer",
    title: "Footer",
    actionLabel: "Edit footer",
    eyebrow: "Footer",
    description: "Footer heading and supporting contact copy shown at the bottom of the public site.",
    completionLabel: "Footer fields complete",
    Icon: MapPin,
    fields: [
      { key: "footer_heading", label: "Footer heading", type: "text", required: true, placeholder: "Contact" },
      {
        key: "footer_subtitle",
        label: "Footer subtitle",
        type: "textarea",
        required: true,
        placeholder: "Let's build something clean, modern, and useful together."
      },
      { key: "email", label: "Footer email", type: "email", required: true },
      { key: "phone", label: "Footer phone", type: "tel" }
    ]
  },
  {
    slug: "seo-defaults",
    title: "SEO Defaults",
    actionLabel: "Edit SEO defaults",
    eyebrow: "SEO",
    description: "Default metadata used when a page or record does not provide its own SEO override.",
    completionLabel: "SEO defaults complete",
    Icon: SearchCheck,
    fields: [
      { key: "seo_default_title", label: "Default meta title", type: "text", required: true },
      { key: "seo_default_description", label: "Default meta description", type: "textarea", required: true },
      { key: "default_og_image", label: "Fallback Open Graph image", type: "image", required: true, placeholder: "/opengraph-image" }
    ]
  }
];

export function getSettingsModule(slug: string) {
  return settingsModules.find((module) => module.slug === slug);
}

export function settingValueToString(value: Json | undefined) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

export function parseNavLinksForEditor(value: Json | undefined): NavLinkEditorItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      const record = entry as Record<string, Json | undefined>;
      const iconKey = typeof record.iconKey === "string" ? record.iconKey : record.icon_key;
      const label = settingValueToString(record.label);
      const href = settingValueToString(record.href);
      const sectionId = settingValueToString(record.sectionId ?? record.section_id);
      if (!navIconOptions.some((option) => option.value === iconKey) || !label || !href) return null;
      return { iconKey: iconKey as NavLinkIconKey, label, href, sectionId };
    })
    .filter((item): item is NavLinkEditorItem => Boolean(item));
}

export function hasSettingValue(value: Json | undefined) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return Boolean(value.trim());
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

export function settingPreviewValue(value: Json | undefined) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return `${value.length} configured`;
  if (value && typeof value === "object") return `${Object.keys(value).length} fields`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "Missing";
}
