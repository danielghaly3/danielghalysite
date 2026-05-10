"use client";

import Image from "next/image";
import { BlurredInfiniteSlider } from "@/components/ui/infinite-slider";
import { fallbackLogoMarqueeItems } from "@/content/cms-fallbacks";
import { isExternalLink } from "@/lib/link";
import type { LogoMarqueeItem, PageSection } from "@/types/cms";

type LogoMarqueeProps = {
  section?: PageSection;
  items?: LogoMarqueeItem[];
};

const MIN_LOGO_LOOP_ITEMS = 20;

function buildLoopedLogos(items: LogoMarqueeItem[]) {
  if (!items.length) return [];

  const repeatCount = Math.max(1, Math.ceil(MIN_LOGO_LOOP_ITEMS / items.length));

  return Array.from({ length: repeatCount }).flatMap((_, copyIndex) =>
    items.map((logo, logoIndex) => ({
      logo,
      key: `${copyIndex}-${logo.id}-${logoIndex}`,
      isDuplicate: copyIndex > 0
    }))
  );
}

export function LogoMarquee({ section, items = fallbackLogoMarqueeItems }: LogoMarqueeProps) {
  const logos = items.length ? items : fallbackLogoMarqueeItems;
  const loopedLogos = buildLoopedLogos(logos);

  return (
    <section
      id="logo-marquee"
      aria-label={section?.label || "Tools and technologies"}
      className="relative mt-16 overflow-hidden bg-paper py-14"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6">
        {/* marquee */}
        <div className="w-full">
          <BlurredInfiniteSlider
            speed={35}
            gap={112}
            fadeWidth={64}
            minCopies={2}
          >
            {loopedLogos.map(({ logo, key, isDuplicate }) => {
              const height = logo.height || 42;
              const inner = (
                <div className="flex items-center justify-center">
                  <Image
                    src={logo.image}
                    alt={isDuplicate ? "" : logo.alt || logo.name}
                    width={Math.round(height * 1.5)}
                    height={height}
                    className="h-auto w-auto opacity-50 brightness-0 transition-opacity duration-300 hover:opacity-90"
                    style={{ height: `${height}px`, width: "auto" }}
                  />
                </div>
              );
              return logo.href ? (
                <a
                  key={key}
                  href={logo.href}
                  data-logo-marquee-item
                  target={isExternalLink(logo.href) ? "_blank" : undefined}
                  rel={isExternalLink(logo.href) ? "noopener noreferrer" : undefined}
                  aria-label={isDuplicate ? undefined : logo.alt || logo.name}
                  aria-hidden={isDuplicate ? true : undefined}
                  tabIndex={isDuplicate ? -1 : undefined}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={key}
                  data-logo-marquee-item
                  aria-hidden={isDuplicate ? true : undefined}
                >
                  {inner}
                </div>
              );
            })}
          </BlurredInfiniteSlider>
        </div>
      </div>
    </section>
  );
}
