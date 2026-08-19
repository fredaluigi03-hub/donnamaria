import { NextResponse } from "next/server";

import { createAnonServerClient } from "@/lib/supabase/anon";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return NextResponse.json({ error: "Date non valide." }, { status: 400 });
  }

  const supabase = createAnonServerClient();
  const { data, error } = await supabase.rpc("check_room_availability", {
    p_check_in: checkIn,
    p_check_out: checkOut,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    data.map((row) => ({ roomSlug: row.room_slug, available: row.is_available })),
  );
}
