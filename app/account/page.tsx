"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  LogOut,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Bed,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { FadeIn } from "@/components/animations/fade-in";
import {
  getCurrentUser,
  getUserReservations,
  loginWithGoogle,
  logoutUser,
  updateProfile,
  type UserProfile,
} from "@/lib/auth-store";
import { type Reservation } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-5", className)} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<"bookings" | "profile">("bookings");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [authError, setAuthError] = useState("");

  const [userReservations, setUserReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    function syncAuth() {
      const current = getCurrentUser();
      setUser(current);
      if (current) {
        getUserReservations().then(setUserReservations);
      } else {
        setUserReservations([]);
      }
    }
    syncAuth();

    window.addEventListener("donnamaria_auth_state_changed", syncAuth);
    return () => {
      window.removeEventListener("donnamaria_auth_state_changed", syncAuth);
    };
  }, []);

  async function handleGoogleLogin() {
    setIsLoading(true);
    setAuthError("");
    try {
      await loginWithGoogle(); // navigates away to Google; no further state update here
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Impossibile avviare l'accesso.");
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    await logoutUser();
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      await updateProfile({ name, phone });
      setProfileSuccessMsg("Profilo aggiornato con successo!");
      setTimeout(() => setProfileSuccessMsg(""), 3000);
    } catch {
      setProfileSuccessMsg("");
    }
  }

  // ----------------------------------------------------
  // UNAUTHENTICATED STATE: LOGIN / REGISTER MODAL
  // ----------------------------------------------------
  if (!user) {
    return (
      <Section className="relative py-20">
        <Container className="flex max-w-xl flex-col items-center">
          <div className="mb-8 text-center">
            <FadeIn>
              <Kicker>Area Ospiti</Kicker>
            </FadeIn>
            <FadeIn delay={0.05}>
              <SectionTitle>Accedi al tuo Account</SectionTitle>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-muted-foreground mt-2 text-sm">
                Gestisci le tue prenotazioni e accedi ai servizi esclusivi di Donna Maria
              </p>
            </FadeIn>
          </div>

          <div className="border-gold/40 bg-card/95 ring-gold/20 relative w-full overflow-hidden rounded-3xl border p-6 shadow-2xl ring-1 shadow-black/10 backdrop-blur-2xl sm:p-8">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="hover:border-gold/60 hover:bg-gold/10 border-border bg-background text-foreground flex h-12 w-full items-center justify-center gap-3 rounded-2xl border text-sm font-semibold shadow-md transition-all disabled:opacity-60"
            >
              <GoogleIcon />
              <span>
                {isLoading ? "Reindirizzamento a Google…" : "Accedi con Google"}
              </span>
            </button>

            {authError && (
              <p className="mt-4 text-center text-xs font-medium text-red-600">
                {authError}
              </p>
            )}

            <p className="text-muted-foreground mt-6 text-center text-xs">
              L&apos;accesso con email/password non è ancora disponibile — al momento è
              supportato solo l&apos;accesso con Google.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED STATE: DASHBOARD & BOOKINGS
  // ----------------------------------------------------
  return (
    <Section className="relative py-12">
      <Container className="flex flex-col gap-8">
        {/* User Card Header */}
        <div className="border-gold/40 flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-gradient-to-r from-[#181818] via-[#24201a] to-[#181818] p-6 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="border-gold/40 bg-gold/20 text-gold font-display flex size-14 items-center justify-center rounded-2xl border text-2xl font-bold uppercase shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gold text-xs font-semibold tracking-widest uppercase">
                  Area Ospiti
                </span>
                <span className="border-gold/40 bg-gold/20 text-gold rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase">
                  Accesso con {user.provider}
                </span>
              </div>
              <h1 className="font-display text-2xl font-semibold text-white">
                Benvenuto, {user.name}
              </h1>
              <p className="text-xs text-white/70">{user.email}</p>
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5"
          >
            <LogOut className="size-4" />
            Disconnetti
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-gold/30 bg-card/80 flex flex-wrap items-center gap-2 rounded-2xl border p-2 shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all",
              activeTab === "bookings"
                ? "border-gold/60 shadow-gold/20 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 shadow-lg"
                : "text-muted-foreground hover:bg-gold/10 hover:text-foreground",
            )}
          >
            <Calendar className="size-4" />
            <span>Le Mie Prenotazioni ({userReservations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("profile");
              setName(user.name);
              setPhone(user.phone ?? "");
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all",
              activeTab === "profile"
                ? "border-gold/60 shadow-gold/20 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 shadow-lg"
                : "text-muted-foreground hover:bg-gold/10 hover:text-foreground",
            )}
          >
            <User className="size-4" />
            <span>Dati Personali</span>
          </button>

          <Button
            asChild
            variant="outline"
            className="border-gold/40 hover:bg-gold/10 ml-auto text-xs uppercase"
          >
            <Link href="/contatti#richiedi-disponibilita">
              Nuova Prenotazione
              <ArrowRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: LE MIE PRENOTAZIONI */}
        {/* ---------------------------------------------------- */}
        {activeTab === "bookings" && (
          <div className="flex flex-col gap-6">
            {userReservations.length === 0 ? (
              <div className="border-gold/30 bg-card/90 flex flex-col items-center justify-center rounded-3xl border p-12 text-center shadow-xl backdrop-blur-md">
                <div className="border-gold/30 bg-gold/15 text-gold mb-4 flex size-14 items-center justify-center rounded-full border">
                  <Calendar className="size-7" />
                </div>
                <h3 className="font-display text-foreground text-xl font-semibold">
                  Nessuna prenotazione attiva
                </h3>
                <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                  Non hai ancora effettuato una richiesta di soggiorno a Donna Maria Suite
                  &amp; Relax.
                </p>
                <Button
                  asChild
                  className="border-gold/40 hover:shadow-gold/30 mt-6 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 uppercase"
                >
                  <Link href="/contatti#richiedi-disponibilita">
                    Prenota Ora un Soggiorno
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {userReservations.map((res) => (
                  <div
                    key={res.id}
                    className="border-gold/30 bg-card/90 hover:border-gold/60 relative flex flex-col justify-between rounded-3xl border p-6 shadow-xl backdrop-blur-md transition-all"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="border-border/60 flex items-center justify-between border-b pb-3">
                        <span className="text-muted-foreground font-mono text-xs font-bold">
                          {res.id}
                        </span>
                        {res.status === "confirmed" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 uppercase">
                            <CheckCircle2 className="size-3.5" />
                            Confermata
                          </span>
                        )}
                        {res.status === "pending" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-600 uppercase">
                            <Clock className="size-3.5" />
                            In Attesa
                          </span>
                        )}
                        {res.status === "cancelled" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-600 uppercase">
                            <XCircle className="size-3.5" />
                            Cancellata
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <Bed className="text-gold size-6 shrink-0" />
                        <div>
                          <h3 className="font-display text-foreground text-lg font-semibold">
                            {res.roomName}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            Donna Maria Suite &amp; Relax · Serino (AV)
                          </p>
                        </div>
                      </div>

                      <div className="border-border/60 bg-muted/30 grid grid-cols-2 gap-3 rounded-2xl border p-3 text-xs">
                        <div>
                          <span className="text-muted-foreground uppercase">
                            Check-in
                          </span>
                          <p className="text-foreground font-semibold">{res.checkIn}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground uppercase">
                            Check-out
                          </span>
                          <p className="text-foreground font-semibold">{res.checkOut}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-3">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Ospiti: </span>
                        <span className="font-semibold">
                          {res.adults} Adulti{" "}
                          {res.children > 0 && `+ ${res.children} Bambini`}
                        </span>
                      </div>
                      <div className="font-display text-gold text-lg font-bold">
                        € {res.totalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: DATI PERSONALI */}
        {/* ---------------------------------------------------- */}
        {activeTab === "profile" && (
          <div className="border-gold/30 bg-card/90 max-w-xl rounded-3xl border p-6 shadow-xl backdrop-blur-md">
            <h2 className="font-display text-gold mb-1 text-xl font-semibold">
              Modifica Dati Personali
            </h2>
            <p className="text-muted-foreground mb-6 text-xs">
              Aggiorna le tue informazioni di contatto per le prossime prenotazioni
            </p>

            {profileSuccessMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs font-semibold text-emerald-600">
                <Sparkles className="size-4" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pName">Nome e Cognome</Label>
                <Input
                  id="pName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gold/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pEmail">Email (Non modificabile)</Label>
                <Input id="pEmail" value={user.email} disabled className="bg-muted" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pPhone">Telefono per Contatto</Label>
                <Input
                  id="pPhone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 347 0000000"
                  className="border-gold/30"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="border-gold/40 hover:shadow-gold/30 mt-2 self-start border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] font-semibold text-amber-100 uppercase transition-all"
              >
                Salva Modifiche
              </Button>
            </form>
          </div>
        )}
      </Container>
    </Section>
  );
}
