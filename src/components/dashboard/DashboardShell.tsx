import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import type { AdminSession } from "@/lib/auth/admin";

type DashboardShellProps = {
  admin: AdminSession;
  children: React.ReactNode;
};

export function DashboardShell({ admin, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* ── Desktop sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] flex-col border-r border-white/[0.06] bg-[#09090b]/90 backdrop-blur-2xl lg:flex">
        {/* Brand card */}
        <div className="px-4 pt-5">
          <Link
            href="/dashboard"
            className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-all hover:border-white/[0.14] hover:bg-white/[0.05]"
          >
            {/* Accent gradient line at top */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] cms-gradient opacity-60 transition-opacity group-hover:opacity-100"
            />
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg cms-gradient text-[11px] font-bold text-white shadow-[0_0_12px_-2px_rgba(0,163,255,0.4)]"
              >
                DG
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Control Center
                </p>
                <p className="mt-0.5 font-display text-sm font-semibold leading-tight tracking-[-0.01em] text-white/90">
                  Daniel Ghaly
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-5 flex-1 overflow-y-auto px-3 pb-4">
          <DashboardNav variant="sidebar" />
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.06] p-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white/60 transition-all hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
          >
            View public site
            <ExternalLink className="h-3 w-3" />
          </Link>
          <div className="flex items-center justify-between gap-2 px-1">
            <p className="truncate text-[11px] text-white/40">{admin.email ?? "Admin"}</p>
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/70"
              >
                <LogOut className="h-3 w-3" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="lg:pl-[272px]">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#09090b]/90 px-5 py-4 backdrop-blur-2xl lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md cms-gradient text-[9px] font-bold text-white">
                DG
              </span>
              <span className="font-display text-lg font-semibold tracking-[-0.01em]">
                CMS
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/[0.06] hover:text-white"
              >
                View site
              </Link>
              <form action="/auth/sign-out" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/[0.06] hover:text-white"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <div className="mt-4">
            <DashboardNav variant="mobile" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
