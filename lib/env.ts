/**
 * Fail fast, with a clear message, when a required environment variable is
 * missing — instead of letting `undefined` reach a third-party constructor
 * (e.g. Supabase's `createClient`) and surface as an opaque "Invalid URL"
 * or similar error far from the real cause.
 *
 * Usage: `requireEnv("NEXT_PUBLIC_SUPABASE_URL")` in place of
 * `process.env.NEXT_PUBLIC_SUPABASE_URL!`.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable "${key}". Copy .env.example to ` +
        `.env.local and fill in a real value before starting the app.`,
    );
  }

  return value;
}

export function hasEnv(key: string): boolean {
  return typeof process.env[key] === "string" && process.env[key]!.trim().length > 0;
}

export function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}
