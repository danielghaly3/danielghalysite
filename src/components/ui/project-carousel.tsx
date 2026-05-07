"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { blurDataUrl } from "@/content/projects";

/* ── Types ── */
interface ProjectCarouselImage {
  src: string;
  alt: string;
  name: string;
  category: string;
  slug: string;
}

interface ProjectCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: ProjectCarouselImage[];
}

/* ── Component ── */
export const ProjectCarousel = React.forwardRef<
  HTMLDivElement,
  ProjectCarouselProps
>(({ images, className, ...props }, ref) => {
  const [currentIndex, setCurrentIndex] = React.useState(
    Math.floor(images.length / 2)
  );

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  React.useEffect(() => {
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full flex items-center justify-center",
        className
      )}
      {...props}
    >
      {/* Carousel track */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[620px] flex items-center justify-center [perspective:1000px]">
        {images.map((image, index) => {
          const offset = index - currentIndex;
          const total = images.length;
          let pos = (offset + total) % total;
          if (pos > Math.floor(total / 2)) {
            pos = pos - total;
          }

          const isCenter = pos === 0;
          const isAdjacent = Math.abs(pos) === 1;

          return (
            <div
              key={index}
              className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] transition-all duration-500 ease-in-out"
              style={{
                transform: `
                  translateX(${pos * 50}%) 
                  scale(${isCenter ? 1 : isAdjacent ? 0.85 : 0.7})
                  rotateY(${pos * -10}deg)
                `,
                zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
                filter: isCenter ? "blur(0px)" : "blur(4px)",
                visibility: Math.abs(pos) > 1 ? "hidden" : "visible",
              }}
            >
              <Link
                href={`/projects/${image.slug}`}
                className="group/card relative block w-full h-full overflow-hidden rounded-3xl border border-line shadow-xl cursor-pointer transition-all duration-300 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(0,82,204,0.15)]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  sizes="(min-width: 768px) 500px, 384px"
                  className="object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/card:scale-[1.06]"
                />

                {/* Bottom gradient — darkens on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover/card:from-black/75" />

                {/* Label — visible on center, revealed on hover for all */}
                <div className={cn(
                  "absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md transition-all duration-300",
                  isCenter
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0"
                )}>
                  <p className="font-display text-base font-semibold text-white sm:text-lg">
                    {image.name}
                  </p>
                  <p className="mt-0.5 text-[12px] font-medium text-white/60">
                    {image.category}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 z-20 border-line bg-white/80 text-ink backdrop-blur-md hover:bg-accent hover:text-white hover:border-accent"
        onClick={handlePrev}
        aria-label="Previous project"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 z-20 border-line bg-white/80 text-ink backdrop-blur-md hover:bg-accent hover:text-white hover:border-accent"
        onClick={handleNext}
        aria-label="Next project"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Pagination dots */}
      <div className="absolute bottom-0 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to project ${index + 1}`}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-6 bg-accent"
                : "bg-ink/20 hover:bg-ink/40"
            )}
          />
        ))}
      </div>
    </div>
  );
});

ProjectCarousel.displayName = "ProjectCarousel";
