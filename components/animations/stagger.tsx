"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import { fadeUpVariants, staggerContainer } from "@/lib/animations";

export interface StaggerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  /** Delay in seconds between each direct child's animation. */
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
}

/**
 * Parent wrapper that staggers the entrance of its children. Wrap each
 * child in <StaggerItem> (below) or any `motion` element using the
 * default variant names ("hidden" / "visible").
 */
export function Stagger({
  children,
  staggerChildren = 0.08,
  delayChildren = 0,
  once = true,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={staggerContainer(staggerChildren, delayChildren)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  variants,
  ...props
}: HTMLMotionProps<"div"> & { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : (variants ?? fadeUpVariants)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
