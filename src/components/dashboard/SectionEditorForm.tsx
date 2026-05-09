"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, Save } from "lucide-react";
import { CmsToast } from "@/components/dashboard/CmsToast";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { createClient } from "@/utils/supabase/client";
import { SectionRepeater } from "@/components/dashboard/SectionRepeater";
import { logCmsMutationError } from "@/lib/cms/debug";
import type { SectionEditorField, SectionEditorPage, SectionEditorSchema } from "@/lib/cms/section-editor";
import { publicPathsForCmsTable, syncCmsUpdate } from "@/lib/cms/client-sync";
import { sanitizeCmsPayload } from "@/lib/cms/table-schema";
import type { Json } from "@/types/cms";
import { cn } from "@/lib/cn";

type SectionRow = Record<string, unknown> & {
  id?: string;
  page?: string;
  section_key?: string;
  metadata?: Json;
};

type FieldValue = string | boolean;
type FormState = Record<string, FieldValue>;
type MetadataState = Record<string, Json | undefined>;

const imageFieldNames = new Set(["image_url", "ogImage", "twitterImage"]);

function blankValue(field: SectionEditorField): FieldValue {
  if (field.type === "checkbox") return field.name === "active";
  return "";
}

function isMetadataRecord(value: unknown): value is MetadataState {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function fieldKey(field: SectionEditorField) {
  return `${field.source}:${field.name}`;
}

function fieldValue(field: SectionEditorField, row?: SectionRow | null): FieldValue {
  const metadata = isMetadataRecord(row?.metadata) ? row.metadata : {};
  const value = field.source === "metadata" ? metadata[field.name] : row?.[field.name];

  if (field.type === "checkbox") {
    return typeof value === "boolean" ? value : field.name === "active";
  }

  return value === undefined || value === null ? "" : String(value);
}

function fieldsToForm(fields: SectionEditorField[], row?: SectionRow | null) {
  return fields.reduce<FormState>((form, field) => {
    form[fieldKey(field)] = fieldValue(field, row);
    return form;
  }, {});
}

function formMetadata(fields: SectionEditorField[], row?: SectionRow | null) {
  const existing = isMetadataRecord(row?.metadata) ? { ...row.metadata } : {};
  for (const field of fields) {
    if (field.source === "metadata" && existing[field.name] === undefined) {
      existing[field.name] = "";
    }
  }
  return existing;
}

function inputClasses() {
  return "mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 disabled:cursor-not-allowed disabled:opacity-60";
}

function isImageField(field: SectionEditorField) {
  return field.type === "text" && imageFieldNames.has(field.name);
}

function imageFieldFolder(page: SectionEditorPage, sectionKey: string, fieldName: string) {
  const fieldFolder = fieldName === "image_url" ? "image" : fieldName.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

  if (fieldName === "ogImage" || fieldName === "twitterImage") {
    return `seo/${page}-${sectionKey}/${fieldFolder}`;
  }

  if (page === "home" && sectionKey === "hero") return `hero/${fieldFolder}`;
  if (page === "home" && sectionKey === "about") return `about/${fieldFolder}`;
  if (page === "projects") return `projects/${sectionKey}/${fieldFolder}`;

  return `misc/${page}-${sectionKey}/${fieldFolder}`;
}

export function SectionEditorForm({
  page,
  schema,
  initialRow,
  repeaterItems
}: {
  page: SectionEditorPage;
  schema: SectionEditorSchema;
  initialRow?: SectionRow | null;
  repeaterItems?: (Record<string, unknown> & { id?: string })[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<FormState>(() => fieldsToForm(schema.fields, initialRow));
  const [metadata, setMetadata] = useState<MetadataState>(() => formMetadata(schema.fields, initialRow));
  const [recordId, setRecordId] = useState(initialRow?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isActive = form["column:active"] !== false;

  function updateField(field: SectionEditorField, value: FieldValue) {
    setDirty(true);
    setMessage("");
    setForm((current) => ({ ...current, [fieldKey(field)]: value }));
    if (field.source === "metadata") {
      setMetadata((current) => ({ ...current, [field.name]: value }));
    }
  }

  function payloadFromForm() {
    const payload: Record<string, unknown> = {
      page,
      section_key: schema.sectionKey,
      metadata
    };

    for (const field of schema.fields) {
      if (field.source !== "column") continue;
      const value = form[fieldKey(field)];

      if (field.type === "checkbox") {
        payload[field.name] = Boolean(value);
      } else if (field.name === "order_index") {
        payload[field.name] = value === "" ? 0 : Number(value);
      } else {
        payload[field.name] = typeof value === "string" && value.trim() === "" ? null : value;
      }
    }

    return sanitizeCmsPayload("page_sections", payload);
  }

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      for (const field of schema.fields) {
        if (field.required && !form[fieldKey(field)]) {
          throw new Error(`${field.label} is required.`);
        }
      }

      const payload = payloadFromForm();
      const isUpdate = Boolean(recordId);
      const result = isUpdate
        ? await supabase.from("page_sections").update(payload).eq("id", recordId)
        : await supabase.from("page_sections").insert(payload).select("id").single();

      if (result.error) {
        logCmsMutationError({ action: isUpdate ? "update" : "insert", table: "page_sections", payload, error: result.error });
        throw new Error(result.error.message);
      }

      if (!isUpdate && result.data && "id" in result.data && typeof result.data.id === "string") {
        setRecordId(result.data.id);
      }

      setDirty(false);
      setMessage(isUpdate ? "Updated successfully" : "Saved successfully");
      await syncCmsUpdate(publicPathsForCmsTable("page_sections", payload));
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? `Failed to save: ${saveError.message}` : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <CmsToast message={error || message} tone={error ? "error" : "success"} />
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between cms-fade-in">
        <div>
          <Link
            href={`/dashboard/pages/${page}`}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {page === "home" ? "Home Page" : "Projects Page"}
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] cms-gradient-text">Section editor</p>
            <span className={isActive ? "cms-status-live text-[10px]" : "cms-status-hidden text-[10px]"}>
              {isActive ? "Live" : "Hidden"}
            </span>
          </div>
          <h1 className="mt-3 font-display text-[clamp(28px,5vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em]">
            {schema.title}
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-white/45">{schema.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {schema.publicAnchor && (
            <Link
              href={schema.publicAnchor}
              target="_blank"
              rel="noopener noreferrer"
              className="cms-btn-secondary h-9 text-[12px]"
            >
              <ExternalLink className="h-3 w-3" />
              Preview on site
            </Link>
          )}
          <div className={cn(
            "text-[12px] font-medium",
            dirty ? "text-amber-400" : "text-white/30"
          )}>
            {dirty ? "Unsaved changes" : "All saved"}
          </div>
        </div>
      </div>

      {/* Toast messages */}
      {(error || message) && (
        <div
          role={error ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "mt-6 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[13px] cms-fade-in",
            error ? "border-red-400/20 bg-red-400/[0.06] text-red-200" : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
          )}
        >
          {!error && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
          {error || message}
        </div>
      )}

      {/* Section fields form */}
      <form onSubmit={onSave} className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-7 cms-fade-in" style={{ animationDelay: "60ms" }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">Section content</p>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          {schema.fields.map((field) => {
            const key = fieldKey(field);
            const value = form[key] ?? blankValue(field);
            const canUpload = isImageField(field);

            if (canUpload) {
              return (
                <ImageUploadField
                  key={key}
                  label={field.label}
                  value={typeof value === "string" ? value : ""}
                  onChange={(nextValue) => updateField(field, nextValue)}
                  folder={imageFieldFolder(page, schema.sectionKey, field.name)}
                  required={field.required}
                  helperText={field.help}
                />
              );
            }

            if (field.type === "checkbox") {
              return (
                <label
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <span className="text-[13px] font-medium text-white/65">{field.label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => updateField(field, event.target.checked)}
                    className="h-5 w-5 rounded border-white/20 accent-[#00A3FF]"
                  />
                </label>
              );
            }

            if (field.type === "textarea") {
              return (
                <div key={key} className={field.rows && field.rows >= 5 ? "lg:col-span-2" : undefined}>
                  <label className="text-[13px] font-medium text-white/65" htmlFor={key}>
                    {field.label}
                    {field.required && <span className="text-[#00A3FF]"> *</span>}
                  </label>
                  <textarea
                    id={key}
                    rows={field.rows ?? 4}
                    required={field.required}
                    value={String(value)}
                    onChange={(event) => updateField(field, event.target.value)}
                    className={cn(inputClasses(), "min-h-[120px] py-3")}
                  />
                  {field.help && <p className="mt-1.5 text-[11px] leading-relaxed text-white/30">{field.help}</p>}
                </div>
              );
            }

            return (
              <div key={key}>
                <label className="text-[13px] font-medium text-white/65" htmlFor={key}>
                  {field.label}
                  {field.required && <span className="text-[#00A3FF]"> *</span>}
                </label>
                <input
                  id={key}
                  type="text"
                  required={field.required}
                  value={String(value)}
                  onChange={(event) => updateField(field, event.target.value)}
                  className={cn(inputClasses(), "h-12")}
                />
                {field.help && <p className="mt-1.5 text-[11px] leading-relaxed text-white/30">{field.help}</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/dashboard/pages/${page}`}
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
            {saving ? "Saving..." : "Save section"}
          </button>
        </div>
      </form>

      {/* Inline repeater */}
      {schema.repeater ? (
        <SectionRepeater config={schema.repeater} initialItems={repeaterItems ?? []} />
      ) : null}

      {/* Related resources */}
      {schema.relatedResources?.length ? (
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 cms-fade-in" style={{ animationDelay: "120ms" }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] cms-gradient-text">
            {schema.repeater ? "Related" : "Linked content"}
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.015em]">
            {schema.repeater ? "Other places this content lives" : "Related editable lists"}
          </h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {schema.relatedResources.map((resource) => (
              <div
                key={resource.href}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <span className="text-[13px] font-semibold text-white/85">{resource.label}</span>
                <span className="mt-1.5 block text-[12px] leading-relaxed text-white/40">{resource.description}</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={resource.href}
                    className="cms-btn-secondary h-8 text-[11px]"
                  >
                    Open
                  </Link>
                  {resource.canCreate === false ? null : (
                    <Link
                      href={resource.createHref ?? `${resource.href}/new`}
                      className="cms-btn-secondary h-8 text-[11px]"
                    >
                      Add item
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
