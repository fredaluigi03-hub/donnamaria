import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";
import { requireEnv } from "@/lib/env";

/**
 * Full-privilege Supabase client — bypasses Row Level Security entirely.
 * Only call this from a Route Handler already gated by
 * `isAdminAuthenticated()` (see lib/admin-auth.ts). Never import this into
 * a "use client" file: the service_role key must never reach the browser.
 */
export function createAdminClient() {
  return createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );
}
