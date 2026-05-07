import Link from "next/link";
import {
  Briefcase,
  FileText,
  Gauge,
  Home,
  Settings,
  Sparkles,
  User,
  Wrench
} from "lucide-react";
import type { AdminSession } from "@/lib/auth/admin";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Gauge },
  { label: "Home Page", href: "/dashboard/pages/home", icon: Home },
  { label: "Projects Page", href: "/dashboard/pages/projects", icon: Briefcase },
  { label: "Project Entries", href: "/dashboard/projects", icon: Briefcase },
  { label: "Blog Posts", href: "/dashboard/blog_posts", icon: FileText },
  { label: "Services", href: "/dashboard/services", icon: Sparkles },
  { label: "Skills / Tools", href: "/dashboard/skills", icon: Wrench },
  { label: "About / Profile", href: "/dashboard/about_content", icon: User },
  { label: "SEO / Settings", href: "/dashboard/site_settings", icon: Settings }
];

type DashboardShellProps = {
  admin: AdminSession;
  children: React.ReactNode;
};

export function DashboardShell({ admin, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-white/10 bg-black/28 p-5 backdrop-blur-xl lg:block">
        <Link href="/" className="block rounded-[18px] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Daniel Ghaly</p>
          <p className="mt-2 font-display text-2xl font-semibold leading-tight">Portfolio CMS</p>
        </Link>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium text-white/62 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute inset-x-5 bottom-5 rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
          <p className="truncate text-sm font-medium text-white">{admin.email ?? "Admin"}</p>
          <form action="/auth/sign-out" method="post" className="mt-3">
            <button
              type="submit"
              className="h-10 w-full rounded-full border border-white/10 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/82 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard" className="font-display text-2xl font-semibold">
              CMS
            </Link>
            <form action="/auth/sign-out" method="post">
              <button type="submit" className="rounded-full border border-white/10 px-4 py-2 text-sm">
                Log out
              </button>
            </form>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/65"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
