"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import styles from "./hover-brand-logo.module.css";

export type HoverBrandLogoItem = {
  id: string;
  name: string;
  category: string;
  icon: string;
  wide?: boolean;
};

type HoverBrandLogoProps = {
  items: HoverBrandLogoItem[];
  className?: string;
};

type Direction = "left" | "right";

type RowConfig = {
  items: HoverBrandLogoItem[];
  direction: Direction;
  durationSeconds: number;
};

function ToolCard({ item }: { item: HoverBrandLogoItem }) {
  return (
    <div
      data-tool-logo-card
      className={cn(
        "group relative isolate flex h-[100px] w-[132px] shrink-0 cursor-default select-none flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[16px] px-3 text-center",
        "bg-white/[0.045] text-white/62",
        "sm:h-[112px] sm:w-[148px] sm:gap-3"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-10 items-center justify-center sm:h-11",
          item.wide ? "w-[64px] sm:w-[72px]" : "w-10 sm:w-11"
        )}
      >
        <Image
          src={item.icon}
          alt=""
          width={item.wide ? 72 : 44}
          height={44}
          unoptimized
          data-tool-logo-icon
          className={cn(
            "h-7 object-contain brightness-0 invert transition-[filter,transform] duration-200 ease-[var(--ease-out-expo)] sm:h-8",
            item.wide ? "w-12 sm:w-14" : "w-7 sm:w-8"
          )}
          draggable={false}
        />
      </span>
      <span className="max-w-full text-balance text-[11px] font-semibold leading-tight sm:text-[12px]">
        {item.name}
      </span>
    </div>
  );
}

function MarqueeRow({ items, direction, durationSeconds }: RowConfig) {
  if (!items.length) return null;
  return (
    <div className={styles.viewport}>
      <div
        className={cn(styles.track, direction === "right" && styles.trackReverse)}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className={styles.row} aria-hidden={copy === 1 ? true : undefined}>
            {items.map((item) => (
              <ToolCard key={`${copy}-${item.id}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function splitIntoRows<T>(list: T[], rowCount: number): T[][] {
  if (rowCount <= 0) return [list];
  const size = Math.ceil(list.length / rowCount);
  const rows: T[][] = [];
  for (let i = 0; i < rowCount; i += 1) {
    rows.push(list.slice(i * size, (i + 1) * size));
  }
  return rows.filter((row) => row.length > 0);
}

const DIRECTIONS: Direction[] = ["left", "right", "left"];
const DURATIONS = [42, 56, 48];

export function HoverBrandLogo({ items, className }: HoverBrandLogoProps) {
  const rowSlices = splitIntoRows(items, 3);
  const rows: RowConfig[] = rowSlices.map((rowItems, index) => ({
    items: rowItems,
    direction: DIRECTIONS[index] ?? "left",
    durationSeconds: DURATIONS[index] ?? 44
  }));

  return (
    <div
      className={cn(
        "rounded-card border border-white/10 bg-white/[0.035] p-4 sm:p-5 lg:p-6",
        className
      )}
    >
      <div className={styles.stack}>
        {rows.map((row, index) => (
          <MarqueeRow
            key={`row-${index}`}
            items={row.items}
            direction={row.direction}
            durationSeconds={row.durationSeconds}
          />
        ))}
      </div>
    </div>
  );
}
