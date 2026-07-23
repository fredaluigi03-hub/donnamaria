"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

export interface HoverScaleProps extends HTMLMotionProps<"div"> {
  scale?: number;
  tapScale?: number;
}

/**
 * Reusable hover/tap micro-interaction. Wrap cards, buttons-as-divs, or
 * image tiles for a consistent "premium" feel instead of ad-hoc
 * `hover:scale-105` Tailwind classes (which can't be disabled for
 * prefers-reduced-motion as cleanly as this can).
 */
export function HoverScale({ scale = 1.03, tapScale = 0.98, ...props }: HoverScaleProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { scale }}
      whileTap={shouldReduceMotion ? undefined : { scale: tapScale }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  );
}
