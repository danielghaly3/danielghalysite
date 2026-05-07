import { Pill } from "@/components/primitives/Pill";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";
import { fallbackGalleryItems } from "@/content/cms-fallbacks";
import type { GalleryItem, PageSection } from "@/types/cms";

type Gallery3DProps = {
  items?: GalleryItem[];
  section?: PageSection;
};

export function Gallery3D({ items = fallbackGalleryItems, section }: Gallery3DProps) {
  const galleryItems = items.length ? items : fallbackGalleryItems;
  const sliderImages = galleryItems.map((item) => ({
    src: item.image,
    alt: item.alt,
    caption: item.caption
  }));
  const ctaLabel = section?.ctaLabel || "Browse all Projects.";
  const ctaHref = section?.ctaHref || "#work";

  return (
    <section aria-labelledby="gallery-heading" className="section-pad overflow-hidden bg-paper">
      <div className="site-container">
        <SectionHeader
          id="gallery-heading"
          eyebrow={section?.eyebrow || "More work"}
          title={section?.title || "Other things I've made."}
          body={section?.body || "Snippets, side projects, and brand explorations."}
          centered
        />
        <div className="flex justify-center">
          <Pill href={ctaHref}>{ctaLabel}</Pill>
        </div>
      </div>

      <ImageAutoSlider images={sliderImages} className="mt-12" />
    </section>
  );
}
