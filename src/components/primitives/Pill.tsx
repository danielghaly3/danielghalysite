"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type PillVariant = "primary" | "inverse" | "ghost";

type PillProps = {
  children: React.ReactNode;
  href?: string;
  variant?: PillVariant;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const variants: Record<PillVariant, string> = {
  primary: "bg-paper text-ink",
  inverse: "bg-ink text-paper",
  ghost: "border border-current bg-transparent text-current"
};

function PillInner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="pill-label">{children}</span>
      <span className="pill-circle" aria-hidden="true">
        <span className="pill-arrow-mask">
          <ArrowRight className="pill-arrow pill-arrow-one" strokeWidth={2} />
          <ArrowRight className="pill-arrow pill-arrow-two" strokeWidth={2} />
        </span>
      </span>
    </>
  );
}

export function Pill({
  children,
  href,
  variant = "primary",
  className,
  ariaLabel,
  onClick,
  type = "button"
}: PillProps) {
  const classes = cn("pill", variants[variant], className);

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 360, damping: 24 }}
      >
        <PillInner>{children}</PillInner>
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      <PillInner>{children}</PillInner>
    </motion.button>
  );
}
