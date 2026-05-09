"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  ExternalLink,
  ImageIcon,
  Layers,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import { CmsToast } from "@/components/dashboard/CmsToast";
import { createClient } from "@/utils/supabase/client";
import { logCmsMutationError } from "@/lib/cms/debug";
import { publicPathsForCmsTable, syncCmsUpdate } from "@/lib/cms/client-sync";
import type { CmsResourceConfig } from "@/lib/cms/admin";
import { sanitizeCmsPayload } from "@/lib/cms/table-schema";
import { cn } from "@/lib/cn";

type Row = Record<string, unknown> & { id?: string; updated_at?: string };

function renderValue(value: unknown) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return value ? String(value) : "Untitled";
}

function relativeTime(iso: string | undefined): string {
  if (!iso) return "";
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return "";
  if (ms < 60_000) return "just now";
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function statusPill(value: unknown, field: string) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="cms-status-live text-[10px]">
        {field === "active" ? "Active" : field === "published" ? "Published" : field === "featured" ? "Featured" : "On"}
      </span>
    ) : (
      <span className="cms-status-hidden text-[10px]">
        {field === "active" ? "Hidden" : field === "published" ? "Draft" : field === "featured" ? "Not featured" : "Off"}
      </span>
    );
  }
  if (value === "published") {
    return <span className="cms-status-live text-[10px]">Published</span>;
  }
  if (value === "draft") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-amber-300">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Draft
      </span>
    );
  }
  if (value === "archived") {
    return <span className="cms-status-hidden text-[10px]">Archived</span>;
  }
  if (value !== undefined && value !== null && value !== "") {
    return (
      <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-white/45">
        {String(value)}
      </span>
    );
  }
  return null;
}

export function CmsResourceManager({ config, saved }: { config: CmsResourceConfig; saved?: "created" | "updated" }) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadRows() {
    setLoading(true);
    setError("");

    let query = supabase.from(config.table).select("*");

    if (config.orderField) {
      query = query.order(config.orderField, { ascending: true });
    } else if (config.displayField === "key") {
      query = query.order("key", { ascending: true });
    } else {
      query = query.order("updated_at", { ascending: false });
    }

    const { data, error: loadError } = await query;

    if (loadError) {
      setError(loadError.message);
      setRows([]);
    } else {
      setRows((data ?? []) as Row[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table]);

  useEffect(() => {
    if (saved === "created") {
      setMessage("Saved successfully");
    }
    if (saved === "updated") {
      setMessage("Updated successfully");
    }
  }, [config.singular, saved]);

  async function onDelete(row: Row) {
    if (!row.id) return;
    const title = renderValue(row[config.displayField]);
    if (!window.confirm(`Delete ${title}? This cannot be undone.`)) return;

    setError("");
    setMessage("");
    const { error: deleteError } = await supabase.from(config.table).delete().eq("id", row.id);

    if (deleteError) {
      logCmsMutationError({ action: "delete", table: config.table, payload: { id: row.id }, error: deleteError });
      setError(`Failed to update: ${deleteError.message}`);
      return;
    }

    setMessage("Removed successfully");
    await syncCmsUpdate(publicPathsForCmsTable(config.table, row));
    await loadRows();
  }

  async function toggleStatus(row: Row) {
    if (!row.id || !config.statusField) return;
    const current = row[config.statusField];
    if (typeof current !== "boolean") return;
    setBusyId(row.id);
    setError("");
    setMessage("");
    const payload = sanitizeCmsPayload(config.table, { [config.statusField]: !current });
    const { error: updateError } = await supabase
      .from(config.table)
      .update(payload)
      .eq("id", row.id);
    setBusyId(null);
    if (updateError) {
      logCmsMutationError({ action: "update", table: config.table, payload, error: updateError });
      setError(`Failed to update: ${updateError.message}`);
      return;
    }
    setMessage("Updated successfully");
    await syncCmsUpdate(publicPathsForCmsTable(config.table, row));
    await loadRows();
  }

  async function moveRow(index: number, direction: -1 | 1) {
    if (!config.orderField) return;
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const a = rows[index];
    const b = rows[target];
    if (!a.id || !b.id) return;
    setBusyId(a.id);
    setError("");
    setMessage("");
    const aOrder = (a[config.orderField] as number | undefined) ?? index * 10;
    const bOrder = (b[config.orderField] as number | undefined) ?? target * 10;
    const aPayload = sanitizeCmsPayload(config.table, { [config.orderField]: bOrder });
    const bPayload = sanitizeCmsPayload(config.table, { [config.orderField]: aOrder });
    const { error: e1 } = await supabase
      .from(config.table)
      .update(aPayload)
      .eq("id", a.id);
    const { error: e2 } = await supabase
      .from(config.table)
      .update(bPayload)
      .eq("id", b.id);
    setBusyId(null);
    if (e1 || e2) {
      if (e1) logCmsMutationError({ action: "update", table: config.table, payload: aPayload, error: e1 });
      if (e2) logCmsMutationError({ action: "update", table: config.table, payload: bPayload, error: e2 });
      setError(`Failed to update: ${e1?.message || e2?.message || "Reorder failed"}`);
      return;
    }
    setMessage("Updated successfully");
    await syncCmsUpdate(publicPathsForCmsTable(config.table, a));
    await loadRows();
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) => {
      const title = String(row[config.displayField] ?? "").toLowerCase();
      const subtitle = config.subtitleField ? String(row[config.subtitleField] ?? "").toLowerCase() : "";
      const slug = config.slugField ? String(row[config.slugField] ?? "").toLowerCase() : "";
      return title.includes(q) || subtitle.includes(q) || slug.includes(q);
    });
  }, [rows, search, config.displayField, config.subtitleField, config.slugField]);

  // Stats
  const publishedCount = config.statusField
    ? rows.filter((r) => {
        const v = r[config.statusField!];
        return v === true || v === "published";
      }).length
    : rows.length;

  return (
    <section className="cms-fade-in">
      <CmsToast message={error || message} tone={error ? "error" : "success"} />
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] cms-gradient-text">
            {config.id === "site_settings" ? "Settings records" : "Library"}
          </p>
          <h1 className="mt-2 font-display text-[clamp(28px,5vw,44px)] font-semibold leading-[1.1] tracking-[-0.025em]">
            {config.label}
          </h1>
          <p className="mt-2 max-w-xl text-[13px] text-white/45">{config.description}</p>
          <div className="mt-2 flex items-center gap-3 text-[12px] text-white/35">
            <span>{rows.length} total</span>
            {config.statusField && (
              <>
                <span>·</span>
                <span>{publishedCount} active</span>
              </>
            )}
          </div>
        </div>
        <Link
          href={`/dashboard/${config.id}/new`}
          className="cms-btn-primary text-[12px]"
        >
          <Plus className="h-3.5 w-3.5" />
          New {config.singular}
        </Link>
      </div>

      {/* Toast messages */}
      {(error || message) && (
        <div
          role={error ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "mt-5 rounded-xl border px-4 py-3 text-[13px] cms-fade-in",
            error
              ? "border-red-400/20 bg-red-400/[0.06] text-red-200"
              : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
          )}
        >
          {error || message}
        </div>
      )}

      {/* Search */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${config.label.toLowerCase()}...`}
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 text-[13px] text-white placeholder:text-white/30 focus:border-[#00A3FF] focus:outline-none focus:ring-2 focus:ring-[#00A3FF]/20"
          />
        </div>
        <span className="text-[11px] text-white/30">
          {filtered.length} of {rows.length}
        </span>
      </div>

      {/* List */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl cms-shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 && rows.length > 0 ? (
          <div className="p-8 text-center text-[13px] text-white/40">No items match &quot;{search}&quot;.</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <Layers className="h-6 w-6 text-white/25" />
            </div>
            <p className="font-display text-xl font-semibold tracking-[-0.01em]">
              No {config.label.toLowerCase()} yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-[13px] text-white/40">
              Create the first {config.singular}. Public pages keep fallback content until CMS content exists.
            </p>
            <Link
              href={`/dashboard/${config.id}/new`}
              className="cms-btn-primary mt-5 text-[12px]"
            >
              <Plus className="h-3.5 w-3.5" />
              New {config.singular}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filtered.map((row, index) => {
              const id = row.id ?? renderValue(row[config.displayField]);
              const title = renderValue(row[config.displayField]);
              const subtitle = config.subtitleField
                ? String(row[config.subtitleField] ?? "").trim()
                : "";
              const thumb = config.thumbnailField
                ? String(row[config.thumbnailField] ?? "").trim()
                : "";
              const statusValue = config.statusField ? row[config.statusField] : undefined;
              const featuredValue = "featured" in row ? row.featured : undefined;
              const updatedAt = row.updated_at;
              const isBusy = busyId === row.id;
              const showReorder = Boolean(config.orderField) && !search.trim();
              const linkHref = config.slugField && typeof row[config.slugField] === "string"
                ? config.id === "projects"
                  ? `/projects/${row[config.slugField]}`
                  : config.id === "blog_posts"
                    ? `/blog/${row[config.slugField]}`
                    : null
                : null;

              return (
                <div
                  key={String(id)}
                  className={cn(
                    "group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]",
                    isBusy && "opacity-60"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-white/20" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <p className="truncate font-display text-[15px] font-semibold tracking-[-0.005em] text-white/90">
                        {title}
                      </p>
                      {config.slugField && row[config.slugField] ? (
                        <span className="text-[11px] text-white/30">/{String(row[config.slugField])}</span>
                      ) : null}
                    </div>
                    {subtitle ? (
                      <p className="mt-0.5 line-clamp-1 text-[12px] text-white/40">{subtitle}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {config.statusField ? (
                        typeof statusValue === "boolean" ? (
                          <button
                            type="button"
                            onClick={() => void toggleStatus(row)}
                            disabled={isBusy}
                            title={`Toggle ${config.statusField}`}
                            aria-label={`Toggle ${title} ${config.statusField}`}
                            className="inline-flex transition-transform hover:scale-105 disabled:cursor-wait"
                          >
                            {statusPill(statusValue, config.statusField)}
                          </button>
                        ) : (
                          statusPill(statusValue, config.statusField)
                        )
                      ) : null}
                      {typeof featuredValue === "boolean" && featuredValue ? statusPill(true, "featured") : null}
                      {updatedAt ? (
                        <span className="text-[10px] text-white/25">{relativeTime(updatedAt)}</span>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    {showReorder ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void moveRow(index, -1)}
                          disabled={index === 0 || isBusy}
                          aria-label="Move up"
                          className="grid h-8 w-8 place-items-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void moveRow(index, 1)}
                          disabled={index === filtered.length - 1 || isBusy}
                          aria-label="Move down"
                          className="grid h-8 w-8 place-items-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : null}
                    {linkHref ? (
                      <Link
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${config.singular} on site`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                    <Link
                      href={`/dashboard/${config.id}/${row.id}`}
                      className="cms-btn-secondary h-8 text-[11px]"
                    >
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void onDelete(row)}
                      aria-label={`Delete ${title}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
