import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Google redirects here after the user approves sign-in, with a one-time
 * `code` to exchange for a real session. This is the step that was
 * missing before — `signInWithOAuth` alone only starts the flow, it
 * never finishes it without a callback route to complete the handshake.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/account`);
}
