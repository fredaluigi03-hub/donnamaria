import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { type Reservation } from "@/lib/admin-store";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  provider: "email" | "google" | "apple";
  createdAt: string;
}

function profileFromUser(user: User): UserProfile {
  const meta = user.user_metadata ?? {};
  const provider = user.app_metadata?.provider;
  return {
    id: user.id,
    name: meta.full_name || meta.name || user.email?.split("@")[0] || "Ospite",
    email: user.email ?? "",
    phone: meta.phone,
    avatarUrl: meta.avatar_url,
    provider: provider === "google" || provider === "apple" ? provider : "email",
    createdAt: user.created_at,
  };
}

// A real Supabase session lives behind an async check; `getCurrentUser()`
// stays synchronous (existing callers in header.tsx/account/page.tsx read
// it that way) by caching the last-known profile here and refreshing it
// via `onAuthStateChange`, which fires on load, on login, on logout, and
// after the OAuth callback completes.
let cachedUser: UserProfile | null = null;

if (typeof window !== "undefined") {
  const supabase = createClient();
  if (supabase) {
    supabase.auth.getUser().then(({ data }) => {
      cachedUser = data.user ? profileFromUser(data.user) : null;
      window.dispatchEvent(new Event("donnamaria_auth_state_changed"));
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      cachedUser = session?.user ? profileFromUser(session.user) : null;
      window.dispatchEvent(new Event("donnamaria_auth_state_changed"));
    });
  }
}

export function getCurrentUser(): UserProfile | null {
  return cachedUser;
}

/**
 * Starts the real Google OAuth flow via Supabase and navigates away to
 * Google's consent screen — there is no mock fallback left. If Supabase
 * or the Google provider aren't configured, this throws instead of
 * silently granting a fake session (which is what shipped before).
 */
export async function loginWithGoogle(): Promise<void> {
  const supabase = createClient();
  if (!supabase) {
    throw new Error("Accesso non disponibile: Supabase non è configurato.");
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function logoutUser(): Promise<void> {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut().catch(() => {});
  }
  cachedUser = null;
  window.dispatchEvent(new Event("donnamaria_auth_state_changed"));
}

/**
 * Updates the signed-in user's display name/phone on the real Supabase
 * account (stored in `user_metadata`), not just a local cache.
 */
export async function updateProfile(fields: {
  name?: string;
  phone?: string;
}): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: fields.name, phone: fields.phone },
  });
  if (error) throw error;
  if (data.user) {
    cachedUser = profileFromUser(data.user);
    window.dispatchEvent(new Event("donnamaria_auth_state_changed"));
  }
}

/**
 * Reads the signed-in guest's own reservations via the RLS-protected
 * `/api/account/reservations` route (see
 * supabase/migrations/0005_guest_reservations_rls.sql) — replaces the
 * previous call to the admin-only endpoint, which always returned nothing
 * for a real guest.
 */
export async function getUserReservations(): Promise<Reservation[]> {
  try {
    const res = await fetch("/api/account/reservations");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
