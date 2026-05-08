import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowUpRight, BookOpen, ExternalLink, FileText, Plus, SearchCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cn } from "@/lib/cn";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
};

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return "";
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

export default async function BlogPageEditor() {
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("blog_posts")
    .select("id,title,slug,excerpt,published,featured,seo_title,seo_description,updated_at")
    .order("updated_at", { ascending: false })
    .limit(8);

  const posts = (data ?? []) as BlogRow[];
  const published = posts.filter((post) => post.published).length;
  const drafts = posts.filter((post) => !post.published).length;
  const seoReady = posts.filter((post) => post.seo_title?.trim() && post.seo_description?.trim()).length;
  const seoPercent = posts.length ? Math.round((seoReady / posts.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="cms-fade-in">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] cms-gradient-text">
              Page editor
            </p>
            <h1 className="mt-3 font-display text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.025em]">
              Blog Page
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/50">
              The blog landing page is powered by published CMS posts. Manage publishing, excerpts, cover images, and per-post SEO here.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard/blog_posts/new" className="cms-btn-primary text-xs">
              <Plus className="h-3.5 w-3.5" />
              Add blog post
            </Link>
            <Link href="/blog" target="_blank" rel="noopener noreferrer" className="cms-btn-secondary text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              View blog
            </Link>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl cms-card p-5 cms-fade-in">
          <BookOpen className="h-4 w-4 text-[#00A3FF]" />
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Published posts</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em]">{published}</p>
          <p className="mt-2 text-[12px] text-white/40">{drafts} drafts waiting</p>
        </div>
        <div className="rounded-2xl cms-card p-5 cms-fade-in" style={{ animationDelay: "40ms" }}>
          <SearchCheck className="h-4 w-4 text-[#00A3FF]" />
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Post SEO</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em]">{seoPercent}%</p>
          <p className="mt-2 text-[12px] text-white/40">{seoReady} of {posts.length} recent posts complete</p>
        </div>
        <Link href="/dashboard/blog_posts" className="group rounded-2xl cms-card p-5 cms-fade-in" style={{ animationDelay: "80ms" }}>
          <FileText className="h-4 w-4 text-white/45 transition-colors group-hover:text-[#00A3FF]" />
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Content library</p>
          <p className="mt-2 font-display text-xl font-semibold tracking-[-0.015em]">Manage all posts</p>
          <p className="mt-2 text-[12px] text-white/40">Search, edit, publish, feature, and reorder post records.</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#00A3FF]/75 group-hover:text-[#00A3FF]">
            Open blog posts
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] cms-fade-in" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Recent posts</p>
            <h2 className="mt-1 font-display text-xl font-semibold tracking-[-0.015em]">Blog content feeding the public page</h2>
          </div>
          <span className="cms-status-live text-[10px]">Live sync</span>
        </div>

        {posts.length ? (
          <div className="divide-y divide-white/[0.05]">
            {posts.map((post) => {
              const missingSeo = !post.seo_title?.trim() || !post.seo_description?.trim();
              return (
                <Link
                  key={post.id}
                  href={`/dashboard/blog_posts/${post.id}`}
                  className="group grid gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-display text-[16px] font-semibold tracking-[-0.01em] text-white/90">
                        {post.title}
                      </p>
                      <span className={post.published ? "cms-status-live text-[10px]" : "cms-status-hidden text-[10px]"}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                      {post.featured ? (
                        <span className="rounded-full border border-[#00A3FF]/20 bg-[#00A3FF]/[0.06] px-2 py-0.5 text-[10px] font-semibold text-[#00A3FF]/80">
                          Featured
                        </span>
                      ) : null}
                      {missingSeo ? (
                        <span className="rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                          SEO missing
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-[12px] text-white/35">/blog/{post.slug}</p>
                    {post.excerpt ? <p className="mt-1 line-clamp-1 text-[12px] text-white/45">{post.excerpt}</p> : null}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-white/35">
                    <span>{relativeTime(post.updated_at)}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-white/25 transition-colors group-hover:text-[#00A3FF]" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="font-display text-xl font-semibold tracking-[-0.01em]">No blog posts yet</p>
            <p className="mx-auto mt-2 max-w-md text-[13px] text-white/40">
              The public blog keeps its empty state until a post is published.
            </p>
            <Link href="/dashboard/blog_posts/new" className="cms-btn-primary mt-5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Add first post
            </Link>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 cms-fade-in" style={{ animationDelay: "180ms" }}>
        <p className={cn("text-[12px] leading-relaxed text-white/45")}>
          Recommended next data addition: add `page_sections.page = blog` support if you want the blog hero copy itself editable like Home and Projects.
        </p>
      </section>
    </div>
  );
}
