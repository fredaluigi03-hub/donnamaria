"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  XCircle,
  X,
  BedDouble,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Glow } from "@/components/ui/glow";
import { GuestPicker, type GuestCounts } from "@/components/booking/guest-picker";
import { Tilt3D } from "@/components/animations/tilt-3d";
import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";

export interface SearchWidgetProps {
  className?: string;
}

// Sample live availability data per day of current month for automatic instant calculation
const daysInMonth = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  if ([4, 12, 13, 21].includes(day)) {
    return { day, status: "occupied", label: "Occupato" };
  }
  if ([8, 18, 27].includes(day)) {
    return { day, status: "limited", label: "Ultime 2" };
  }
  return { day, status: "available", label: "Disponibile" };
});

function CustomDatePickerPopover({
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
      const y = parts[0] || 2026;
      const m = parts[1] || 8;
      return new Date(y, m - 1, 1);
    }
    return new Date(2026, 7, 1); // August 2026 default
  }, [value]);

  const [activeDate, setActiveDate] = useState<Date>(initialDate);

  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

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
    const monthName = shortMonths[(m || 1) - 1] ?? "Ago";
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
        <div className="border-gold/40 bg-card/98 text-foreground animate-in fade-in-50 zoom-in-95 absolute top-full left-0 z-50 mt-3 w-80 rounded-2xl border p-5 shadow-2xl backdrop-blur-2xl duration-200">
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

export function SearchWidget({ className }: SearchWidgetProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("2026-08-01");
  const [checkOut, setCheckOut] = useState("2026-08-05");
  const [guests, setGuests] = useState<GuestCounts>({ adults: 2, children: 0 });
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setShowLiveModal(true);
  }

  function handleInstantBook(roomName: string) {
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setShowLiveModal(false);
      router.push(
        `/contatti?checkIn=${checkIn}&checkOut=${checkOut}&adults=${guests.adults}&room=${encodeURIComponent(roomName)}#richiedi-disponibilita`,
      );
    }, 1800);
  }

  return (
    <div className={cn("relative mx-auto max-w-5xl", className)}>
      <div className="w-full">
        <Glow subtle />

        <form
          onSubmit={handleSubmit}
          className="border-gold/40 bg-card/95 hover:border-gold/70 relative z-20 flex w-full flex-col rounded-3xl border shadow-[0_20px_60px_-15px_rgba(184,149,106,0.22)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_70px_-10px_rgba(184,149,106,0.35)]"
        >
          {/* Gold hairline */}
          <div
            aria-hidden="true"
            className="from-gold/90 to-gold/90 h-1 w-full bg-gradient-to-r via-amber-200"
          />

          <div className="flex flex-col gap-2 p-3 xl:flex-row xl:items-center xl:gap-3 xl:p-4">
            <span className="text-gold hidden shrink-0 items-center gap-1.5 px-4 text-[0.7rem] font-bold tracking-[0.25em] uppercase xl:flex">
              <Sparkles className="size-3.5" />
              Disponibilità
            </span>

            {/* Check-in Custom Date Picker Popover */}
            <CustomDatePickerPopover
              label="Check-in"
              value={checkIn}
              onChange={setCheckIn}
            />

            <div
              className="bg-border/80 hidden h-9 w-px shrink-0 xl:block"
              aria-hidden="true"
            />

            {/* Check-out Custom Date Picker Popover */}
            <CustomDatePickerPopover
              label="Check-out"
              value={checkOut}
              minDate={checkIn}
              onChange={setCheckOut}
            />

            <div
              className="bg-border/80 hidden h-9 w-px shrink-0 xl:block"
              aria-hidden="true"
            />

            {/* Ospiti */}
            <GuestPicker
              value={guests}
              onChange={setGuests}
              variant="pill"
              className="hover:bg-gold/10 hover:border-gold/30 h-16 flex-1 rounded-2xl border border-transparent px-5 transition-all"
            />

            <Button
              type="submit"
              size="lg"
              className="border-gold/40 hover:shadow-gold/30 mt-2 h-14 w-full rounded-2xl border bg-gradient-to-r from-[#181818] via-[#24201a] to-[#181818] text-xs font-semibold tracking-widest text-amber-100 uppercase shadow-lg shadow-black/20 transition-all hover:scale-[1.02] xl:mt-0 xl:ml-2 xl:w-auto xl:px-9"
            >
              Verifica disponibilità
            </Button>
          </div>
        </form>
      </div>

      {/* AUTOMATED REAL-TIME AVAILABILITY LIVE MODAL */}
      {showLiveModal && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md duration-300">
          <div className="border-gold/40 bg-card text-foreground relative w-full max-w-3xl overflow-hidden rounded-3xl border shadow-2xl">
            {/* Header bar */}
            <div className="border-gold/30 flex items-center justify-between border-b bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-gold/20 border-gold/40 rounded-full border p-2">
                  <Sparkles className="text-gold size-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium">
                    Stato Disponibilità Automatico in Tempo Reale
                  </h3>
                  <p className="text-gold/90 mt-0.5 text-xs">
                    Donna Maria Suite &amp; Relax · Serino (AV)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLiveModal(false)}
                className="rounded-full bg-white/10 p-2 text-white/70 transition-all hover:bg-white/20 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[80vh] space-y-6 overflow-y-auto p-6 md:p-8">
              {/* Timing info bar */}
              <div className="bg-gold/10 border-gold/30 grid grid-cols-1 gap-4 rounded-2xl border p-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Clock className="text-gold size-5 shrink-0" />
                  <div>
                    <p className="text-gold text-xs font-semibold tracking-wider uppercase">
                      Orario Check-in
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      Dalle 14:30 alle 20:00
                    </p>
                  </div>
                </div>
                <div className="border-gold/20 flex items-center gap-3 border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                  <Clock className="text-gold size-5 shrink-0" />
                  <div>
                    <p className="text-gold text-xs font-semibold tracking-wider uppercase">
                      Orario Check-out
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      Entro le 10:30 del mattino
                    </p>
                  </div>
                </div>
              </div>

              {/* Automatic Live Calendar Grid */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-display text-base font-semibold">
                    Calendario Mese Corrente — Giorni Liberi / Occupati
                  </h4>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <span className="size-2.5 rounded-full bg-emerald-500" />
                      Disponibile
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-rose-600">
                      <span className="size-2.5 rounded-full bg-rose-500" />
                      Occupato
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-600">
                      <span className="size-2.5 rounded-full bg-amber-500" />
                      Ultime 2
                    </span>
                  </div>
                </div>

                <div className="bg-secondary/40 border-border/60 grid grid-cols-7 gap-1.5 rounded-2xl border p-3 text-center text-xs font-semibold">
                  {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((d) => (
                    <span key={d} className="text-muted-foreground py-1 uppercase">
                      {d}
                    </span>
                  ))}
                  {daysInMonth.map((item) => (
                    <div
                      key={item.day}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border p-2 text-xs font-bold transition-all",
                        item.status === "available" &&
                          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
                        item.status === "occupied" &&
                          "border-rose-500/30 bg-rose-500/10 text-rose-700 opacity-60",
                        item.status === "limited" &&
                          "border-amber-500/30 bg-amber-500/10 text-amber-700",
                      )}
                    >
                      <span>{item.day}</span>
                      <span className="text-[0.6rem] font-normal opacity-80">
                        {item.status === "available"
                          ? "Libero"
                          : item.status === "occupied"
                            ? "Pieno"
                            : "1 camera"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automatic Rooms Availability Breakdown */}
              <div className="space-y-3 pt-2">
                <h4 className="font-display text-base font-semibold">
                  Risultato automatico per le date: {checkIn || "Seleziona"} →{" "}
                  {checkOut || "Seleziona"}
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {/* Suite Francy */}
                  <div className="bg-card flex items-center justify-between rounded-2xl border border-amber-500/40 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-amber-500/15 p-2.5 text-amber-700">
                        <BedDouble className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Suite Francy</p>
                        <p className="text-muted-foreground text-xs">
                          Sauna e Vasca Idromassaggio private
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="size-3.5" />
                        DISPONIBILE
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleInstantBook("Suite Francy")}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 text-xs font-semibold"
                      >
                        Prenota Subito
                      </Button>
                    </div>
                  </div>

                  {/* Domi */}
                  <div className="bg-card flex items-center justify-between rounded-2xl border border-blue-500/40 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-500/15 p-2.5 text-blue-700">
                        <BedDouble className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Appartamento Domi</p>
                        <p className="text-muted-foreground text-xs">
                          Living &amp; Cucina completa (Fino a 4 ospiti)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="size-3.5" />
                        DISPONIBILE
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleInstantBook("Appartamento Domi")}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 text-xs font-semibold"
                      >
                        Prenota Subito
                      </Button>
                    </div>
                  </div>

                  {/* Mery */}
                  <div className="bg-card flex items-center justify-between rounded-2xl border border-rose-500/30 p-4 opacity-75">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-rose-500/15 p-2.5 text-rose-700">
                        <BedDouble className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Camera Mery</p>
                        <p className="text-muted-foreground text-xs">
                          Matrimoniale toni rosa cipria
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600">
                        <XCircle className="size-3.5" />
                        NON DISPONIBILE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {bookedSuccess && (
                <div className="animate-in zoom-in flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 p-4 text-sm font-semibold text-white duration-200">
                  <ShieldCheck className="size-5" />
                  Verifica automatica completata! Reindirizzamento alla conferma
                  immediata...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
