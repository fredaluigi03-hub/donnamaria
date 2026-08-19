import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { mapReservationRow, nightsBetween, toStayRange } from "@/lib/admin-store";
import { getRoomBySlug } from "@/config/rooms";
import { stayDatesSchema } from "@/utils/validation";

/**
 * Lets a signed-in guest move the check-in/check-out dates of their own
 * pending/confirmed reservation — extend or shorten the stay. Uses the
 * cookie-bound session client, not the service-role one: RLS policy
 * "guests can modify dates of their own reservation"
 * (supabase/migrations/0008_guest_modify_dates.sql) restricts this to the
 * caller's own row, and the same Postgres exclusion constraint that
 * blocks a double-booked new reservation (0001_reservations.sql) blocks
 * this update too if the new dates overlap someone else's stay — this
 * route just translates that into a 409, it doesn't re-check availability
 * itself.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = stayDatesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dati non validi." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("reservations")
    .select("room_slug")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: "Si è verificato un errore." }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json(
      { error: "Prenotazione non trovata o non modificabile." },
      { status: 404 },
    );
  }

  const { checkIn, checkOut } = parsed.data;
  const room = getRoomBySlug(existing.room_slug);
  const nights = nightsBetween(checkIn, checkOut);
  const totalPrice = (room?.basePricePerNight ?? 0) * nights;

  const { data, error } = await supabase
    .from("reservations")
    .update({ stay: toStayRange(checkIn, checkOut), total_price: totalPrice })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    if (error.code === "23P01") {
      return NextResponse.json(
        {
          error:
            "Questa camera non è più disponibile per le nuove date. Prova un altro periodo.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Si è verificato un errore." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "Prenotazione non trovata o non modificabile." },
      { status: 404 },
    );
  }

  return NextResponse.json(mapReservationRow(data, (slug) => getRoomBySlug(slug)?.name));
}
