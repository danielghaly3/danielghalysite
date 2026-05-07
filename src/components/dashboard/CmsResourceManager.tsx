"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { CmsResourceConfig } from "@/lib/cms/admin";
import { cn } from "@/lib/cn";

type Row = Record<string, unknown> & { id?: string };

function renderValue(value: unknown) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return value ? String(value) : "Untitled";
}

export function CmsResourceManager({ config }: { config: CmsResourceConfig }) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  async function onDelete(row: Row) {
    if (!row.id) return;
    const title = renderValue(row[config.displayField]);
    if (!window.confirm(`Delete ${title}? This cannot be undone.`)) return;

    setError("");
    setMessage("");
    const { error: deleteError } = await supabase.from(config.table).delete().eq("id", row.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} deleted.`);
    await loadRows();
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Manage</p>
          <h1 className="mt-3 font-display text-[clamp(36px,5vw,58px)] font-semibold leading-none tracking-[-0.03em]">
            {config.label}
          </h1>
          <p className="mt-4 max-w-2xl text-white/58">{config.description}</p>
        </div>
        <Link
          href={`/dashboard/${config.id}/new`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0747A6]"
        >
          <Plus className="h-4 w-4" />
          New {config.singular}
        </Link>
      </div>

      {(error || message) && (
        <div
          className={cn(
            "mt-6 rounded-[14px] border px-4 py-3 text-sm",
            error ? "border-red-400/25 bg-red-400/10 text-red-100" : "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
          )}
        >
          {error || message}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04]">
        {loading ? (
          <div className="p-8 text-sm text-white/55">Loading {config.label.toLowerCase()}...</div>
        ) : rows.length ? (
          <div className="divide-y divide-white/10">
            {rows.map((row) => (
              <div
                key={row.id ?? renderValue(row[config.displayField])}
                className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
              >
                <div>
                  <p className="font-display text-2xl font-semibold tracking-[-0.01em]">
                    {renderValue(row[config.displayField])}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/46">
                    {config.slugField && Boolean(row[config.slugField]) && <span>/{String(row[config.slugField])}</span>}
                    {config.statusField && (
                      <span>
                        {config.statusField}: {renderValue(row[config.statusField])}
                      </span>
                    )}
                    {config.orderField && <span>order: {renderValue(row[config.orderField])}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/${config.id}/${row.id}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void onDelete(row)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-red-400/20 text-red-100 transition-colors hover:bg-red-400/10"
                    aria-label={`Delete ${renderValue(row[config.displayField])}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="font-display text-3xl font-semibold">No {config.label.toLowerCase()} yet.</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/52">
              Create the first {config.singular} on a dedicated editor page. Public pages keep fallback content until CMS content exists.
            </p>
            <Link
              href={`/dashboard/${config.id}/new`}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              New {config.singular}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
