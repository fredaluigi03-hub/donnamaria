"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { pageTransitionVariants } from "@/lib/animations";

/**
 * Mount in the root layout, wrapping `{children}`. Keys the transition on
 * the pathname so each route gets its own enter/exit animation.
 * App Router streams by default, so this only affects the client-rendered
 * transition — it does not block navigation or data fetching.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransitionVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
