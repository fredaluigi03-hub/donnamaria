import { createClient } from "@/lib/supabase/client";
import { getReservations, type Reservation } from "@/lib/admin-store";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  provider: "email" | "google" | "apple";
  createdAt: string;
}

const AUTH_STORAGE_KEY = "donnamaria_user_profile_v1";

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    window.dispatchEvent(new Event("donnamaria_auth_state_changed"));
  } catch (err) {
    console.error("Failed to set current user:", err);
  }
}

export async function loginWithOAuth(provider: "google" | "apple"): Promise<UserProfile> {
  const supabase = createClient();

  // Try real Supabase OAuth if configured
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/account`,
        },
      });
      if (error) console.warn("Supabase OAuth notice:", error.message);
    }
  } catch (err) {
    console.warn("Supabase client notice:", err);
  }

  // Demo / fallback user session so account works immediately
  const mockUser: UserProfile = {
    id: `usr_${Math.floor(1000 + Math.random() * 9000)}`,
    name: provider === "google" ? "Mario Rossi (Google)" : "Marco Rossi (Apple)",
    email: provider === "google" ? "mario.rossi@gmail.com" : "marco.rossi@icloud.com",
    phone: "+39 347 1234567",
    avatarUrl:
      provider === "google"
        ? "https://lh3.googleusercontent.com/a/default-user"
        : undefined,
    provider,
    createdAt: new Date().toISOString(),
  };

  setCurrentUser(mockUser);
  return mockUser;
}

export async function loginWithEmail(email: string, name?: string): Promise<UserProfile> {
  const mockUser: UserProfile = {
    id: `usr_${Math.floor(1000 + Math.random() * 9000)}`,
    name: name || email.split("@")[0] || "Ospite",
    email,
    phone: "+39 333 1234567",
    provider: "email",
    createdAt: new Date().toISOString(),
  };

  setCurrentUser(mockUser);
  return mockUser;
}

export function logoutUser(): void {
  setCurrentUser(null);
  try {
    const supabase = createClient();
    supabase.auth.signOut().catch(() => {});
  } catch {}
}

export function getUserReservations(userEmail: string): Reservation[] {
  const all = getReservations();
  if (!userEmail) return [];
  return all.filter(
    (res) => res.email.toLowerCase().trim() === userEmail.toLowerCase().trim(),
  );
}
