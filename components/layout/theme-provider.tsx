"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Wraps next-themes so dark mode is class-based (`.dark` on <html>),
 * matching the `--variant dark` selector in app/globals.css. Mounted once
 * in the root layout.
 *
 * Deliberately `forcedTheme="light"`: this is an art-directed site, not an
 * app, so one committed look — never whatever the visitor's OS happens to
 * say. Light is that look: the warm ivory palette (`#faf8f5` ground, ink
 * text, champagne bronze accent) is where this brand's elegance lives, and
 * it's what the luxury references (Aman, Six Senses, Bulgari) all do. Dark
 * is not automatically premium; on a hospitality site it reads closer to
 * nightlife than to a hillside retreat.
 *
 * Darkness stays where it earns its keep: the full-bleed cinematic media
 * (Hero footage, photo bands) carries its own dark ground with white type
 * over it. Luminous pages punctuated by dark immersive imagery is the
 * contrast rhythm — not one uniform tone everywhere.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="light"
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
