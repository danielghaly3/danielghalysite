import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight } from "lucide-react";
import { cmsResources } from "@/lib/cms/admin";
import { createClient } from "@/utils/supabase/server";

async function getCount(table: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function DashboardPage() {
  const cards = await Promise.all(
    cmsResources.map(async (resource) => ({
      ...resource,
      count: await getCount(resource.table)
    }))
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Dashboard</p>
          <h1 className="mt-3 font-display text-[clamp(38px,5vw,64px)] font-semibold leading-none tracking-[-0.03em]">
            Content command center.
          </h1>
          <p className="mt-4 max-w-2xl text-white/58">
            Manage the content that feeds the public portfolio while keeping admin controls behind Supabase Auth and RLS.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          View site
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {[
          {
            label: "Home Page",
            href: "/dashboard/pages/home",
            description: "Edit every homepage section from one clean page."
          },
          {
            label: "Projects Page",
            href: "/dashboard/pages/projects",
            description: "Edit the projects landing page and every project detail entry."
          }
        ].map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group rounded-[20px] border border-accent/20 bg-accent/10 p-6 shadow-soft transition-colors hover:bg-accent/15"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-medium text-white/62">{page.description}</p>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.015em]">{page.label}</h2>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.08] text-white/70 transition-colors group-hover:bg-accent group-hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((resource) => (
          <Link
            key={resource.id}
            href={`/dashboard/${resource.id}`}
            className="group rounded-[20px] border border-white/10 bg-white/[0.045] p-6 shadow-soft transition-colors hover:bg-white/[0.07]"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-medium text-white/55">{resource.description}</p>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.015em]">{resource.label}</h2>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/60 transition-colors group-hover:bg-accent group-hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-8 text-4xl font-semibold">{resource.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
