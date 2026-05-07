"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  as?: keyof React.JSX.IntrinsicElements;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
};

export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.3
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = (motion as unknown as Record<string, typeof motion.div>)[as] || motion.div;

  const variants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, transform: `translateY(${y}px)`, filter: "blur(6px)" },
    show: {
      opacity: 1,
      transform: "translateY(0px)",
      filter: "blur(0px)",
      transition: { duration: shouldReduceMotion ? 0.3 : 0.7, ease, delay: shouldReduceMotion ? 0 : delay }
    }
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}

Reveal.Group = function RevealGroup({
  children,
  className,
  stagger = 0.08
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: shouldReduceMotion ? 0 : stagger } }
      }}
    >
      {children}
    </motion.div>
  );
};
