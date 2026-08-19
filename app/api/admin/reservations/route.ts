import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { toStayRange, mapReservationRow } from "@/lib/admin-store";
import { getRoomBySlug } from "@/config/rooms";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    data.map((row) => mapReservationRow(row, (slug) => getRoomBySlug(slug)?.name)),
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body?.customerName ||
    !body?.email ||
    !body?.phone ||
    !body?.roomSlug ||
    !body?.checkIn ||
    !body?.checkOut
  ) {
    return NextResponse.json({ error: "Dati mancanti." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      customer_name: body.customerName,
      email: body.email,
      phone: body.phone,
      room_slug: body.roomSlug,
      stay: toStayRange(body.checkIn, body.checkOut),
      adults: body.adults ?? 0,
      children: body.children ?? 0,
      status: body.status ?? "pending",
      total_price: body.totalPrice ?? 0,
      notes: body.notes,
    })
    .select()
    .single();

  if (error) {
    // 23P01 = exclusion_violation — the dates overlap an existing,
    // non-cancelled reservation for this room. The database, not our
    // application code, is the one refusing the double booking.
    if (error.code === "23P01") {
      return NextResponse.json(
        { error: "Queste date non sono più disponibili per questa camera." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapReservationRow(data, (slug) => getRoomBySlug(slug)?.name));
}
