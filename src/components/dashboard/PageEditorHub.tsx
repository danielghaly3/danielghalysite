import Link from "next/link";
import { cookies } from "next/headers";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Layers,
  Plus
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { pageSectionSchemas, type SectionEditorSchema } from "@/lib/cms/section-editor";
import { cn } from "@/lib/cn";

type PageName = "home" | "projects";

type PageSectionRow = {
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
  content: unknown;
  active: boolean;
  updated_at: string;
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  short_description: string | null;
  thumbnail_url: string | null;
  updated_at: string;
};

/* ─── Repeater item counts ─── */

type ItemPreview = {
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
  status: string;
};

type ItemSummary = {
  table: string;
  total: number;
  active: number;
  preview: ItemPreview[];
};

function safeText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function rowImage(row: Record<string, unknown>) {
  return safeText(row.image_url) || safeText(row.thumbnail_url) || safeText(row.cover_image_url) || safeText(row.icon);
}

function itemStatus(row: Record<string, unknown>) {
  if (typeof row.status === "string") return row.status;
  if (typeof row.published === "boolean") return row.published ? "published" : "draft";
  if (typeof row.active === "boolean") return row.active ? "active" : "hidden";
  return "";
}

function isRowActive(row: Record<string, unknown>) {
  if (typeof row.status === "string") return row.status === "published";
  if (typeof row.published === "boolean") return row.published;
  if (typeof row.active === "boolean") return row.active;
  return true;
}

async function getRepeaterSummaries(schemas: SectionEditorSchema[]): Promise<Map<string, ItemSummary>> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const repeaters = schemas
    .map((schema) => schema.repeater)
    .filter((repeater): repeater is NonNullable<SectionEditorSchema["repeater"]> => Boolean(repeater));

  const summaries = await Promise.all(
    repeaters.map(async (repeater) => {
      const { data, count, error } = await supabase
        .from(repeater.table)
        .select("*", { count: "exact" })
        .order("order_index", { ascending: true })
        .limit(24);

      if (error) return { table: repeater.table, total: 0, active: 0, preview: [] } satisfies ItemSummary;

      const rows = (data ?? []) as Record<string, unknown>[];
      const activeRows = rows.filter(isRowActive);
      return {
        table: repeater.table,
        total: count ?? rows.length,
        active: activeRows.length,
        preview: rows.slice(0, 3).map((row) => ({
          title: safeText(row[repeater.itemTitleField]) || "(untitled)",
          subtitle: safeText(repeater.itemSubtitleField ? row[repeater.itemSubtitleField] : ""),
          image: rowImage(row),
          active: isRowActive(row),
          status: itemStatus(row)
        }))
      } satisfies ItemSummary;
    })
  );

  return new Map(summaries.map((summary) => [summary.table, summary]));
}

/* ─── Data fetchers ─── */

async function getPageSections(page: PageName) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("page_sections")
    .select("id,page,section_key,label,eyebrow,title,body,cta_label,cta_href,image_url,content,active,updated_at")
    .eq("page", page)
    .order("order_index", { ascending: true });

  return (data ?? []) as PageSectionRow[];
}

async function getProjects() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("projects")
    .select("id,title,slug,status,featured,short_description,thumbnail_url,updated_at")
    .order("order_index", { ascending: true });

  return (data ?? []) as ProjectRow[];
}

function sectionEditHref(page: PageName, key: string) {
  return `/dashboard/pages/${page}/${key}`;
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`;
}

function getFeaturedProjectSummary(projects: ProjectRow[]): ItemSummary {
  const featured = projects.filter((project) => project.status === "published" && project.featured);
  return {
    table: "projects",
    total: projects.length,
    active: featured.length,
    preview: featured.slice(0, 3).map((project) => ({
      title: project.title,
      subtitle: project.short_description ?? "",
      image: project.thumbnail_url ?? "",
      active: true,
      status: "featured"
    }))
  };
}

function getProjectLibrarySummary(projects: ProjectRow[]): ItemSummary {
  const published = projects.filter((project) => project.status === "published");
  return {
    table: "projects",
    total: projects.length,
    active: published.length,
    preview: published.slice(0, 3).map((project) => ({
      title: project.title,
      subtitle: project.short_description ?? "",
      image: project.thumbnail_url ?? "",
      active: true,
      status: project.featured ? "featured" : "published"
    }))
  };
}

function contentString(section: PageSectionRow | undefined, key: string) {
  if (!section?.content || typeof section.content !== "object" || Array.isArray(section.content)) return "";
  const value = (section.content as Record<string, unknown>)[key];
  return safeText(value);
}

function fallbackPreviewForSection(schema: SectionEditorSchema, section?: PageSectionRow): ItemPreview[] {
  if (schema.sectionKey === "detail") {
    return ["overviewLabel", "problemLabel", "solutionLabel"].map((key) => ({
      title: contentString(section, key) || key.replace("Label", ""),
      subtitle: "Template label",
      image: "",
      active: true,
      status: "live"
    }));
  }

  if (schema.sectionKey !== "about") return [];
  return [
    {
      title: section?.title || "About profile",
      subtitle: contentString(section, "educationLabel") || "Profile, bio, and education",
      image: section?.image_url?.trim() || "",
      active: section?.active !== false,
      status: section?.active === false ? "hidden" : "live"
    }
  ];
}

function relatedSummaryForSection(
  schema: SectionEditorSchema,
  itemSummary?: ItemSummary,
  featuredSummary?: ItemSummary,
  projectSummary?: ItemSummary
) {
  if (schema.sectionKey === "featured_work") return featuredSummary;
  if (schema.page === "projects" && schema.sectionKey === "grid") return projectSummary;
  return itemSummary;
}

function summaryLabel(schema: SectionEditorSchema, summary?: ItemSummary) {
  if (!summary) return "";
  if (schema.sectionKey === "featured_work") return `${summary.active} featured of ${summary.total} projects`;
  if (summary.table === "projects") return `${summary.active} published of ${summary.total} projects`;
  return `${summary.active} visible of ${summary.total} items`;
}

function publicHref(page: PageName, schema: SectionEditorSchema) {
  if (schema.publicAnchor) return schema.publicAnchor;
  return page === "home" ? "/" : "/projects";
}

function statusClass(status: string) {
  if (status === "published" || status === "active" || status === "featured" || status === "live") {
    return "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300";
  }
  if (status === "draft") return "border-amber-400/20 bg-amber-400/[0.06] text-amber-300";
  return "border-white/[0.08] bg-white/[0.03] text-white/40";
}

/* ─── Missing content detection ─── */

type MissingField = { label: string };

function getMissingFields(schema: SectionEditorSchema, section?: PageSectionRow, summary?: ItemSummary): MissingField[] {
  const missing: MissingField[] = [];
  if (!section) return [{ label: "Section data" }];

  const hasTitleField = schema.fields.some((field) => field.source === "column" && field.name === "title");
  if (hasTitleField && schema.sectionKey !== "detail" && section.active && !section.title?.trim()) {
    missing.push({ label: "Heading" });
  }

  const hasCta = schema.fields.some((f) => f.name === "cta_label");
  if (hasCta && section.cta_label?.trim() && !section.cta_href?.trim()) {
    missing.push({ label: "CTA link" });
  }

  const hasImageField = schema.fields.some((field) => field.name === "image_url");
  if (hasImageField && schema.sectionKey === "hero" && section.active && !section.image_url?.trim()) {
    missing.push({ label: "Hero image" });
  }

  if (summary && summary.total === 0) missing.push({ label: "Related items" });
  if (summary && summary.total > 0 && summary.active === 0) missing.push({ label: "Visible items" });

  return missing;
}

/* ─── Rich Section Card ─── */

function SectionPreview({
  schema,
  section,
  summary
}: {
  schema: SectionEditorSchema;
  section?: PageSectionRow;
  summary?: ItemSummary;
}) {
  const previews = summary?.preview.length ? summary.preview : fallbackPreviewForSection(schema, section);

  if (section?.image_url?.trim()) {
    return (
      <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.06] bg-black/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={section.image_url}
          alt=""
          className="h-28 w-full object-cover opacity-75 transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  if (previews.length) {
    return (
      <div className="mt-4 space-y-2">
        {previews.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.03]">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-4 w-4 text-white/20" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-semibold text-white/75">{item.title}</span>
              {item.subtitle ? <span className="mt-0.5 block truncate text-[11px] text-white/35">{item.subtitle}</span> : null}
            </span>
            {item.status ? (
              <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em]", statusClass(item.status))}>
                {item.status}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015] p-4">
      <p className="text-[12px] leading-relaxed text-white/35">
        No visual preview yet. Add media or related items to make this section easier to review.
      </p>
    </div>
  );
}

function SectionCard({
  schema,
  section,
  href,
  summary,
  previewHref,
  delay = 0
}: {
  schema: SectionEditorSchema;
  section?: PageSectionRow;
  href: string;
  summary?: ItemSummary;
  previewHref: string;
  delay?: number;
}) {
  const isActive = section?.active !== false;
  const missingFields = getMissingFields(schema, section, summary);
  const hasMissing = missingFields.length > 0;
  const itemLabel = summaryLabel(schema, summary);

  return (
    <article
      className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-2xl cms-card p-5 cms-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={isActive ? "cms-status-live" : "cms-status-hidden"}>
          {isActive ? "Live" : "Hidden"}
        </span>
        <div className="flex items-center gap-3">
          {hasMissing && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400/80">
              <AlertTriangle className="h-3 w-3" />
              {missingFields.length} missing
            </span>
          )}
          {section?.updated_at && (
            <span className="inline-flex items-center gap-1 text-[10px] text-white/30">
              <Clock className="h-3 w-3" />
              {relativeTime(section.updated_at)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex-1">
        <h2 className="font-display text-xl font-semibold tracking-[-0.015em] text-white/95">
          {schema.title}
        </h2>
        {section?.title?.trim() ? (
          <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-relaxed text-white/70">
            {section.title}
          </p>
        ) : (
          <p className="mt-2 text-[13px] font-medium text-white/28">No live heading set</p>
        )}
        {section?.body?.trim() ? (
          <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-white/42">{section.body}</p>
        ) : (
          <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-white/30">{schema.description}</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {section?.cta_label?.trim() ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-[#00A3FF]/20 bg-[#00A3FF]/[0.06] px-2 py-1 text-[11px] font-semibold text-[#00A3FF]/80">
            CTA: {section.cta_label}
          </span>
        ) : null}
        {itemLabel ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-white/50">
            <Layers className="h-3 w-3" />
            {itemLabel}
          </span>
        ) : null}
        {!hasMissing ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/20 bg-emerald-400/[0.05] px-2 py-1 text-[11px] font-medium text-emerald-300/80">
            <CheckCircle2 className="h-3 w-3" />
            Healthy
          </span>
        ) : null}
      </div>

      {hasMissing ? (
        <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.045] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300">Needs attention</p>
          <p className="mt-1 text-[12px] text-amber-100/75">
            {missingFields.map((field) => field.label).join(", ")}
          </p>
        </div>
      ) : null}

      <SectionPreview schema={schema} section={section} summary={summary} />

      <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4">
        <Link
          href={href}
          className="cms-btn-primary h-9 flex-1 text-[12px]"
        >
          <Edit3 className="h-3 w-3" />
          Edit section
        </Link>
        <Link
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="cms-btn-secondary h-9 text-[12px]"
        >
          <ExternalLink className="h-3 w-3" />
          Preview
        </Link>
      </div>
    </article>
  );
}

/* ─── Projects list ─── */

function ProjectList({ projects }: { projects: ProjectRow[] }) {
  const published = projects.filter((p) => p.status === "published").length;
  const featured = projects.filter((p) => p.featured).length;

  return (
    <section className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 cms-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] cms-gradient-text">Individual project pages</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.015em]">Edit each project page</h2>
          <p className="mt-1 text-[12px] text-white/40">
            {projects.length} total · {published} published · {featured} featured
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="cms-btn-primary text-[12px]"
        >
          <Plus className="h-3.5 w-3.5" />
          New project
        </Link>
      </div>

      <div className="mt-5 divide-y divide-white/[0.05]">
        {projects.length ? (
          projects.map((project) => (
            <div key={project.id} className="group grid gap-3 py-3.5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <p className="truncate font-display text-[16px] font-semibold tracking-[-0.01em] text-white/90">{project.title}</p>
                  <span className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
                    project.status === "published"
                      ? "border border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                      : project.status === "draft"
                        ? "border border-amber-400/20 bg-amber-400/[0.06] text-amber-300"
                        : "border border-white/10 bg-white/[0.03] text-white/40"
                  )}>
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="shrink-0 rounded-full border border-[#00A3FF]/20 bg-[#00A3FF]/[0.06] px-2 py-0.5 text-[10px] font-semibold text-[#00A3FF]/80">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[12px] text-white/35">/{project.slug}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="cms-btn-secondary h-8 text-[11px]"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </Link>
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cms-btn-secondary h-8 text-[11px]"
                >
                  <ExternalLink className="h-3 w-3" />
                  View
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-[13px] text-white/40">No projects yet. Create one to generate a public project page.</div>
        )}
      </div>
    </section>
  );
}

/* ─── Shared content (nav + footer) ─── */

function SharedContentList() {
  const cards = [
    {
      title: "Navigation",
      description: "Dock nav labels, links, icons, and section targets.",
      href: "/dashboard/settings"
    },
    {
      title: "Footer & Global SEO",
      description: "Footer heading, subtitle, contact links, social links, and SEO defaults.",
      href: "/dashboard/settings"
    }
  ];

  return (
    <section className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 cms-fade-in" style={{ animationDelay: "180ms" }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] cms-gradient-text">Shared page content</p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.015em]">Navigation & Footer</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-[#00A3FF]/20 hover:bg-white/[0.04]"
          >
            <span className="text-[13px] font-semibold text-white/85 group-hover:text-white">{card.title}</span>
            <span className="mt-1.5 block text-[12px] leading-relaxed text-white/40">{card.description}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#00A3FF]/70 group-hover:text-[#00A3FF]">
              Edit settings
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─── Main component ─── */

export async function PageEditorHub({ page }: { page: PageName }) {
  const schemas = pageSectionSchemas[page];

  const [sections, projects, itemSummaries] = await Promise.all([
    getPageSections(page),
    getProjects(),
    getRepeaterSummaries(schemas)
  ]);
  const featuredSummary = getFeaturedProjectSummary(projects);
  const projectSummary = getProjectLibrarySummary(projects);

  const title = page === "home" ? "Home Page" : "Projects Page";
  const description =
    page === "home"
      ? "Edit the homepage section by section. Each card shows live content status."
      : "Edit the projects landing page and jump into each project detail page.";

  const activeSections = sections.filter((s) => s.active).length;
  const totalSections = schemas.length;

  return (
    <div>
      {/* Header */}
      <div className="cms-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] cms-gradient-text">Page editor</p>
            <h1 className="mt-3 font-display text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.025em]">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/50">{description}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[12px] text-white/40">
                <Eye className="h-3.5 w-3.5" />
                {activeSections} of {totalSections} sections active
              </span>
              <span className="cms-status-live text-[10px]">
                Changes are live
              </span>
            </div>
          </div>
          <Link
            href={page === "home" ? "/" : "/projects"}
            target="_blank"
            rel="noopener noreferrer"
            className="cms-btn-secondary text-[12px]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View public page
          </Link>
        </div>
      </div>

      {/* Section cards grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {schemas.map((schema, i) => {
          const section = sections.find((item) => item.section_key === schema.sectionKey);
          const href = sectionEditHref(page, schema.sectionKey);
          const repeaterSummary = schema.repeater ? itemSummaries.get(schema.repeater.table) : undefined;
          const summary = relatedSummaryForSection(schema, repeaterSummary, featuredSummary, projectSummary);

          return (
            <SectionCard
              key={schema.sectionKey}
              schema={schema}
              section={section}
              href={href}
              summary={summary}
              previewHref={publicHref(page, schema)}
              delay={i * 40}
            />
          );
        })}
      </div>

      <SharedContentList />

      {page === "projects" ? <ProjectList projects={projects as ProjectRow[]} /> : null}
    </div>
  );
}
