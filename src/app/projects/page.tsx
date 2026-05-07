import type { Metadata } from "next";
import { DockNav } from "@/components/layout/dock-nav";
import { Footer } from "@/components/layout/Footer";
import { ProjectsHero } from "@/components/sections/ProjectsHero";
import { ProjectCarousel } from "@/components/ui/project-carousel";
import { getNavLinks, getPageSection, getPageSections, getPublishedProjects, getSiteSettings } from "@/lib/cms/public";
import type { PageSection } from "@/types/cms";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const section = await getPageSection("projects", "hero");
  const title = section?.title || "Projects";
  const description =
    section?.body ||
    "A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.";

  return {
    title,
    description,
    alternates: {
      canonical: "/projects"
    },
    openGraph: {
      title,
      description,
      url: "/projects",
      images: section?.imageUrl ? [section.imageUrl] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: section?.imageUrl ? [section.imageUrl] : undefined
    }
  };
}

export default async function ProjectsPage() {
  const [projects, settings, pageSections, navLinks] = await Promise.all([
    getPublishedProjects(),
    getSiteSettings(),
    getPageSections("projects"),
    getNavLinks()
  ]);
  const section = (key: string): PageSection | undefined =>
    pageSections.find((pageSection) => pageSection.sectionKey === key);
  const gridSection = section("grid");
  const carouselImages = projects.map((p) => ({
    src: p.image,
    alt: p.alt,
    name: p.name,
    category: p.category,
    slug: p.slug
  }));

  return (
    <>
      <DockNav items={navLinks} />
      <main id="main">
        <ProjectsHero section={section("hero")} />

        <section
          id="projects-grid"
          className="section-pad bg-paper text-ink"
        >
          <div className="site-container text-center">
            <h2 className="font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.02em]">
              {gridSection?.title || "Explore the Work"}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ash">
              {gridSection?.body || "Browse through selected brand, web, and digital projects."}
            </p>
          </div>

          <div className="mt-14">
            <ProjectCarousel images={carouselImages} />
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
