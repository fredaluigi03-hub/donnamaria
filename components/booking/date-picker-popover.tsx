"use client";

import { useState, useRef, useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const today = toISODate(new Date());

const italianMonths = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const shortMonths = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giug",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

/** Shared date popover for both the homepage search bar and the global
 * booking modal's "search" step (see booking-provider.tsx) — one calendar
 * implementation, not two drifting copies. */
export function CustomDatePickerPopover({
  label,
  value,
  onChange,
  minDate,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  minDate?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setOpen(false), open);

  const initialDate = useMemo(() => {
    if (value && value.includes("-")) {
      const parts = value.split("-").map(Number);
      const y = parts[0] || new Date().getFullYear();
      const m = parts[1] || new Date().getMonth() + 1;
      return new Date(y, m - 1, 1);
    }
    return new Date();
  }, [value]);

  const [activeDate, setActiveDate] = useState<Date>(initialDate);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const currentMonthTitle = `${italianMonths[month]} ${year}`;
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  // Day offset for weekday alignment (0 = Monday, 6 = Sunday)
  const firstDayWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const emptyPaddingArray = Array.from({ length: firstDayWeekday }, (_, i) => i);

  function prevMonth(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setActiveDate(new Date(year, month - 1, 1));
  }

  function nextMonth(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setActiveDate(new Date(year, month + 1, 1));
  }

  const formattedDisplay = useMemo(() => {
    if (!value) return "Seleziona data";
    const parts = value.split("-");
    if (parts.length < 3) return value;
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    const monthName = shortMonths[(m || 1) - 1] ?? "Gen";
    return `${d} ${monthName} ${y}`;
  }, [value]);

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "hover:bg-gold/10 hover:border-gold/30 flex h-16 w-full cursor-pointer flex-col justify-center gap-0.5 rounded-2xl border px-5 text-left transition-all",
          open
            ? "border-gold/60 bg-gold/10 shadow-gold/10 shadow-lg"
            : "border-transparent",
        )}
      >
        <span className="text-gold flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
          <CalendarIcon className="size-3" />
          {label}
        </span>
        <span className="text-foreground text-sm font-semibold">{formattedDisplay}</span>
      </button>

      {open && (
        <div className="border-gold/40 bg-card/98 text-foreground animate-in fade-in-50 zoom-in-95 absolute top-full left-1/2 z-50 mt-3 w-[calc(100vw-2.5rem)] max-w-xs -translate-x-1/2 rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl duration-200 sm:p-5 xl:left-0 xl:translate-x-0">
          <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-2">
            <button
              type="button"
              onClick={prevMonth}
              className="hover:bg-gold/20 text-gold rounded-lg p-1.5 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-display text-gold text-sm font-semibold tracking-wide uppercase">
              {currentMonthTitle}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="hover:bg-gold/20 text-gold rounded-lg p-1.5 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="text-gold mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold">
            {["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {emptyPaddingArray.map((_, idx) => (
              <span key={`pad-${idx}`} />
            ))}
            {daysArray.map((dayNum) => {
              const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const isSelected = value === dayStr;
              const isMinDisabled = minDate && dayStr < minDate;

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={Boolean(isMinDisabled)}
                  onClick={() => {
                    onChange(dayStr);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-8 items-center justify-center rounded-xl font-medium transition-all",
                    isSelected
                      ? "bg-gold shadow-gold/40 scale-105 font-bold text-white shadow-md"
                      : isMinDisabled
                        ? "text-muted-foreground/40 cursor-not-allowed"
                        : "hover:bg-gold/20 hover:text-gold text-foreground",
                  )}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-3 text-xs">
            <span className="text-muted-foreground">Donna Maria Suite</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gold font-semibold hover:underline"
            >
              Conferma
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
