import type { ServiceCarouselItem } from "@/components/ui/service-card-carousel";
import type { HoverBrandLogoItem } from "@/components/ui/hover-brand-logo";
import type {
  AboutContent,
  EducationItem,
  FaqItem,
  GalleryItem,
  LogoMarqueeItem,
  NavLinkItem,
  PageSection,
  ProcessStep,
  SiteSettings
} from "@/types/cms";
import { faqs } from "./faq";
import { processSteps } from "./process";
import { site } from "./site";
import { galleryItems } from "./work";

export const fallbackSiteSettings: SiteSettings = {
  name: site.name,
  tagline: site.tagline,
  email: site.email,
  phone: "+1 647 570 0334",
  location: site.location,
  instagram_url: "https://www.instagram.com/graphxify/",
  linkedin_url: "https://www.linkedin.com/in/danielghalyx/",
  github_url: "https://github.com/",
  resume_url: "",
  seo_default_title: site.title,
  seo_default_description: site.description,
  default_og_image: "/opengraph-image",
  footer_heading: "Contact",
  footer_subtitle: "Let's build something clean, modern, and useful together."
};

export const fallbackAboutContent: AboutContent = {
  headline: "Designing clean digital experiences with purpose.",
  subheadline: "Designer and Web Developer",
  bio: [
    "I'm Daniel Ghaly, a designer and web developer focused on building modern brand identities, websites, and digital experiences that feel clean, sharp, and useful.",
    "My work combines visual design, front end development, and AI assisted workflows to help businesses move faster without losing quality."
  ],
  image_url: "/images/daniel-studio-portrait.png",
  resume_url: "",
  location: site.location,
  email: site.email,
  phone: "+1 647 570 0334",
  instagram_url: "https://www.instagram.com/graphxify/",
  linkedin_url: "https://www.linkedin.com/in/danielghalyx/",
  github_url: "https://github.com/"
};

export const fallbackServiceItems: ServiceCarouselItem[] = [
  {
    id: "brand-identity",
    title: "Brand Identity Design",
    subtitle: "Visual systems for businesses that need to look premium and trusted.",
    description:
      "I create clean, memorable brand identities including logos, color systems, typography, visual direction, and brand assets that help businesses look professional across every platform.",
    tags: ["Logo Design", "Typography", "Visual Direction"],
    image: "/images/maven-fashion.png",
    alt: "Brand identity design visual"
  },
  {
    id: "web-design",
    title: "Web Design",
    subtitle: "Modern websites designed to convert visitors into customers.",
    description:
      "I design polished, responsive websites with strong layout, clear messaging, smooth user experience, and a premium visual style that helps small businesses stand out online.",
    tags: ["UI Design", "Responsive Design", "Landing Pages"],
    image: "/images/flyup-line.png",
    alt: "Modern website design visual"
  },
  {
    id: "web-development",
    title: "Web Development",
    subtitle: "Fast responsive websites built with modern tools.",
    description:
      "I build websites using React, Next.js, Tailwind CSS, Supabase, and Vercel with a focus on performance, clean structure, SEO basics, and reliable deployment.",
    tags: ["Next.js", "Tailwind CSS", "Supabase"],
    image: "/images/daniel-hero.png",
    alt: "Web development workspace visual"
  },
  {
    id: "ai-workflow",
    title: "AI Assisted Design and Development",
    subtitle: "Smarter workflows using modern AI tools.",
    description:
      "I use tools like Claude, ChatGPT, Codex, Lovable, and AI image generation to speed up research, design exploration, coding, content planning, and website production.",
    tags: ["Claude", "ChatGPT", "Codex"],
    image: "/images/daniel-studio-portrait.png",
    alt: "AI assisted workflow visual"
  }
];

export const fallbackToolkitItems: HoverBrandLogoItem[] = [
  { id: "adobe-illustrator", name: "Adobe Illustrator", category: "Design", icon: "/icons/tools/adobe-illustrator.svg" },
  { id: "adobe-photoshop", name: "Adobe Photoshop", category: "Design", icon: "/icons/tools/adobe-photoshop.svg" },
  { id: "adobe-indesign", name: "Adobe InDesign", category: "Design", icon: "/icons/tools/adobe-indesign.svg" },
  { id: "figma", name: "Figma", category: "Design", icon: "/icons/tools/figma.svg" },
  { id: "html", name: "HTML", category: "Development", icon: "/icons/tools/html.svg" },
  { id: "css", name: "CSS", category: "Development", icon: "/icons/tools/css.svg" },
  { id: "react", name: "React", category: "Development", icon: "/icons/tools/react.svg" },
  { id: "next-js", name: "Next.js", category: "Development", icon: "/icons/tools/next-js.svg" },
  { id: "typescript", name: "TypeScript", category: "Development", icon: "/icons/tools/typescript.svg" },
  { id: "tailwind-css", name: "Tailwind CSS", category: "Development", icon: "/icons/tools/tailwind-css.svg" },
  { id: "supabase", name: "Supabase", category: "Development", icon: "/icons/tools/supabase.svg" },
  { id: "vercel", name: "Vercel", category: "Development", icon: "/icons/tools/vercel.svg" },
  { id: "github", name: "GitHub", category: "Development", icon: "/icons/tools/github.svg" },
  { id: "wordpress", name: "WordPress", category: "Development", icon: "/icons/tools/wordpress.svg" },
  { id: "wix", name: "Wix", category: "Development", icon: "/icons/tools/wix.svg" },
  { id: "framer", name: "Framer", category: "Development", icon: "/icons/tools/framer.svg" },
  { id: "shopify", name: "Shopify", category: "Development", icon: "/icons/tools/shopify.svg" },
  { id: "claude", name: "Claude", category: "AI workflow", icon: "/icons/tools/claude.svg" },
  { id: "chatgpt", name: "ChatGPT", category: "AI workflow", icon: "/icons/tools/chatgpt.svg" },
  { id: "codex", name: "Codex", category: "AI workflow", icon: "/icons/tools/codex.svg" },
  { id: "lovable", name: "Lovable", category: "AI workflow", icon: "/icons/tools/lovable.svg", wide: true },
  { id: "midjourney", name: "Midjourney", category: "AI workflow", icon: "/icons/tools/midjourney.svg" },
  { id: "runway", name: "Runway", category: "AI workflow", icon: "/icons/tools/runway.svg" },
  { id: "nano-banana", name: "Nano Banana", category: "AI workflow", icon: "/icons/tools/nano-banana.svg" }
];

export const fallbackPageSections: PageSection[] = [
  {
    id: "home-hero",
    page: "home",
    sectionKey: "hero",
    label: "Hero",
    eyebrow: "Hey, I'm",
    title: "Daniel Ghaly",
    body: "Designer and Web Developer. Design that works hard so brands don't have to.",
    ctaLabel: "See the work",
    ctaHref: "#work",
    imageUrl: "/images/daniel-hero.png",
    orderIndex: 10,
    active: true,
    metadata: {
      imageAlt: "Dark directional brand image for Daniel Ghaly's portfolio",
      seoTitle: site.title,
      seoDescription: site.description,
      ogTitle: site.title,
      ogDescription: site.description,
      ogImage: "/opengraph-image",
      twitterTitle: site.title,
      twitterDescription: site.description,
      twitterImage: "/opengraph-image",
      canonicalUrl: "/"
    }
  },
  {
    id: "home-logo-marquee",
    page: "home",
    sectionKey: "logo_marquee",
    label: "Logo Marquee",
    eyebrow: "",
    title: "Brands Trusted Me",
    body: "",
    ctaLabel: "",
    ctaHref: "",
    imageUrl: "",
    orderIndex: 20,
    active: true,
    metadata: {}
  },
  {
    id: "home-about",
    page: "home",
    sectionKey: "about",
    label: "About",
    eyebrow: "About",
    title: "Designing clean digital experiences with purpose.",
    body: "",
    ctaLabel: "",
    ctaHref: "",
    imageUrl: "",
    orderIndex: 30,
    active: true,
    metadata: {
      educationLabel: "Education",
      imageAlt: "Portrait of Daniel Ghaly"
    }
  },
  {
    id: "home-featured-work",
    page: "home",
    sectionKey: "featured_work",
    label: "Featured Work",
    eyebrow: "Selected work",
    title: "Recent projects, real outcomes.",
    body: "",
    ctaLabel: "View case study",
    ctaHref: "",
    imageUrl: "",
    orderIndex: 40,
    active: true,
    metadata: {}
  },
  {
    id: "home-toolkit",
    page: "home",
    sectionKey: "toolkit",
    label: "Toolkit",
    eyebrow: "Toolkit",
    title: "Skills and Tools I Use",
    body: "",
    ctaLabel: "",
    ctaHref: "",
    imageUrl: "",
    orderIndex: 50,
    active: true,
    metadata: {}
  },
  {
    id: "home-services",
    page: "home",
    sectionKey: "services",
    label: "Services",
    eyebrow: "What I Offer",
    title: "Services",
    body: "",
    ctaLabel: "",
    ctaHref: "",
    imageUrl: "",
    orderIndex: 60,
    active: true,
    metadata: {}
  },
  {
    id: "home-process",
    page: "home",
    sectionKey: "process",
    label: "Process",
    eyebrow: "Process",
    title: "From first call to shipped, in five steps.",
    body: "",
    ctaLabel: "",
    ctaHref: "",
    imageUrl: "",
    orderIndex: 70,
    active: true,
    metadata: {}
  },
  {
    id: "home-gallery",
    page: "home",
    sectionKey: "gallery",
    label: "Gallery",
    eyebrow: "More work",
    title: "Other things I've made.",
    body: "Snippets, side projects, and brand explorations.",
    ctaLabel: "Browse all Projects.",
    ctaHref: "#work",
    imageUrl: "",
    orderIndex: 80,
    active: true,
    metadata: {}
  },
  {
    id: "home-faq",
    page: "home",
    sectionKey: "faq",
    label: "FAQ",
    eyebrow: "FAQ",
    title: "Questions worth answering.",
    body: "The basics before we get into scope, timelines, and the shape of the work.",
    ctaLabel: "Still have questions? Email me",
    ctaHref: `mailto:${site.email}`,
    imageUrl: "",
    orderIndex: 90,
    active: true,
    metadata: {}
  },
  {
    id: "projects-hero",
    page: "projects",
    sectionKey: "hero",
    label: "Projects Hero",
    eyebrow: "Selected work",
    title: "Projects",
    body: "A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.",
    ctaLabel: "Browse the work",
    ctaHref: "#projects-grid",
    imageUrl: "/images/daniel-hero.png",
    orderIndex: 10,
    active: true,
    metadata: {
      imageAlt: "Editorial brand visual for the Daniel Ghaly projects archive",
      seoTitle: "Projects",
      seoDescription:
        "A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.",
      ogTitle: "Projects",
      ogDescription:
        "A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.",
      ogImage: "/images/daniel-hero.png",
      twitterTitle: "Projects",
      twitterDescription:
        "A collection of brand, web, and digital projects built with a focus on clean design, strong user experience, and polished execution.",
      twitterImage: "/images/daniel-hero.png",
      canonicalUrl: "/projects"
    }
  },
  {
    id: "projects-grid",
    page: "projects",
    sectionKey: "grid",
    label: "Projects Grid",
    eyebrow: "",
    title: "Explore the Work",
    body: "Browse through selected brand, web, and digital projects.",
    ctaLabel: "",
    ctaHref: "",
    imageUrl: "",
    orderIndex: 20,
    active: true,
    metadata: {}
  },
  {
    id: "projects-detail",
    page: "projects",
    sectionKey: "detail",
    label: "Project Detail Template",
    eyebrow: "",
    title: "",
    body: "",
    ctaLabel: "",
    ctaHref: "",
    imageUrl: "",
    orderIndex: 30,
    active: true,
    metadata: {
      backLabel: "All Projects",
      clientLabel: "Client",
      roleLabel: "Role",
      yearLabel: "Year",
      technologiesLabel: "Technologies",
      servicesLabel: "Services",
      linksLabel: "Links",
      liveLabel: "View live",
      githubLabel: "Source code",
      figmaLabel: "Figma file",
      overviewLabel: "Overview",
      problemLabel: "The Problem",
      solutionLabel: "The Solution",
      resultsLabel: "Results",
      previousLabel: "Previous",
      nextLabel: "Next"
    }
  }
];

export const fallbackProcessSteps: ProcessStep[] = processSteps.map((step, index) => ({
  id: `fallback-process-${index}`,
  title: step.title,
  blurb: step.blurb,
  detail: step.detail,
  image: step.image,
  imageAlt: `${step.title} process step visual`
}));

export const fallbackFaqItems: FaqItem[] = faqs.map((faq, index) => ({
  id: `fallback-faq-${index}`,
  question: faq.question,
  answer: faq.answer
}));

export const fallbackGalleryItems: GalleryItem[] = galleryItems.map((item, index) => ({
  id: `fallback-gallery-${index}`,
  caption: item.caption,
  image: item.image,
  alt: item.alt
}));

export const fallbackLogoMarqueeItems: LogoMarqueeItem[] = [
  { id: "logo-figma", name: "Figma", image: "/icons/tools/figma.svg", alt: "Figma", height: 44, href: "" },
  { id: "logo-react", name: "React", image: "/icons/tools/react.svg", alt: "React", height: 42, href: "" },
  { id: "logo-next-js", name: "Next.js", image: "/icons/tools/next-js.svg", alt: "Next.js", height: 40, href: "" },
  { id: "logo-typescript", name: "TypeScript", image: "/icons/tools/typescript.svg", alt: "TypeScript", height: 42, href: "" },
  { id: "logo-tailwind", name: "Tailwind CSS", image: "/icons/tools/tailwind-css.svg", alt: "Tailwind CSS", height: 38, href: "" },
  { id: "logo-illustrator", name: "Adobe Illustrator", image: "/icons/tools/adobe-illustrator.svg", alt: "Adobe Illustrator", height: 44, href: "" },
  { id: "logo-photoshop", name: "Adobe Photoshop", image: "/icons/tools/adobe-photoshop.svg", alt: "Adobe Photoshop", height: 44, href: "" },
  { id: "logo-supabase", name: "Supabase", image: "/icons/tools/supabase.svg", alt: "Supabase", height: 42, href: "" },
  { id: "logo-vercel", name: "Vercel", image: "/icons/tools/vercel.svg", alt: "Vercel", height: 38, href: "" },
  { id: "logo-github", name: "GitHub", image: "/icons/tools/github.svg", alt: "GitHub", height: 42, href: "" },
  { id: "logo-claude", name: "Claude", image: "/icons/tools/claude.svg", alt: "Claude", height: 42, href: "" },
  { id: "logo-framer", name: "Framer", image: "/icons/tools/framer.svg", alt: "Framer", height: 42, href: "" },
  { id: "logo-shopify", name: "Shopify", image: "/icons/tools/shopify.svg", alt: "Shopify", height: 44, href: "" },
  { id: "logo-wordpress", name: "WordPress", image: "/icons/tools/wordpress.svg", alt: "WordPress", height: 42, href: "" }
];

export const fallbackEducationItems: EducationItem[] = [
  {
    id: "edu-humber",
    program: "Graphic Design and Advertising",
    school: "Humber College",
    year: "",
    description: ""
  },
  {
    id: "edu-sheridan",
    program: "Digital Design",
    school: "Sheridan College",
    year: "",
    description: ""
  }
];

export const fallbackNavLinks: NavLinkItem[] = [
  { iconKey: "home", label: "Home", href: "/", sectionId: "top" },
  { iconKey: "about", label: "About", href: "/#about", sectionId: "about" },
  { iconKey: "work", label: "Work", href: "/projects" },
  { iconKey: "services", label: "Services", href: "/#services", sectionId: "services" },
  { iconKey: "contact", label: "Contact", href: "/#contact", sectionId: "contact" }
];
