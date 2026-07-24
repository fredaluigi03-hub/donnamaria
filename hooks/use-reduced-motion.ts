"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Hydration-safe replacement for `motion/react`'s `useReducedMotion()`.
 *
 * The Motion library's own hook resolves `prefers-reduced-motion`
 * synchronously on the client's very first render (via `matchMedia`), but
 * server-rendered markup always assumes `false` — for any visitor who
 * actually has the OS setting on, that mismatch between the SSR HTML and
 * the first client render trips React's hydration warning on every
 * component that branches on it (variants, inline `style`, etc.).
 *
 * Built on the same `useSyncExternalStore`-backed `useMediaQuery` used
 * for `isMobile` elsewhere in the kit: it forces `false` on the server
 * and the client's first paint, then reconciles the real value in a
 * later, safe re-render — so the initial HTML always matches, and
 * reduced-motion users just see the calmer variant kick in a frame after
 * mount instead of causing a console warning.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
