const fs = require('fs');
const path = 'd:/Daniel_Site/Daniel_Site/src/components/ui/sticky-gallery.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/interface StickyGalleryProps \{[\s\S]*?\}/, `export type GalleryImageInput = string | { src: string; alt?: string };\n\ninterface StickyGalleryProps {\n  images: GalleryImageInput[];\n  layout: GalleryLayout;\n}`);

content = content.replace(/function Img\(\{ src, className \}: \{ src: string; className\?: string \}\) \{[\s\S]*?return \([\s\S]*?<Image[\s\S]*?src=\{src\}[\s\S]*?alt=""[\s\S]*?\/>[\s\S]*?\)[\s\S]*?\}/, `function Img({ image, className }: { image: GalleryImageInput; className?: string }) {
  const src = typeof image === 'string' ? image : image.src;
  const alt = typeof image === 'string' ? '' : (image.alt ?? '');
  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-[20px] border border-line bg-bone shadow-soft", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-[1.04]"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  );
}`);

content = content.replace(/\{ images: string\[\] \}/g, '{ images: GalleryImageInput[] }');
content = content.replace(/src=\{m\[/g, 'image={m[');

fs.writeFileSync(path, content);
console.log("Updated sticky-gallery.tsx successfully!");
