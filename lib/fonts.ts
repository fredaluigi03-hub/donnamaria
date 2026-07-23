import { Fraunces, Inter } from "next/font/google";

/**
 * Central font configuration.
 *
 * - `fontSans` is the workhorse body/UI typeface.
 * - `fontDisplay` is used for headings and hero type; swap it per client
 *   brand without touching component code, since consumers reference the
 *   `--font-sans` / `--font-display` CSS variables, not these names.
 *
 * `Fraunces` is an editorial serif — warm, italic-friendly, reads as
 * boutique-hotel rather than corporate — paired with `Inter` for legible
 * body copy and UI chrome.
 */
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
