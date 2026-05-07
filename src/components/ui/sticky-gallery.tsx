"use client";

import React from "react";
import Image from "next/image";

/* ── Types ── */
export type GalleryLayout =
  | "hero-split"
  | "mosaic-left"
  | "bento"
  | "editorial"
  | "featured-left"
  | "featured-right"
  | "magazine"
  | "zigzag"
  | "showcase";

interface StickyGalleryProps {
  images: string[];
  layout: GalleryLayout;
}

/* ── Shared image ── */
function Img({ src, className }: { src: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[20px] border border-line shadow-soft ${className ?? ""}`}>
      <Image
        src={src}
        alt=""
        width={900}
        height={700}
        className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT A: hero-split (9 images)
   1 full → 2 side → 3 row → 2 side → 1 full
   ───────────────────────────────────────────── */
function HeroSplit({ images: m }: { images: string[] }) {
  return (
    <div className="grid gap-4">
      <Img src={m[0]} className="aspect-[21/9]" />
      <div className="grid grid-cols-2 gap-4">
        <Img src={m[1]} className="aspect-[4/3]" />
        <Img src={m[2]} className="aspect-[4/3]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[3]} className="aspect-square" />
        <Img src={m[4]} className="aspect-square" />
        <Img src={m[5]} className="aspect-square" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Img src={m[6]} className="aspect-[4/3]" />
        <Img src={m[7]} className="aspect-[4/3]" />
      </div>
      <Img src={m[8]} className="aspect-[21/9]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT B: mosaic-left (9 images)
   2/3+1/3 → 3 equal → 1/3+2/3 → 2 equal
   ───────────────────────────────────────────── */
function MosaicLeft({ images: m }: { images: string[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[0]} className="col-span-2 aspect-[16/10]" />
        <Img src={m[1]} className="aspect-[3/4]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[2]} className="aspect-square" />
        <Img src={m[3]} className="aspect-square" />
        <Img src={m[4]} className="aspect-square" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[5]} className="aspect-[3/4]" />
        <Img src={m[6]} className="col-span-2 aspect-[16/10]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Img src={m[7]} className="aspect-[4/3]" />
        <Img src={m[8]} className="aspect-[4/3]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT C: bento (9 images)
   Mixed grid with spanning cells
   ───────────────────────────────────────────── */
function Bento({ images: m }: { images: string[] }) {
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-4 sm:aspect-[16/10]">
      <Img src={m[0]} className="col-span-2 row-span-2" />
      <Img src={m[1]} className="col-span-1 row-span-1" />
      <Img src={m[2]} className="col-span-1 row-span-2" />
      <Img src={m[3]} className="col-span-1 row-span-1" />
      <Img src={m[4]} className="col-span-1 row-span-2" />
      <Img src={m[5]} className="col-span-2 row-span-1" />
      <Img src={m[6]} className="col-span-1 row-span-1" />
      <Img src={m[7]} className="col-span-1 row-span-1" />
      <Img src={m[8]} className="col-span-2 row-span-1" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT D: editorial (9 images)
   60/40 → full → 3 equal → 40/60 → full
   ───────────────────────────────────────────── */
function Editorial({ images: m }: { images: string[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-5 gap-4">
        <Img src={m[0]} className="col-span-3 aspect-[16/10]" />
        <Img src={m[1]} className="col-span-2 aspect-[16/10]" />
      </div>
      <Img src={m[2]} className="aspect-[21/9]" />
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[3]} className="aspect-square" />
        <Img src={m[4]} className="aspect-square" />
        <Img src={m[5]} className="aspect-square" />
      </div>
      <div className="grid grid-cols-5 gap-4">
        <Img src={m[6]} className="col-span-2 aspect-[16/10]" />
        <Img src={m[7]} className="col-span-3 aspect-[16/10]" />
      </div>
      <Img src={m[8]} className="aspect-[21/9]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT E: featured-left (9 images)
   1 tall left + 2x2 right, then 4 row + 1 wide bottom
   ───────────────────────────────────────────── */
function FeaturedLeft({ images: m }: { images: string[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Img src={m[0]} className="row-span-2 aspect-auto min-h-[400px] sm:min-h-[500px]" />
        <div className="grid grid-rows-2 gap-4">
          <Img src={m[1]} className="aspect-[16/9]" />
          <Img src={m[2]} className="aspect-[16/9]" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Img src={m[3]} className="aspect-square" />
        <Img src={m[4]} className="aspect-square" />
        <Img src={m[5]} className="aspect-square" />
        <Img src={m[6]} className="aspect-square" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Img src={m[7]} className="aspect-[4/3]" />
        <Img src={m[8]} className="aspect-[4/3]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT F: featured-right (9 images)
   2x2 left + 1 tall right, then wide + 3 row
   ───────────────────────────────────────────── */
function FeaturedRight({ images: m }: { images: string[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-rows-2 gap-4">
          <Img src={m[0]} className="aspect-[16/9]" />
          <Img src={m[1]} className="aspect-[16/9]" />
        </div>
        <Img src={m[2]} className="row-span-2 aspect-auto min-h-[400px] sm:min-h-[500px]" />
      </div>
      <Img src={m[3]} className="aspect-[21/9]" />
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[4]} className="aspect-[3/4]" />
        <Img src={m[5]} className="aspect-[3/4]" />
        <Img src={m[6]} className="aspect-[3/4]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Img src={m[7]} className="aspect-[4/3]" />
        <Img src={m[8]} className="aspect-[4/3]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT G: magazine (9 images)
   full → narrow+wide → wide+narrow → 3 equal → full
   ───────────────────────────────────────────── */
function Magazine({ images: m }: { images: string[] }) {
  return (
    <div className="grid gap-4">
      <Img src={m[0]} className="aspect-[21/9]" />
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[1]} className="aspect-[3/4]" />
        <Img src={m[2]} className="col-span-2 aspect-[16/10]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[3]} className="col-span-2 aspect-[16/10]" />
        <Img src={m[4]} className="aspect-[3/4]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[5]} className="aspect-square" />
        <Img src={m[6]} className="aspect-square" />
        <Img src={m[7]} className="aspect-square" />
      </div>
      <Img src={m[8]} className="aspect-[21/9]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT H: zigzag (8 images)
   1/3+2/3 → 2/3+1/3 → 1/3+2/3 → 2/3+1/3
   ───────────────────────────────────────────── */
function Zigzag({ images: m }: { images: string[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[0]} className="aspect-[3/4]" />
        <Img src={m[1]} className="col-span-2 aspect-[16/10]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[2]} className="col-span-2 aspect-[16/10]" />
        <Img src={m[3]} className="aspect-[3/4]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[4]} className="aspect-[3/4]" />
        <Img src={m[5]} className="col-span-2 aspect-[16/10]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[6]} className="col-span-2 aspect-[16/10]" />
        <Img src={m[7]} className="aspect-[3/4]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT I: showcase (9 images)
   2 side → 1 full → 3 equal → 1 full → 2 side
   ───────────────────────────────────────────── */
function Showcase({ images: m }: { images: string[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Img src={m[0]} className="aspect-[3/4]" />
        <Img src={m[1]} className="aspect-[3/4]" />
      </div>
      <Img src={m[2]} className="aspect-[21/9]" />
      <div className="grid grid-cols-3 gap-4">
        <Img src={m[3]} className="aspect-square" />
        <Img src={m[4]} className="aspect-square" />
        <Img src={m[5]} className="aspect-square" />
      </div>
      <Img src={m[6]} className="aspect-[21/9]" />
      <div className="grid grid-cols-2 gap-4">
        <Img src={m[7]} className="aspect-[4/3]" />
        <Img src={m[8]} className="aspect-[4/3]" />
      </div>
    </div>
  );
}

/* ── Layout map ── */
const layouts: Record<GalleryLayout, React.FC<{ images: string[] }>> = {
  "hero-split": HeroSplit,
  "mosaic-left": MosaicLeft,
  "bento": Bento,
  "editorial": Editorial,
  "featured-left": FeaturedLeft,
  "featured-right": FeaturedRight,
  "magazine": Magazine,
  "zigzag": Zigzag,
  "showcase": Showcase,
};

/* ── Main component ── */
export function StickyGallery({ images, layout }: StickyGalleryProps) {
  if (!images || images.length === 0) return null;
  const LayoutComponent = layouts[layout] ?? Showcase;

  return (
    <section className="relative bg-bone">
      {/* Top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 sm:h-40"
        style={{
          background: "linear-gradient(to bottom, rgb(245,243,240) 0%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-16">
        <LayoutComponent images={images} />
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 sm:h-40"
        style={{
          background: "linear-gradient(to top, rgb(245,243,240) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
