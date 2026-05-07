import { Reveal } from "@/components/primitives/Reveal";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import {
  ServiceCardCarousel,
  type ServiceCarouselItem
} from "@/components/ui/service-card-carousel";
import { fallbackServiceItems } from "@/content/cms-fallbacks";
import type { PageSection } from "@/types/cms";

type ServicesProps = {
  items?: ServiceCarouselItem[];
  section?: PageSection;
};

export function Services({ items = fallbackServiceItems, section }: ServicesProps) {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-pad rounded-[28px] bg-paper text-ink"
    >
      <div className="site-container">
        <Reveal>
          <SectionHeader
            id="services-heading"
            eyebrow={section?.eyebrow || "What I Offer"}
            title={section?.title || "Services"}
            body={section?.body || undefined}
          />
        </Reveal>

        <Reveal y={36}>
          <ServiceCardCarousel items={items} />
        </Reveal>
      </div>
    </section>
  );
}
