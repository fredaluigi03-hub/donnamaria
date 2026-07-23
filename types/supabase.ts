/**
 * Placeholder Supabase database types.
 *
 * Replace this file per-project by running:
 *   npx supabase gen types typescript --project-id <id> > types/supabase.ts
 *
 * Keeping a minimal shape here (rather than `any`) means `lib/supabase/*`
 * compiles cleanly before the real schema is generated.
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
