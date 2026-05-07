import { cn } from "@/lib/cn";

export function OrangeTick({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("orange-tick", className)} />;
}
