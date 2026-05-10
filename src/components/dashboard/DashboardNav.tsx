"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Layers,
  ListOrdered,
  MessageSquareText,
  Settings,
  Sparkles,
  User,
  Wrench,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/cn";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  matchPrefix?: string;
};

type NavGroup = {
  label: string | null;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [{ label: "Overview", href: "/dashboard", icon: LayoutDashboard, matchPrefix: "exact" }]
  },
  {
    label: "Pages",
    items: [
      { label: "Home Page", href: "/dashboard/pages/home", icon: Home, matchPrefix: "exact" },
      { label: "About Page", href: "/dashboard/pages/home/about", icon: User },
      { label: "Projects Page", href: "/dashboard/pages/projects", icon: Briefcase, matchPrefix: "exact" },
      { label: "Project Template", href: "/dashboard/pages/projects/detail", icon: Layers },

      { label: "Contact / Footer", href: "/dashboard/settings/footer", icon: MessageSquareText }
    ]
  },
  {
    label: "Content Library",
    items: [
      { label: "Projects", href: "/dashboard/projects", icon: Briefcase },

      { label: "Services", href: "/dashboard/services", icon: Sparkles },
      { label: "Skills / Tools", href: "/dashboard/skills", icon: Wrench },
      { label: "Logo Marquee", href: "/dashboard/logo_marquee_items", icon: Layers },
      { label: "Gallery", href: "/dashboard/gallery_items", icon: ImageIcon },
      { label: "FAQ", href: "/dashboard/faq_items", icon: HelpCircle },
      { label: "Process", href: "/dashboard/process_steps", icon: ListOrdered },
      { label: "Education", href: "/dashboard/education_items", icon: GraduationCap },
      { label: "About Profile", href: "/dashboard/about_content", icon: User }
    ]
  },
  {
    label: "Settings",
    items: [
      { label: "Settings Hub", href: "/dashboard/settings", icon: Settings },
      { label: "Settings Records", href: "/dashboard/site_settings", icon: Layers }
    ]
  }
];

function isItemActive(pathname: string, item: NavItem): boolean {
  if (item.matchPrefix === "exact") return pathname === item.href;
  if (pathname === item.href) return true;
  return pathname.startsWith(`${item.href}/`);
}

type Variant = "sidebar" | "mobile";

export function DashboardNav({ variant = "sidebar" }: { variant?: Variant }) {
  const pathname = usePathname();

  if (variant === "mobile") {
    const flat = navGroups.flatMap((group) => group.items);
    return (
      <nav className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {flat.map((item) => {
          const active = isItemActive(pathname, item);
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
                active
                  ? "border-[#00A3FF]/30 bg-[#00A3FF]/10 text-white"
                  : "border-white/[0.08] text-white/55 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-7">
      {navGroups.map((group, idx) => (
        <div key={group.label ?? `group-${idx}`} className="flex flex-col gap-0.5">
          {group.label ? (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
              {group.label}
            </p>
          ) : null}
          {group.items.map((item) => {
            const active = isItemActive(pathname, item);
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150",
                  active
                    ? "bg-white/[0.07] text-white"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                )}
              >
                {active ? <span aria-hidden="true" className="cms-active-bar" /> : null}
                <item.icon
                  className={cn(
                    "h-[15px] w-[15px] shrink-0 transition-colors",
                    active ? "text-[#00A3FF]" : "text-white/40 group-hover:text-white/60"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
