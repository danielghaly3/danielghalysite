import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Daniel Ghaly",
  robots: {
    index: false,
    follow: false
  }
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return <DashboardShell admin={admin}>{children}</DashboardShell>;
}
