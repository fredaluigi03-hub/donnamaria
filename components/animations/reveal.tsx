"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { MOTION } from "@/lib/constants";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

/**
 * Clip-path "curtain" reveal — masks content behind a sliding panel rather
 * than fading it, for a more editorial/premium entrance than FadeIn.
 * Good for hero images, large headlines, and section dividers.
 */
export function Reveal({ children, className, delay = 0, once = true }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0 0)" }}
        viewport={{ once, amount: 0.3 }}
        transition={{
          duration: MOTION.durationSlow,
          ease: MOTION.easeEmphatic,
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
