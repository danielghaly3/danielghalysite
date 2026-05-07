import { Plus } from "lucide-react";
import { Pill } from "@/components/primitives/Pill";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { pricingTiers } from "@/content/pricing";
import { cn } from "@/lib/cn";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="section-pad bg-bone">
      <div className="site-container">
        <Reveal>
          <SectionHeader
            id="pricing-heading"
            eyebrow="Investment"
            title="Honest packages. Real numbers."
            body="Three starting points. Custom scopes available, just ask."
            centered
          />
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3 lg:items-center">
          {pricingTiers.map((tier, index) => (
            <Reveal key={tier.name} delay={index * 0.08}>
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-card border p-8",
                  tier.featured
                    ? "scale-[1.02] border-ink bg-ink text-paper lg:scale-[1.04]"
                    : "border-line bg-paper text-ink"
                )}
              >
                {tier.featured ? (
                  <span className="absolute left-8 top-0 -translate-y-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-accent-ink">
                    Most picked
                  </span>
                ) : null}
                <h3 className="font-display text-3xl font-semibold tracking-[-0.02em]">{tier.name}</h3>
                <p className={cn("mt-3 text-sm", tier.featured ? "text-white/60" : "text-ash")}>{tier.subtitle}</p>
                <p className="mt-8 flex items-end gap-2">
                  <span className="font-display text-5xl font-semibold tracking-[-0.04em]">
                    From {tier.price}
                  </span>
                  <span className={cn("pb-2 text-xs font-semibold uppercase", tier.featured ? "text-white/55" : "text-ash")}>
                    CAD {tier.suffix ?? ""}
                  </span>
                </p>
                <div className={cn("my-8 h-px", tier.featured ? "bg-white/15" : "bg-line")} />
                <ul className="space-y-4">
                  {tier.inclusions.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6">
                      <Plus className={cn("mt-1 h-3.5 w-3.5 shrink-0", tier.featured ? "text-accent" : "text-ink")} />
                      <span className={tier.featured ? "text-white/78" : "text-graphite"}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <Pill href="mailto:danielghaly3@gmail.com" variant={tier.featured ? "primary" : "ghost"}>
                    Start here
                  </Pill>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
