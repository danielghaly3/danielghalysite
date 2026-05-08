import Link from "next/link";
import { cookies } from "next/headers";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  ListOrdered,
  Plus,
  Settings,
  Sparkles,
  Wrench
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getSiteSettings } from "@/lib/cms/public";
import { cn } from "@/lib/cn";

type CountResult = { total: number; published: number };

async function getMetric(
  table: string,
  options?: { activeField?: string; activeValue?: boolean | string; statusField?: string; statusValue?: string }
): Promise<CountResult> {
  const supabase = createClient(await cookies());
  const totalRes = await supabase.from(table).select("*", { count: "exact", head: true });
  const total = totalRes.count ?? 0;

  if (options?.activeField) {
    const pub = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq(options.activeField, options.activeValue ?? true);
    return { total, published: pub.count ?? 0 };
  }

  if (options?.statusField && options.statusValue) {
    const pub = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq(options.statusField, options.statusValue);
    return { total, published: pub.count ?? 0 };
  }

  return { total, published: total };
}

type RecentRow = {
  kind: string;
  label: string;
  href: string;
  updatedAt: string;
};

async function getRecentlyUpdated(): Promise<RecentRow[]> {
  const supabase = createClient(await cookies());
  const sources = [
    { table: "projects", select: "id,title,updated_at", labelField: "title", kind: "Project", route: (row: Record<string, unknown>) => `/dashboard/projects/${row.id}` },
    { table: "blog_posts", select: "id,title,updated_at", labelField: "title", kind: "Blog post", route: (row: Record<string, unknown>) => `/dashboard/blog_posts/${row.id}` },
    { table: "page_sections", select: "id,label,page,section_key,updated_at", labelField: "label", kind: "Section", route: (row: Record<string, unknown>) => `/dashboard/pages/${row.page}/${row.section_key}` },
    { table: "services", select: "id,title,updated_at", labelField: "title", kind: "Service", route: (row: Record<string, unknown>) => `/dashboard/services/${row.id}` },
    { table: "skills", select: "id,name,updated_at", labelField: "name", kind: "Skill", route: (row: Record<string, unknown>) => `/dashboard/skills/${row.id}` },
    { table: "faq_items", select: "id,question,updated_at", labelField: "question", kind: "FAQ", route: (row: Record<string, unknown>) => `/dashboard/faq_items/${row.id}` },
    { table: "process_steps", select: "id,title,updated_at", labelField: "title", kind: "Process step", route: (row: Record<string, unknown>) => `/dashboard/process_steps/${row.id}` },
    { table: "logo_marquee_items", select: "id,name,updated_at", labelField: "name", kind: "Logo", route: (row: Record<string, unknown>) => `/dashboard/logo_marquee_items/${row.id}` },
    { table: "education_items", select: "id,program,updated_at", labelField: "program", kind: "Education", route: (row: Record<string, unknown>) => `/dashboard/education_items/${row.id}` },
    { table: "gallery_items", select: "id,caption,updated_at", labelField: "caption", kind: "Gallery", route: (row: Record<string, unknown>) => `/dashboard/gallery_items/${row.id}` }
  ];

  const all = await Promise.all(
    sources.map(async (src) => {
      const { data } = await supabase
        .from(src.table)
        .select(src.select)
        .order("updated_at", { ascending: false })
        .limit(2);
      return ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => {
        const labelValue = row[src.labelField];
        return {
          kind: src.kind,
          label: typeof labelValue === "string" && labelValue.trim() ? labelValue : "(untitled)",
          href: src.route(row),
          updatedAt: (row.updated_at as string) ?? new Date(0).toISOString()
        };
      });
    })
  );

  return all
    .flat()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);
}

type HealthIssue = { severity: "warn" | "info"; message: string; href?: string };

async function getContentHealth(): Promise<HealthIssue[]> {
  const supabase = createClient(await cookies());
  const issues: HealthIssue[] = [];

  const { data: sections } = await supabase
    .from("page_sections")
    .select("id,page,section_key,label,title,active");
  const sectionsList = (sections ?? []) as { id: string; page: string; section_key: string; label: string; title: string | null; active: boolean }[];
  const missingTitles = sectionsList.filter((s) => s.active && (!s.title || !s.title.trim()));
  for (const s of missingTitles) {
    issues.push({
      severity: "warn",
      message: `${s.page} / ${s.label} has no title`,
      href: `/dashboard/pages/${s.page}/${s.section_key}`
    });
  }

  const { count: featuredCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .eq("featured", true);
  if (!featuredCount || featuredCount === 0) {
    issues.push({
      severity: "warn",
      message: "No featured projects — homepage Featured Work block will be empty",
      href: "/dashboard/projects"
    });
  }

  const { data: navRow } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "nav_links")
    .maybeSingle();
  if (!navRow) {
    issues.push({
      severity: "warn",
      message: "nav_links not configured in site_settings — dock nav uses fallback",
      href: "/dashboard/site_settings"
    });
  }

  const { data: aboutRow } = await supabase
    .from("about_content")
    .select("headline,bio,image_url")
    .limit(1)
    .maybeSingle();
  if (!aboutRow) {
    issues.push({
      severity: "warn",
      message: "About profile is empty",
      href: "/dashboard/about_content"
    });
  } else {
    const a = aboutRow as { headline: string | null; bio: string | null; image_url: string | null };
    if (!a.headline?.trim()) issues.push({ severity: "info", message: "About headline is empty", href: "/dashboard/about_content" });
    if (!a.bio?.trim()) issues.push({ severity: "info", message: "About bio is empty", href: "/dashboard/about_content" });
    if (!a.image_url?.trim()) issues.push({ severity: "info", message: "About portrait image is empty", href: "/dashboard/about_content" });
  }

  return issues;
}

async function getSectionSummary(): Promise<{ total: number; active: number }> {
  const supabase = createClient(await cookies());
  const { data } = await supabase.from("page_sections").select("active");
  const list = (data ?? []) as { active: boolean }[];
  return { total: list.length, active: list.filter((s) => s.active).length };
}

async function getSeoStatus(): Promise<{ complete: number; total: number; missing: string[] }> {
  const supabase = createClient(await cookies());
  const keys = ["seo_default_title", "seo_default_description", "name", "tagline", "email", "location"];
  const { data } = await supabase.from("site_settings").select("key,value").in("key", keys);
  const found = (data ?? []) as { key: string; value: unknown }[];
  const missing: string[] = [];
  for (const key of keys) {
    const row = found.find((r) => r.key === key);
    if (!row || !row.value || (typeof row.value === "string" && !row.value.trim())) {
      missing.push(key.replace(/_/g, " "));
    }
  }
  return { complete: keys.length - missing.length, total: keys.length, missing };
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
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

type MetricCardProps = {
  label: string;
  href: string;
  total: number;
  published?: number;
  publishedLabel?: string;
  Icon: typeof Briefcase;
  delay?: number;
};

function MetricCard({ label, href, total, published, publishedLabel = "active", Icon, delay = 0 }: MetricCardProps) {
  const subtitle = published !== undefined && published !== total
    ? `${published} ${publishedLabel} of ${total}`
    : `${total} ${total === 1 ? "item" : "items"}`;

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl cms-card p-5 cms-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 transition-colors group-hover:border-[#00A3FF]/30 group-hover:text-[#00A3FF]">
          <Icon className="h-4 w-4" />
        </span>
        <span className="opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 text-[#00A3FF]" />
        </span>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">{label}</p>
        <p className="mt-2 font-display text-3xl font-semibold leading-none tracking-[-0.02em]">
          {total}
        </p>
        <p className="mt-2 text-[11px] text-white/40">{subtitle}</p>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const [
    settings,
    projects,
    blog,
    services,
    skills,
    faqs,
    gallery,
    process,
    logos,
    education,
    recent,
    health,
    sectionSummary,
    seoStatus
  ] = await Promise.all([
    getSiteSettings(),
    getMetric("projects", { statusField: "status", statusValue: "published" }),
    getMetric("blog_posts", { activeField: "published", activeValue: true }),
    getMetric("services", { activeField: "active", activeValue: true }),
    getMetric("skills", { activeField: "active", activeValue: true }),
    getMetric("faq_items", { activeField: "active", activeValue: true }),
    getMetric("gallery_items", { activeField: "active", activeValue: true }),
    getMetric("process_steps", { activeField: "active", activeValue: true }),
    getMetric("logo_marquee_items", { activeField: "active", activeValue: true }),
    getMetric("education_items", { activeField: "active", activeValue: true }),
    getRecentlyUpdated(),
    getContentHealth(),
    getSectionSummary(),
    getSeoStatus()
  ]);

  const quickActions = [
    { label: "Edit homepage", href: "/dashboard/pages/home", Icon: Layers },
    { label: "New project", href: "/dashboard/projects/new", Icon: Plus },
    { label: "New blog post", href: "/dashboard/blog_posts/new", Icon: Plus },
    { label: "Edit global settings", href: "/dashboard/settings", Icon: Settings },
    { label: "View public site", href: "/", Icon: ExternalLink, external: true }
  ];

  const seoPercent = Math.round((seoStatus.complete / seoStatus.total) * 100);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Header ── */}
      <div className="cms-fade-in">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] cms-gradient-text">
              Overview
            </p>
            <h1 className="mt-3 font-display text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.025em]">
              Portfolio Control Center
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/50">
              {settings.tagline || "Manage every visible piece of the public site from one place."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="cms-btn-secondary text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View public site
            </Link>
            <Link
              href="/dashboard/pages/home"
              className="cms-btn-primary text-xs"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit homepage
            </Link>
          </div>
        </div>
      </div>

      {/* ── Identity + Status ── */}
      <div className="grid gap-4 lg:grid-cols-3 cms-fade-in" style={{ animationDelay: "50ms" }}>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 lg:col-span-2">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] cms-gradient opacity-40" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
            Site identity
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl font-semibold tracking-[-0.015em]">{settings.name}</p>
              <p className="mt-1 text-sm text-white/50">
                {settings.location} · <span className="text-white/35">{settings.email}</span>
              </p>
            </div>
            <span className="cms-status-live self-start">
              Public site live
            </span>
          </div>
        </div>

        {/* Section & SEO summary */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Page Sections</p>
              {sectionSummary.active === sectionSummary.total ? (
                <Eye className="h-3.5 w-3.5 text-emerald-400/70" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-amber-400/70" />
              )}
            </div>
            <p className="mt-2 font-display text-lg font-semibold">
              {sectionSummary.active} <span className="text-[13px] font-normal text-white/40">of {sectionSummary.total} active</span>
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">SEO Completion</p>
              <span className={cn(
                "text-[11px] font-semibold",
                seoPercent === 100 ? "text-emerald-400" : "text-amber-400"
              )}>
                {seoPercent}%
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  seoPercent === 100 ? "bg-emerald-400" : "cms-gradient"
                )}
                style={{ width: `${seoPercent}%` }}
              />
            </div>
            {seoStatus.missing.length > 0 && (
              <p className="mt-2 truncate text-[11px] text-white/35">
                Missing: {seoStatus.missing.slice(0, 2).join(", ")}
                {seoStatus.missing.length > 2 && ` +${seoStatus.missing.length - 2}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Metrics grid ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Content at a glance
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard label="Projects" href="/dashboard/projects" total={projects.total} published={projects.published} publishedLabel="published" Icon={Briefcase} delay={0} />
          <MetricCard label="Blog Posts" href="/dashboard/blog_posts" total={blog.total} published={blog.published} publishedLabel="published" Icon={FileText} delay={40} />
          <MetricCard label="Services" href="/dashboard/services" total={services.total} published={services.published} Icon={Sparkles} delay={80} />
          <MetricCard label="Skills" href="/dashboard/skills" total={skills.total} published={skills.published} Icon={Wrench} delay={120} />
          <MetricCard label="FAQ" href="/dashboard/faq_items" total={faqs.total} published={faqs.published} Icon={HelpCircle} delay={160} />
          <MetricCard label="Gallery" href="/dashboard/gallery_items" total={gallery.total} published={gallery.published} Icon={ImageIcon} delay={200} />
          <MetricCard label="Process" href="/dashboard/process_steps" total={process.total} published={process.published} Icon={ListOrdered} delay={240} />
          <MetricCard label="Logos" href="/dashboard/logo_marquee_items" total={logos.total} published={logos.published} Icon={Layers} delay={280} />
          <MetricCard label="Education" href="/dashboard/education_items" total={education.total} published={education.published} Icon={GraduationCap} delay={320} />
        </div>
      </section>

      {/* ── Quick actions + Health + Recent ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Quick actions + Health */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 cms-fade-in" style={{ animationDelay: "100ms" }}>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Quick actions
            </h2>
            <div className="mt-4 flex flex-col gap-1.5">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  {...(("external" in action && action.external) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[13px] font-medium text-white/70 transition-all hover:border-[#00A3FF]/25 hover:bg-white/[0.04] hover:text-white"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <action.Icon className="h-3.5 w-3.5 text-white/40 group-hover:text-[#00A3FF]" />
                    {action.label}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/25 group-hover:text-[#00A3FF]" />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 cms-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                Content health
              </h2>
              {health.length === 0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  All clear
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-white/35">
                  {health.length} {health.length === 1 ? "issue" : "issues"}
                </span>
              )}
            </div>
            {health.length === 0 ? (
              <p className="mt-4 text-[13px] text-white/45">
                No missing content detected. Your sections, projects, and settings look good.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-1.5">
                {health.slice(0, 6).map((issue, i) => {
                  const tone =
                    issue.severity === "warn"
                      ? "border-amber-400/20 bg-amber-400/[0.05] text-amber-200/90"
                      : "border-white/[0.06] bg-white/[0.02] text-white/60";
                  const inner = (
                    <span className="flex items-start gap-2.5">
                      <AlertTriangle
                        className={cn(
                          "mt-0.5 h-3 w-3 shrink-0",
                          issue.severity === "warn" ? "text-amber-400" : "text-white/35"
                        )}
                      />
                      <span className="text-[12px] leading-snug">{issue.message}</span>
                    </span>
                  );
                  return (
                    <li key={i}>
                      {issue.href ? (
                        <Link
                          href={issue.href}
                          className={cn(
                            "block rounded-xl border px-3 py-2.5 transition-colors hover:bg-white/[0.04]",
                            tone
                          )}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div className={cn("rounded-xl border px-3 py-2.5", tone)}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Recently updated */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 lg:col-span-2 cms-fade-in" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Recently updated
            </h2>
            <span className="cms-status-live text-[10px]">
              Live sync
            </span>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-[13px] text-white/45">No updates yet. Edit any content to see it appear here.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/[0.05]">
              {recent.map((row, i) => (
                <li key={i}>
                  <Link
                    href={row.href}
                    className="group flex items-center justify-between gap-4 py-3 transition-colors hover:bg-white/[0.02] -mx-2 px-2 rounded-lg"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#00A3FF]/80">
                        {row.kind}
                      </p>
                      <p className="mt-1 truncate font-display text-[15px] font-semibold tracking-[-0.005em] text-white/85 group-hover:text-white">
                        {row.label}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] text-white/35">
                      <Clock className="h-3 w-3" />
                      <span>{relativeTime(row.updatedAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
