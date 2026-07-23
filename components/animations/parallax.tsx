"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Pixels of vertical travel across the scroll range. Negative moves up. */
  offset?: number;
}

/**
 * Scroll-linked parallax translate, driven by Motion's `useScroll` against
 * this element's own viewport progress (no ScrollTrigger dependency needed
 * for simple cases — reach for GSAP/ScrollTrigger instead when you need
 * scrubbed timelines or pinning).
 */
export function Parallax({ children, className, offset = 80 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div style={{ y: shouldReduceMotion ? 0 : y }}>{children}</motion.div>
    </div>
  );
}
