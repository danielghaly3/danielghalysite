import Image from "next/image";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { OrangeTick } from "@/components/primitives/OrangeTick";
import { Reveal } from "@/components/primitives/Reveal";
import { blurDataUrl, introImages } from "@/content/work";

export function Intro() {
  return (
    <section aria-labelledby="intro-heading" className="section-pad bg-paper">
      <div className="site-container">
        <Reveal>
          <SectionHeader
            id="intro-heading"
            eyebrow="Approach"
            title="Design that earns its keep."
            body="I design brands and websites that look sharp and pull weight. Clear positioning, clean systems, and frontend that actually ships. No fluff, no noise, no templates pretending to be strategy."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {introImages.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.08}>
              <figure className="group">
                <div className="image-frame aspect-[4/5] bg-bone">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    placeholder="blur"
                    blurDataURL={blurDataUrl}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-5 transition-transform duration-[600ms] ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
                  <OrangeTick />
                  <p className="text-sm font-semibold">
                    {item.name} <span className="text-ash">· {item.tag}</span>
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
