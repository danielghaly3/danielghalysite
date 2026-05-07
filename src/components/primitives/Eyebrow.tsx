import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}
