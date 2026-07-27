import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface SectionTitleProps {
  children: ReactNode;
  className?: string;
  /** White type, for use over full-bleed photography. */
  inverted?: boolean;
  /** Renders as h3 — for a heading nested under a section's own h2. */
  as?: "h2" | "h3";
}

/**
 * The one section heading treatment, shared by every section.
 *
 * Sized with `clamp()` rather than Tailwind's discrete `text-3xl md:text-4xl`
 * steps, which every section previously duplicated: 30px growing to 36px is
 * timid type, and next to a Hero that reaches ~96px it made the page visibly
 * lose confidence the moment the footage ended — a big part of why everything
 * below the hero read as empty rather than composed. This scales 40px → 76px
 * with the viewport, so the editorial voice holds all the way down.
 *
 * `max-w-[20ch]` (not a fixed rem width) keeps the measure tied to the type
 * size itself, so headings break into two or three deliberate lines at every
 * viewport instead of one cramped column of large text.
 */
function SectionTitle({
  children,
  className,
  inverted = false,
  as = "h2",
}: SectionTitleProps) {
  const Comp = as;

  return (
    <div className="relative isolate">
      {/* A soft warm light sitting behind the words and spilling past them —
          champagne, pulled from the same accent as the ambient ground. Light
          *behind* the block, so the glyph edges themselves stay perfectly
          crisp. `isolate` keeps the -z-10 layer inside this heading instead of
          sliding under the page's other stacking layers. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 blur-3xl",
          inverted ? "opacity-40" : "opacity-70",
        )}
        style={{
          background: inverted
            ? "radial-gradient(55% 60% at 25% 45%, rgba(255,255,255,0.20), transparent 72%)"
            : "radial-gradient(55% 60% at 25% 45%, rgba(184,149,106,0.28), transparent 72%)",
        }}
      />
      {/* Light and shade on the letterforms themselves, done the way print
          does it rather than with a glow:

          — A vertical gradient *fill* (lighter warm ink at the top, deeper at
            the baseline) reads as a single soft light falling from above. It's
            what gives large display type presence; a flat fill at this size
            looks printed on, not lit.
          — One wide, very low-opacity ambient shadow underneath, to lift the
            block off the ground. No hard offset drop shadow, no neon glow, no
            emboss — those are the things that date a page instantly.

          Both stay inside dark inks, so contrast against the ivory ground
          holds well past the 4.5:1 floor even at the gradient's lightest stop. */}
      <Comp
        className={cn(
          "font-display max-w-[20ch] bg-clip-text text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.02em] text-balance text-transparent",
          inverted
            ? "bg-gradient-to-b from-white via-white to-white/80 [text-shadow:0_2px_18px_rgba(10,8,6,0.35)]"
            : "bg-gradient-to-b from-[#26211c] via-[#181818] to-[#453b30] [text-shadow:0_10px_30px_rgba(24,20,16,0.10)]",
          className,
        )}
      >
        {children}
      </Comp>
    </div>
  );
}

export { SectionTitle };
