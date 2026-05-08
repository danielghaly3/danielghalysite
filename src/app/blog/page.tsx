import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DockNav } from "@/components/layout/dock-nav";
import { Footer } from "@/components/layout/Footer";
import { blurDataUrl } from "@/content/work";
import { getNavLinks, getPublishedBlogPosts, getSiteSettings } from "@/lib/cms/public";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on design, web development, brand systems, and modern creative workflows."
};

export default async function BlogPage() {
  const [posts, settings, navLinks] = await Promise.all([
    getPublishedBlogPosts(),
    getSiteSettings(),
    getNavLinks()
  ]);

  return (
    <>
      <DockNav items={navLinks} />
      <main id="main">
        <section className="relative isolate overflow-hidden rounded-b-[48px] bg-ink pb-24 pt-32 text-paper">
          <div className="site-container">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Writing</p>
            <h1 className="hero-title mt-4 max-w-4xl">Ideas, process, and sharp notes.</h1>
            <p className="mt-8 max-w-xl text-lg leading-[1.6] text-white/65">
              Practical thinking on brand identity, design systems, web builds, and AI-assisted creative production.
            </p>
          </div>
        </section>

        <section className="section-pad bg-paper text-ink">
          <div className="site-container">
            {posts.length ? (
              <div className="grid gap-5 lg:grid-cols-3">
                {posts.map((post) => (
                  <article key={post.id} className="overflow-hidden rounded-[20px] border border-line bg-bone shadow-soft">
                    <Link href={`/blog/${post.slug}`} className="image-frame block aspect-[4/3] bg-paper">
                      <Image
                        src={post.coverImageUrl}
                        alt={`${post.title} cover image`}
                        fill
                        placeholder="blur"
                        blurDataURL={blurDataUrl}
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </Link>
                    <div className="p-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                        {post.category} · {post.readingTime} min read
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.01em]">
                        {post.title}
                      </h2>
                      <p className="mt-4 text-[15px] leading-[1.65] text-ash">{post.excerpt}</p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent"
                      >
                        Read post <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-line bg-bone p-10 text-center">
                <p className="font-display text-3xl font-semibold">No posts published yet.</p>
                <p className="mx-auto mt-3 max-w-md text-ash">
                  Published CMS posts will appear here automatically. The empty state keeps the public site stable until content is ready.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
