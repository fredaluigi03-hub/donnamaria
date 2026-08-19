"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Glow } from "@/components/ui/glow";
import { GuestPicker, type GuestCounts } from "@/components/booking/guest-picker";
import {
  CustomDatePickerPopover,
  today,
  toISODate,
} from "@/components/booking/date-picker-popover";
import { useBooking } from "@/components/booking/booking-provider";
import { cn } from "@/lib/utils";

export interface SearchWidgetProps {
  className?: string;
}

// Relative to "now" (tomorrow, 3 nights), never a fixed calendar date — a
// hardcoded date reads as available today and is stale by next week.
function defaultStayDates() {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 1);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 3);
  return { checkIn: toISODate(checkIn), checkOut: toISODate(checkOut) };
}

/**
 * The homepage's visible search bar. Submitting no longer opens its own
 * modal — it hands the chosen dates to the single global booking flow
 * (see booking-provider.tsx), the same one every "Prenota" button on the
 * site now opens, so there's exactly one booking experience, not one per
 * entry point.
 */
export function SearchWidget({ className }: SearchWidgetProps) {
  const { openBooking } = useBooking();
  const [defaults] = useState(defaultStayDates);
  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [guests, setGuests] = useState<GuestCounts>({ adults: 2, children: 0 });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    openBooking({
      checkIn,
      checkOut,
      adults: guests.adults,
      children: guests.children,
    });
  }

  return (
    <div className={cn("relative mx-auto max-w-5xl", className)}>
      <Glow subtle />

      <form
        onSubmit={handleSubmit}
        className="border-gold/40 bg-card/95 hover:border-gold/70 relative z-20 flex w-full flex-col rounded-3xl border shadow-[0_20px_60px_-15px_rgba(184,149,106,0.22)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_25px_70px_-10px_rgba(184,149,106,0.35)]"
      >
        <div
          aria-hidden="true"
          className="from-gold/90 to-gold/90 h-1 w-full bg-gradient-to-r via-amber-200"
        />

        <div className="flex flex-col gap-2 p-3 xl:flex-row xl:items-center xl:gap-3 xl:p-4">
          <span className="text-gold hidden shrink-0 items-center gap-1.5 px-4 text-[0.7rem] font-bold tracking-[0.25em] uppercase xl:flex">
            <Sparkles className="size-3.5" />
            Disponibilità
          </span>

          <CustomDatePickerPopover
            label="Check-in"
            value={checkIn}
            minDate={today}
            onChange={(val) => {
              setCheckIn(val);
              if (checkOut && checkOut <= val) setCheckOut("");
            }}
          />

          <div
            className="bg-border/80 hidden h-9 w-px shrink-0 xl:block"
            aria-hidden="true"
          />

          <CustomDatePickerPopover
            label="Check-out"
            value={checkOut}
            minDate={checkIn || today}
            onChange={setCheckOut}
          />

          <div
            className="bg-border/80 hidden h-9 w-px shrink-0 xl:block"
            aria-hidden="true"
          />

          <GuestPicker
            value={guests}
            onChange={setGuests}
            variant="pill"
            className="hover:bg-gold/10 hover:border-gold/30 h-16 flex-1 rounded-2xl border border-transparent px-5 transition-all"
          />

          <Button
            type="submit"
            size="lg"
            disabled={!checkIn || !checkOut}
            className="border-gold/40 hover:shadow-gold/30 mt-2 h-14 w-full rounded-2xl border bg-gradient-to-r from-[#181818] via-[#24201a] to-[#181818] text-xs font-semibold tracking-widest text-amber-100 uppercase shadow-lg shadow-black/20 transition-all hover:scale-[1.02] xl:mt-0 xl:ml-2 xl:w-auto xl:px-9"
          >
            Verifica disponibilità
          </Button>
        </div>
      </form>
    </div>
  );
}
