"use client";

import { Reveal } from "@/components/primitives/Reveal";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Lightbulb, Layers, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Strategy First",
    description:
      "Every project starts with understanding the business, audience, and goals. No design happens until the strategy is clear."
  },
  {
    icon: Layers,
    title: "Design with Intent",
    description:
      "Clean layouts, consistent systems, and premium visuals. Every decision is deliberate, nothing decorative without purpose."
  },
  {
    icon: Rocket,
    title: "Build and Ship",
    description:
      "Modern tools, fast performance, and production ready code. I design it, build it, and make sure it works everywhere."
  }
];

export function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="section-pad bg-paper text-ink"
    >
      <div className="site-container">
        <Reveal>
          <SectionHeader
            id="approach-heading"
            eyebrow="How I Work"
            title="My Approach"
            body="A simple, focused process built around clarity, quality, and results."
          />
        </Reveal>

        <Reveal y={36}>
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="group rounded-[24px] border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-pop sm:p-9"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-ash">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
