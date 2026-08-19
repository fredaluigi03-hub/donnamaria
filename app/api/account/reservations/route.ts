import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { mapReservationRow } from "@/lib/admin-store";
import { getRoomBySlug } from "@/config/rooms";

/**
 * Guest-scoped reservations, for a signed-in user's own `/account` page.
 * Uses the cookie-bound session client (not the admin/service-role one),
 * so RLS policy "guests can view their own reservations"
 * (supabase/migrations/0005_guest_reservations_rls.sql) does the actual
 * filtering — this route can't leak another guest's bookings even if the
 * query below were ever changed to omit a filter.
 *
 * No `.eq("email", ...)` filter here on purpose: RLS already matches
 * case-insensitively (`lower(email) = lower(jwt email)`), but a plain
 * `.eq()` here is case-sensitive and would silently hide every booking
 * whose stored email differs only in case from the Google account email —
 * which is exactly what made "my bookings" appear empty for real guests.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: "Si è verificato un errore." }, { status: 500 });
  return NextResponse.json(
    data.map((row) => mapReservationRow(row, (slug) => getRoomBySlug(slug)?.name)),
  );
}
