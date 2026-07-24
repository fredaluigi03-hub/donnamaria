"use client";

import { motion, type HTMLMotionProps } from "motion/react";

import {
  fadeVariants,
  slideInLeftVariants,
  slideInRightVariants,
} from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface SlideInProps extends HTMLMotionProps<"div"> {
  direction?: "left" | "right";
  delay?: number;
  once?: boolean;
  amount?: number;
}

/** Slide an element in horizontally as it enters the viewport. */
export function SlideIn({
  direction = "left",
  delay = 0,
  once = true,
  amount = 0.3,
  ...props
}: SlideInProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = direction === "left" ? slideInLeftVariants : slideInRightVariants;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={shouldReduceMotion ? fadeVariants : variants}
      transition={{ delay }}
      {...props}
    />
  );
}
