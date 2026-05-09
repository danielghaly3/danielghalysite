"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function CmsToast({ message, tone }: { message: string; tone: "success" | "error" }) {
  if (!message) return null;

  const Icon = tone === "success" ? CheckCircle2 : XCircle;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
      className={cn(
        "fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-2 rounded-xl border px-4 py-3 text-[13px] shadow-2xl backdrop-blur-md cms-fade-in",
        tone === "error"
          ? "border-red-400/25 bg-red-950/85 text-red-100"
          : "border-emerald-400/25 bg-emerald-950/85 text-emerald-100"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", tone === "error" ? "text-red-300" : "text-emerald-300")} />
      <span className="min-w-0 break-words">{message}</span>
    </div>
  );
}
