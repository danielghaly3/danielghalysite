import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, Edit3, ExternalLink, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

type PageName = "home" | "projects";

type PageSectionRow = {
  id: string;
  page: string;
  section_key: string;
  label: string;
  title: string | null;
  active: boolean;
  updated_at: string;
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
};

type PageCard = {
  title: string;
  description: string;
  sectionKey?: string;
  href?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

const homeCards: PageCard[] = [
  {
    title: "Hero",
    description: "Main headline, intro copy, CTA, and hero image.",
    sectionKey: "hero"
  },
  {
    title: "Logo Marquee",
    description: "Section label plus the tool logos shown in the moving marquee.",
    sectionKey: "logo_marquee",
    secondaryHref: "/dashboard/logo_marquee_items",
    secondaryLabel: "Manage logos"
  },
  {
    title: "About — Section copy",
    description: "Eyebrow and heading override for the About section. Bio, portrait, and contact details live in About / Profile.",
    sectionKey: "about",
    secondaryHref: "/dashboard/about_content",
    secondaryLabel: "Edit profile"
  },
  {
    title: "About — Education",
    description: "Programs and schools shown in the About section education block.",
    href: "/dashboard/education_items"
  },
  {
    title: "About / Profile",
    description: "Profile headline, bio, portrait, location, resume, and contact details.",
    href: "/dashboard/about_content"
  },
  {
    title: "Featured Work",
    description: "Homepage work section heading and the project entries it highlights.",
    sectionKey: "featured_work",
    secondaryHref: "/dashboard/projects",
    secondaryLabel: "Manage projects"
  },
  {
    title: "Skills / Tools",
    description: "Toolkit heading and the skills/tools shown in the animated grid.",
    sectionKey: "toolkit",
    secondaryHref: "/dashboard/skills",
    secondaryLabel: "Manage tools"
  },
  {
    title: "Services",
    description: "Services heading and the service cards shown on the homepage.",
    sectionKey: "services",
    secondaryHref: "/dashboard/services",
    secondaryLabel: "Manage services"
  },
  {
    title: "Process",
    description: "Process section heading and accordion steps.",
    sectionKey: "process",
    secondaryHref: "/dashboard/process_steps",
    secondaryLabel: "Manage steps"
  },
  {
    title: "Gallery",
    description: "Gallery heading, CTA, and auto-slider images.",
    sectionKey: "gallery",
    secondaryHref: "/dashboard/gallery_items",
    secondaryLabel: "Manage images"
  },
  {
    title: "FAQ",
    description: "FAQ heading, CTA, questions, and answers.",
    sectionKey: "faq",
    secondaryHref: "/dashboard/faq_items",
    secondaryLabel: "Manage FAQs"
  },
  {
    title: "Navigation (dock)",
    description: "Top dock nav labels and links. Edit the site_settings row with key 'nav_links'.",
    href: "/dashboard/site_settings"
  },
  {
    title: "SEO / Footer",
    description: "Global SEO defaults, social links, email, phone, and footer settings.",
    href: "/dashboard/site_settings"
  }
];

const projectPageCards: PageCard[] = [
  {
    title: "Projects Hero",
    description: "Projects page headline, intro copy, CTA, and hero image.",
    sectionKey: "hero"
  },
  {
    title: "Projects Grid Intro",
    description: "Heading and body copy above the project carousel.",
    sectionKey: "grid"
  },
  {
    title: "Project Archive",
    description: "All project cards, publish state, featured state, and ordering.",
    href: "/dashboard/projects"
  },
  {
    title: "Project Detail Template",
    description: "Each project detail page pulls from the project record fields below.",
    href: "/dashboard/projects"
  }
];

async function getPageSections(page: PageName) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("page_sections")
    .select("id,page,section_key,label,title,active,updated_at")
    .eq("page", page)
    .order("order_index", { ascending: true });

  return (data ?? []) as PageSectionRow[];
}

async function getProjects() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("projects")
    .select("id,title,slug,status,featured")
    .order("order_index", { ascending: true });

  return (data ?? []) as ProjectRow[];
}

function sectionEditHref(sections: PageSectionRow[], page: PageName, key: string) {
  const section = sections.find((item) => item.page === page && item.section_key === key);
  return section?.id ? `/dashboard/page_sections/${section.id}` : "/dashboard/page_sections/new";
}

function SectionCard({
  card,
  href,
  section
}: {
  card: PageCard;
  href: string;
  section?: PageSectionRow;
}) {
  return (
    <article className="rounded-[20px] border border-white/10 bg-white/[0.045] p-5 shadow-soft">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            {section?.active === false ? "Hidden section" : "Editable section"}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.015em]">{card.title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/55">{card.description}</p>
          {section?.title ? <p className="mt-4 line-clamp-2 text-sm text-white/72">{section.title}</p> : null}
        </div>
        <Link
          href={href}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/62 transition-colors hover:bg-accent hover:text-white"
          aria-label={`Edit ${card.title}`}
        >
          <Edit3 className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={href}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          Edit
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {card.secondaryHref && card.secondaryLabel ? (
          <Link
            href={card.secondaryHref}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-semibold text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            {card.secondaryLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function ProjectList({ projects }: { projects: ProjectRow[] }) {
  return (
    <section className="mt-10 rounded-[22px] border border-white/10 bg-white/[0.045] p-5 shadow-pop sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Individual project pages</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.015em]">Edit each project page.</h2>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0747A6]"
        >
          <Plus className="h-4 w-4" />
          New project
        </Link>
      </div>

      <div className="mt-6 divide-y divide-white/10">
        {projects.length ? (
          projects.map((project) => (
            <div key={project.id} className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div>
                <p className="font-display text-2xl font-semibold tracking-[-0.01em]">{project.title}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/46">
                  <span>/{project.slug}</span>
                  <span>{project.status}</span>
                  {project.featured ? <span>featured</span> : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  Edit CMS
                  <Edit3 className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-semibold text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  View page
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-sm text-white/55">No projects yet. Create one to generate a public project page.</div>
        )}
      </div>
    </section>
  );
}

export async function PageEditorHub({ page }: { page: PageName }) {
  const [sections, projects] = await Promise.all([getPageSections(page), page === "projects" ? getProjects() : []]);
  const cards = page === "home" ? homeCards : projectPageCards;
  const title = page === "home" ? "Home page CMS." : "Projects page CMS.";
  const description =
    page === "home"
      ? "Edit the homepage section by section without touching the public design system."
      : "Edit the projects landing page and jump into each project detail page.";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Page editor</p>
          <h1 className="mt-3 font-display text-[clamp(36px,5vw,58px)] font-semibold leading-none tracking-[-0.03em]">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-white/58">{description}</p>
        </div>
        <Link
          href={page === "home" ? "/" : "/projects"}
          className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          View public page
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const section = card.sectionKey
            ? sections.find((item) => item.section_key === card.sectionKey)
            : undefined;
          const href = card.href ?? sectionEditHref(sections, page, card.sectionKey ?? "");

          return <SectionCard key={card.title} card={card} href={href} section={section} />;
        })}
      </div>

      {page === "projects" ? <ProjectList projects={projects as ProjectRow[]} /> : null}
    </div>
  );
}
