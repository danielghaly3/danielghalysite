import Image from "next/image";
import { blurDataUrl } from "@/content/work";
import { cn } from "@/lib/cn";
import styles from "./image-auto-slider.module.css";

export type ImageAutoSliderItem = {
  src: string;
  alt: string;
  caption?: string;
};

type ImageAutoSliderProps = {
  images: ImageAutoSliderItem[];
  className?: string;
  durationSeconds?: number;
};

export function ImageAutoSlider({ images, className, durationSeconds = 28 }: ImageAutoSliderProps) {
  if (!images.length) return null;

  const sliderStyle = {
    "--slider-duration": `${durationSeconds}s`
  } as React.CSSProperties;

  return (
    <div className={cn(styles.root, "w-full", className)} style={sliderStyle}>
      <div className={styles.viewport}>
        <div className={styles.track} data-image-auto-slider-track>
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className={styles.group} aria-hidden={groupIndex === 1}>
              {images.map((image) => (
                <figure
                  key={`${groupIndex}-${image.src}-${image.caption ?? image.alt}`}
                  className={styles.card}
                  data-image-auto-slider-card
                >
                  <div className={styles.media}>
                    <Image
                      src={image.src}
                      alt={groupIndex === 0 ? image.alt : ""}
                      fill
                      placeholder="blur"
                      blurDataURL={blurDataUrl}
                      sizes="(min-width: 1024px) 320px, (min-width: 640px) 24vw, 58vw"
                      className="object-cover"
                    />
                    {image.caption ? <figcaption className={styles.caption}>{image.caption}</figcaption> : null}
                  </div>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
