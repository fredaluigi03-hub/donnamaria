"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType } from "react";

import { staggerContainer } from "@/lib/animations";
import { useMounted } from "@/hooks/use-mounted";

export interface TextRevealProps {
  text: string;
  className?: string;
  /** Split by "word" (default, cheaper + more readable) or "char". */
  by?: "word" | "char";
  delay?: number;
  once?: boolean;
  as?: ElementType;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/**
 * Animate text in word-by-word (or char-by-char) with a masked vertical
 * reveal. Use for hero headlines and section titles — sparingly, since
 * char-splitting hurts screen-reader output (see accessibility note below).
 */
export function TextReveal({
  text,
  className,
  by = "word",
  delay = 0,
  once = true,
  as: Component = "span",
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useMounted();
  // Gated on `mounted`, not just `shouldReduceMotion` — Motion resolves
  // `matchMedia` synchronously on the client's first render (not inside an
  // effect), so branching into two structurally different trees (plain
  // text vs. the animated multi-span markup) based on it directly would
  // make the server and the client's first paint disagree on the DOM,
  // triggering a hydration mismatch. `useMounted()` is `false` on both the
  // server and the client's first paint, so both always render the same
  // (animated) branch; the plain-text branch only appears in a later,
  // post-hydration client-only re-render, which is safe.
  const reduceMotion = mounted && !!shouldReduceMotion;
  const units = by === "word" ? text.split(" ") : text.split("");

  if (reduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={className} aria-label={text}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.6 }}
        variants={staggerContainer(by === "word" ? 0.06 : 0.02, delay)}
        className="inline"
        aria-hidden="true"
      >
        {units.map((unit, index) => (
          <span key={index} className="inline-block overflow-hidden align-bottom">
            <motion.span className="inline-block" variants={wordVariants}>
              {unit === " " ? " " : unit}
              {by === "word" && index < units.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}
