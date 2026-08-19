import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { toStayRange } from "@/lib/admin-store";
import type { Database } from "@/types/supabase";

type ReservationUpdate = Database["public"]["Tables"]["reservations"]["Update"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body)
    return NextResponse.json(
      { error: "Corpo della richiesta non valido." },
      { status: 400 },
    );

  const update: ReservationUpdate = {};
  if (body.customerName !== undefined) update.customer_name = body.customerName;
  if (body.email !== undefined) update.email = body.email;
  if (body.phone !== undefined) update.phone = body.phone;
  if (body.roomSlug !== undefined) update.room_slug = body.roomSlug;
  if (body.adults !== undefined) update.adults = body.adults;
  if (body.children !== undefined) update.children = body.children;
  if (body.status !== undefined) update.status = body.status;
  if (body.totalPrice !== undefined) update.total_price = body.totalPrice;
  if (body.notes !== undefined) update.notes = body.notes;
  if (body.checkIn !== undefined && body.checkOut !== undefined) {
    update.stay = toStayRange(body.checkIn, body.checkOut);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("reservations").update(update).eq("id", id);

  if (error) {
    if (error.code === "23P01") {
      return NextResponse.json(
        { error: "Queste date non sono più disponibili per questa camera." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("reservations").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
