import type { GalleryLayout } from "@/components/ui/sticky-gallery";
import { blurDataUrl } from "./work";

export type Project = {
  slug: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  alt: string;
  year?: string;
  client?: string;
  role?: string;
  overview?: string;
  problem?: string;
  solution?: string;
  results?: string;
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  gallery?: { src: string; alt: string }[];
  stickyGallery?: {
    layout: GalleryLayout;
    images: (string | { src: string; alt?: string })[];
  };
};

export const allProjects: Project[] = [
  {
    slug: "boss-med-clinic",
    name: "Boss Med Clinic",
    category: "Healthcare Website",
    description:
      "A clean, professional website for a medical clinic focused on building trust and streamlining patient intake with modern design and responsive layout.",
    tags: ["Web Design", "Web Development", "UI Design"],
    image: "/images/healthcare.png",
    alt: "Boss Med Clinic website design",
    year: "2024",
    client: "Boss Med Clinic",
    role: "Designer and Developer",
    overview:
      "Boss Med Clinic needed a digital presence that would establish credibility with patients and simplify the intake process. The design focuses on clear hierarchy, calming tones, and straightforward navigation so patients can find what they need without friction. Every layout decision was made with trust and accessibility in mind.",
    stickyGallery: {
      layout: "hero-split",
      images: [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop",
      ],
    },
  },
  {
    slug: "pharmacy-on-king",
    name: "Pharmacy On King",
    category: "Pharmacy Website",
    description:
      "A polished digital presence for a local pharmacy, designed to communicate reliability and make essential services easy to find.",
    tags: ["Web Design", "Web Development", "SEO"],
    image: "/images/daniel-hero.png",
    alt: "Pharmacy On King website design",
    year: "2024",
    client: "Pharmacy On King",
    role: "Designer and Developer",
    overview:
      "This project involved creating a professional yet approachable website for a community pharmacy. The goal was to highlight core services, build local trust, and ensure the site ranks well in search. A clean layout with prominent calls to action guides users to prescriptions, services, and contact information.",
    stickyGallery: {
      layout: "mosaic-left",
      images: [
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563233004-3754e72f46a9?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
      ],
    },
  },
  {
    slug: "king-medical-arts-pharmacy",
    name: "King Medical Arts Pharmacy",
    category: "Healthcare Website",
    description:
      "A modern healthcare website with clear navigation, patient resources, and a visual identity that inspires confidence.",
    tags: ["Web Design", "UI Design", "SEO"],
    image: "/images/healthcare.png",
    alt: "King Medical Arts Pharmacy website design",
    year: "2024",
    client: "King Medical Arts Pharmacy",
    role: "Designer and Developer",
    overview:
      "King Medical Arts Pharmacy required a website that balances professionalism with warmth. The design system uses clean typography, structured layouts, and a calming color palette to create an experience that feels trustworthy and easy to navigate for patients of all ages.",
    stickyGallery: {
      layout: "bento",
      images: [
        "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551190822-a9ce113ac1e6?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581093458791-9d42e3c2fd45?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512678080587-27446a5e78c2?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop",
      ],
    },
  },
  {
    slug: "flyup-line",
    name: "FlyUp Line",
    category: "Travel Brand and Website",
    description:
      "A confident brand identity and conversion focused website for a travel agency built around speed, price transparency, and a clean booking flow.",
    tags: ["Brand Identity", "Web Design", "Web Development"],
    image: "/images/flyup-line.png",
    alt: "FlyUp Line travel brand and website design",
    year: "2024",
    client: "FlyUp Line",
    role: "Brand Designer and Developer",
    overview:
      "FlyUp Line needed a brand and website that could compete in a crowded travel market. The solution combines a bold visual identity with a streamlined booking experience. Every element, from the logo to the UI components, was designed to communicate speed, value, and reliability.",
    stickyGallery: {
      layout: "editorial",
      images: [
        "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop",
      ],
    },
  },
  {
    slug: "luka-hair-salon",
    name: "Luka Hair Salon",
    category: "Salon Website",
    description:
      "An elegant, visually driven website for a hair salon that puts the craft front and center with rich imagery and effortless booking.",
    tags: ["Web Design", "UI Design", "Brand Identity"],
    image: "/images/luka-salon.png",
    alt: "Luka Hair Salon website design",
    year: "2024",
    client: "Luka Hair Salon",
    role: "Designer and Developer",
    overview:
      "Luka Hair Salon wanted a website that reflects the artistry and premium feel of their services. The design uses large imagery, elegant typography, and seamless booking integration to create an experience that matches the in-salon atmosphere.",
    stickyGallery: {
      layout: "featured-left",
      images: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1521590832167-7228fcb10cbe?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&auto=format&fit=crop",
      ],
    },
  },
  {
    slug: "maven",
    name: "Maven",
    category: "Brand Identity",
    description:
      "A premium brand identity system including logo, typography, color direction, and visual guidelines for a fashion forward venture.",
    tags: ["Brand Identity", "Web Design"],
    image: "/images/maven-fashion.png",
    alt: "Maven brand identity design",
    year: "2024",
    client: "Maven",
    role: "Brand Designer",
    overview:
      "Maven is a fashion brand that needed a visual identity as refined as its products. The brand system includes a custom logotype, a curated color palette, typographic hierarchy, and comprehensive brand guidelines that ensure consistency across every touchpoint.",
    stickyGallery: {
      layout: "featured-right",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop",
      ],
    },
  },
  {
    slug: "graphxify",
    name: "Graphxify",
    category: "Brand Identity and Website",
    description:
      "A full brand identity and portfolio website for a creative studio, built around bold visuals, clean typography, and a modern dark aesthetic.",
    tags: ["Brand Identity", "Web Design", "Web Development"],
    image: "/images/daniel-hero.png",
    alt: "Graphxify brand identity and website",
    year: "2025",
    client: "Graphxify",
    role: "Creative Director and Developer",
    overview:
      "Graphxify is the creative studio behind this portfolio. The brand was built from the ground up with a dark, modern aesthetic, bold blue accents, and a component driven website that showcases work with clarity and impact.",
    stickyGallery: {
      layout: "magazine",
      images: [
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1613909207039-6b173b4717ff?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop",
      ],
    },
  },
  {
    slug: "fav-for-pet",
    name: "Fav For Pet",
    category: "Retail Brand and E-commerce",
    description:
      "A warm, approachable brand and online store for a pet supply company, designed to build trust and drive conversions with pet owners.",
    tags: ["Brand Identity", "E-commerce", "UI Design"],
    image: "/images/luka-salon.png",
    alt: "Fav For Pet retail brand design",
    year: "2024",
    client: "Fav For Pet",
    role: "Brand Designer and Developer",
    overview:
      "Fav For Pet needed a brand that felt friendly and trustworthy while also being conversion focused. The visual identity uses warm tones and playful elements, paired with a clean e-commerce layout that makes browsing and purchasing effortless for pet owners.",
    stickyGallery: {
      layout: "zigzag",
      images: [
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1425082661507-d6d2f66e4637?w=800&auto=format&fit=crop",
      ],
    },
  },
  {
    slug: "bella-vita",
    name: "Bella Vita",
    category: "Restaurant Website",
    description:
      "An elegant, visually rich website for a high end restaurant focused on showcasing the dining experience, menu, and reservation flow.",
    tags: ["Web Design", "UI Design", "SEO"],
    image: "/images/maven-fashion.png",
    alt: "Bella Vita restaurant website design",
    year: "2024",
    client: "Bella Vita",
    role: "Designer and Developer",
    overview:
      "Bella Vita is a fine dining restaurant that needed a website worthy of its culinary craft. The design leans into rich imagery, elegant spacing, and a seamless reservation experience that converts visitors into guests.",
    stickyGallery: {
      layout: "showcase",
      images: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
      ],
    },
  },
];

export { blurDataUrl };
