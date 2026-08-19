import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";
import { requireEnv } from "@/lib/env";

/**
 * Stateless anon-key client for server code with no user session to track
 * (the public booking route). Row Level Security still applies exactly as
 * it would from the browser — this is not a privilege escalation, just the
 * same restricted access without needing cookies.
 */
export function createAnonServerClient() {
  return createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false } },
  );
}
