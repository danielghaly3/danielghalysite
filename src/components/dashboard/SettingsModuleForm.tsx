"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Mail,
  MapPin,
  Navigation,
  Palette,
  Plus,
  Save,
  SearchCheck,
  Trash2
} from "lucide-react";
import { CmsToast } from "@/components/dashboard/CmsToast";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/cn";
import { logCmsMutationError } from "@/lib/cms/debug";
import { syncCmsUpdate } from "@/lib/cms/client-sync";
import { sanitizeCmsPayload } from "@/lib/cms/table-schema";
import {
  hasSettingValue,
  navIconOptions,
  parseNavLinksForEditor,
  settingValueToString,
  type NavLinkEditorItem,
  type SettingRow,
  type SettingsModuleConfig
} from "@/lib/cms/settings-modules";
import type { Json, NavLinkIconKey } from "@/types/cms";

type FormState = Record<string, string | NavLinkEditorItem[]>;
type ClientSettingsModuleConfig = Omit<SettingsModuleConfig, "Icon">;

const moduleIcons = {
  "site-identity": Palette,
  "contact-info": Mail,
  "social-links": Mail,
  navigation: Navigation,
  footer: MapPin,
  "seo-defaults": SearchCheck
};

function buildInitialState(module: ClientSettingsModuleConfig, rows: SettingRow[]) {
  const rowMap = new Map(rows.map((row) => [row.key, row.value]));
  return module.fields.reduce<FormState>((state, field) => {
    const value = rowMap.get(field.key);
    state[field.key] = field.type === "navLinks" ? parseNavLinksForEditor(value) : settingValueToString(value);
    return state;
  }, {});
}

function newNavItem(): NavLinkEditorItem {
  return { iconKey: "home", label: "", href: "", sectionId: "" };
}

function completionFor(module: ClientSettingsModuleConfig, form: FormState) {
  const required = module.fields.filter((field) => field.required);
  if (!required.length) return 100;
  const complete = required.filter((field) => {
    const value = form[field.key];
    if (Array.isArray(value)) {
      return value.length > 0 && value.every((item) => item.iconKey && item.label.trim() && item.href.trim());
    }
    return hasSettingValue(value as Json);
  }).length;
  return Math.round((complete / required.length) * 100);
}

function navItemsToJson(items: NavLinkEditorItem[]): Json {
  return items
    .filter((item) => item.label.trim() && item.href.trim())
    .map((item) => ({
      iconKey: item.iconKey,
      label: item.label.trim(),
      href: item.href.trim(),
      ...(item.sectionId.trim() ? { sectionId: item.sectionId.trim() } : {})
    }));
}

function inputClass() {
  return "mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 disabled:cursor-not-allowed disabled:opacity-60";
}

function settingsUploadFolder(moduleSlug: string, fieldKey: string) {
  if (fieldKey === "default_og_image") return "seo/default-og-image";
  return `settings/${moduleSlug}/${fieldKey.replace(/_/g, "-")}`;
}

export function SettingsModuleForm({
  module,
  rows
}: {
  module: ClientSettingsModuleConfig;
  rows: SettingRow[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<FormState>(() => buildInitialState(module, rows));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const completion = completionFor(module, form);
  const ModuleIcon = moduleIcons[module.slug as keyof typeof moduleIcons] ?? Palette;

  function updateValue(key: string, value: string | NavLinkEditorItem[]) {
    setDirty(true);
    setMessage("");
    setError("");
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateNavItem(fieldKey: string, index: number, patch: Partial<NavLinkEditorItem>) {
    const items = Array.isArray(form[fieldKey]) ? [...form[fieldKey] as NavLinkEditorItem[]] : [];
    items[index] = { ...items[index], ...patch };
    updateValue(fieldKey, items);
  }

  function moveNavItem(fieldKey: string, index: number, direction: -1 | 1) {
    const items = Array.isArray(form[fieldKey]) ? [...form[fieldKey] as NavLinkEditorItem[]] : [];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const [moved] = items.splice(index, 1);
    items.splice(target, 0, moved);
    updateValue(fieldKey, items);
  }

  function removeNavItem(fieldKey: string, index: number) {
    const items = Array.isArray(form[fieldKey]) ? [...form[fieldKey] as NavLinkEditorItem[]] : [];
    updateValue(fieldKey, items.filter((_, itemIndex) => itemIndex !== index));
  }

  function addNavItem(fieldKey: string) {
    const items = Array.isArray(form[fieldKey]) ? [...form[fieldKey] as NavLinkEditorItem[]] : [];
    updateValue(fieldKey, [...items, newNavItem()]);
  }

  async function onSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      for (const field of module.fields) {
        if (!field.required) continue;
        const value = form[field.key];
        if (Array.isArray(value)) {
          if (!value.length || value.some((item) => !item.label.trim() || !item.href.trim())) {
            throw new Error(`${field.label} needs at least one complete item.`);
          }
        } else if (!value.trim()) {
          throw new Error(`${field.label} is required.`);
        }
      }

      const payload = module.fields.map((field) => {
        const value = form[field.key];
        return sanitizeCmsPayload("site_settings", {
          key: field.key,
          value: field.type === "navLinks" ? navItemsToJson(value as NavLinkEditorItem[]) : (value || "")
        });
      });

      const { error: saveError } = await supabase.from("site_settings").upsert(payload, { onConflict: "key" });
      if (saveError) {
        logCmsMutationError({ action: "upsert", table: "site_settings", payload, error: saveError });
        throw new Error(saveError.message);
      }

      setDirty(false);
      setMessage("Saved successfully");
      await syncCmsUpdate(["/", "/projects"]);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? `Failed to save: ${saveError.message}` : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="cms-fade-in">
      <CmsToast message={error || message} tone={error ? "error" : "success"} />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </Link>
          <div className="mt-7 flex items-center gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] cms-gradient-text">{module.eyebrow}</p>
            <span className={completion === 100 ? "cms-status-live text-[10px]" : "cms-status-hidden text-[10px]"}>
              {completion}% complete
            </span>
          </div>
          <h1 className="mt-3 font-display text-[clamp(30px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.025em]">
            {module.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/50">{module.description}</p>
        </div>
        <div className={cn("text-[12px] font-medium", dirty ? "text-amber-300" : "text-white/35")}>
          {dirty ? "Unsaved changes" : "All saved"}
        </div>
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={onSave} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-7">
          <div className="space-y-6">
            {module.fields.map((field) => {
              const value = form[field.key];

              if (field.type === "navLinks") {
                const items = Array.isArray(value) ? value : [];
                return (
                  <div key={field.key}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <label className="text-sm font-medium text-white/72">
                          {field.label}
                          {field.required ? <span className="text-[#00A3FF]"> *</span> : null}
                        </label>
                        {field.helperText ? <p className="mt-1.5 text-xs leading-relaxed text-white/38">{field.helperText}</p> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => addNavItem(field.key)}
                        className="cms-btn-secondary h-9 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add item
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {items.length ? (
                        items.map((item, index) => (
                          <div key={`${item.iconKey}-${index}`} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                            <div className="grid gap-3 lg:grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
                              <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Icon</label>
                                <select
                                  value={item.iconKey}
                                  onChange={(event) => updateNavItem(field.key, index, { iconKey: event.target.value as NavLinkIconKey })}
                                  className={cn(inputClass(), "h-11")}
                                >
                                  {navIconOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-ink">
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Label</label>
                                <input
                                  value={item.label}
                                  onChange={(event) => updateNavItem(field.key, index, { label: event.target.value })}
                                  className={cn(inputClass(), "h-11")}
                                  placeholder="Work"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Link</label>
                                <input
                                  value={item.href}
                                  onChange={(event) => updateNavItem(field.key, index, { href: event.target.value })}
                                  className={cn(inputClass(), "h-11")}
                                  placeholder="/projects"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Section target</label>
                                <input
                                  value={item.sectionId}
                                  onChange={(event) => updateNavItem(field.key, index, { sectionId: event.target.value })}
                                  className={cn(inputClass(), "h-11")}
                                  placeholder="services"
                                />
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveNavItem(field.key, index, -1)}
                                  disabled={index === 0}
                                  aria-label="Move navigation item up"
                                  className="grid h-9 w-9 place-items-center rounded-lg text-white/35 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-25"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveNavItem(field.key, index, 1)}
                                  disabled={index === items.length - 1}
                                  aria-label="Move navigation item down"
                                  className="grid h-9 w-9 place-items-center rounded-lg text-white/35 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-25"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeNavItem(field.key, index)}
                                  aria-label="Delete navigation item"
                                  className="grid h-9 w-9 place-items-center rounded-lg text-white/35 transition-colors hover:bg-red-500/10 hover:text-red-300"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.015] p-6 text-center text-sm text-white/45">
                          No navigation items yet.
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-white/72" htmlFor={field.key}>
                      {field.label}
                      {field.required ? <span className="text-[#00A3FF]"> *</span> : null}
                    </label>
                    <textarea
                      id={field.key}
                      rows={4}
                      required={field.required}
                      value={typeof value === "string" ? value : ""}
                      onChange={(event) => updateValue(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className={cn(inputClass(), "min-h-[120px] py-3")}
                    />
                    {field.helperText ? <p className="mt-1.5 text-xs leading-relaxed text-white/38">{field.helperText}</p> : null}
                  </div>
                );
              }

              if (field.type === "image") {
                return (
                  <ImageUploadField
                    key={field.key}
                    label={field.label}
                    value={typeof value === "string" ? value : ""}
                    onChange={(nextValue) => updateValue(field.key, nextValue)}
                    folder={settingsUploadFolder(module.slug, field.key)}
                    required={field.required}
                    helperText={field.helperText}
                    placeholder={field.placeholder}
                  />
                );
              }

              return (
                <div key={field.key}>
                  <label className="text-sm font-medium text-white/72" htmlFor={field.key}>
                    {field.label}
                    {field.required ? <span className="text-[#00A3FF]"> *</span> : null}
                  </label>
                  <input
                    id={field.key}
                    type={field.type === "url" ? "url" : field.type}
                    required={field.required}
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => updateValue(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className={cn(inputClass(), "h-12")}
                  />
                  {field.helperText ? <p className="mt-1.5 text-xs leading-relaxed text-white/38">{field.helperText}</p> : null}
                </div>
              );
            })}
          </div>

          {(error || message) ? (
            <div
              role={error ? "alert" : "status"}
              aria-live="polite"
              className={cn(
                "mt-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px]",
                error ? "border-red-400/20 bg-red-400/[0.06] text-red-200" : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
              )}
            >
              {!error ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : null}
              {error || message}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/dashboard/settings" className="cms-btn-secondary h-11 text-[13px]">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="cms-btn-primary h-11 text-[13px]">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : `Save ${module.title.toLowerCase()}`}
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Status</p>
            <ModuleIcon className="h-4 w-4 text-[#00A3FF]" />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em]">{completion}%</p>
          <p className="mt-2 text-[13px] text-white/45">{module.completionLabel}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={cn("h-full rounded-full", completion === 100 ? "bg-emerald-400" : "cms-gradient")}
              style={{ width: `${completion}%` }}
            />
          </div>
          <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[12px] leading-relaxed text-white/45">
              These fields save to `site_settings` and update public pages immediately. Raw records remain available for advanced edits.
            </p>
            <Link href="/dashboard/site_settings" className="mt-4 inline-flex text-[12px] font-semibold text-[#00A3FF]/80 hover:text-[#00A3FF]">
              Open raw settings
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
