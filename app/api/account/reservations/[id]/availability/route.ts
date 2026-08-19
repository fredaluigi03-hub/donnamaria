import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Checks whether a signed-in guest's own reservation could actually move to
 * a new check-in/check-out range — the same live check the "Prenota Ora"
 * flow does for a brand-new booking, but excluding the reservation's own
 * current row so its unchanged dates don't read as "occupied by itself".
 * See supabase/migrations/0009_check_availability_excluding.sql.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return NextResponse.json({ error: "Date non valide." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  // RLS scopes this to the caller's own row — a reservation that isn't
  // theirs (or doesn't exist) simply won't be found.
  const { data: reservation, error: fetchError } = await supabase
    .from("reservations")
    .select("room_slug")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: "Si è verificato un errore." }, { status: 500 });
  }
  if (!reservation) {
    return NextResponse.json({ error: "Prenotazione non trovata." }, { status: 404 });
  }

  const { data, error } = await supabase.rpc("check_room_availability_excluding", {
    p_check_in: checkIn,
    p_check_out: checkOut,
    p_exclude_reservation_id: id,
  });

  if (error) {
    return NextResponse.json({ error: "Si è verificato un errore." }, { status: 500 });
  }

  const roomAvailability = data.find((row) => row.room_slug === reservation.room_slug);
  return NextResponse.json({ available: roomAvailability?.is_available ?? false });
}
