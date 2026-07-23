"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GuestPicker, type GuestCounts } from "@/components/booking/guest-picker";
import { cn } from "@/lib/utils";

export interface SearchWidgetProps {
  className?: string;
}

/**
 * The homepage "Booking-style" availability bar: check-in/check-out +
 * guests, single reusable component (also usable on /camere if that page
 * wants the same bar). Submitting takes the guest to the booking request
 * form (/contatti#richiedi-disponibilita) with the selection pre-filled
 * as query params — this kit has no live payment/availability engine (see
 * components/forms/booking-form.tsx), so "Verifica disponibilità" opens a
 * request, it doesn't confirm a real-time hold.
 */
export function SearchWidget({ className }: SearchWidgetProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<GuestCounts>({ adults: 2, children: 0 });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("adults", String(guests.adults));
    params.set("children", String(guests.children));
    router.push(`/contatti?${params.toString()}#richiedi-disponibilita`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "bg-card text-card-foreground border-border flex w-full flex-col gap-3 rounded-xl border p-3 shadow-xl sm:flex-row sm:items-center sm:gap-2",
        className,
      )}
    >
      <label className="flex h-14 flex-1 flex-col justify-center gap-0.5 rounded-lg px-3.5 sm:h-16">
        <span className="text-muted-foreground flex items-center gap-1.5 text-[0.65rem] font-medium tracking-[0.1em] uppercase">
          <CalendarRange className="size-3.5" aria-hidden="true" />
          Check-in
        </span>
        <input
          type="date"
          value={checkIn}
          onChange={(event) => setCheckIn(event.target.value)}
          className="text-foreground w-full bg-transparent text-sm outline-none"
        />
      </label>

      <div className="bg-border hidden h-10 w-px sm:block" aria-hidden="true" />

      <label className="flex h-14 flex-1 flex-col justify-center gap-0.5 rounded-lg px-3.5 sm:h-16">
        <span className="text-muted-foreground flex items-center gap-1.5 text-[0.65rem] font-medium tracking-[0.1em] uppercase">
          <CalendarRange className="size-3.5" aria-hidden="true" />
          Check-out
        </span>
        <input
          type="date"
          value={checkOut}
          min={checkIn || undefined}
          onChange={(event) => setCheckOut(event.target.value)}
          className="text-foreground w-full bg-transparent text-sm outline-none"
        />
      </label>

      <div className="bg-border hidden h-10 w-px sm:block" aria-hidden="true" />

      <GuestPicker
        value={guests}
        onChange={setGuests}
        variant="pill"
        className="h-14 flex-1 sm:h-16"
      />

      <Button type="submit" size="lg" className="h-14 gap-2 sm:h-16 sm:px-8">
        <Search className="size-4" aria-hidden="true" />
        Verifica disponibilità
      </Button>
    </form>
  );
}
