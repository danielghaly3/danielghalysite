"use client";

import { motion, useReducedMotion } from "motion/react";
import { Pill } from "@/components/primitives/Pill";
import { Eyebrow } from "@/components/primitives/Eyebrow";

const words = "Have a brief? Let's make it real.".split(" ");

export function ContactBanner() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-banner-heading"
      className="-mt-7 relative isolate overflow-hidden rounded-[28px] border border-line bg-paper py-[clamp(96px,12vw,180px)] text-center text-ink"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_50%_28%,rgba(0,82,204,0.08),transparent_60%)]"
      />

      <div className="site-container">
        <div className="mx-auto max-w-[600px]">
          <Eyebrow>Start something</Eyebrow>
          <h2
            id="contact-banner-heading"
            className="section-title mt-5"
            aria-label="Have a brief? Let's make it real."
          >
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                aria-hidden="true"
                className="mr-[0.18em] inline-block"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, transform: "translateY(18px)", filter: "blur(6px)" }
                }
                whileInView={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: shouldReduceMotion ? 0.25 : 0.6,
                  delay: shouldReduceMotion ? 0 : index * 0.06,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <p className="mt-6 text-lg leading-[1.55] text-ash">
            Send the rough idea, the deadline, the budget, or just a hello. I reply within a working day.
          </p>
          <div className="mt-9">
            <Pill href="mailto:danielghaly3@gmail.com" variant="inverse">
              Get in touch
            </Pill>
          </div>
        </div>
      </div>
    </section>
  );
}
