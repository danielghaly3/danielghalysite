import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/primitives/Pill";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { blurDataUrl, featuredProjects as fallbackFeaturedProjects } from "@/content/work";
import { cn } from "@/lib/cn";
import type { PageSection } from "@/types/cms";

type FeaturedProject = (typeof fallbackFeaturedProjects)[number];

function ProjectImage({ image, alt, href }: { image: string; alt: string; href: string }) {
  return (
    <Link href={href} className="image-frame block aspect-[4/3] bg-paper">
      <Image
        src={image}
        alt={alt}
        fill
        placeholder="blur"
        blurDataURL={blurDataUrl}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover"
      />
    </Link>
  );
}

function ProjectContent({
  ctaLabel,
  project
}: {
  ctaLabel: string;
  project: FeaturedProject;
}) {
  return (
    <div className="flex h-full flex-col justify-center">
      <h3 className="font-display text-[clamp(28px,3vw,44px)] font-semibold leading-tight tracking-[-0.02em]">
        {project.name}
      </h3>
      <p className="mt-5 text-[16px] leading-[1.65] text-ash">{project.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-8">
        <Pill href={`/projects/${project.slug}`}>{ctaLabel}</Pill>
      </div>
    </div>
  );
}

type FeaturedWorkProps = {
  projects?: FeaturedProject[];
  section?: PageSection;
};

export function FeaturedWork({ projects = fallbackFeaturedProjects, section }: FeaturedWorkProps) {
  const visibleProjects = projects.length >= 3 ? projects.slice(0, 3) : fallbackFeaturedProjects;
  const ctaLabel = section?.ctaLabel || "View case study";

  return (
    <section id="work" aria-labelledby="work-heading" className="section-pad bg-bone">
      <div className="site-container">
        <Reveal>
          <SectionHeader
            id="work-heading"
            eyebrow={section?.eyebrow || "Selected work"}
            title={section?.title || "Recent projects, real outcomes."}
            body={section?.body || undefined}
          />
        </Reveal>

        <div className="space-y-20">
          {visibleProjects.slice(0, 2).map((project, index) => (
            <Reveal key={project.name} y={40}>
              <article
                className={cn(
                  "grid gap-8 lg:grid-cols-10 lg:items-stretch",
                  index === 1 && "lg:[&>*:first-child]:order-2"
                )}
              >
                <div className="lg:col-span-6">
                  <ProjectImage image={project.image} alt={project.alt} href={`/projects/${project.slug}`} />
                </div>
                <div className="lg:col-span-4">
                  <ProjectContent ctaLabel={ctaLabel} project={project} />
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal y={40}>
            <article>
              <ProjectImage
                image={visibleProjects[2].image}
                alt={visibleProjects[2].alt}
                href={`/projects/${visibleProjects[2].slug}`}
              />
              <div className="mt-8">
                <ProjectContent ctaLabel={ctaLabel} project={visibleProjects[2]} />
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
