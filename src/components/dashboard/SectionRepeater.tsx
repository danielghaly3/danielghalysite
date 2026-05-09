"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Save } from "lucide-react";
import { CmsToast } from "@/components/dashboard/CmsToast";
import { RepeaterField } from "@/components/dashboard/RepeaterField";
import { createClient } from "@/utils/supabase/client";
import { logCmsMutationError } from "@/lib/cms/debug";
import { publicPathsForCmsTable, syncCmsUpdate } from "@/lib/cms/client-sync";
import { sanitizeCmsPayload } from "@/lib/cms/table-schema";
import { cn } from "@/lib/cn";
import type { SectionRepeaterConfig } from "@/lib/cms/section-editor";

type Item = Record<string, unknown> & { id?: string };

type SectionRepeaterProps = {
  config: SectionRepeaterConfig;
  initialItems: Item[];
};

function cloneNewItem(item: Record<string, unknown>): Item {
  if (typeof structuredClone === "function") {
    return structuredClone(item) as Item;
  }

  return JSON.parse(JSON.stringify(item)) as Item;
}

function hasRepeaterValue(value: unknown) {
  if (typeof value === "string") return Boolean(value.trim());
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
}

const tableUploadFolders: Record<string, string> = {
  logo_marquee_items: "logos",
  skills: "skills",
  services: "services",
  process_steps: "process",
  gallery_items: "gallery"
};

export function SectionRepeater({ config, initialItems }: SectionRepeaterProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Item[]>(() => initialItems.map((i) => ({ ...i })));
  const [baselineItems, setBaselineItems] = useState<Item[]>(() => initialItems.map((i) => ({ ...i })));
  const baselineIds = useMemo(
    () => new Set(baselineItems.map((i) => (i.id as string) ?? "").filter(Boolean)),
    [baselineItems]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const activeCount = useMemo(() => {
    return items.filter((item) => {
      if (typeof item.active === "boolean") return item.active;
      if (typeof item.published === "boolean") return item.published;
      if (typeof item.status === "string") return item.status === "published";
      return true;
    }).length;
  }, [items]);

  const dirty = useMemo(() => {
    if (items.length !== baselineItems.length) return true;
    return items.some((item, idx) => {
      const initial = baselineItems[idx];
      if (!initial) return true;
      return JSON.stringify(item) !== JSON.stringify(initial);
    });
  }, [items, baselineItems]);

  async function onSave() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      for (const [index, item] of items.entries()) {
        for (const field of config.fields) {
          if (!field.required) continue;
          if (!hasRepeaterValue(item[field.name])) {
            throw new Error(`${field.label} is required for item ${index + 1}.`);
          }
        }
      }

      const currentIds = new Set(items.map((i) => i.id).filter(Boolean) as string[]);
      const toDelete = [...baselineIds].filter((id) => !currentIds.has(id));

      const renumbered = items.map((item, idx) => ({ ...item, order_index: idx * 10 }));

      const toInsert = renumbered
        .filter((item) => !item.id)
        .map(({ id: _id, ...rest }) => {
          void _id;
          return sanitizeCmsPayload(config.table, rest);
        });
      const toUpdate = renumbered.filter((item) => item.id);
      let savedItems: Item[] = renumbered;

      if (toDelete.length) {
        const { error: deleteError } = await supabase.from(config.table).delete().in("id", toDelete);
        if (deleteError) {
          logCmsMutationError({ action: "delete", table: config.table, payload: { ids: toDelete }, error: deleteError });
          throw new Error(deleteError.message);
        }
      }

      if (toInsert.length) {
        const { data: insertedRows, error: insertError } = await supabase.from(config.table).insert(toInsert).select("*");
        if (insertError) {
          logCmsMutationError({ action: "insert", table: config.table, payload: toInsert, error: insertError });
          throw new Error(insertError.message);
        }

        let insertedIndex = 0;
        savedItems = savedItems.map((item) => {
          if (item.id) return item;
          const inserted = (insertedRows?.[insertedIndex] ?? item) as Item;
          insertedIndex += 1;
          return inserted;
        });
      }

      for (const item of toUpdate) {
        const { id, ...rest } = item;
        const payload = sanitizeCmsPayload(config.table, rest);
        const { error: updateError } = await supabase.from(config.table).update(payload).eq("id", id as string);
        if (updateError) {
          logCmsMutationError({ action: "update", table: config.table, payload, error: updateError });
          throw new Error(updateError.message);
        }
      }

      setItems(savedItems);
      setBaselineItems(savedItems);
      setMessage(toDelete.length && !toInsert.length && !toUpdate.length ? "Removed successfully" : "Saved successfully");
      await syncCmsUpdate(publicPathsForCmsTable(config.table));
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? `Failed to save: ${saveError.message}` : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function safeString(item: Item, key?: string): string {
    if (!key) return "";
    const value = item[key];
    return typeof value === "string" ? value : "";
  }

  return (
    <section className="mt-8 rounded-[20px] border border-white/10 bg-white/[0.04] p-5 sm:p-7">
      <CmsToast message={error || message} tone={error ? "error" : "success"} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Section items</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.015em]">{config.label}</h2>
          {config.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">{config.description}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="cms-status-live text-[10px]">{activeCount} live</span>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-white/40">
              {items.length} total
            </span>
          </div>
        </div>
        <Link
          href={config.detailHref}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/10 px-3 text-xs font-semibold text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          Advanced library view
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {(error || message) && (
        <div
          role={error ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "mt-5 rounded-[12px] border px-3 py-2.5 text-sm",
            error
              ? "border-red-400/25 bg-red-400/10 text-red-100"
              : "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
          )}
        >
          {error || message}
        </div>
      )}

      <div className="mt-5">
        <RepeaterField
          label=""
          items={items}
          onChange={(next) => {
            setError("");
            if (next.length < items.length) {
              setMessage("Removed successfully. Save to publish this change.");
            }
            setItems(next as Item[]);
            if (next.length >= items.length) setMessage("");
          }}
          fields={config.fields}
          newItem={() => cloneNewItem(config.newItem)}
          itemTitle={(item) => safeString(item, config.itemTitleField)}
          itemSubtitle={(item) => safeString(item, config.itemSubtitleField)}
          addLabel={config.addLabel}
          emptyState="No items yet."
          uploadFolder={tableUploadFolders[config.table] ?? config.table}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
        <span className={cn("text-xs", dirty ? "text-amber-300" : "text-white/45")}>
          {dirty ? "Unsaved item changes" : "Items live and synced"}
        </span>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0747A6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : `Save ${config.label.toLowerCase()}`}
        </button>
      </div>
    </section>
  );
}
