"use client";

/* eslint-disable @next/next/no-img-element */

import { useId, useMemo, useRef, useState } from "react";
import { CheckCircle2, ImageUp, Loader2, Trash2, XCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/cn";

type ImageUploadMode = "single" | "list";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  bucket?: string;
  mode?: ImageUploadMode;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  hideLabel?: boolean;
  className?: string;
};

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "portfolio-media";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_SIZE_LABEL = "10MB";
const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml"
]);
const ACCEPTED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg"]);
const ACCEPT_ATTRIBUTE = ".jpg,.jpeg,.png,.webp,.gif,.svg,image/jpeg,image/png,image/webp,image/gif,image/svg+xml";

const inputBase =
  "mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 disabled:cursor-not-allowed disabled:opacity-60";

function splitImageUrls(value: string) {
  return value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function extensionFor(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function sanitizePathSegment(value: string) {
  const safe = value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9-_/]+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^-+|-+$/g, "")
    .replace(/^\/+|\/+$/g, "");

  return safe || "misc";
}

function sanitizeFileName(fileName: string) {
  const safe = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return safe || "image";
}

function uniqueUploadPath(folder: string, file: File) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
  return `${sanitizePathSegment(folder)}/${Date.now()}-${id}-${sanitizeFileName(file.name)}`;
}

function validateImage(file: File) {
  const extension = extensionFor(file.name);
  const hasAllowedType = ACCEPTED_MIME_TYPES.has(file.type);
  const hasAllowedExtension = ACCEPTED_EXTENSIONS.has(extension);

  if (!file.size) {
    throw new Error("Choose a non-empty image file.");
  }

  if (!hasAllowedType && !hasAllowedExtension) {
    throw new Error("Unsupported image type. Use JPG, PNG, WebP, GIF, or SVG.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Image is too large. Upload files under ${MAX_FILE_SIZE_LABEL}.`);
  }
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  bucket = DEFAULT_BUCKET,
  mode = "single",
  required,
  helperText,
  placeholder,
  rows,
  disabled,
  hideLabel,
  className
}: ImageUploadFieldProps) {
  const supabase = useMemo(() => createClient(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = useId();
  const valueInputId = `${fieldId}-value`;
  const fileInputId = `${fieldId}-file`;
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const urls = mode === "list" ? splitImageUrls(value) : value.trim() ? [value.trim()] : [];

  async function uploadFiles(files: FileList | null) {
    const selectedFiles = Array.from(files ?? []);
    if (!selectedFiles.length) {
      setError("Choose an image file to upload.");
      return;
    }

    setUploading(true);
    setStatus("");
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        validateImage(file);
        const path = uniqueUploadPath(folder, file);
        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
          cacheControl: "3600",
          contentType: file.type || undefined,
          upsert: false
        });

        if (uploadError) {
          throw new Error(`${uploadError.message}. Check that the ${bucket} bucket and storage policies exist.`);
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }

      if (mode === "list") {
        onChange([...splitImageUrls(value), ...uploadedUrls].join("\n"));
      } else {
        onChange(uploadedUrls[0] ?? "");
      }

      setStatus(`${uploadedUrls.length} image${uploadedUrls.length === 1 ? "" : "s"} uploaded. Save to publish this field.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clearImages() {
    onChange("");
    setStatus("Image field cleared. Save to publish this change.");
    setError("");
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        {hideLabel ? null : (
          <label className="text-sm font-medium text-white/72" htmlFor={valueInputId}>
            {label}
            {required ? <span className="text-[#00A3FF]"> *</span> : null}
          </label>
        )}
        <div className="ml-auto flex items-center gap-2">
          {urls.length ? (
            <button
              type="button"
              onClick={clearImages}
              disabled={disabled || uploading}
              aria-label={`Clear ${label}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 text-[11px] font-semibold text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          ) : null}
          <label
            htmlFor={fileInputId}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] px-2.5 text-[11px] font-semibold text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white",
              (disabled || uploading) && "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-white/60"
            )}
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageUp className="h-3 w-3" />}
            {uploading ? "Uploading..." : mode === "list" ? "Upload images" : "Upload image"}
            <input
              id={fileInputId}
              ref={inputRef}
              type="file"
              accept={ACCEPT_ATTRIBUTE}
              multiple={mode === "list"}
              className="sr-only"
              disabled={disabled || uploading}
              onChange={(event) => void uploadFiles(event.target.files)}
            />
          </label>
        </div>
      </div>

      {mode === "list" ? (
        <textarea
          id={valueInputId}
          rows={rows ?? 4}
          required={required}
          value={value}
          placeholder={placeholder ?? "One image URL or path per line"}
          disabled={disabled}
          onChange={(event) => {
            setStatus("");
            setError("");
            onChange(event.target.value);
          }}
          className={cn(inputBase, "min-h-[120px] py-3 leading-relaxed")}
        />
      ) : (
        <input
          id={valueInputId}
          type="text"
          required={required}
          value={value}
          placeholder={placeholder ?? "/images/example.webp or https://..."}
          disabled={disabled}
          onChange={(event) => {
            setStatus("");
            setError("");
            onChange(event.target.value);
          }}
          className={cn(inputBase, "h-12")}
        />
      )}

      {helperText ? <p className="mt-1.5 text-xs leading-relaxed text-white/38">{helperText}</p> : null}

      {status || error ? (
        <div
          role={error ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-[12px]",
            error ? "border-red-400/20 bg-red-400/[0.06] text-red-200" : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
          )}
        >
          {error ? <XCircle className="h-3.5 w-3.5 shrink-0" /> : <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
          {error || status}
        </div>
      ) : null}

      {urls.length ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {urls.map((url, index) => (
            <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
              <img
                src={url}
                alt={`${label} preview ${index + 1}`}
                className="aspect-video w-full bg-white/[0.03] object-cover"
                loading="lazy"
              />
              <p className="truncate border-t border-white/[0.06] px-3 py-2 text-xs text-white/35">{url}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015] px-4 py-5 text-center text-xs text-white/35">
          No image selected.
        </div>
      )}
    </div>
  );
}
