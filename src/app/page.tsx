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
  getNavLinks,
  getPageSections,
  getProcessSteps,
  getServices,
  getSiteSettings,
  getSkills
} from "@/lib/cms/public";
import type { PageSection } from "@/types/cms";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.seo_default_title,
    description: settings.seo_default_description,
    openGraph: {
      title: settings.seo_default_title,
      description: settings.seo_default_description,
      images: [settings.default_og_image]
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo_default_title,
      description: settings.seo_default_description,
      images: [settings.default_og_image]
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

  return (
    <>
      <DockNav items={navLinks} />
      <main id="main">
        <Hero about={about} section={section("hero")} settings={settings} />
        <LogoMarquee section={section("logo_marquee")} items={logoMarqueeItems} />
        <About
          about={about}
          section={section("about")}
          education={educationItems}
          settings={settings}
        />
        <FeaturedWork projects={featuredProjects} section={section("featured_work")} />
        <Toolkit items={skills} section={section("toolkit")} />
        <Services items={services} section={section("services")} />
        <Process items={processSteps} section={section("process")} />
        <Gallery3D items={galleryItems} section={section("gallery")} />
        <FAQ items={faqItems} section={section("faq")} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
