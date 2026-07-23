import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";
import { requireEnv } from "@/lib/env";

/**
 * Browser-side Supabase client. Use inside Client Components ("use client").
 * For Server Components, Server Actions, or Route Handlers use
 * `lib/supabase/server.ts` instead — never share a single client instance
 * across the server/browser boundary.
 */
export function createClient() {
  return createBrowserClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}
