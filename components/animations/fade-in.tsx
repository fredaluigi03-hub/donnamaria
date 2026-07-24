"use client";

import { motion, type HTMLMotionProps } from "motion/react";

import { fadeUpVariants, fadeVariants } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface FadeInProps extends HTMLMotionProps<"div"> {
  /** Vertical offset in px the element rises from. Set 0 for a plain fade. */
  distance?: number;
  delay?: number;
  once?: boolean;
  /** Fraction of the element that must be visible to trigger. */
  amount?: number;
  /** Override the default ~0.4s duration — e.g. for slower, ceremonious hero entrances. */
  duration?: number;
}

/**
 * Fade (optionally fade-up) an element in as it enters the viewport.
 * The most-used animation primitive in the kit — reach for this before
 * writing a bespoke `whileInView` block.
 */
export function FadeIn({
  distance = 24,
  delay = 0,
  once = true,
  amount = 0.3,
  duration,
  variants,
  ...props
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const resolvedVariants = variants ?? (distance === 0 ? fadeVariants : fadeUpVariants);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={shouldReduceMotion ? fadeVariants : resolvedVariants}
      transition={{ delay, ...(duration !== undefined ? { duration } : {}) }}
      {...props}
    />
  );
}
