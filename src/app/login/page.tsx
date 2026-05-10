import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/dashboard/LoginForm";

export const metadata: Metadata = {
  title: "Daniel Ghaly",
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 py-16 text-paper">
      <div className="w-full max-w-[440px]">
        <Link href="/" className="text-sm font-medium text-white/55 transition-colors hover:text-white">
          Daniel Ghaly
        </Link>
        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.045] p-7 shadow-pop backdrop-blur-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Admin</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-[-0.02em]">
            Sign in to manage the CMS.
          </h1>
          <p className="mt-3 text-sm leading-[1.6] text-white/55">
            Use the Supabase Auth admin account that has a matching row in the `admin_users` table.
          </p>
          <div className="mt-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
