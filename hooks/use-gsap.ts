"use client";

import type { RefObject } from "react";
import { gsap } from "gsap";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";

type ContextSafeCallback = (context: gsap.Context) => void;

/**
 * Scoped GSAP context bound to a ref. All tweens/ScrollTriggers created
 * inside `callback` are automatically reverted on unmount and on
 * dependency changes — prevents the classic "GSAP animations leak across
 * route changes" bug in the App Router.
 *
 * Usage:
 *   const scope = useRef<HTMLDivElement>(null);
 *   useGsap(() => {
 *     gsap.from(".item", { opacity: 0, y: 20, stagger: 0.1 });
 *   }, scope, [deps]);
 */
export function useGsap(
  callback: ContextSafeCallback,
  scope: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(callback, scope.current ?? undefined);
    return () => ctx.revert();
  }, deps);
}
