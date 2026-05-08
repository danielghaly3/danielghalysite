"use client";

import { useState, useCallback, useId } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2
} from "lucide-react";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import { cn } from "@/lib/cn";

export type RepeaterFieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "image" | "number" | "checkbox" | "select" | "list";
  rows?: number;
  options?: { label: string; value: string }[];
  placeholder?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
};

export type RepeaterFieldProps<T extends Record<string, unknown>> = {
  label: string;
  description?: string;
  items: T[];
  onChange: (next: T[]) => void;
  fields: RepeaterFieldConfig[];
  newItem: () => T;
  itemTitle?: (item: T, index: number) => string;
  itemSubtitle?: (item: T, index: number) => string;
  addLabel?: string;
  emptyState?: string;
  reorderable?: boolean;
  uploadFolder?: string;
  className?: string;
};

const inputBase =
  "w-full rounded-[8px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors";

export function RepeaterField<T extends Record<string, unknown>>(props: RepeaterFieldProps<T>) {
  const {
    label,
    description,
    items,
    onChange,
    fields,
    newItem,
    itemTitle,
    itemSubtitle,
    addLabel = "Add item",
    emptyState = "No items yet. Click \"Add item\" to start.",
    reorderable = true,
    uploadFolder = "misc",
    className
  } = props;

  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const baseId = useId();

  const toggle = useCallback((index: number) => {
    setOpenIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const addItem = useCallback(() => {
    const next = [...items, newItem()];
    onChange(next);
    setOpenIndexes(new Set([next.length - 1]));
  }, [items, newItem, onChange]);

  const removeItem = useCallback(
    (index: number) => {
      if (typeof window !== "undefined" && !window.confirm("Delete this item?")) return;
      const next = items.filter((_, i) => i !== index);
      onChange(next);
      setOpenIndexes((current) => {
        const updated = new Set<number>();
        current.forEach((i) => {
          if (i < index) updated.add(i);
          else if (i > index) updated.add(i - 1);
        });
        return updated;
      });
    },
    [items, onChange]
  );

  const moveItem = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= items.length) return;
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onChange(next);
      setOpenIndexes((current) => {
        const updated = new Set<number>();
        current.forEach((i) => {
          if (i === from) updated.add(to);
          else if (from < to && i > from && i <= to) updated.add(i - 1);
          else if (from > to && i >= to && i < from) updated.add(i + 1);
          else updated.add(i);
        });
        return updated;
      });
    },
    [items, onChange]
  );

  const updateField = useCallback(
    (index: number, name: string, value: unknown) => {
      const next = [...items];
      next[index] = { ...next[index], [name]: value } as T;
      onChange(next);
    },
    [items, onChange]
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{label}</p>
          {description ? <p className="mt-1 text-xs leading-relaxed text-white/55">{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 text-xs font-semibold text-white transition-colors hover:bg-[#0747A6]"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-white/10 bg-white/[0.015] p-6 text-center text-sm text-white/55">
          {emptyState}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => {
            const isOpen = openIndexes.has(index);
            const title = itemTitle ? itemTitle(item, index) : `Item ${index + 1}`;
            const subtitle = itemSubtitle ? itemSubtitle(item, index) : undefined;
            const panelId = `${baseId}-item-${index}`;

            return (
              <li
                key={index}
                className={cn(
                  "rounded-[12px] border bg-white/[0.03] transition-colors",
                  isOpen ? "border-white/15 bg-white/[0.05]" : "border-white/10"
                )}
              >
                <div className="flex items-center gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex flex-1 items-center gap-3 rounded-[8px] py-1 pr-2 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/[0.06] text-white/65">
                      {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white/90">
                        {title?.trim() ? title : "(untitled)"}
                      </span>
                      {subtitle ? (
                        <span className="block truncate text-xs text-white/50">{subtitle}</span>
                      ) : null}
                    </span>
                  </button>
                  {reorderable ? (
                    <>
                      <button
                        type="button"
                        onClick={() => moveItem(index, index - 1)}
                        disabled={index === 0}
                        aria-label="Move up"
                        className="grid h-7 w-7 place-items-center rounded-md text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/45"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, index + 1)}
                        disabled={index === items.length - 1}
                        aria-label="Move down"
                        className="grid h-7 w-7 place-items-center rounded-md text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/45"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label={`Delete ${title?.trim() ? title : `item ${index + 1}`}`}
                    className="grid h-7 w-7 place-items-center rounded-md text-white/45 transition-colors hover:bg-red-500/15 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {isOpen ? (
                  <div id={panelId} className="border-t border-white/[0.07] p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {fields.map((field) => {
                        const value = item[field.name];
                        const fieldId = `${baseId}-${index}-${field.name}`;
                        const containerClass =
                          field.fullWidth || field.type === "textarea" || field.type === "image"
                            ? "sm:col-span-2"
                            : "";

                        return (
                          <div key={field.name} className={cn("flex flex-col gap-1.5", containerClass)}>
                            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55" htmlFor={fieldId}>
                              {field.label}
                              {field.required ? <span className="text-accent"> *</span> : null}
                            </label>

                            {field.type === "textarea" ? (
                              <textarea
                                id={fieldId}
                                rows={field.rows ?? 3}
                                required={field.required}
                                value={typeof value === "string" ? value : ""}
                                placeholder={field.placeholder}
                                onChange={(e) => updateField(index, field.name, e.target.value)}
                                className={cn(inputBase, "leading-relaxed")}
                              />
                            ) : field.type === "checkbox" ? (
                              <label className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/85">
                                <input
                                  id={fieldId}
                                  type="checkbox"
                                  checked={Boolean(value)}
                                  onChange={(e) => updateField(index, field.name, e.target.checked)}
                                  className="h-4 w-4 accent-accent"
                                />
                                <span>{field.placeholder ?? "Active"}</span>
                              </label>
                            ) : field.type === "select" ? (
                              <select
                                id={fieldId}
                                value={typeof value === "string" ? value : ""}
                                required={field.required}
                                onChange={(e) => updateField(index, field.name, e.target.value)}
                                className={inputBase}
                              >
                                {field.options?.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === "number" ? (
                              <input
                                id={fieldId}
                                type="number"
                                required={field.required}
                                value={
                                  typeof value === "number"
                                    ? value
                                    : typeof value === "string" && value !== ""
                                      ? Number(value)
                                      : ""
                                }
                                onChange={(e) =>
                                  updateField(
                                    index,
                                    field.name,
                                    e.target.value === "" ? null : Number(e.target.value)
                                  )
                                }
                                className={inputBase}
                              />
                            ) : field.type === "list" ? (
                              <textarea
                                id={fieldId}
                                rows={field.rows ?? 3}
                                required={field.required}
                                value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
                                placeholder={field.placeholder ?? "One per line"}
                                onChange={(e) =>
                                  updateField(
                                    index,
                                    field.name,
                                    e.target.value.split(/\n+/).map((s) => s.trim()).filter(Boolean)
                                  )
                                }
                                className={cn(inputBase, "leading-relaxed")}
                              />
                            ) : field.type === "image" ? (
                              <ImageUploadField
                                label={field.label}
                                value={typeof value === "string" ? value : ""}
                                onChange={(nextValue) => updateField(index, field.name, nextValue)}
                                folder={`${uploadFolder}/${index + 1}/${field.name}`}
                                placeholder={field.placeholder ?? "/path/to/image.png"}
                                helperText={field.helperText}
                                required={field.required}
                                hideLabel
                              />
                            ) : (
                              <input
                                id={fieldId}
                                type="text"
                                required={field.required}
                                value={typeof value === "string" ? value : ""}
                                placeholder={field.placeholder}
                                onChange={(e) => updateField(index, field.name, e.target.value)}
                                className={inputBase}
                              />
                            )}

                            {field.helperText && field.type !== "image" ? (
                              <p className="text-[11px] text-white/40">{field.helperText}</p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
