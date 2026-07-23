/**
 * Cross-cutting constants that don't belong to a single feature.
 * Prefer adding to `config/site.ts` for site-identity values; this file is
 * for structural/behavioral constants (breakpoints, z-index scale, etc).
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  header: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  loadingScreen: 100,
} as const;

export const MOTION = {
  durationFast: 0.2,
  durationBase: 0.4,
  durationSlow: 0.7,
  easeStandard: [0.22, 1, 0.36, 1] as const,
  easeEmphatic: [0.16, 1, 0.3, 1] as const,
} as const;
