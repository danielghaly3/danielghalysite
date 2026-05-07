import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarkdownRenderer } from "@/components/cms/MarkdownRenderer";
import { DockNav } from "@/components/layout/dock-nav";
import { Footer } from "@/components/layout/Footer";
import { blurDataUrl } from "@/content/work";
import { getBlogPostBySlug, getPublishedBlogPosts, getSiteSettings } from "@/lib/cms/public";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: `/blog/${post.slug}`,
      images: [post.ogImageUrl]
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [post.ogImageUrl]
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getBlogPostBySlug(slug), getSiteSettings()]);

  if (!post) notFound();

  return (
    <>
      <DockNav />
      <main id="main">
        <article>
          <section className="relative isolate min-h-[82svh] overflow-hidden rounded-b-[48px] bg-ink text-paper">
            <div className="absolute inset-y-0 right-0 z-[-2] w-full opacity-45 md:w-[58%] md:opacity-85">
              <Image
                src={post.coverImageUrl}
                alt={`${post.title} cover image`}
                fill
                priority
                placeholder="blur"
                blurDataURL={blurDataUrl}
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 z-[-1] bg-[linear-gradient(90deg,rgba(14,14,16,0.98)_0%,rgba(14,14,16,0.86)_48%,rgba(14,14,16,0.24)_100%)]" />

            <div className="site-container flex min-h-[82svh] items-center pb-20 pt-28">
              <div className="max-w-4xl">
                <Link
                  href="/blog"
                  className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-white/70 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  All Posts
                </Link>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  {post.category} · {post.readingTime} min read
                </p>
                <h1 className="hero-title mt-4 max-w-5xl">{post.title}</h1>
                {post.excerpt && <p className="mt-8 max-w-xl text-lg leading-[1.6] text-white/70">{post.excerpt}</p>}
              </div>
            </div>
          </section>

          <section className="section-pad bg-paper text-ink">
            <div className="site-container">
              <div className="mx-auto max-w-3xl">
                <MarkdownRenderer content={post.content || post.excerpt} />
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer settings={settings} />
    </>
  );
}
