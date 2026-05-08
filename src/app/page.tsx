import type { Metadata } from "next";
import { DockNav } from "@/components/layout/dock-nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { About } from "@/components/sections/About";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Toolkit } from "@/components/sections/Toolkit";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Gallery3D } from "@/components/sections/Gallery3D";
import { FAQ } from "@/components/sections/FAQ";
import {
  getAboutContent,
  getEducationItems,
  getFaqItems,
  getFeaturedProjects,
  getGalleryItems,
  getLogoMarqueeItems,
  getPageSection,
  getNavLinks,
  getPageSections,
  getProcessSteps,
  getServices,
  getSiteSettings,
  getSkills
} from "@/lib/cms/public";
import { sectionString } from "@/lib/cms/section-content";
import type { PageSection } from "@/types/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, heroSection] = await Promise.all([getSiteSettings(), getPageSection("home", "hero")]);
  const title = sectionString(heroSection, "seoTitle", settings.seo_default_title);
  const description = sectionString(heroSection, "seoDescription", settings.seo_default_description);
  const ogTitle = sectionString(heroSection, "ogTitle", title);
  const ogDescription = sectionString(heroSection, "ogDescription", description);
  const ogImage = sectionString(heroSection, "ogImage", settings.default_og_image);
  const twitterTitle = sectionString(heroSection, "twitterTitle", ogTitle);
  const twitterDescription = sectionString(heroSection, "twitterDescription", ogDescription);
  const twitterImage = sectionString(heroSection, "twitterImage", ogImage);
  const canonicalUrl = sectionString(heroSection, "canonicalUrl", "/");

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: [ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage]
    }
  };
}

export default async function HomePage() {
  const [
    settings,
    about,
    featuredProjects,
    services,
    skills,
    pageSections,
    processSteps,
    faqItems,
    galleryItems,
    logoMarqueeItems,
    educationItems,
    navLinks
  ] = await Promise.all([
    getSiteSettings(),
    getAboutContent(),
    getFeaturedProjects(),
    getServices(),
    getSkills(),
    getPageSections("home"),
    getProcessSteps(),
    getFaqItems(),
    getGalleryItems(),
    getLogoMarqueeItems(),
    getEducationItems(),
    getNavLinks()
  ]);
  const section = (key: string): PageSection | undefined =>
    pageSections.find((pageSection) => pageSection.sectionKey === key);
  const heroSection = section("hero");
  const logoMarqueeSection = section("logo_marquee");
  const aboutSection = section("about");
  const featuredWorkSection = section("featured_work");
  const toolkitSection = section("toolkit");
  const servicesSection = section("services");
  const processSection = section("process");
  const gallerySection = section("gallery");
  const faqSection = section("faq");

  return (
    <>
      <DockNav items={navLinks} />
      <main id="main">
        {heroSection ? <Hero about={about} section={heroSection} settings={settings} /> : null}
        {logoMarqueeSection && logoMarqueeItems.length ? (
          <LogoMarquee section={logoMarqueeSection} items={logoMarqueeItems} />
        ) : null}
        {aboutSection ? (
          <About
            about={about}
            section={aboutSection}
            education={educationItems}
            settings={settings}
          />
        ) : null}
        {featuredWorkSection && featuredProjects.length ? (
          <FeaturedWork projects={featuredProjects} section={featuredWorkSection} />
        ) : null}
        {toolkitSection && skills.length ? <Toolkit items={skills} section={toolkitSection} /> : null}
        {servicesSection && services.length ? <Services items={services} section={servicesSection} /> : null}
        {processSection && processSteps.length ? <Process items={processSteps} section={processSection} /> : null}
        {gallerySection && galleryItems.length ? <Gallery3D items={galleryItems} section={gallerySection} /> : null}
        {faqSection && faqItems.length ? <FAQ items={faqItems} section={faqSection} /> : null}
      </main>
      <Footer settings={settings} />
    </>
  );
}
