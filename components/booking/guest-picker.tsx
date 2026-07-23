"use client";

import { useRef, useState } from "react";
import { ChevronDown, Users } from "lucide-react";

import { Stepper } from "@/components/ui/stepper";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

export interface GuestCounts {
  adults: number;
  children: number;
}

export interface GuestPickerProps {
  value: GuestCounts;
  onChange: (value: GuestCounts) => void;
  className?: string;
  /** Visual style: "pill" for the homepage search bar, "field" for a form. */
  variant?: "pill" | "field";
  /** id of an external <Label> describing this control, e.g. "guests-label". */
  labelledBy?: string;
}

export function formatGuestCounts({ adults, children }: GuestCounts): string {
  const adultsLabel = `${adults} ${adults === 1 ? "adulto" : "adulti"}`;
  if (children === 0) return adultsLabel;
  const childrenLabel = `${children} ${children === 1 ? "bambino" : "bambini"}`;
  return `${adultsLabel}, ${childrenLabel}`;
}

/**
 * Adults + children guest counter used by both the homepage search widget
 * and the booking form — a single controlled component so the two never
 * drift out of sync. Replaces the earlier plain "1–6 ospiti" dropdown,
 * which couldn't distinguish adults from children.
 */
export function GuestPicker({
  value,
  onChange,
  className,
  variant = "field",
  labelledBy,
}: GuestPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);

  return (
    <div ref={containerRef} className={cn("relative h-10", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={labelledBy}
        className={cn(
          "flex h-full w-full items-center gap-2.5 rounded-md text-left text-sm transition-colors",
          variant === "pill" ? "px-3.5" : "border-input border bg-transparent px-3.5 shadow-sm",
        )}
      >
        <Users className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
        <span className="flex flex-col leading-tight">
          {variant === "pill" && (
            <span className="text-muted-foreground text-[0.65rem] font-medium tracking-[0.1em] uppercase">
              Ospiti
            </span>
          )}
          <span>{formatGuestCounts(value)}</span>
        </span>
        <ChevronDown
          className={cn(
            "text-muted-foreground ml-auto size-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Seleziona il numero di ospiti"
          className="border-border bg-popover text-popover-foreground absolute top-full left-0 z-20 mt-2 w-72 rounded-lg border p-4 shadow-lg"
        >
          <Stepper
            label="Adulti"
            value={value.adults}
            min={1}
            max={10}
            onChange={(adults) => onChange({ ...value, adults })}
          />
          <div className="border-border my-3 border-t" />
          <Stepper
            label="Bambini"
            description="0–17 anni"
            value={value.children}
            min={0}
            max={10}
            onChange={(children) => onChange({ ...value, children })}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-primary mt-4 w-full text-right text-sm font-medium underline-offset-4 hover:underline"
          >
            Fatto
          </button>
        </div>
      )}
    </div>
  );
}
