import type { Metadata } from "next";
import { DockNav } from "@/components/layout/dock-nav";
import { Footer } from "@/components/layout/Footer";
import { ProjectsHero } from "@/components/sections/ProjectsHero";
import { ProjectCarousel } from "@/components/ui/project-carousel";
import { getNavLinks, getPageSection, getPageSections, getPublishedProjects, getSiteSettings } from "@/lib/cms/public";
import { sectionString } from "@/lib/cms/section-content";
import type { PageSection } from "@/types/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const section = await getPageSection("projects", "hero");
  const title = section?.title || "Projects";
  const description =
    section?.body ||
    "A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.";
  const seoTitle = sectionString(section, "seoTitle", title);
  const seoDescription = sectionString(section, "seoDescription", description);
  const ogTitle = sectionString(section, "ogTitle", seoTitle);
  const ogDescription = sectionString(section, "ogDescription", seoDescription);
  const ogImage = sectionString(section, "ogImage", section?.imageUrl || "");
  const twitterTitle = sectionString(section, "twitterTitle", ogTitle);
  const twitterDescription = sectionString(section, "twitterDescription", ogDescription);
  const twitterImage = sectionString(section, "twitterImage", ogImage);
  const canonicalUrl = sectionString(section, "canonicalUrl", "/projects");

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      images: ogImage ? [ogImage] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined
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
  const heroSection = section("hero");
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
        {heroSection ? <ProjectsHero section={heroSection} /> : null}

        {gridSection ? (
          <section
            id="projects-grid"
            className="section-pad bg-paper text-ink"
          >
            <div className="site-container text-center">
              <h2 className="font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.02em]">
                {gridSection.title || "Explore the Work"}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ash">
                {gridSection.body || "Browse through selected brand, web, and digital projects."}
              </p>
            </div>

            {carouselImages.length ? (
              <div className="mt-14">
                <ProjectCarousel images={carouselImages} />
              </div>
            ) : (
              <div className="site-container mt-14">
                <div className="rounded-[20px] border border-line bg-bone p-10 text-center">
                  <p className="font-display text-3xl font-semibold">No published projects yet.</p>
                  <p className="mx-auto mt-3 max-w-md text-ash">
                    Published CMS projects will appear here automatically.
                  </p>
                </div>
              </div>
            )}
          </section>
        ) : null}
      </main>
      <Footer settings={settings} />
    </>
  );
}
