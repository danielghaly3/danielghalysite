"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

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

export type GalleryImageInput = string | { src: string; alt?: string };

interface StickyGalleryProps {
  images: GalleryImageInput[];
  layout: GalleryLayout;
}

/* ── Shared image ── */
function Img({ image, className }: { image: GalleryImageInput; className?: string }) {
  const src = typeof image === 'string' ? image : image.src;
  const alt = typeof image === 'string' ? '' : (image.alt ?? '');
  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-[20px] border border-line bg-bone shadow-soft", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT A: hero-split (9 images)
   ───────────────────────────────────────────── */
function HeroSplit({ images: m }: { images: GalleryImageInput[] }) {
  return (
    <div className="grid gap-4">
      <Img image={m[0]} className="aspect-[16/9] md:aspect-[21/9]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Img image={m[1]} className="aspect-[4/3] md:aspect-[16/9]" />
        <Img image={m[2]} className="aspect-[4/3] md:aspect-[16/9]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Img image={m[3]} className="aspect-square" />
        <Img image={m[4]} className="aspect-square" />
        <Img image={m[5]} className="aspect-square" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Img image={m[6]} className="aspect-[4/3] md:aspect-[16/9]" />
        <Img image={m[7]} className="aspect-[4/3] md:aspect-[16/9]" />
      </div>
      <Img image={m[8]} className="aspect-[16/9] md:aspect-[21/9]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT B: mosaic-left (9 images)
   ───────────────────────────────────────────── */
function MosaicLeft({ images: m }: { images: GalleryImageInput[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[0]} className="sm:col-span-2 aspect-[16/9] sm:aspect-auto" />
        <Img image={m[1]} className="aspect-square sm:aspect-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Img image={m[2]} className="aspect-square" />
        <Img image={m[3]} className="aspect-square" />
        <Img image={m[4]} className="aspect-square" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[5]} className="aspect-square sm:aspect-auto" />
        <Img image={m[6]} className="sm:col-span-2 aspect-[16/9] sm:aspect-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Img image={m[7]} className="aspect-[4/3] md:aspect-[16/9]" />
        <Img image={m[8]} className="aspect-[4/3] md:aspect-[16/9]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT C: bento (9 images)
   ───────────────────────────────────────────── */
function Bento({ images: m }: { images: GalleryImageInput[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-4 gap-4 sm:aspect-square">
      <Img image={m[0]} className="col-span-2 sm:row-span-2 aspect-square sm:aspect-auto" />
      <Img image={m[1]} className="col-span-1 sm:row-span-1 aspect-square sm:aspect-auto" />
      <Img image={m[2]} className="col-span-1 sm:row-span-2 aspect-[3/4] sm:aspect-auto" />
      <Img image={m[3]} className="col-span-1 sm:row-span-1 aspect-square sm:aspect-auto" />
      <Img image={m[4]} className="col-span-1 sm:row-span-2 aspect-[3/4] sm:aspect-auto" />
      <Img image={m[5]} className="col-span-2 sm:row-span-1 aspect-video sm:aspect-auto" />
      <Img image={m[6]} className="col-span-1 sm:row-span-1 aspect-square sm:aspect-auto" />
      <Img image={m[7]} className="col-span-1 sm:row-span-1 aspect-square sm:aspect-auto" />
      <Img image={m[8]} className="col-span-2 sm:row-span-1 aspect-video sm:aspect-auto" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT D: editorial (9 images)
   ───────────────────────────────────────────── */
function Editorial({ images: m }: { images: GalleryImageInput[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[0]} className="sm:col-span-3 aspect-[16/9] sm:aspect-auto" />
        <Img image={m[1]} className="sm:col-span-2 aspect-square sm:aspect-auto" />
      </div>
      <Img image={m[2]} className="aspect-[16/9] md:aspect-[21/9]" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Img image={m[3]} className="aspect-square" />
        <Img image={m[4]} className="aspect-square" />
        <Img image={m[5]} className="aspect-square" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[6]} className="sm:col-span-2 aspect-square sm:aspect-auto" />
        <Img image={m[7]} className="sm:col-span-3 aspect-[16/9] sm:aspect-auto" />
      </div>
      <Img image={m[8]} className="aspect-[16/9] md:aspect-[21/9]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT E: featured-left (9 images)
   ───────────────────────────────────────────── */
function FeaturedLeft({ images: m }: { images: GalleryImageInput[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:aspect-[16/9] md:aspect-[2/1]">
        <Img image={m[0]} className="aspect-[4/3] sm:aspect-auto" />
        <div className="grid grid-rows-2 gap-4 sm:h-full">
          <Img image={m[1]} className="aspect-[16/9] sm:aspect-auto" />
          <Img image={m[2]} className="aspect-[16/9] sm:aspect-auto" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Img image={m[3]} className="aspect-square" />
        <Img image={m[4]} className="aspect-square" />
        <Img image={m[5]} className="aspect-square" />
        <Img image={m[6]} className="aspect-square" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Img image={m[7]} className="aspect-[4/3] md:aspect-[16/9]" />
        <Img image={m[8]} className="aspect-[4/3] md:aspect-[16/9]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT F: featured-right (9 images)
   ───────────────────────────────────────────── */
function FeaturedRight({ images: m }: { images: GalleryImageInput[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:aspect-[16/9] md:aspect-[2/1]">
        <div className="grid grid-rows-2 gap-4 sm:h-full">
          <Img image={m[0]} className="aspect-[16/9] sm:aspect-auto" />
          <Img image={m[1]} className="aspect-[16/9] sm:aspect-auto" />
        </div>
        <Img image={m[2]} className="aspect-[4/3] sm:aspect-auto" />
      </div>
      <Img image={m[3]} className="aspect-[16/9] md:aspect-[21/9]" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Img image={m[4]} className="aspect-[4/3]" />
        <Img image={m[5]} className="aspect-[4/3]" />
        <Img image={m[6]} className="aspect-[4/3]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Img image={m[7]} className="aspect-[4/3] md:aspect-[16/9]" />
        <Img image={m[8]} className="aspect-[4/3] md:aspect-[16/9]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT G: magazine (9 images)
   ───────────────────────────────────────────── */
function Magazine({ images: m }: { images: GalleryImageInput[] }) {
  return (
    <div className="grid gap-4">
      <Img image={m[0]} className="aspect-[16/9] md:aspect-[21/9]" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[1]} className="aspect-square sm:aspect-auto" />
        <Img image={m[2]} className="sm:col-span-2 aspect-[16/9] sm:aspect-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[3]} className="sm:col-span-2 aspect-[16/9] sm:aspect-auto" />
        <Img image={m[4]} className="aspect-square sm:aspect-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Img image={m[5]} className="aspect-square" />
        <Img image={m[6]} className="aspect-square" />
        <Img image={m[7]} className="aspect-square" />
      </div>
      <Img image={m[8]} className="aspect-[16/9] md:aspect-[21/9]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT H: zigzag (8 images)
   ───────────────────────────────────────────── */
function Zigzag({ images: m }: { images: GalleryImageInput[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[0]} className="aspect-square sm:aspect-auto" />
        <Img image={m[1]} className="sm:col-span-2 aspect-[16/9] sm:aspect-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[2]} className="sm:col-span-2 aspect-[16/9] sm:aspect-auto" />
        <Img image={m[3]} className="aspect-square sm:aspect-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[4]} className="aspect-square sm:aspect-auto" />
        <Img image={m[5]} className="sm:col-span-2 aspect-[16/9] sm:aspect-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:aspect-[21/9] md:aspect-[3/1]">
        <Img image={m[6]} className="sm:col-span-2 aspect-[16/9] sm:aspect-auto" />
        <Img image={m[7]} className="aspect-square sm:aspect-auto" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT I: showcase (9 images)
   ───────────────────────────────────────────── */
function Showcase({ images: m }: { images: GalleryImageInput[] }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Img image={m[0]} className="aspect-[4/3] md:aspect-[16/9]" />
        <Img image={m[1]} className="aspect-[4/3] md:aspect-[16/9]" />
      </div>
      <Img image={m[2]} className="aspect-[16/9] md:aspect-[21/9]" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Img image={m[3]} className="aspect-square" />
        <Img image={m[4]} className="aspect-square" />
        <Img image={m[5]} className="aspect-square" />
      </div>
      <Img image={m[6]} className="aspect-[16/9] md:aspect-[21/9]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Img image={m[7]} className="aspect-[4/3] md:aspect-[16/9]" />
        <Img image={m[8]} className="aspect-[4/3] md:aspect-[16/9]" />
      </div>
    </div>
  );
}

/* ── Layout map ── */
const layouts: Record<GalleryLayout, React.FC<{ images: GalleryImageInput[] }>> = {
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
    <section className="bg-paper pb-8 sm:pb-12">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12">
        <LayoutComponent images={images} />
      </div>
    </section>
  );
}
