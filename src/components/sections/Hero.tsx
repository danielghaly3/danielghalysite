"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Pill } from "@/components/primitives/Pill";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { fallbackAboutContent, fallbackSiteSettings } from "@/content/cms-fallbacks";
import { blurDataUrl } from "@/content/work";
import { sectionString } from "@/lib/cms/section-content";
import type { AboutContent, PageSection, SiteSettings } from "@/types/cms";

type HeroProps = {
  about?: AboutContent;
  section?: PageSection;
  settings?: SiteSettings;
};

export function Hero({ about = fallbackAboutContent, section, settings = fallbackSiteSettings }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [0, -40]);
  const name = section?.title || settings.name || "Daniel Ghaly";
  const body =
    section?.body ||
    (about.subheadline
      ? `${about.subheadline}. ${settings.tagline}`
      : "I cofounded Graphxify, a design studio building bold brands and lean websites that turn attention into outcomes. Based in Mississauga, working everywhere.");
  const image = section?.imageUrl || "/images/daniel-hero.png";
  const imageAlt = sectionString(section, "imageAlt", "Dark directional brand image for Daniel Ghaly's portfolio");
  const ctaLabel = section?.ctaLabel || "See the work";
  const ctaHref = section?.ctaHref || "#work";

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] overflow-hidden rounded-b-[48px] bg-ink text-paper"
    >
      <motion.div
        className="absolute inset-y-0 right-0 z-[-2] w-full opacity-55 md:w-[60%] md:opacity-100"
        style={{ y: imageY }}
        initial={shouldReduceMotion ? { opacity: 1 } : { scale: 1.05 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          placeholder="blur"
          blurDataURL={blurDataUrl}
          sizes="(min-width: 768px) 60vw, 100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 z-[-1] bg-[linear-gradient(90deg,rgba(14,14,16,0.98)_0%,rgba(14,14,16,0.84)_42%,rgba(14,14,16,0.18)_100%)]" />
      <div className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,transparent_30%,rgba(14,14,16,0.55)_100%)]" />

      <div className="site-container flex min-h-[100svh] items-center pb-16 pt-24">
        <div className="max-w-4xl">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{
              duration: shouldReduceMotion ? 0.25 : 0.6,
              delay: shouldReduceMotion ? 0 : 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <Eyebrow>{section?.eyebrow || "Hey, I'm"}</Eyebrow>
          </motion.div>

          <h1 id="hero-title" className="hero-title mt-6">
            <span className="sr-only">{name}</span>
            <span className="block whitespace-nowrap" aria-hidden="true">
              {name.split("").map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  className="inline-block"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transform: "translateY(16px)", filter: "blur(8px)" }
                  }
                  animate={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
                  transition={{
                    duration: shouldReduceMotion ? 0.25 : 0.7,
                    delay: shouldReduceMotion ? 0.08 : 0.18 + index * 0.04,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            className="mt-10 max-w-[460px] text-lg leading-[1.55] text-white/75"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{
              duration: shouldReduceMotion ? 0.25 : 0.65,
              delay: shouldReduceMotion ? 0.16 : 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {body}
          </motion.p>

          <motion.div
            className="mt-9"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.25 : 0.45,
              delay: shouldReduceMotion ? 0.2 : 1,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <Pill href={ctaHref} variant="inverse">
              {ctaLabel}
            </Pill>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
