"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepperProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

/**
 * Numeric +/- counter — the primitive behind the guest picker (adults,
 * children). Buttons are real `<button type="button">` elements (not divs
 * with onClick) so they're keyboard- and screen-reader-operable by
 * default, and disable themselves at min/max instead of silently no-op'ing.
 */
function Stepper({
  label,
  description,
  value,
  onChange,
  min = 0,
  max = 10,
  className,
}: StepperProps) {
  function decrement() {
    if (value > min) onChange(value - 1);
  }

  function increment() {
    if (value < max) onChange(value + 1);
  }

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label={`Diminuisci ${label.toLowerCase()}`}
          className="border-input flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-accent"
        >
          <Minus className="size-3.5" aria-hidden="true" />
        </button>

        <span className="w-4 text-center text-sm font-medium tabular-nums" aria-live="polite">
          {value}
        </span>

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          aria-label={`Aumenta ${label.toLowerCase()}`}
          className="border-input flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-accent"
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export { Stepper };
