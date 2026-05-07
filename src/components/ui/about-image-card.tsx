"use client";

import * as React from "react";
import Image from "next/image";
import { blurDataUrl } from "@/content/work";
import { cn } from "@/lib/cn";

type AboutImageCardProps = {
  src?: string;
  alt?: string;
  name?: string;
  role?: string;
  className?: string;
};

export function AboutImageCard({
  src = "/images/daniel-studio-portrait.png",
  alt = "Portrait of Daniel Ghaly",
  name = "Daniel Ghaly",
  role = "Designer and Web Developer",
  className,
}: AboutImageCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = ((y - height / 2) / (height / 2)) * -6;
    const rotateY = ((x - width / 2) / (width / 2)) * 6;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.4s ease-in-out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transformStyle: "preserve-3d" }}
      className={cn(
        "group relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-ink shadow-pop",
        className
      )}
    >
      {/* Image layer — sits slightly behind for depth */}
      <div
        className="absolute inset-0"
        style={{ transform: "translateZ(-20px) scale(1.1)" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          placeholder="blur"
          blurDataURL={blurDataUrl}
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(180deg,transparent_40%,rgba(14,14,16,0.65)_100%)]" />

      {/* Glass label — floats forward in 3D */}
      <div
        className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-xl backdrop-saturate-150 sm:inset-x-6 sm:bottom-6 sm:p-5"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="min-w-0">
          <p className="font-display text-base font-semibold leading-tight tracking-[-0.01em] text-white sm:text-lg">
            {name}
          </p>
          <p className="mt-1 text-[12px] leading-tight text-white/70 sm:text-[13px]">
            {role}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="inline-flex h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_12px_rgba(0,82,204,0.7)]"
        />
      </div>
    </div>
  );
}
