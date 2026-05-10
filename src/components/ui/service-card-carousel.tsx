"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { blurDataUrl } from "@/content/work";

export type ServiceCarouselItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  alt: string;
};

type ServiceCardCarouselProps = {
  items: ServiceCarouselItem[];
  className?: string;
};

const easing = [0.22, 1, 0.36, 1] as const;

export function ServiceCardCarousel({ items, className }: ServiceCardCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const reduceMotion = useReducedMotion();
  
  const len = items.length;
  const index = ((page % len) + len) % len;
  const current = items[index];

  if (!current) return null;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const goTo = (newIndex: number) => {
    const newDirection = newIndex > index ? 1 : -1;
    if (newIndex === index) return;
    setPage([page + (newIndex - index), newDirection]);
  };

  const transition = {
    type: "spring",
    stiffness: 250,
    damping: 32,
    mass: 1,
  };

  const imageVariants = {
    enter: (direction: number) => ({
      x: reduceMotion ? 0 : (direction > 0 ? "100%" : "-100%"),
      opacity: 1,
      scale: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: reduceMotion ? 0 : (direction < 0 ? "100%" : "-100%"),
      opacity: 1,
      scale: 1,
    }),
  };

  const contentVariants = {
    enter: (direction: number) => ({
      x: reduceMotion ? 0 : (direction > 0 ? 80 : -80),
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: reduceMotion ? 0 : (direction < 0 ? 80 : -80),
      opacity: 0,
    }),
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative mx-auto max-w-[960px]">
        {/* Image card — square */}
        <div className="relative aspect-square w-full max-w-[470px] overflow-hidden rounded-[24px] border border-line bg-bone shadow-soft">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`image-${page}`}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="absolute inset-0"
            >
              <Image
                src={current.image}
                alt={current.alt}
                fill
                placeholder="blur"
                blurDataURL={blurDataUrl}
                sizes="(min-width: 1024px) 470px, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text card — overlaps the image from the right */}
        <div className="relative z-10 -mt-16 ml-auto w-[90%] max-w-[560px] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:mt-0 lg:ml-0 lg:w-[560px]">
          <div className="relative min-h-[300px] sm:min-h-[340px] lg:min-h-[380px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.article
                key={`content-${page}`}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 flex flex-col rounded-[24px] bg-ink p-7 text-paper shadow-pop sm:p-9 lg:p-10"
              >
                <h3 className="font-display text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.05] tracking-[-0.02em]">
                  {current.title}
                </h3>
                <p className="mt-3 text-[14px] font-medium text-accent">{current.subtitle}</p>
                <p className="mt-6 text-[15px] leading-[1.7] text-white/78">{current.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-7">
                  {current.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11px] font-medium text-white/85"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-4 sm:gap-5">
        <button
          type="button"
          aria-label="Previous service"
          onClick={() => paginate(-1)}
          className="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper transition-[background-color,transform,color] duration-200 ease-[var(--ease-out-expo)] hover:bg-accent active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5" role="tablist" aria-label="Service navigation">
          {items.map((item, i) => {
            const isActive = i === index;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to service ${i + 1}, ${item.title}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out-expo)]",
                  isActive ? "w-8 bg-accent" : "w-2 bg-ink/20 hover:bg-ink/40"
                )}
              />
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Next service"
          onClick={() => paginate(1)}
          className="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper transition-[background-color,transform,color] duration-200 ease-[var(--ease-out-expo)] hover:bg-accent active:scale-95"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
