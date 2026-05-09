import type { Json, PageSection } from "@/types/cms";

type SectionContent = Record<string, Json | undefined>;

export function getSectionContent(section?: PageSection): SectionContent {
  const content = section?.metadata;
  if (!content || typeof content !== "object" || Array.isArray(content)) return {};
  return content as SectionContent;
}

export function sectionString(section: PageSection | undefined, key: string, fallback = "") {
  const value = getSectionContent(section)[key];
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

export function sectionUrlList(section: PageSection | undefined, key: string, fallback: string[] = []) {
  const value = getSectionContent(section)[key];
  if (!Array.isArray(value)) return fallback;
  const urls = value.filter((entry): entry is string => typeof entry === "string" && Boolean(entry.trim()));
  return urls.length ? urls : fallback;
}
