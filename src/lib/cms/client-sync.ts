export const CMS_UPDATE_EVENT = "cms:updated";
const CMS_UPDATE_STORAGE_KEY = "cms:last-update";

type CmsUpdatePayload = {
  paths: string[];
  timestamp: number;
};

function uniquePaths(paths: string[]) {
  return Array.from(new Set(paths.filter((path) => path.startsWith("/"))));
}

export function publicPathsForCmsTable(table: string, payload?: Record<string, unknown>) {
  const slug = typeof payload?.slug === "string" && payload.slug.trim() ? payload.slug.trim() : "";

  if (table === "projects") {
    return slug ? ["/", "/projects", `/projects/${slug}`] : ["/", "/projects"];
  }

  if (table === "blog_posts") {
    return slug ? ["/blog", `/blog/${slug}`] : ["/blog"];
  }

  if (table === "page_sections") {
    const page = typeof payload?.page === "string" ? payload.page : "";
    return page === "projects" ? ["/projects"] : ["/"];
  }

  if (table === "site_settings") return ["/", "/projects"];

  if (
    table === "about_content" ||
    table === "education_items" ||
    table === "faq_items" ||
    table === "gallery_items" ||
    table === "logo_marquee_items" ||
    table === "process_steps" ||
    table === "services" ||
    table === "skills"
  ) {
    return ["/"];
  }

  return ["/"];
}

export function publishCmsUpdate(paths: string[]) {
  if (typeof window === "undefined") return;

  const payload: CmsUpdatePayload = {
    paths: uniquePaths(paths),
    timestamp: Date.now()
  };

  try {
    window.localStorage.setItem(CMS_UPDATE_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: payload }));
  } catch {
    window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: payload }));
  }
}

export async function syncCmsUpdate(paths: string[]) {
  const normalized = uniquePaths(paths);
  if (!normalized.length) return;

  try {
    const response = await fetch("/api/cms/revalidate", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ paths: normalized })
    });

    if (!response.ok && process.env.NODE_ENV === "development") {
      console.error("[CMS revalidate failed]", {
        status: response.status,
        body: await response.text()
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[CMS revalidate failed]", error);
    }
  } finally {
    publishCmsUpdate(normalized);
  }
}

export function parseCmsUpdateEvent(event: Event): CmsUpdatePayload | null {
  if (event instanceof CustomEvent && event.detail && typeof event.detail === "object") {
    const detail = event.detail as Partial<CmsUpdatePayload>;
    return Array.isArray(detail.paths) ? { paths: detail.paths, timestamp: detail.timestamp ?? Date.now() } : null;
  }

  if (event instanceof StorageEvent && event.key === CMS_UPDATE_STORAGE_KEY && event.newValue) {
    try {
      const parsed = JSON.parse(event.newValue) as Partial<CmsUpdatePayload>;
      return Array.isArray(parsed.paths) ? { paths: parsed.paths, timestamp: parsed.timestamp ?? Date.now() } : null;
    } catch {
      return null;
    }
  }

  return null;
}
