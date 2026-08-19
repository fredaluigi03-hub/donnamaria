import { cookies } from "next/headers";

/**
 * Server-only admin session: an HMAC-signed, httpOnly cookie checked before
 * the dashboard ever renders. Replaces the previous scheme, where "logged
 * in" was just `localStorage.getItem(...) === "true"` — anyone could set
 * that from the browser console and skip the login form entirely, whether
 * or not they knew the password.
 */

export const COOKIE_NAME = "donnamaria_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // one work shift

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing ADMIN_SESSION_SECRET in production — set it in your environment before deploying.",
    );
  }
  return "dev-only-secret-do-not-use-in-production";
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Buffer.from(signature).toString("base64url");
}

/**
 * Real credentials, not shipped to the client. Falls back to admin/root
 * only outside production, so the demo keeps working out of the box —
 * `getSecret()` above enforces the equivalent fail-fast for the session
 * secret in production.
 */
export function checkAdminCredentials(username: string, password: string): boolean {
  const isDev = process.env.NODE_ENV !== "production";
  // `|| undefined`, not `??`: an env var present but set to "" (e.g. an
  // unfilled ADMIN_USERNAME= line in .env.local) must fall back too, and
  // `??` only catches null/undefined, not empty string.
  const expectedUsername = process.env.ADMIN_USERNAME || (isDev ? "admin" : undefined);
  const expectedPassword = process.env.ADMIN_PASSWORD || (isDev ? "root" : undefined);
  if (!expectedUsername || !expectedPassword) return false;
  return username === expectedUsername && password === expectedPassword;
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `admin.${expires}`;
  return `${payload}.${await hmac(payload)}`;
}

async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [role, expiresStr, signature] = token.split(".");
  const expires = Number(expiresStr);
  if (role !== "admin" || !Number.isFinite(expires) || Date.now() > expires) return false;
  return signature === (await hmac(`${role}.${expiresStr}`));
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}
