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
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  BadgeCheck,
  Ban,
  Undo2,
  Loader2,
  Cake,
  MapPin,
  Users2,
  Pencil,
  Check,
  X,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { LogoWatermark } from "@/components/ui/logo-watermark";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Kicker } from "@/components/ui/kicker";
import { SectionTitle } from "@/components/ui/section-title";
import { FadeIn } from "@/components/animations/fade-in";
import {
  ageFromDateOfBirth,
  cancelReservation,
  checkReservationAvailability,
  getCurrentUser,
  getUserReservations,
  loginWithGoogle,
  logoutUser,
  modifyReservationDates,
  updateProfile,
  type UserGender,
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

/** Dark gradient header bar shared by every dialog on this page, matching
 * the global "Prenota Ora" booking modal's look instead of a plain white
 * card — the account area otherwise felt visually disconnected from the
 * rest of the site. */
function DialogHeaderBar({
  icon,
  title,
  subtitle,
  onClose,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClose: () => void;
}) {
  return (
    <div className="border-gold/30 flex items-center justify-between border-b bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] p-6 text-white">
      <div className="flex items-center gap-3">
        <div className="bg-gold/20 border-gold/40 rounded-full border p-2">{icon}</div>
        <div>
          <h3 className="font-display text-xl font-medium">{title}</h3>
          {subtitle && <p className="text-gold/90 mt-0.5 text-xs">{subtitle}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi"
        className="rounded-full bg-white/10 p-2 text-white/70 transition-all hover:bg-white/20 hover:text-white"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

type EditableFieldKey = "name" | "phone" | "dateOfBirth" | "gender" | "address";

/** One row of the account summary — read-only unless `editable`, in which
 * case a pencil turns it into an inline input with save/cancel instead of
 * navigating to a separate edit form. */
function ProfileRow({
  icon,
  label,
  displayValue,
  editable,
  isEditing,
  draft,
  onDraftChange,
  onStartEdit,
  onCancel,
  onSave,
  isSaving,
  type = "text",
  options,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  displayValue: string;
  editable?: boolean;
  isEditing?: boolean;
  draft?: string;
  onDraftChange?: (value: string) => void;
  onStartEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  type?: "text" | "tel" | "date" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="border-border/60 bg-muted/30 flex flex-col gap-2 rounded-2xl border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground flex shrink-0 items-center gap-2">
        {icon}
        {label}
      </span>

      {editable && isEditing ? (
        <div className="flex items-center gap-2">
          {type === "select" ? (
            <Select
              autoFocus
              value={draft}
              onChange={(e) => onDraftChange?.(e.target.value)}
              className="border-gold/40 h-9 text-xs"
            >
              {options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              autoFocus
              type={type}
              value={draft}
              onChange={(e) => onDraftChange?.(e.target.value)}
              placeholder={placeholder}
              max={type === "date" ? new Date().toISOString().slice(0, 10) : undefined}
              className="border-gold/40 h-9 text-xs"
            />
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            aria-label={`Salva ${label}`}
            className="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-500/10 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Annulla modifica"
            className="text-muted-foreground hover:bg-muted rounded-lg p-1.5 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="font-medium">{displayValue}</span>
          {editable && (
            <button
              type="button"
              onClick={onStartEdit}
              aria-label={`Modifica ${label}`}
              className="text-gold hover:bg-gold/10 rounded-lg p-1.5 transition-colors"
            >
              <Pencil className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const PROVIDER_LABELS: Record<UserProfile["provider"], string> = {
  google: "Google",
  apple: "Apple",
  email: "Email",
};

const GENDER_LABELS: Record<UserGender, string> = {
  female: "Donna",
  male: "Uomo",
  unspecified: "Preferisco non specificare",
};

const GENDER_OPTIONS = (Object.keys(GENDER_LABELS) as UserGender[]).map((value) => ({
  value,
  label: GENDER_LABELS[value],
}));

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Whole days from today (midnight-to-midnight) to a YYYY-MM-DD date. */
function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AccountPage() {
  // Starts null on both server and client (matching header.tsx's pattern)
  // and only picks up the real cached user inside the effect below, after
  // mount — reading getCurrentUser() synchronously here could return an
  // already-resolved session on the client while SSR always has none,
  // which is a server/client markup mismatch React has to discard and
  // re-render from scratch.
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"bookings" | "profile">("bookings");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [userReservations, setUserReservations] = useState<Reservation[]>([]);

  // Shown once, right after a guest's very first login, so name/phone are
  // saved to the account and never need to be retyped on a booking form.
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const [welcomePhone, setWelcomePhone] = useState("");
  const [isSavingWelcome, setIsSavingWelcome] = useState(false);

  useEffect(() => {
    function syncAuth() {
      const current = getCurrentUser();
      setUser(current);
      if (current) {
        getUserReservations().then(setUserReservations);
        if (!current.phone && !sessionStorage.getItem("donnamaria_welcome_dismissed")) {
          setWelcomeName(current.name);
          setShowWelcomeDialog(true);
        }
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

  function dismissWelcomeDialog() {
    sessionStorage.setItem("donnamaria_welcome_dismissed", "1");
    setShowWelcomeDialog(false);
  }

  async function handleSaveWelcomeProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingWelcome(true);
    try {
      await updateProfile({ name: welcomeName, phone: welcomePhone });
      sessionStorage.setItem("donnamaria_welcome_dismissed", "1");
      setShowWelcomeDialog(false);
    } finally {
      setIsSavingWelcome(false);
    }
  }

  // ----------------------------------------------------
  // Personal data — single banner, inline per-field editing
  // ----------------------------------------------------
  const [editingField, setEditingField] = useState<EditableFieldKey | null>(null);
  const [fieldDraft, setFieldDraft] = useState("");
  const [isSavingField, setIsSavingField] = useState(false);
  const [fieldSaveError, setFieldSaveError] = useState("");

  function startEditField(field: EditableFieldKey, currentValue: string) {
    setEditingField(field);
    setFieldDraft(currentValue);
    setFieldSaveError("");
  }

  function cancelEditField() {
    setEditingField(null);
    setFieldSaveError("");
  }

  async function saveEditField() {
    if (!editingField) return;
    setIsSavingField(true);
    setFieldSaveError("");
    try {
      switch (editingField) {
        case "name":
          await updateProfile({ name: fieldDraft });
          break;
        case "phone":
          await updateProfile({ phone: fieldDraft });
          break;
        case "dateOfBirth":
          await updateProfile({ dateOfBirth: fieldDraft });
          break;
        case "gender":
          await updateProfile({ gender: fieldDraft as UserGender });
          break;
        case "address":
          await updateProfile({ address: fieldDraft });
          break;
      }
      setEditingField(null);
    } catch (err) {
      setFieldSaveError(err instanceof Error ? err.message : "Impossibile salvare.");
    } finally {
      setIsSavingField(false);
    }
  }

  // ----------------------------------------------------
  // Cancel a reservation
  // ----------------------------------------------------
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  async function confirmCancelReservation() {
    if (!cancelTarget) return;
    setIsCancelling(true);
    setCancelError("");
    try {
      const updated = await cancelReservation(cancelTarget.id);
      setUserReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setCancelTarget(null);
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Impossibile cancellare la prenotazione.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  // ----------------------------------------------------
  // Modify a reservation's dates — live availability preview, same as the
  // "Prenota Ora" flow, before letting the guest actually save.
  // ----------------------------------------------------
  const [editTarget, setEditTarget] = useState<Reservation | null>(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [isSavingDates, setIsSavingDates] = useState(false);
  const [editDatesError, setEditDatesError] = useState("");
  const [datesAvailability, setDatesAvailability] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");

  function openEditDatesDialog(res: Reservation) {
    setEditTarget(res);
    setEditCheckIn(res.checkIn);
    setEditCheckOut(res.checkOut);
    setEditDatesError("");
    setDatesAvailability("idle");
  }

  function closeEditDatesDialog() {
    setEditTarget(null);
    setDatesAvailability("idle");
  }

  // Whether the two date fields currently form a checkable range — computed
  // during render rather than tracked as its own state, so the invalid case
  // never needs a synchronous setState inside the effect below.
  const datesRangeValid = Boolean(
    editCheckIn && editCheckOut && editCheckOut > editCheckIn,
  );

  useEffect(() => {
    if (!editTarget || !datesRangeValid) return;
    // "checking" is set inside the timeout callback, not synchronously in
    // the effect body — during the 400ms debounce window the guest just
    // sees the previous status rather than a flash of "checking" on every
    // keystroke.
    const timeout = setTimeout(() => {
      setDatesAvailability("checking");
      checkReservationAvailability(editTarget.id, editCheckIn, editCheckOut)
        .then((available) =>
          setDatesAvailability(available ? "available" : "unavailable"),
        )
        .catch(() => setDatesAvailability("idle"));
    }, 400);
    return () => clearTimeout(timeout);
  }, [editTarget, editCheckIn, editCheckOut, datesRangeValid]);

  // Ignores stale `datesAvailability` from before the range became invalid
  // (e.g. the guest just picked a check-out before check-in) instead of
  // trusting a leftover "available" from a previous valid combination.
  const effectiveDatesAvailability = datesRangeValid ? datesAvailability : "idle";

  async function confirmModifyDates(e: React.FormEvent) {
    e.preventDefault();
    if (!editTarget || effectiveDatesAvailability !== "available") return;
    setIsSavingDates(true);
    setEditDatesError("");
    try {
      const updated = await modifyReservationDates(
        editTarget.id,
        editCheckIn,
        editCheckOut,
      );
      setUserReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      closeEditDatesDialog();
    } catch (err) {
      setEditDatesError(
        err instanceof Error ? err.message : "Impossibile modificare la prenotazione.",
      );
    } finally {
      setIsSavingDates(false);
    }
  }

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
      <LogoWatermark />

      <Dialog
        open={showWelcomeDialog}
        onOpenChange={(open) => {
          if (!open) dismissWelcomeDialog();
        }}
      >
        <DialogContent
          showClose={false}
          className="border-gold/40 bg-card max-w-md overflow-hidden rounded-3xl border p-0 shadow-2xl"
        >
          <DialogTitle className="sr-only">
            Benvenuto, {user.name.split(" ")[0]}!
          </DialogTitle>
          <DialogDescription className="sr-only">
            Completa i tuoi dati una sola volta: verranno usati per pre-compilare
            automaticamente le tue prossime richieste di prenotazione.
          </DialogDescription>
          <DialogHeaderBar
            icon={<Sparkles className="text-gold size-5" />}
            title={`Benvenuto, ${user.name.split(" ")[0]}!`}
            subtitle="Donna Maria Suite & Relax · Serino (AV)"
            onClose={dismissWelcomeDialog}
          />

          <div className="p-6 sm:p-8">
            <p className="text-muted-foreground mb-4 text-sm">
              Completa i tuoi dati una sola volta: verranno usati per pre-compilare
              automaticamente le tue prossime richieste di prenotazione.
            </p>

            <form onSubmit={handleSaveWelcomeProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="wName">Nome e Cognome</Label>
                <Input
                  id="wName"
                  value={welcomeName}
                  onChange={(e) => setWelcomeName(e.target.value)}
                  required
                  className="border-gold/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="wPhone">Telefono per Contatto</Label>
                <Input
                  id="wPhone"
                  type="tel"
                  value={welcomePhone}
                  onChange={(e) => setWelcomePhone(e.target.value)}
                  placeholder="+39 347 0000000"
                  className="border-gold/30"
                />
              </div>

              <div className="mt-2 flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={isSavingWelcome}
                  className="border-gold/40 hover:shadow-gold/30 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] font-semibold text-amber-100 uppercase transition-all"
                >
                  {isSavingWelcome ? "Salvataggio…" : "Salva e continua"}
                </Button>
                <button
                  type="button"
                  onClick={dismissWelcomeDialog}
                  className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2"
                >
                  Completa più tardi
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCancelTarget(null);
            setCancelError("");
          }
        }}
      >
        <DialogContent
          showClose={false}
          className="border-gold/40 bg-card max-w-md overflow-hidden rounded-3xl border p-0 shadow-2xl"
        >
          <DialogTitle className="sr-only">Disdire la prenotazione?</DialogTitle>
          <DialogDescription className="sr-only">
            Rivedi la policy di rimborso prima di confermare.
          </DialogDescription>
          <DialogHeaderBar
            icon={<Ban className="text-gold size-5" />}
            title="Disdire la prenotazione?"
            subtitle="Donna Maria Suite & Relax · Serino (AV)"
            onClose={() => setCancelTarget(null)}
          />

          {cancelTarget && (
            <div className="p-6 sm:p-8">
              {(() => {
                const remaining = daysUntil(cancelTarget.checkIn);
                const fullRefund = remaining >= 7;
                return (
                  <div className="flex flex-col gap-4">
                    <p className="text-muted-foreground text-sm">
                      {cancelTarget.roomName} · Check-in {cancelTarget.checkIn}
                    </p>
                    <div
                      className={cn(
                        "rounded-2xl border p-4 text-sm",
                        fullRefund
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-700",
                      )}
                    >
                      {fullRefund ? (
                        <>
                          Mancano {remaining} giorni al check-in: hai diritto al{" "}
                          <strong>rimborso completo (100%)</strong>.
                        </>
                      ) : (
                        <>
                          Mancano {remaining < 0 ? 0 : remaining} giorni al check-in (meno
                          di 7): verrà rimborsato il <strong>70%</strong>, il{" "}
                          <strong>30%</strong> sarà trattenuto come da policy di
                          cancellazione.
                        </>
                      )}
                    </div>

                    {cancelError && (
                      <p className="text-destructive text-xs font-medium">
                        {cancelError}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={isCancelling}
                        onClick={confirmCancelReservation}
                        className="inline-flex items-center gap-1.5"
                      >
                        {isCancelling && <Loader2 className="size-4 animate-spin" />}
                        Conferma cancellazione
                      </Button>
                      <button
                        type="button"
                        onClick={() => setCancelTarget(null)}
                        className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={editTarget !== null}
        onOpenChange={(open) => !open && closeEditDatesDialog()}
      >
        <DialogContent
          showClose={false}
          className="border-gold/40 bg-card max-w-md overflow-hidden rounded-3xl border p-0 shadow-2xl"
        >
          <DialogTitle className="sr-only">Modifica le date del soggiorno</DialogTitle>
          <DialogDescription className="sr-only">
            Cambia il periodo di check-in/check-out — verifichiamo subito la disponibilità
            per le nuove date.
          </DialogDescription>
          <DialogHeaderBar
            icon={<Calendar className="text-gold size-5" />}
            title="Modifica le date del soggiorno"
            subtitle="Donna Maria Suite & Relax · Serino (AV)"
            onClose={closeEditDatesDialog}
          />

          {editTarget && (
            <div className="p-6 sm:p-8">
              <form onSubmit={confirmModifyDates} className="flex flex-col gap-4">
                <p className="text-muted-foreground text-sm">{editTarget.roomName}</p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editCheckIn">Check-in</Label>
                    <Input
                      id="editCheckIn"
                      type="date"
                      value={editCheckIn}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setEditCheckIn(e.target.value)}
                      className="border-gold/30"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editCheckOut">Check-out</Label>
                    <Input
                      id="editCheckOut"
                      type="date"
                      value={editCheckOut}
                      min={editCheckIn || new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setEditCheckOut(e.target.value)}
                      className="border-gold/30"
                      required
                    />
                  </div>
                </div>

                {/* Same live-availability language as the "Prenota Ora" flow's
                    results step, so a guest recognizes the pattern instead of
                    only finding out at save time whether the dates work. */}
                {effectiveDatesAvailability === "checking" && (
                  <p className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    Verifica disponibilità in corso…
                  </p>
                )}
                {effectiveDatesAvailability === "available" && (
                  <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 uppercase">
                    <CheckCircle2 className="size-3.5" />
                    Disponibile per queste date
                  </p>
                )}
                {effectiveDatesAvailability === "unavailable" && (
                  <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 uppercase">
                    <XCircle className="size-3.5" />
                    Non disponibile per queste date
                  </p>
                )}

                {editDatesError && (
                  <p className="text-destructive text-xs font-medium">{editDatesError}</p>
                )}

                <div className="mt-2 flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={isSavingDates || effectiveDatesAvailability !== "available"}
                    className="border-gold/40 hover:shadow-gold/30 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] font-semibold text-amber-100 uppercase transition-all"
                  >
                    {isSavingDates && <Loader2 className="size-4 animate-spin" />}
                    Salva nuove date
                  </Button>
                  <button
                    type="button"
                    onClick={closeEditDatesDialog}
                    className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2"
                  >
                    Annulla
                  </button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Container className="relative z-10 flex flex-col gap-8">
        {/* User Card Header */}
        <div className="border-gold/40 flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-gradient-to-r from-[#181818] via-[#24201a] to-[#181818] p-6 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- external Google avatar, no next/image domain configured
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="border-gold/40 bg-gold/20 size-14 shrink-0 rounded-2xl border object-cover shadow-inner"
              />
            ) : (
              <div className="border-gold/40 bg-gold/20 text-gold font-display flex size-14 shrink-0 items-center justify-center rounded-2xl border text-2xl font-bold uppercase shadow-inner">
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gold text-xs font-semibold tracking-widest uppercase">
                  Area Ospiti
                </span>
                <span className="border-gold/40 bg-gold/20 text-gold rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase">
                  Accesso con {PROVIDER_LABELS[user.provider]}
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
            onClick={() => setActiveTab("profile")}
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

                      {res.status !== "cancelled" &&
                        (() => {
                          const remaining = daysUntil(res.checkIn);
                          if (remaining < 0) return null;
                          return (
                            <p className="text-gold flex items-center gap-1.5 text-xs font-semibold">
                              <Clock className="size-3.5" />
                              {remaining === 0
                                ? "Check-in oggi!"
                                : remaining === 1
                                  ? "Manca 1 giorno al check-in"
                                  : `Mancano ${remaining} giorni al check-in`}
                            </p>
                          );
                        })()}

                      {res.status === "cancelled" && res.refundPercentage != null && (
                        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <Undo2 className="size-3.5" />
                          {res.refundPercentage === 100
                            ? "Rimborso completo (100%)"
                            : `Rimborso ${res.refundPercentage}% — trattenuto il ${100 - res.refundPercentage}% come da policy`}
                        </p>
                      )}
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

                    {(res.status === "pending" || res.status === "confirmed") &&
                      daysUntil(res.checkIn) >= 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDatesDialog(res)}
                            className="border-gold/40 hover:bg-gold/10 inline-flex items-center gap-1.5"
                          >
                            <Pencil className="size-3.5" />
                            Modifica date
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCancelTarget(res)}
                            className="border-destructive/40 text-destructive hover:bg-destructive/10 inline-flex items-center gap-1.5"
                          >
                            <Ban className="size-3.5" />
                            Disdici prenotazione
                          </Button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: DATI PERSONALI — one banner, per-field inline edit */}
        {/* ---------------------------------------------------- */}
        {activeTab === "profile" && (
          <div className="border-gold/30 bg-card/90 max-w-xl rounded-3xl border p-6 shadow-xl backdrop-blur-md">
            <h2 className="font-display text-gold mb-1 text-xl font-semibold">
              I Tuoi Dati
            </h2>
            <p className="text-muted-foreground mb-6 text-xs">
              Premi la matita accanto a un campo per modificarlo, poi salva — ogni dato si
              aggiorna singolarmente.
            </p>

            {fieldSaveError && (
              <div className="border-destructive/40 bg-destructive/10 text-destructive mb-4 rounded-2xl border p-3 text-xs font-semibold">
                {fieldSaveError}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {/* Never editable — tied to the Google account. Shown as a
                  plain row (not ProfileRow) because it needs the verified
                  badge inline, which ProfileRow's plain-string displayValue
                  can't express. */}
              <div className="border-border/60 bg-muted/30 flex items-center justify-between gap-3 rounded-2xl border p-3 text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Mail className="size-4" />
                  Email
                </span>
                <span className="flex items-center gap-2 font-medium">
                  {user.email}
                  {user.emailVerified ? (
                    <Badge variant="success" className="gap-1">
                      <ShieldCheck className="size-3" />
                      Verificata
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1">
                      <ShieldAlert className="size-3" />
                      Non verificata
                    </Badge>
                  )}
                </span>
              </div>

              <ProfileRow
                icon={<User className="size-4" />}
                label="Nome e Cognome"
                displayValue={user.name}
                editable
                isEditing={editingField === "name"}
                draft={fieldDraft}
                onDraftChange={setFieldDraft}
                onStartEdit={() => startEditField("name", user.name)}
                onCancel={cancelEditField}
                onSave={saveEditField}
                isSaving={isSavingField}
              />

              <ProfileRow
                icon={<Phone className="size-4" />}
                label="Telefono"
                displayValue={user.phone || "Non specificato"}
                editable
                isEditing={editingField === "phone"}
                draft={fieldDraft}
                onDraftChange={setFieldDraft}
                onStartEdit={() => startEditField("phone", user.phone ?? "")}
                onCancel={cancelEditField}
                onSave={saveEditField}
                isSaving={isSavingField}
                type="tel"
                placeholder="+39 347 0000000"
              />

              <ProfileRow
                icon={<Cake className="size-4" />}
                label="Età"
                displayValue={
                  user.dateOfBirth
                    ? `${ageFromDateOfBirth(user.dateOfBirth)} anni`
                    : "Non specificata"
                }
                editable
                isEditing={editingField === "dateOfBirth"}
                draft={fieldDraft}
                onDraftChange={setFieldDraft}
                onStartEdit={() => startEditField("dateOfBirth", user.dateOfBirth ?? "")}
                onCancel={cancelEditField}
                onSave={saveEditField}
                isSaving={isSavingField}
                type="date"
              />

              <ProfileRow
                icon={<Users2 className="size-4" />}
                label="Genere"
                displayValue={
                  user.gender ? GENDER_LABELS[user.gender] : "Non specificato"
                }
                editable
                isEditing={editingField === "gender"}
                draft={fieldDraft}
                onDraftChange={setFieldDraft}
                onStartEdit={() => startEditField("gender", user.gender ?? "unspecified")}
                onCancel={cancelEditField}
                onSave={saveEditField}
                isSaving={isSavingField}
                type="select"
                options={GENDER_OPTIONS}
              />

              <ProfileRow
                icon={<MapPin className="size-4" />}
                label="Indirizzo"
                displayValue={user.address || "Non specificato"}
                editable
                isEditing={editingField === "address"}
                draft={fieldDraft}
                onDraftChange={setFieldDraft}
                onStartEdit={() => startEditField("address", user.address ?? "")}
                onCancel={cancelEditField}
                onSave={saveEditField}
                isSaving={isSavingField}
                placeholder="Via Roma 1, 83028 Serino (AV)"
              />

              <ProfileRow
                icon={<BadgeCheck className="size-4" />}
                label="Metodo di accesso"
                displayValue={PROVIDER_LABELS[user.provider]}
              />

              <ProfileRow
                icon={<Calendar className="size-4" />}
                label="Cliente dal"
                displayValue={formatDate(user.createdAt)}
              />

              <ProfileRow
                icon={<Clock className="size-4" />}
                label="Ultimo accesso"
                displayValue={formatDate(user.lastSignInAt)}
              />
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
