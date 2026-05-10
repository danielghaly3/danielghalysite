import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Figma, Github } from "lucide-react";
import { DockNav } from "@/components/layout/dock-nav";
import { Footer } from "@/components/layout/Footer";
import { StickyGallery } from "@/components/ui/sticky-gallery";
import { blurDataUrl } from "@/content/projects";
import { getNavLinks, getPageSection, getProjectBySlug, getPublishedProjects, getSiteSettings } from "@/lib/cms/public";
import { sectionString } from "@/lib/cms/section-content";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  if (!project) return { title: "Project Not Found" };

  const title = project.seoTitle ?? project.name;
  const description = project.seoDescription ?? project.description;
  const image = project.ogImageUrl ?? project.image ?? settings.default_og_image;

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`
    },
    openGraph: {
      title,
      description,
      url: `/projects/${project.slug}`,
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [projects, settings, navLinks, detailSection] = await Promise.all([
    getPublishedProjects(),
    getSiteSettings(),
    getNavLinks(),
    getPageSection("projects", "detail")
  ]);
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const techList = project.technologies && project.technologies.length ? project.technologies : project.tags;
  const labels = {
    back: sectionString(detailSection, "backLabel", "All Projects"),
    client: sectionString(detailSection, "clientLabel", "Client"),
    role: sectionString(detailSection, "roleLabel", "Role"),
    year: sectionString(detailSection, "yearLabel", "Year"),
    technologies: sectionString(detailSection, "technologiesLabel", "Technologies"),
    services: sectionString(detailSection, "servicesLabel", "Services"),
    links: sectionString(detailSection, "linksLabel", "Links"),
    live: sectionString(detailSection, "liveLabel", "View live"),
    github: sectionString(detailSection, "githubLabel", "Source code"),
    figma: sectionString(detailSection, "figmaLabel", "Figma file"),
    overview: sectionString(detailSection, "overviewLabel", "Overview"),
    problem: sectionString(detailSection, "problemLabel", "The Problem"),
    solution: sectionString(detailSection, "solutionLabel", "The Solution"),
    results: sectionString(detailSection, "resultsLabel", "Results"),
    previous: sectionString(detailSection, "previousLabel", "Previous"),
    next: sectionString(detailSection, "nextLabel", "Next")
  };
  const externalLinks: { label: string; href: string; Icon: typeof ExternalLink }[] = [];
  if (project.liveUrl) externalLinks.push({ label: labels.live, href: project.liveUrl, Icon: ExternalLink });
  if (project.githubUrl) externalLinks.push({ label: labels.github, href: project.githubUrl, Icon: Github });
  if (project.figmaUrl) externalLinks.push({ label: labels.figma, href: project.figmaUrl, Icon: Figma });

  return (
    <>
      <DockNav items={navLinks} />
      <main id="main">
        <section className="relative isolate min-h-[100svh] overflow-hidden rounded-b-[48px] bg-ink text-paper">
          <div 
            className="absolute inset-y-0 right-0 z-[-2] w-full opacity-55 md:w-[65%] md:opacity-100"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%, black 100%)"
            }}
          >
            <Image
              src={project.image}
              alt={project.alt}
              fill
              priority
              placeholder="blur"
              blurDataURL={blurDataUrl}
              sizes="(min-width: 768px) 65vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 z-[-1] bg-[linear-gradient(90deg,rgba(14,14,16,1)_0%,rgba(14,14,16,0.8)_20%,transparent_100%)] md:bg-[linear-gradient(90deg,rgba(14,14,16,1)_0%,rgba(14,14,16,0)_50%)]" />
          <div className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,transparent_30%,rgba(14,14,16,0.8)_100%)]" />

          <div className="site-container flex min-h-[100svh] items-center pb-24 pt-28">
            <div className="max-w-4xl">
              <Link
                href="/projects"
                className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-white/70 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {labels.back}
              </Link>

              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                {project.category}
              </p>
              <h1 className="hero-title mt-3">{project.name}</h1>
              <p className="mt-10 max-w-[460px] text-lg leading-[1.55] text-white/75">
                {project.description}
              </p>
            </div>
          </div>
        </section>

        <section className="section-pad bg-paper text-ink">
          <div className="site-container">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <div className="space-y-8">
                  {project.client && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">{labels.client}</p>
                      <p className="mt-1.5 font-display text-base font-semibold">{project.client}</p>
                    </div>
                  )}
                  {project.role && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">{labels.role}</p>
                      <p className="mt-1.5 font-display text-base font-semibold">{project.role}</p>
                    </div>
                  )}
                  {project.year && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">{labels.year}</p>
                      <p className="mt-1.5 font-display text-base font-semibold">{project.year}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
                      {project.technologies?.length ? labels.technologies : labels.services}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {techList.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-line bg-bone px-3 py-1.5 text-[11px] font-medium text-ash"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {externalLinks.length ? (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">{labels.links}</p>
                      <div className="mt-3 flex flex-col gap-2">
                        {externalLinks.map(({ label, href, Icon }) => (
                          <a
                            key={href}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-ink transition-colors hover:text-accent"
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{label}</span>
                            <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-12">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">{labels.overview}</h2>
                  <p className="mt-6 text-lg leading-[1.75] text-ash">
                    {project.overview ?? project.description}
                  </p>
                </div>

                {project.problem ? (
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">{labels.problem}</h2>
                    <p className="mt-6 whitespace-pre-line text-lg leading-[1.75] text-ash">{project.problem}</p>
                  </div>
                ) : null}

                {project.solution ? (
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">{labels.solution}</h2>
                    <p className="mt-6 whitespace-pre-line text-lg leading-[1.75] text-ash">{project.solution}</p>
                  </div>
                ) : null}

                {project.results ? (
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">{labels.results}</h2>
                    <p className="mt-6 whitespace-pre-line text-lg leading-[1.75] text-ash">{project.results}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {project.stickyGallery && (
          <StickyGallery images={project.stickyGallery.images} layout={project.stickyGallery.layout} />
        )}

        <section className="border-t border-line bg-paper py-12 text-ink sm:py-16">
          <div className="site-container flex items-center justify-between">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex items-center gap-3 text-ash transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ash">{labels.previous}</p>
                  <p className="mt-0.5 font-display text-base font-semibold text-ink">{prev.name}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex items-center gap-3 text-right text-ash transition-colors hover:text-ink"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ash">{labels.next}</p>
                  <p className="mt-0.5 font-display text-base font-semibold text-ink">{next.name}</p>
                </div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
