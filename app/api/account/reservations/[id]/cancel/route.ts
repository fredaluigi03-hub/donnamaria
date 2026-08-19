import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { mapReservationRow } from "@/lib/admin-store";
import { getRoomBySlug } from "@/config/rooms";

/**
 * Lets a signed-in guest cancel their own pending/confirmed reservation.
 * Uses the cookie-bound session client, not the service-role one — RLS
 * policy "guests can cancel their own reservation"
 * (supabase/migrations/0006_guest_cancellation.sql) is what actually
 * restricts this to the caller's own row, and a database trigger (not
 * this route) computes `refund_percentage` from the real check-in date,
 * so the refund policy can't be gamed by editing the request.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Si è verificato un errore." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "Prenotazione non trovata o non cancellabile." },
      { status: 404 },
    );
  }

  return NextResponse.json(mapReservationRow(data, (slug) => getRoomBySlug(slug)?.name));
}
