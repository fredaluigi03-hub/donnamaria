"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, User } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Posts to /api/admin/login, which verifies against server-only env vars and
 * sets an httpOnly session cookie — the credentials never reach this bundle.
 * `router.refresh()` re-runs the server component in app/admin/page.tsx,
 * which reads that cookie and swaps in the dashboard.
 */
export function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setLoginError("Credenziali errate.");
        return;
      }
      router.refresh();
    } catch {
      setLoginError("Errore di connessione. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Section className="relative min-h-[85vh] py-20">
      <Container className="flex max-w-md flex-col items-center justify-center">
        <div className="border-gold/40 bg-card/95 ring-gold/20 relative w-full overflow-hidden rounded-3xl border p-8 shadow-2xl ring-1 shadow-black/20 backdrop-blur-2xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="border-gold/40 bg-gold/15 text-gold mb-3 flex size-14 items-center justify-center rounded-full border shadow-md">
              <ShieldCheck className="size-7" />
            </div>
            <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
              Donna Maria Suite &amp; Relax
            </span>
            <h1 className="font-display text-foreground text-2xl font-semibold">
              Area Riservata Gestionale
            </h1>
            <p className="text-muted-foreground mt-1 text-xs">
              Accedi con le credenziali di amministratore
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" className="text-xs font-semibold uppercase">
                Username
              </Label>
              <div className="relative">
                <User className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-gold/30 focus:border-gold pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase">
                Password
              </Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-gold/30 focus:border-gold pl-9"
                />
              </div>
            </div>

            {loginError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500">
                {loginError}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="border-gold/40 hover:shadow-gold/30 mt-2 w-full border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] font-semibold text-amber-100 uppercase transition-all"
            >
              {isSubmitting ? "Accesso in corso…" : "Accedi al Gestionale"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
