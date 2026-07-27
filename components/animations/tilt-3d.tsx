"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /**
   * Max rotation in degrees at the edges. Kept deliberately small — this is
   * meant to read as depth/tactility, not as a card flip. docs/03_DESIGN_SYSTEM.md
   * lists "heavy transforms" under Avoid, so anything past ~6° is off-brand.
   */
  max?: number;
}

/**
 * Real perspective tilt that follows the pointer — the image plane leans a
 * few degrees toward the cursor, so a flat photo gains an actual sense of
 * depth instead of just scaling on hover.
 *
 * Skipped entirely (renders as a plain wrapper) when the pointer can't hover
 * — touch screens would only ever see a stuck rotation, since there's no
 * "leave" to reset it — and when `prefers-reduced-motion` is set. Gated on
 * `useMounted()` too: both of those resolve only after hydration, so applying
 * them straight away would make the server and the client's first paint
 * disagree. Transform-only (rotate), so it stays on the compositor.
 */
export function Tilt3D({ children, className, max = 5 }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const shouldReduceMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover)");
  const active = mounted && !shouldReduceMotion && canHover;

  // Raw pointer position, normalized to -0.5…0.5 around the element's center.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  // Spring the raw input, then map to degrees — smoothing the source keeps the
  // lean from snapping on fast cursor moves without needing to animate the
  // rotation itself.
  const spring = { stiffness: 120, damping: 18, mass: 0.4 };
  const smoothX = useSpring(pointerX, spring);
  const smoothY = useSpring(pointerY, spring);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-max, max]);
  // Inverted: pointer below center should lean the top of the plane away.
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [max, -max]);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !active) return;
    const rect = el.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn("[perspective:1200px]", className)}
    >
      <motion.div
        className="h-full w-full"
        style={active ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
