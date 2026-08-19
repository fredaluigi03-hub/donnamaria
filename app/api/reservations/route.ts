import { NextResponse } from "next/server";

import { createAnonServerClient } from "@/lib/supabase/anon";
import { nightsBetween, toStayRange } from "@/lib/admin-store";
import { bookingFormSchema } from "@/utils/validation";
import { getRoomBySlug } from "@/config/rooms";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dati non validi." },
      { status: 400 },
    );
  }

  const values = parsed.data;
  const room = getRoomBySlug(values.room);
  const nights = nightsBetween(values.checkIn, values.checkOut);
  const totalPrice = (room?.basePricePerNight ?? 0) * nights;

  const supabase = createAnonServerClient();
  // RLS (see supabase/migrations/0001_reservations.sql) independently caps
  // this insert to status "pending" even if this route's own check below
  // were ever bypassed or changed — the real guarantee lives in the
  // database, not in this request handler.
  const { error } = await supabase.from("reservations").insert({
    customer_name: values.name,
    email: values.email,
    phone: values.phone,
    room_slug: values.room as "suite-francy" | "domi" | "mery",
    stay: toStayRange(values.checkIn, values.checkOut),
    adults: values.adults,
    children: values.children,
    status: "pending",
    total_price: totalPrice,
    notes: values.message,
  });

  if (error) {
    if (error.code === "23P01") {
      return NextResponse.json(
        {
          error:
            "Questa camera non è più disponibile per le date scelte. Prova altre date o un'altra camera.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Si è verificato un errore. Riprova." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
