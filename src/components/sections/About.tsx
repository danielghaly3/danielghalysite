"use client";

import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { AboutImageCard } from "@/components/ui/about-image-card";
import {
  fallbackAboutContent,
  fallbackEducationItems,
  fallbackSiteSettings
} from "@/content/cms-fallbacks";
import { sectionString } from "@/lib/cms/section-content";
import type { AboutContent, EducationItem, PageSection, SiteSettings } from "@/types/cms";

type AboutProps = {
  about?: AboutContent;
  section?: PageSection;
  education?: EducationItem[];
  settings?: SiteSettings;
};

export function About({
  about = fallbackAboutContent,
  section,
  education = fallbackEducationItems,
  settings = fallbackSiteSettings
}: AboutProps) {
  const eyebrow = section?.eyebrow || "About";
  const headline = section?.title || about.headline;
  const imageUrl = section?.imageUrl || about.image_url;
  const imageAlt = sectionString(section, "imageAlt", `Portrait of ${settings.name}`);
  const educationLabel = sectionString(section, "educationLabel", "Education");
  const educationItems = education;
  const showEducation = educationItems.length > 0;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-pad bg-paper text-ink"
    >
      <div className="site-container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="about-heading"
              className="section-title mt-5 max-w-[640px]"
            >
              {headline}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-7 max-w-xl space-y-5 text-lg leading-[1.55] text-ash">
              {about.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {showEducation ? (
            <Reveal delay={0.15}>
              <div className="mt-10 max-w-md rounded-[20px] border border-line bg-white p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                  {educationLabel}
                </p>
                <ul className="mt-4 divide-y divide-line">
                  {educationItems.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                    >
                      <span className="font-display text-[15px] font-semibold leading-tight tracking-[-0.005em] text-ink">
                        {entry.program}
                      </span>
                      <span className="text-[13px] text-ash">
                        {entry.school}
                        {entry.year ? ` · ${entry.year}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}
        </div>

        <div className="lg:col-span-6">
          <AboutImageCard
            src={imageUrl}
            alt={imageAlt}
            name={settings.name}
            role={about.subheadline}
          />
        </div>
      </div>
    </section>
  );
}
