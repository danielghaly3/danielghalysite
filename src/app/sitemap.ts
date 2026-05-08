import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getSitemapEntries } from "@/lib/cms/public";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries(site.url);
}
