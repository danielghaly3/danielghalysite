"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Home,
  User,
  Briefcase,
  Sparkles,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { fallbackNavLinks } from "@/content/cms-fallbacks";
import type { NavLinkIconKey, NavLinkItem } from "@/types/cms";

const ICON_MAP: Record<NavLinkIconKey, LucideIcon> = {
  home: Home,
  about: User,
  work: Briefcase,
  services: Sparkles,
  contact: Mail,
};

type DockNavProps = {
  items?: NavLinkItem[];
};

const ActiveContext = createContext<string>("home");

/* ── Hook: detect which homepage section is in view ── */
function useActiveSection(pathname: string, sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    if (pathname !== "/") return;
    if (!sectionIds.length) return;

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        }
        if (best) {
          setActiveSection(best.target.id);
        }
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.1, 0.25, 0.5] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, sectionIds]);

  return activeSection;
}

/* ── Derive which dock item label is active ── */
function useActiveLabel(pathname: string, activeSection: string, items: NavLinkItem[]): string {
  if (pathname.startsWith("/projects")) {
    const workItem = items.find((item) => item.iconKey === "work");
    return workItem?.label ?? "Work";
  }

  if (pathname === "/") {
    const match = items.find((item) => item.sectionId === activeSection);
    return match?.label ?? items[0]?.label ?? "Home";
  }

  return items[0]?.label ?? "Home";
}

/* ── Single dock icon ── */
function DockIcon({
  item,
  Icon,
  mouseX,
}: {
  item: NavLinkItem;
  Icon: LucideIcon;
  mouseX: ReturnType<typeof useMotionValue<number>>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const activeLabel = useContext(ActiveContext);
  const isActive = item.label === activeLabel;

  const distance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 200;
    return val - rect.x - rect.width / 2;
  });

  const sizeTransform = useTransform(distance, [-120, 0, 120], [40, 52, 40]);
  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 200, damping: 15 });
  const liftTransform = useTransform(distance, [-120, 0, 120], [0, -4, 0]);
  const lift = useSpring(liftTransform, { mass: 0.1, stiffness: 200, damping: 15 });

  const inner = (
    <motion.div
      ref={ref}
      style={{ width: size, height: size, y: lift }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-[background-color,box-shadow,color] duration-300",
        isActive
          ? "bg-[#0052CC] text-white shadow-[0_0_14px_rgba(0,82,204,0.45)]"
          : "text-white/70 hover:bg-[#0052CC]/20 hover:text-white hover:shadow-[0_0_12px_rgba(0,82,204,0.3)]"
      )}
    >
      <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />

      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: -4, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -2, x: "-50%" }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-1/2 mt-2 whitespace-nowrap rounded-lg bg-[#0E0E10] px-2.5 py-1 text-[11px] font-medium text-white shadow-lg ring-1 ring-white/10"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const isHashLink = item.href.includes("#") && item.href !== "/";

  if (isHashLink) {
    return (
      <a href={item.href} aria-label={item.label}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href} aria-label={item.label}>
      {inner}
    </Link>
  );
}

/* ── Main dock nav ── */
export function DockNav({ items = fallbackNavLinks }: DockNavProps) {
  const navItems = items.length ? items : fallbackNavLinks;
  const sectionIds = navItems
    .map((item) => item.sectionId)
    .filter((id): id is string => Boolean(id));
  const mouseX = useMotionValue(Infinity);
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);
  const pathname = usePathname();
  const activeSection = useActiveSection(pathname, sectionIds);
  const activeLabel = useActiveLabel(pathname, activeSection, navItems);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 300 && y > lastScroll.current + 4) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScroll.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ActiveContext.Provider value={activeLabel}>
      <motion.nav
        aria-label="Main navigation"
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: visible ? 0 : -80,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2 py-1.5 shadow-2xl backdrop-blur-xl backdrop-saturate-150 sm:gap-1.5 sm:px-3 sm:py-2"
      >
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.iconKey] ?? Home;
          return <DockIcon key={`${item.iconKey}-${item.label}`} item={item} Icon={Icon} mouseX={mouseX} />;
        })}
      </motion.nav>
    </ActiveContext.Provider>
  );
}
