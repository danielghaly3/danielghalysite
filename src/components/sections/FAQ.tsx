"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Pill } from "@/components/primitives/Pill";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { fallbackFaqItems } from "@/content/cms-fallbacks";
import { cn } from "@/lib/cn";
import type { FaqItem, PageSection } from "@/types/cms";

type FAQProps = {
  items?: FaqItem[];
  section?: PageSection;
};

export function FAQ({ items = fallbackFaqItems, section }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  const faqs = items.length ? items : fallbackFaqItems;

  const toggle = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-pad bg-paper">
      <div className="site-container grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>{section?.eyebrow || "FAQ"}</Eyebrow>
          <h2 id="faq-heading" className="section-title mt-5">
            {section?.title || "Questions worth answering."}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-[1.55] text-ash">
            {section?.body || "The basics before we get into scope, timelines, and the shape of the work."}
          </p>
          <div className="mt-8">
            <Pill href={section?.ctaHref || "mailto:danielghaly3@gmail.com"}>
              {section?.ctaLabel || "Still have questions? Email me"}
            </Pill>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-7">
          {faqs.map((faq, index) => {
            const open = openItems.has(index);
            const panelId = `faq-answer-${index}`;

            return (
              <motion.div
                key={faq.question}
                layout
                className={cn(
                  "rounded-card border p-6 transition-colors duration-200 md:px-7",
                  open ? "border-accent bg-paper" : "border-line bg-bone"
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-4 text-left"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                >
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                  <span className="text-lg font-semibold text-ink">{faq.question}</span>
                </button>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pl-12 pt-4 text-[15px] leading-7 text-ash">{faq.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
