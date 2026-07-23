import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface KickerProps {
  children: ReactNode;
  className?: string;
  /** White text + white rule, for use over a photo (matches Hero's kicker). */
  inverted?: boolean;
}

/**
 * Small uppercase eyebrow label flanked by two thin gold rules — the same
 * treatment as the Hero's kicker (see components/sections/hero.tsx),
 * extracted so every section intro reads as one voice instead of the Hero
 * using this and every other section using a plain `<Badge>` pill.
 */
function Kicker({ children, className, inverted = false }: KickerProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-3 text-xs font-medium tracking-[0.35em] uppercase",
        inverted ? "text-white/85" : "text-muted-foreground",
        className,
      )}
    >
      <span className="bg-gold/70 h-px w-8" aria-hidden="true" />
      {children}
      <span className="bg-gold/70 h-px w-8" aria-hidden="true" />
    </span>
  );
}

export { Kicker };
