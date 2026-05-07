import { Pill } from "@/components/primitives/Pill";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  id: string;
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
  cta?: { label: string; href: string };
  centered?: boolean;
  className?: string;
};

export function SectionHeader({
  id,
  index,
  eyebrow,
  title,
  body,
  cta,
  centered = false,
  className
}: SectionHeaderProps) {
  void index;

  if (centered) {
    return (
      <div className={cn("mx-auto mb-14 max-w-3xl text-center", className)}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="section-title mt-5">
          {title}
        </h2>
        {body ? <p className="mx-auto mt-6 max-w-xl text-lg leading-[1.55] text-ash">{body}</p> : null}
        {cta ? (
          <div className="mt-8 flex justify-center">
            <Pill href={cta.href}>{cta.label}</Pill>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("section-header mb-14", className)}>
      <div className="lg:col-span-7">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className="section-title mt-5">
          {title}
        </h2>
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        {body ? <p className="max-w-xl text-lg leading-[1.55] text-ash">{body}</p> : null}
        {cta ? (
          <div className="mt-8">
            <Pill href={cta.href}>{cta.label}</Pill>
          </div>
        ) : null}
      </div>
    </div>
  );
}
