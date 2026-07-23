"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { siteConfig } from "@/config/site";

export interface LoadingScreenProps {
  /** Called once the exit animation has finished. */
  onComplete?: () => void;
  /** Minimum time the screen stays up, in ms — avoids a jarring flash. */
  minDuration?: number;
}

/**
 * Full-viewport loading screen shown once per session on first load.
 * Mount conditionally from the root layout (client-only) and gate on
 * `sessionStorage` if you only want it on the very first visit — left
 * as a per-project decision, see docs/Animations.md#loading-screen.
 */
export function LoadingScreen({ onComplete, minDuration = 900 }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), minDuration);
    return () => clearTimeout(timer);
  }, [minDuration]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="bg-background fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
        >
          <motion.span
            className="font-display text-lg font-semibold tracking-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {siteConfig.name}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
