"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { CmsToast } from "@/components/dashboard/CmsToast";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { createClient } from "@/utils/supabase/client";
import { logCmsMutationError } from "@/lib/cms/debug";
import { publicPathsForCmsTable, syncCmsUpdate } from "@/lib/cms/client-sync";
import type { CmsFieldConfig, CmsResourceConfig } from "@/lib/cms/admin";
import { sanitizeCmsPayload } from "@/lib/cms/table-schema";
import { cn } from "@/lib/cn";

type Row = Record<string, unknown> & { id?: string };
type FormValue = string | boolean;
type FormState = Record<string, FormValue>;

const imageFieldNames = new Set(["cover_image_url", "thumbnail_url", "og_image_url", "image_url", "icon"]);
const galleryFieldNames = new Set(["gallery_images"]);
const resourceUploadFolders: Record<string, string> = {
  projects: "projects",
  blog_posts: "blog",
  services: "services",
  skills: "skills",
  page_sections: "sections",
  process_steps: "process",
  gallery_items: "gallery",
  logo_marquee_items: "logos",
  about_content: "about"
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blankValue(field: CmsFieldConfig): FormValue {
  if (field.type === "checkbox") return field.name === "active";
  if (field.type === "json") return field.name === "process" || field.name === "metadata" || field.name === "content" ? "{}" : "";
  return "";
}

function rowToForm(fields: CmsFieldConfig[], row?: Row | null): FormState {
  return fields.reduce<FormState>((form, field) => {
    const value = row?.[field.name];

    if (field.type === "checkbox") {
      form[field.name] = typeof value === "boolean" ? value : field.name === "active";
      return form;
    }

    if (field.type === "list") {
      form[field.name] = Array.isArray(value) ? value.join("\n") : "";
      return form;
    }

    if (field.type === "json") {
      if (value === undefined || value === null) {
        form[field.name] = blankValue(field);
      } else if (typeof value === "string") {
        form[field.name] = value;
      } else {
        form[field.name] = JSON.stringify(value, null, 2);
      }
      return form;
    }

    form[field.name] = value === undefined || value === null ? "" : String(value);
    return form;
  }, {});
}

function listValue(value: FormValue) {
  if (typeof value !== "string") return [];
  return value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJsonValue(field: CmsFieldConfig, value: FormValue) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();

  if (!trimmed) {
    return field.name === "process" || field.name === "metadata" || field.name === "content" ? {} : "";
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    if (field.name === "value") return trimmed;
    throw new Error(`${field.label} must be valid JSON.`);
  }
}

function formToPayload(fields: CmsFieldConfig[], form: FormState) {
  return fields.reduce<Record<string, unknown>>((payload, field) => {
    const value = form[field.name];

    if (field.type === "checkbox") {
      payload[field.name] = Boolean(value);
      return payload;
    }

    if (field.type === "number") {
      payload[field.name] = value === "" ? null : Number(value);
      return payload;
    }

    if (field.type === "list") {
      payload[field.name] = listValue(value);
      return payload;
    }

    if (field.type === "json") {
      payload[field.name] = parseJsonValue(field, value);
      return payload;
    }

    payload[field.name] = typeof value === "string" && value.trim() === "" ? null : value;
    return payload;
  }, {});
}

function inputClasses(error?: boolean) {
  return cn(
    "mt-2 w-full rounded-xl border bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20",
    error ? "border-red-400/60" : "border-white/[0.08]",
    "disabled:cursor-not-allowed disabled:opacity-60"
  );
}

function isImageField(field: CmsFieldConfig) {
  return field.type === "text" && imageFieldNames.has(field.name);
}

function isGalleryField(field: CmsFieldConfig) {
  return field.type === "list" && galleryFieldNames.has(field.name);
}

function fieldFolderName(name: string) {
  return name.replace(/_/g, "-").replace(/-url$/, "");
}

type CmsResourceFormProps = {
  config: CmsResourceConfig;
  initialRow?: Row | null;
};

export function CmsResourceForm({ config, initialRow = null }: CmsResourceFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<FormState>(() => rowToForm(config.fields, initialRow));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const isEditing = Boolean(initialRow?.id);

  function updateField(field: CmsFieldConfig, value: FormValue) {
    setForm((current) => {
      const next = { ...current, [field.name]: value };

      if (
        config.slugField &&
        config.slugSourceField === field.name &&
        typeof value === "string" &&
        !isEditing &&
        !String(current[config.slugField] ?? "").trim()
      ) {
        next[config.slugField] = slugify(value);
      }

      return next;
    });
  }

  function uploadFolderForField(field: CmsFieldConfig) {
    const base = resourceUploadFolders[config.id] ?? config.id;
    const sourceKey = config.slugField ?? config.displayField;
    const sourceValue = form[sourceKey];
    const recordSegment =
      typeof sourceValue === "string" && sourceValue.trim()
        ? slugify(sourceValue)
        : typeof initialRow?.id === "string"
          ? initialRow.id
          : "new";

    return `${base}/${recordSegment || "new"}/${fieldFolderName(field.name)}`;
  }

  async function checkSlugUnique(payload: Record<string, unknown>) {
    if (!config.slugField) return true;
    const slug = payload[config.slugField];
    if (!slug) return true;

    let query = supabase.from(config.table).select("id").eq(config.slugField, slug).limit(1);
    if (initialRow?.id) query = query.neq("id", initialRow.id);

    const { data, error: slugError } = await query;
    if (slugError) throw new Error(slugError.message);
    return !data?.length;
  }

  async function onSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      for (const field of config.fields) {
        if (field.required && !form[field.name]) {
          throw new Error(`${field.label} is required.`);
        }
      }

      const payload = sanitizeCmsPayload(config.table, formToPayload(config.fields, form));
      const slugIsUnique = await checkSlugUnique(payload);
      if (!slugIsUnique) throw new Error("Slug is already in use. Choose a unique slug.");

      const result = initialRow?.id
        ? await supabase.from(config.table).update(payload).eq("id", initialRow.id)
        : await supabase.from(config.table).insert(payload);

      if (result.error) {
        logCmsMutationError({ action: isEditing ? "update" : "insert", table: config.table, payload, error: result.error });
        throw new Error(result.error.message);
      }

      setMessage(isEditing ? "Updated successfully" : "Saved successfully");
      await syncCmsUpdate(publicPathsForCmsTable(config.table, payload));
      router.push(`/dashboard/${config.id}?saved=${isEditing ? "updated" : "created"}`);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href={`/dashboard/${config.id}`}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {config.label}
          </Link>
          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] cms-gradient-text">
            {isEditing ? "Edit" : "Create"}
          </p>
          <h1 className="mt-3 font-display text-[clamp(28px,5vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em]">
            {isEditing ? `Edit ${config.singular}` : `New ${config.singular}`}
          </h1>
          <p className="mt-3 max-w-2xl text-[13px] text-white/45">{config.description}</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-[13px] text-red-200 cms-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={onSave} className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-pop sm:p-7">
        <div className="grid gap-6 lg:grid-cols-2">
          {config.fields.map((field) => {
            const value = form[field.name] ?? blankValue(field);
            const canUpload = isImageField(field) || isGalleryField(field);

            if (canUpload) {
              return (
                <ImageUploadField
                  key={field.name}
                  label={field.label}
                  value={typeof value === "string" ? value : ""}
                  onChange={(nextValue) => updateField(field, nextValue)}
                  folder={uploadFolderForField(field)}
                  mode={isGalleryField(field) ? "list" : "single"}
                  required={field.required}
                  helperText={field.help}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 4}
                  className={isGalleryField(field) ? "lg:col-span-2" : undefined}
                />
              );
            }

            if (field.type === "checkbox") {
              return (
                <label
                  key={field.name}
                  className="flex items-center justify-between gap-4 rounded-[12px] border border-white/10 bg-white/[0.035] px-4 py-3"
                >
                  <span className="text-sm font-medium text-white/72">{field.label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => updateField(field, event.target.checked)}
                    className="h-5 w-5 rounded border-white/20 accent-accent"
                  />
                </label>
              );
            }

            if (field.type === "textarea" || field.type === "list" || field.type === "json") {
              return (
                <div key={field.name} className={field.rows && field.rows >= 8 ? "lg:col-span-2" : undefined}>
                  <label className="text-sm font-medium text-white/72" htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-accent"> *</span>}
                  </label>
                  <textarea
                    id={field.name}
                    required={field.required}
                    rows={field.rows ?? (field.type === "list" ? 4 : 5)}
                    value={String(value)}
                    onChange={(event) => updateField(field, event.target.value)}
                    className={cn(inputClasses(), "min-h-[120px] py-3")}
                    placeholder={field.placeholder}
                  />
                  {field.help && <p className="mt-1.5 text-xs leading-relaxed text-white/38">{field.help}</p>}
                </div>
              );
            }

            if (field.type === "select") {
              return (
                <div key={field.name}>
                  <label className="text-sm font-medium text-white/72" htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-accent"> *</span>}
                  </label>
                  <select
                    id={field.name}
                    required={field.required}
                    value={String(value)}
                    onChange={(event) => updateField(field, event.target.value)}
                    className={cn(inputClasses(), "h-12")}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value} className="bg-ink">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={field.name}>
                <label className="text-sm font-medium text-white/72" htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-accent"> *</span>}
                </label>
                <input
                  id={field.name}
                  type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                  required={field.required}
                  value={String(value)}
                  onChange={(event) => updateField(field, event.target.value)}
                  className={cn(inputClasses(), "h-12")}
                  placeholder={field.placeholder}
                />
                {field.help && <p className="mt-1.5 text-xs leading-relaxed text-white/38">{field.help}</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/dashboard/${config.id}`}
            className="cms-btn-secondary h-11 text-[13px]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="cms-btn-primary h-11 text-[13px]"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
