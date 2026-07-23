import type { Transition, Variants } from "motion/react";
import { MOTION } from "@/lib/constants";

/**
 * Shared Framer/Motion variants + transitions. Import these instead of
 * inlining `{ opacity: 0, y: 24 }` objects across components — one place
 * to retune the entire site's motion feel. See docs/Animations.md.
 */

export const transitionStandard: Transition = {
  duration: MOTION.durationBase,
  ease: MOTION.easeStandard,
};

export const transitionEmphatic: Transition = {
  duration: MOTION.durationSlow,
  ease: MOTION.easeEmphatic,
};

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionStandard },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transitionStandard },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: transitionStandard },
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: transitionStandard },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: transitionStandard },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: transitionStandard },
};

/** Wrap children with this on the parent to stagger their entrance. */
export function staggerContainer(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.durationBase, ease: MOTION.easeStandard },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: MOTION.durationFast, ease: MOTION.easeStandard },
  },
};
