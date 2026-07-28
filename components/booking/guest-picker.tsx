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
          variant === "pill"
            ? "px-3.5"
            : "border-input border bg-transparent px-3.5 shadow-sm",
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
          className="border-gold/40 bg-card/95 text-foreground animate-in fade-in-50 zoom-in-95 absolute top-full left-1/2 z-50 mt-3 w-[calc(100vw-2.5rem)] max-w-xs -translate-x-1/2 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl duration-200 sm:p-5 xl:left-0 xl:translate-x-0"
        >
          <div className="border-border/60 mb-3 flex items-center gap-2 border-b pb-2">
            <Users className="text-gold size-4" />
            <span className="text-gold text-xs font-semibold tracking-widest uppercase">
              Ospiti della camera
            </span>
          </div>

          <Stepper
            label="Adulti"
            value={value.adults}
            min={1}
            max={10}
            onChange={(adults) => onChange({ ...value, adults })}
          />
          <div className="border-border/60 my-3 border-t" />
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
            className="bg-gold/15 hover:bg-gold/25 border-gold/30 text-gold mt-4 w-full rounded-xl border py-2 text-center text-xs font-semibold tracking-wider uppercase transition-all"
          >
            Conferma Ospiti
          </button>
        </div>
      )}
    </div>
  );
}
