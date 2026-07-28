"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Glow } from "@/components/ui/glow";
import { GuestPicker, type GuestCounts } from "@/components/booking/guest-picker";
import { cn } from "@/lib/utils";

export interface SearchWidgetProps {
  className?: string;
}

/**
 * The homepage availability strip: check-in/check-out + guests, single
 * reusable component (also usable on /camere if that page wants the same
 * bar). Submitting takes the guest to the booking request form
 * (/contatti#richiedi-disponibilita) with the selection pre-filled as
 * query params — this kit has no live payment/availability engine (see
 * components/forms/booking-form.tsx), so "Verifica disponibilità" opens a
 * request, it doesn't confirm a real-time hold. Styled as a plain
 * hairline-bordered strip rather than a floating card, deliberately
 * avoiding the OTA "search engine" look (icons, shadow, rounded card).
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
    <div className={cn("relative", className)}>
      {/* Same champagne bleed as the amenity cards and the room booking rail —
          this is the one panel on the homepage that asks for a commitment, so
          it gets the site's "lit object" treatment rather than sitting on the
          page as a bare rule. */}
      <Glow subtle />

      <form
        onSubmit={handleSubmit}
        className="bg-card border-border/70 flex w-full flex-col overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(24,20,16,0.05),0_20px_48px_-22px_rgba(24,20,16,0.28)]"
      >
        {/* Gold hairline, the same marker the amenity cards carry. */}
        <div
          aria-hidden="true"
          className="from-gold/70 via-gold to-gold/70 h-0.5 w-full bg-gradient-to-r"
        />

        <div className="flex flex-col gap-1 p-2 xl:flex-row xl:items-center xl:gap-2 xl:p-3">
          <span className="text-muted-foreground hidden shrink-0 px-4 text-[0.65rem] font-medium tracking-[0.2em] uppercase xl:block">
            Disponibilità
          </span>

          {/* Each field is its own quiet surface that warms on hover, so the
              row reads as three deliberate controls instead of one long bar
              of unlabelled inputs. */}
          <label className="hover:bg-secondary/60 flex h-16 flex-1 cursor-pointer flex-col justify-center gap-0.5 rounded-xl px-4 transition-colors">
            <span className="text-muted-foreground text-[0.65rem] font-medium tracking-[0.15em] uppercase">
              Check-in
            </span>
            <input
              type="date"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              className="text-foreground w-full cursor-pointer bg-transparent text-sm font-medium outline-none"
            />
          </label>

          <div
            className="bg-border/70 hidden h-9 w-px shrink-0 xl:block"
            aria-hidden="true"
          />

          <label className="hover:bg-secondary/60 flex h-16 flex-1 cursor-pointer flex-col justify-center gap-0.5 rounded-xl px-4 transition-colors">
            <span className="text-muted-foreground text-[0.65rem] font-medium tracking-[0.15em] uppercase">
              Check-out
            </span>
            <input
              type="date"
              value={checkOut}
              min={checkIn || undefined}
              onChange={(event) => setCheckOut(event.target.value)}
              className="text-foreground w-full cursor-pointer bg-transparent text-sm font-medium outline-none"
            />
          </label>

          <div
            className="bg-border/70 hidden h-9 w-px shrink-0 xl:block"
            aria-hidden="true"
          />

          <GuestPicker
            value={guests}
            onChange={setGuests}
            variant="pill"
            className="hover:bg-secondary/60 h-16 flex-1 rounded-xl px-4 transition-colors"
          />

          {/* Solid, not outline: it's the primary action of the panel. Full
              width on the stacked layout so it never reads as an afterthought
              under the fields. */}
          <Button
            type="submit"
            size="lg"
            className="mt-1 w-full xl:mt-0 xl:ml-2 xl:w-auto xl:px-8"
          >
            Verifica disponibilità
          </Button>
        </div>
      </form>
    </div>
  );
}
