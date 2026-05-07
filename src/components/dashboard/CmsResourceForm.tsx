"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImageUp, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { CmsFieldConfig, CmsResourceConfig } from "@/lib/cms/admin";
import { cn } from "@/lib/cn";

type Row = Record<string, unknown> & { id?: string };
type FormValue = string | boolean;
type FormState = Record<string, FormValue>;

const imageFieldNames = new Set(["cover_image_url", "thumbnail_url", "og_image_url", "image_url", "icon"]);
const galleryFieldNames = new Set(["gallery_images"]);
const storageBucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "portfolio-media";

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
  if (field.type === "json") return field.name === "process" || field.name === "metadata" ? "{}" : "";
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
    return field.name === "process" || field.name === "metadata" ? {} : "";
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
    "mt-2 w-full rounded-[12px] border bg-white/[0.055] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-accent",
    error ? "border-red-400/60" : "border-white/10",
    "disabled:cursor-not-allowed disabled:opacity-60"
  );
}

function isImageField(field: CmsFieldConfig) {
  return field.type === "text" && imageFieldNames.has(field.name);
}

function isGalleryField(field: CmsFieldConfig) {
  return field.type === "list" && galleryFieldNames.has(field.name);
}

function getPreviewUrls(field: CmsFieldConfig, value: FormValue) {
  if (typeof value !== "string") return [];
  if (isGalleryField(field)) return listValue(value);
  if (isImageField(field) && value.trim()) return [value.trim()];
  return [];
}

function sanitizeFileName(fileName: string) {
  const fallback = "image";
  const safe = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return safe || fallback;
}

function uniqueUploadPath(resourceId: string, fieldName: string, file: File) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
  return `${resourceId}/${fieldName}/${Date.now()}-${id}-${sanitizeFileName(file.name)}`;
}

function ImagePreviews({ field, value }: { field: CmsFieldConfig; value: FormValue }) {
  const urls = getPreviewUrls(field, value);
  if (!urls.length) return null;

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {urls.map((url) => (
        <div key={url} className="overflow-hidden rounded-[14px] border border-white/10 bg-black/20">
          <Image
            src={url}
            alt={`${field.label} preview`}
            width={640}
            height={360}
            unoptimized
            className="aspect-video w-full object-cover"
          />
          <p className="truncate border-t border-white/10 px-3 py-2 text-xs text-white/45">{url}</p>
        </div>
      ))}
    </div>
  );
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
  const [uploadingField, setUploadingField] = useState("");
  const [error, setError] = useState("");
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

  async function uploadFiles(field: CmsFieldConfig, files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setUploadingField(field.name);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          throw new Error("Only image files can be uploaded.");
        }

        const path = uniqueUploadPath(config.id, field.name, file);
        const { error: uploadError } = await supabase.storage.from(storageBucket).upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false
        });

        if (uploadError) {
          throw new Error(`${uploadError.message}. Check that the ${storageBucket} bucket and storage policies exist.`);
        }

        const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }

      setForm((current) => {
        if (isGalleryField(field)) {
          const existing = listValue(current[field.name] ?? "");
          return { ...current, [field.name]: [...existing, ...uploadedUrls].join("\n") };
        }

        return { ...current, [field.name]: uploadedUrls[0] ?? "" };
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image.");
    } finally {
      setUploadingField("");
    }
  }

  async function onSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      for (const field of config.fields) {
        if (field.required && !form[field.name]) {
          throw new Error(`${field.label} is required.`);
        }
      }

      const payload = formToPayload(config.fields, form);
      const slugIsUnique = await checkSlugUnique(payload);
      if (!slugIsUnique) throw new Error("Slug is already in use. Choose a unique slug.");

      const result = initialRow?.id
        ? await supabase.from(config.table).update(payload).eq("id", initialRow.id)
        : await supabase.from(config.table).insert(payload);

      if (result.error) throw new Error(result.error.message);

      router.push(`/dashboard/${config.id}`);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href={`/dashboard/${config.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {config.label}
          </Link>
          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            {isEditing ? "Edit" : "Create"}
          </p>
          <h1 className="mt-3 font-display text-[clamp(36px,5vw,58px)] font-semibold leading-none tracking-[-0.03em]">
            {isEditing ? `Edit ${config.singular}` : `New ${config.singular}`}
          </h1>
          <p className="mt-4 max-w-2xl text-white/58">{config.description}</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-[14px] border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <form onSubmit={onSave} className="mt-8 rounded-[20px] border border-white/10 bg-white/[0.045] p-5 shadow-pop sm:p-7">
        <div className="grid gap-6 lg:grid-cols-2">
          {config.fields.map((field) => {
            const value = form[field.name] ?? blankValue(field);
            const canUpload = isImageField(field) || isGalleryField(field);

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
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-white/72" htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="text-accent"> *</span>}
                    </label>
                    {canUpload && (
                      <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white">
                        <ImageUp className="h-3.5 w-3.5" />
                        {uploadingField === field.name ? "Uploading..." : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          multiple={isGalleryField(field)}
                          className="sr-only"
                          disabled={Boolean(uploadingField)}
                          onChange={(event) => void uploadFiles(field, event.target.files)}
                        />
                      </label>
                    )}
                  </div>
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
                  <ImagePreviews field={field} value={value} />
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
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-white/72" htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-accent"> *</span>}
                  </label>
                  {canUpload && (
                    <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white">
                      <ImageUp className="h-3.5 w-3.5" />
                      {uploadingField === field.name ? "Uploading..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={Boolean(uploadingField)}
                        onChange={(event) => void uploadFiles(field, event.target.files)}
                      />
                    </label>
                  )}
                </div>
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
                <ImagePreviews field={field} value={value} />
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/dashboard/${config.id}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0747A6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
