import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Settings,
  ShieldCheck
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cn } from "@/lib/cn";
import {
  hasSettingValue,
  settingPreviewValue,
  settingsModules
} from "@/lib/cms/settings-modules";
import type { Json } from "@/types/cms";

type SettingRow = {
  key: string;
  value: Json;
  updated_at?: string;
};

function displayKey(key: string) {
  return key.replace(/_/g, " ");
}

async function getSettingsData() {
  const supabase = createClient(await cookies());
  const [{ data: settings }, { count: admins }] = await Promise.all([
    supabase.from("site_settings").select("key,value,updated_at"),
    supabase.from("admin_users").select("*", { count: "exact", head: true })
  ]);

  return {
    settings: ((settings ?? []) as SettingRow[]).reduce<Map<string, SettingRow>>((map, row) => {
      map.set(row.key, row);
      return map;
    }, new Map()),
    admins: admins ?? 0
  };
}

export async function SettingsHub() {
  const { settings, admins } = await getSettingsData();
  const requiredKeys = [...new Set(settingsModules.flatMap((module) => module.fields.map((field) => field.key)))];
  const completeKeys = requiredKeys.filter((key) => hasSettingValue(settings.get(key)?.value));
  const completion = requiredKeys.length ? Math.round((completeKeys.length / requiredKeys.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="cms-fade-in">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] cms-gradient-text">
              Settings
            </p>
            <h1 className="mt-3 font-display text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.025em]">
              Global Site Controls
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/50">
              Navigation, footer, contact information, social links, site identity, and SEO defaults live here.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard/site_settings" className="cms-btn-primary text-xs">
              <Settings className="h-3.5 w-3.5" />
              Edit settings records
            </Link>
            <Link href="/" target="_blank" rel="noopener noreferrer" className="cms-btn-secondary text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              View public site
            </Link>
          </div>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 cms-fade-in">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] cms-gradient opacity-50" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Configuration health
              </p>
              <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em]">
                {completion}% complete
              </p>
              <p className="mt-2 text-[13px] text-white/45">
                {completeKeys.length} of {requiredKeys.length} core settings are filled.
              </p>
            </div>
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={cn("h-full rounded-full", completion === 100 ? "bg-emerald-400" : "cms-gradient")}
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 cms-fade-in" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">CMS access</p>
            <ShieldCheck className="h-4 w-4 text-[#00A3FF]" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em]">{admins}</p>
          <p className="mt-2 text-[13px] text-white/45">
            Admin {admins === 1 ? "user" : "users"} configured through `admin_users`.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settingsModules.map((card, index) => {
          const missing = card.fields
            .filter((field) => field.required)
            .map((field) => field.key)
            .filter((key) => !hasSettingValue(settings.get(key)?.value));
          const complete = missing.length === 0;

          return (
            <Link
              key={card.title}
              href={`/dashboard/settings/${card.slug}`}
              className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl cms-card p-5 cms-fade-in"
              style={{ animationDelay: `${80 + index * 35}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 transition-colors group-hover:border-[#00A3FF]/30 group-hover:text-[#00A3FF]">
                  <card.Icon className="h-4 w-4" />
                </span>
                <span className={complete ? "cms-status-live text-[10px]" : "cms-status-hidden text-[10px]"}>
                  {complete ? "Ready" : `${missing.length} missing`}
                </span>
              </div>

              <div className="mt-5 flex-1">
                <h2 className="font-display text-xl font-semibold tracking-[-0.015em] text-white/95">
                  {card.title}
                </h2>
                <p className="mt-2 text-[12px] leading-relaxed text-white/42">{card.description}</p>

                <div className="mt-5 space-y-2">
                  {card.fields.map((field) => {
                    const key = field.key;
                    const row = settings.get(key);
                    const filled = hasSettingValue(row?.value);
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                      >
                        <span className="truncate text-[11px] font-medium capitalize text-white/45">{displayKey(key)}</span>
                        <span className={cn("truncate text-right text-[11px]", filled ? "text-white/70" : "text-amber-300")}>
                          {settingPreviewValue(row?.value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <span className="mt-5 inline-flex items-center gap-1.5 border-t border-white/[0.06] pt-4 text-[12px] font-semibold text-[#00A3FF]/75 transition-colors group-hover:text-[#00A3FF]">
                {card.actionLabel}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 cms-fade-in" style={{ animationDelay: "250ms" }}>
        <div className="flex items-center gap-2 text-[13px] text-white/55">
          <KeyRound className="h-4 w-4 text-[#00A3FF]" />
          Values are stored in Supabase `site_settings` as JSON. Public pages use these records immediately, with local fallbacks if a key is missing.
          <CheckCircle2 className="ml-auto hidden h-4 w-4 text-emerald-400 sm:block" />
        </div>
      </section>
    </div>
  );
}
