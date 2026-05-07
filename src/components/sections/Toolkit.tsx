import { Reveal } from "@/components/primitives/Reveal";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { HoverBrandLogo, type HoverBrandLogoItem } from "@/components/ui/hover-brand-logo";
import { fallbackToolkitItems } from "@/content/cms-fallbacks";
import type { PageSection } from "@/types/cms";

type ToolkitProps = {
  items?: HoverBrandLogoItem[];
  section?: PageSection;
};

export function Toolkit({ items = fallbackToolkitItems, section }: ToolkitProps) {
  return (
    <section id="skills" aria-labelledby="toolkit-heading" className="section-pad rounded-[28px] bg-ink text-paper">
      <div className="site-container">
        <Reveal>
          <SectionHeader
            id="toolkit-heading"
            eyebrow={section?.eyebrow || "Toolkit"}
            title={section?.title || "Skills and Tools I Use"}
            body={section?.body || undefined}
          />
        </Reveal>

        <Reveal y={36}>
          <HoverBrandLogo items={items} />
        </Reveal>
      </div>
    </section>
  );
}
