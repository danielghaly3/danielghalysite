"use client";

import { KeyboardEvent, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Reveal } from "@/components/primitives/Reveal";
import { fallbackProcessSteps } from "@/content/cms-fallbacks";
import { blurDataUrl } from "@/content/work";
import { cn } from "@/lib/cn";
import type { PageSection, ProcessStep } from "@/types/cms";

const easing = [0.23, 1, 0.32, 1] as const;

type ProcessProps = {
  items?: ProcessStep[];
  section?: PageSection;
};

export function Process({ items = fallbackProcessSteps, section }: ProcessProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const steps = items.length ? items : fallbackProcessSteps;

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      buttonRefs.current[(index + 1) % steps.length]?.focus();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      buttonRefs.current[(index - 1 + steps.length) % steps.length]?.focus();
    }
  };

  return (
    <section id="process" aria-labelledby="process-heading" className="section-pad bg-paper">
      <div className="site-container">
        <Reveal>
          <SectionHeader
            id="process-heading"
            eyebrow={section?.eyebrow || "Process"}
            title={section?.title || "From first call to shipped, in five steps."}
            body={section?.body || undefined}
          />
        </Reveal>

        <ul className="space-y-3" role="list">
          {steps.map((step, index) => {
            const open = openIndex === index;
            const panelId = `process-panel-${index}`;

            return (
              <motion.li
                key={step.id}
                layout="position"
                transition={{ duration: 0.26, ease: easing }}
              >
                <button
                  ref={(node) => {
                    buttonRefs.current[index] = node;
                  }}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "group relative grid w-full overflow-hidden rounded-card border p-7 text-left md:p-8",
                    "grid-cols-[4px_minmax(0,1fr)] gap-5 md:grid-cols-[4px_minmax(0,1.4fr)_minmax(220px,0.8fr)]",
                    "min-h-[112px] transition-[background-color,border-color,box-shadow,transform,filter,color] duration-200 ease-[var(--ease-out-expo)] will-change-transform active:scale-[0.997]",
                    open
                      ? "-translate-y-0.5 border-white/10 bg-ink text-paper shadow-pop ring-1 ring-white/10 hover:brightness-[1.04]"
                      : "border-line bg-bone text-ink hover:-translate-y-0.5 hover:border-accent/50 hover:bg-paper hover:shadow-soft"
                  )}
                >
                  <motion.span
                    aria-hidden="true"
                    className={cn(
                      "h-full min-h-16 rounded-full transition-colors duration-200 ease-[var(--ease-out-expo)]",
                      open ? "bg-paper" : "bg-accent/70 group-hover:bg-accent"
                    )}
                    initial={false}
                    animate={{ scaleY: open ? 1 : 0.36, opacity: open ? 1 : 0.65 }}
                    transition={{ duration: 0.28, ease: easing }}
                    style={{ transformOrigin: "top" }}
                  />

                  <div className="min-w-0">
                    <span className="block font-display text-[clamp(24px,3vw,36px)] font-semibold leading-tight tracking-[-0.02em]">
                      {step.title}
                    </span>

                    <motion.div
                      id={panelId}
                      initial={false}
                      animate={{
                        height: open ? "auto" : 0,
                        opacity: open ? 1 : 0,
                        transform: open ? "translateY(0px)" : "translateY(-4px)"
                      }}
                      transition={{
                        height: { duration: 0.32, ease: easing },
                        opacity: { duration: open ? 0.24 : 0.14, ease: easing, delay: open ? 0.04 : 0 },
                        transform: { duration: 0.24, ease: easing }
                      }}
                      className="overflow-hidden"
                      aria-hidden={!open}
                    >
                      <p className="mt-5 max-w-2xl text-[15px] leading-7 text-paper/85">
                        {step.detail}
                      </p>
                    </motion.div>
                  </div>

                  <span
                    className={cn(
                      "hidden self-center text-right text-sm leading-6 transition-colors duration-200 md:block",
                      open ? "text-paper/80" : "text-ash"
                    )}
                  >
                    {step.blurb}
                  </span>

                  <motion.span
                    className="col-span-full block overflow-hidden md:col-start-2 md:justify-self-end"
                    initial={false}
                    animate={{
                      height: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                      transform: open ? "translateY(0px)" : "translateY(6px)"
                    }}
                    transition={{
                      height: { duration: 0.34, ease: easing },
                      opacity: { duration: open ? 0.25 : 0.14, ease: easing, delay: open ? 0.05 : 0 },
                      transform: { duration: 0.26, ease: easing }
                    }}
                    aria-hidden={!open}
                  >
                    <span className="mt-6 block md:mt-3 md:w-[320px]">
                      <span className="relative block aspect-video overflow-hidden rounded-image bg-ink/10">
                        <Image
                          src={step.image}
                          alt={step.imageAlt}
                          fill
                          placeholder="blur"
                          blurDataURL={blurDataUrl}
                          sizes="320px"
                          className="object-cover"
                        />
                      </span>
                    </span>
                  </motion.span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
