"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

export function useInViewReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return { ref, inView };
}
