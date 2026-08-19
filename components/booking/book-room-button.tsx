"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/booking/booking-provider";
import type { RoomSlug } from "@/types";

/**
 * Opens the global booking modal pre-filled to one room. Exists because the
 * pages that need this button (room detail pages) are Server Components —
 * they can pass a `roomSlug` string down, but not a `useBooking()` closure,
 * so the click handler has to live in its own small client component.
 */
export function BookRoomButton({
  roomSlug,
  label = "Richiedi disponibilità",
  className,
}: {
  roomSlug: RoomSlug;
  label?: string;
  className?: string;
}) {
  const { openBooking } = useBooking();
  return (
    <Button size="lg" onClick={() => openBooking({ roomSlug })} className={className}>
      {label}
      <ArrowRight aria-hidden="true" />
    </Button>
  );
}
