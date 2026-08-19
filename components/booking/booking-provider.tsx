"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  BedDouble,
  ArrowLeft,
  Loader2,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GuestPicker, type GuestCounts } from "@/components/booking/guest-picker";
import {
  CustomDatePickerPopover,
  today,
  toISODate,
} from "@/components/booking/date-picker-popover";
import { rooms } from "@/config/rooms";
import { aiDisclosure, siteConfig } from "@/config/site";
import { emailSchema } from "@/utils/validation";
import type { RoomSlug } from "@/types";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth-store";

/** "Luigi Freda" → { firstName: "Luigi", lastName: "Freda" }. */
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const [firstName = "", ...rest] = fullName.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

/** Values pre-filled from the signed-in guest's saved profile, so returning
 * guests never retype their contact details — still fully editable, this
 * only sets the initial value of each field. */
function guestDetailsFromProfile(): Partial<GuestDetailsValues> {
  const user = getCurrentUser();
  if (!user) return {};
  return {
    ...splitFullName(user.name),
    email: user.email,
    phone: user.phone ?? "",
  };
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function defaultStayDates() {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 1);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 3);
  return { checkIn: toISODate(checkIn), checkOut: toISODate(checkOut) };
}

export interface BookingPrefill {
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  roomSlug?: RoomSlug;
}

interface BookingContextValue {
  openBooking: (prefill?: BookingPrefill) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

/** Opens the same global booking flow every "Prenota" / "Richiedi
 * disponibilità" on the site now shares — see BookingProvider. */
export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
}

interface RoomAvailability {
  slug: RoomSlug;
  name: string;
  tagline: string;
  available: boolean;
}

const guestDetailsSchema = z.object({
  firstName: z.string().trim().min(2, "Inserisci il tuo nome."),
  lastName: z.string().trim().min(2, "Inserisci il tuo cognome."),
  email: emailSchema,
  phone: z.string().trim().min(6, "Inserisci un numero di telefono valido."),
  message: z.string().trim().optional(),
});
type GuestDetailsValues = z.infer<typeof guestDetailsSchema>;

type Step = "closed" | "search" | "results" | "details" | "success";

/**
 * Single global booking flow, mounted once at the root layout — every
 * "Prenota" / "Richiedi disponibilità" on the site opens this same modal via
 * `useBooking().openBooking()`, instead of each linking to its own copy of
 * a booking form on /contatti. A visitor who clicks it from a room's detail
 * page never leaves that page: dates → real availability → guest details →
 * confirmation, layered on top of wherever they already are.
 */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("closed");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<GuestCounts>({ adults: 2, children: 0 });
  const [availability, setAvailability] = useState<RoomAvailability[] | null>(null);
  const [availabilityError, setAvailabilityError] = useState("");
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomAvailability | null>(null);
  const [highlightSlug, setHighlightSlug] = useState<RoomSlug | undefined>(undefined);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset: resetGuestForm,
    formState: { errors, isSubmitting },
  } = useForm<GuestDetailsValues>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: guestDetailsFromProfile(),
  });

  const nights = nightsBetween(checkIn, checkOut);

  const loadAvailability = useCallback(async (ci: string, co: string) => {
    setLoadingAvailability(true);
    setAvailabilityError("");
    try {
      const res = await fetch(`/api/availability?checkIn=${ci}&checkOut=${co}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Errore durante la verifica.");
      const bySlug = new Map<string, boolean>(
        body.map((row: { roomSlug: string; available: boolean }) => [
          row.roomSlug,
          row.available,
        ]),
      );
      setAvailability(
        rooms.map((room) => ({
          slug: room.slug,
          name: room.name,
          tagline: room.tagline,
          available: bySlug.get(room.slug) ?? false,
        })),
      );
    } catch (err) {
      setAvailabilityError(
        err instanceof Error ? err.message : "Errore durante la verifica.",
      );
      setAvailability(null);
    } finally {
      setLoadingAvailability(false);
    }
  }, []);

  const openBooking = useCallback(
    (prefill: BookingPrefill = {}) => {
      const defaults = defaultStayDates();
      const ci = prefill.checkIn || defaults.checkIn;
      const co = prefill.checkOut || defaults.checkOut;
      setCheckIn(ci);
      setCheckOut(co);
      setGuests({ adults: prefill.adults ?? 2, children: prefill.children ?? 0 });
      setHighlightSlug(prefill.roomSlug);
      setSelectedRoom(null);
      setExpandedSlug(prefill.roomSlug ?? null);
      setSubmitError("");

      if (prefill.checkIn && prefill.checkOut) {
        // Dates already chosen (the homepage search bar) — skip straight
        // to real results instead of asking again.
        setStep("results");
        loadAvailability(ci, co);
      } else {
        // Opened from a room page / header / anywhere else with no dates
        // yet — the modal itself now has to ask, since there's no search
        // bar on the page it was triggered from.
        setStep("search");
      }
    },
    [loadAvailability],
  );

  const closeBooking = useCallback(() => setStep("closed"), []);

  // Without this, a wheel/touch scroll starting over the backdrop (or any
  // non-scrollable part of the modal) falls through to the page underneath
  // — which is fixed in place but still scrolls its own document, so the
  // guest sees nothing move and assumes scrolling is broken. Locking the
  // body while open means every scroll gesture always lands on the modal's
  // own `overflow-y-auto` content instead.
  useEffect(() => {
    if (step === "closed") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [step]);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStep("results");
    setSubmitError("");
    loadAvailability(checkIn, checkOut);
  }

  function handlePickRoom(room: RoomAvailability) {
    setSelectedRoom(room);
    setSubmitError("");
    resetGuestForm(guestDetailsFromProfile());
    setStep("details");
  }

  async function onSubmitGuestDetails(values: GuestDetailsValues) {
    if (!selectedRoom) return;
    setSubmitError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email,
          phone: values.phone,
          message: values.message,
          room: selectedRoom.slug,
          checkIn,
          checkOut,
          adults: guests.adults,
          children: guests.children,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 409) {
          // Someone else took it while this guest was filling in details —
          // the exact race the exclusion constraint exists for. Send them
          // back to a refreshed availability list instead of a dead end.
          setSubmitError(body.error ?? "Questa camera non è più disponibile.");
          setStep("results");
          loadAvailability(checkIn, checkOut);
          return;
        }
        setSubmitError(body.error ?? "Qualcosa è andato storto. Riprova.");
        return;
      }

      setStep("success");
    } catch {
      setSubmitError("Qualcosa è andato storto. Riprova.");
    }
  }

  const contextValue = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={contextValue}>
      {children}

      {step !== "closed" && (
        <div className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md duration-300">
          <div className="border-gold/40 bg-card text-foreground relative w-full max-w-4xl overflow-hidden rounded-3xl border shadow-2xl">
            <div className="border-gold/30 flex items-center justify-between border-b bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-gold/20 border-gold/40 rounded-full border p-2">
                  <Sparkles className="text-gold size-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium">
                    {step === "search" && "Verifica disponibilità"}
                    {step === "results" && "Disponibilità"}
                    {step === "details" && "I tuoi dati"}
                    {step === "success" && "Richiesta inviata"}
                  </h3>
                  <p className="text-gold/90 mt-0.5 text-xs">
                    Donna Maria Suite &amp; Relax · Serino (AV)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeBooking}
                className="rounded-full bg-white/10 p-2 text-white/70 transition-all hover:bg-white/20 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[85vh] space-y-6 overflow-y-auto p-6 md:p-8">
              {step === "search" && (
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-5">
                  <p className="text-muted-foreground text-sm">
                    Scegli le date per vedere subito quali camere sono libere.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <CustomDatePickerPopover
                      label="Check-in"
                      value={checkIn}
                      minDate={today}
                      onChange={(val) => {
                        setCheckIn(val);
                        if (checkOut && checkOut <= val) setCheckOut("");
                      }}
                    />
                    <CustomDatePickerPopover
                      label="Check-out"
                      value={checkOut}
                      minDate={checkIn || today}
                      onChange={setCheckOut}
                    />
                  </div>
                  <GuestPicker
                    value={guests}
                    onChange={setGuests}
                    className="border-border h-16 rounded-2xl border px-5"
                  />
                  <Button type="submit" size="lg" disabled={!checkIn || !checkOut}>
                    Verifica disponibilità
                  </Button>
                </form>
              )}

              {step === "results" && (
                <>
                  <button
                    type="button"
                    onClick={() => setStep("search")}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start text-xs font-semibold uppercase transition-colors"
                  >
                    <ArrowLeft className="size-3.5" />
                    Modifica ricerca
                  </button>

                  <div className="bg-gold/10 border-gold/30 grid grid-cols-1 gap-4 rounded-2xl border p-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Clock className="text-gold size-5 shrink-0" />
                      <div>
                        <p className="text-gold text-xs font-semibold tracking-wider uppercase">
                          Check-in
                        </p>
                        <p className="text-foreground text-sm font-medium">
                          {checkIn} · dalle 14:30 alle 20:00
                        </p>
                      </div>
                    </div>
                    <div className="border-gold/20 flex items-center gap-3 border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                      <Clock className="text-gold size-5 shrink-0" />
                      <div>
                        <p className="text-gold text-xs font-semibold tracking-wider uppercase">
                          Check-out
                        </p>
                        <p className="text-foreground text-sm font-medium">
                          {checkOut} · entro le 10:30
                        </p>
                      </div>
                    </div>
                  </div>

                  {loadingAvailability && (
                    <div className="flex items-center justify-center gap-2 py-10 text-sm">
                      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                      Verifica disponibilità in corso…
                    </div>
                  )}

                  {!loadingAvailability && availabilityError && (
                    <p className="text-destructive text-sm" role="alert">
                      {availabilityError}
                    </p>
                  )}

                  {!loadingAvailability && availability && (
                    <div className="space-y-3">
                      <h4 className="font-display text-base font-semibold">
                        Camere disponibili per queste date — {nights}{" "}
                        {nights === 1 ? "notte" : "notti"}
                      </h4>

                      {submitError && (
                        <p className="text-destructive text-sm" role="alert">
                          {submitError}
                        </p>
                      )}

                      {availability.every((room) => !room.available) ? (
                        <p className="text-muted-foreground text-sm">
                          Nessuna camera disponibile per queste date. Prova un altro
                          periodo.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {availability
                            .filter((room) => room.available)
                            .map((room) => {
                              const fullRoom = rooms.find((r) => r.slug === room.slug);
                              const total = (fullRoom?.basePricePerNight ?? 0) * nights;
                              const isExpanded = expandedSlug === room.slug;

                              return (
                                <div
                                  key={room.slug}
                                  className={cn(
                                    "bg-card overflow-hidden rounded-2xl border shadow-sm",
                                    room.slug === highlightSlug
                                      ? "border-gold ring-gold/20 ring-2"
                                      : "border-gold/30",
                                  )}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedSlug(isExpanded ? null : room.slug)
                                    }
                                    className="hover:bg-gold/5 flex w-full items-center justify-between p-4 text-left transition-colors"
                                    aria-expanded={isExpanded}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="bg-gold/15 text-gold rounded-xl p-2.5">
                                        <BedDouble className="size-5" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold">
                                          {room.name}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                          {room.tagline}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="text-right">
                                        <p className="font-display text-sm font-bold">
                                          € {total}
                                        </p>
                                        <p className="text-muted-foreground text-[0.65rem]">
                                          {nights} {nights === 1 ? "notte" : "notti"}
                                        </p>
                                      </div>
                                      <ChevronDown
                                        className={cn(
                                          "text-muted-foreground size-4 shrink-0 transition-transform",
                                          isExpanded && "rotate-180",
                                        )}
                                        aria-hidden="true"
                                      />
                                    </div>
                                  </button>

                                  {isExpanded && fullRoom && (
                                    <div className="border-gold/20 flex flex-wrap gap-3 border-t p-4 pt-3">
                                      {fullRoom.amenities.map((amenity) => (
                                        <span
                                          key={amenity.label}
                                          className="bg-secondary/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                                        >
                                          <amenity.icon
                                            className="size-3.5"
                                            aria-hidden="true"
                                          />
                                          {amenity.label}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <div className="border-gold/20 flex items-center justify-between border-t p-4">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                                      <CheckCircle2 className="size-3.5" />
                                      DISPONIBILE
                                    </span>
                                    <Button
                                      size="sm"
                                      onClick={() => handlePickRoom(room)}
                                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 text-xs font-semibold"
                                    >
                                      Prenota
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {step === "details" &&
                selectedRoom &&
                (() => {
                  const fullRoom = rooms.find((r) => r.slug === selectedRoom.slug);
                  const total = (fullRoom?.basePricePerNight ?? 0) * nights;
                  return (
                    <form
                      onSubmit={handleSubmit(onSubmitGuestDetails)}
                      className="flex flex-col gap-5"
                      noValidate
                    >
                      <button
                        type="button"
                        onClick={() => setStep("results")}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start text-xs font-semibold uppercase transition-colors"
                      >
                        <ArrowLeft className="size-3.5" />
                        Torna alla disponibilità
                      </button>

                      <div className="border-gold/30 flex flex-col gap-4 overflow-hidden rounded-2xl border sm:flex-row">
                        {fullRoom && (
                          <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-48">
                            <Image
                              src={fullRoom.coverImage}
                              alt={fullRoom.name}
                              fill
                              sizes="192px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col gap-3 p-4 sm:py-4 sm:pr-4 sm:pl-0">
                          <div>
                            <p className="font-display text-lg font-semibold">
                              {selectedRoom.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {checkIn} → {checkOut} · {guests.adults} adulti
                              {guests.children > 0 ? ` + ${guests.children} bambini` : ""}
                            </p>
                          </div>
                          <div className="border-border/60 flex items-center justify-between border-t pt-3 text-sm">
                            <span className="text-muted-foreground">
                              € {fullRoom?.basePricePerNight ?? 0} × {nights}{" "}
                              {nights === 1 ? "notte" : "notti"}
                            </span>
                            <span className="font-display text-base font-bold">
                              € {total}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stessa struttura di un checkout Booking.com: banner
                          "quasi fatto", campi separati, promemoria in fondo —
                          senza inventare funzioni che questo sito non offre
                          davvero (noleggio auto, taxi, conferma via SMS). */}
                      <div className="bg-secondary/60 border-border/60 rounded-xl border p-3 text-sm">
                        Quasi fatto! Compila i campi obbligatori indicati con *.
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="bk-firstName">Nome *</Label>
                          <Input
                            id="bk-firstName"
                            autoComplete="given-name"
                            aria-invalid={!!errors.firstName}
                            {...register("firstName")}
                          />
                          {errors.firstName && (
                            <p className="text-destructive text-sm" role="alert">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="bk-lastName">Cognome *</Label>
                          <Input
                            id="bk-lastName"
                            autoComplete="family-name"
                            aria-invalid={!!errors.lastName}
                            {...register("lastName")}
                          />
                          {errors.lastName && (
                            <p className="text-destructive text-sm" role="alert">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bk-email">Indirizzo email *</Label>
                        <Input
                          id="bk-email"
                          type="email"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          {...register("email")}
                        />
                        <p className="text-muted-foreground text-xs">
                          L&apos;email di conferma sarà inviata a questo indirizzo.
                        </p>
                        {errors.email && (
                          <p className="text-destructive text-sm" role="alert">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bk-phone">Numero di telefono *</Label>
                        <Input
                          id="bk-phone"
                          type="tel"
                          autoComplete="tel"
                          aria-invalid={!!errors.phone}
                          {...register("phone")}
                        />
                        <p className="text-muted-foreground text-xs">
                          Solo per confermare la prenotazione, se necessario.
                        </p>
                        {errors.phone && (
                          <p className="text-destructive text-sm" role="alert">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="bk-message">
                          Richieste speciali (facoltativo)
                        </Label>
                        <Textarea id="bk-message" rows={3} {...register("message")} />
                      </div>

                      <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          Buono a sapersi: questa è una richiesta di disponibilità, non un
                          addebito immediato — vi risponderemo per confermare prima di
                          qualsiasi pagamento.
                        </span>
                      </div>

                      <p className="text-muted-foreground flex gap-2.5 text-xs leading-relaxed">
                        <Sparkles
                          className="text-warning mt-0.5 size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          {aiDisclosure.formNote}{" "}
                          <Link
                            href={aiDisclosure.href}
                            className="text-foreground underline underline-offset-2"
                          >
                            Dichiarazione completa
                          </Link>
                        </span>
                      </p>

                      {submitError && (
                        <p className="text-destructive text-sm" role="alert">
                          {submitError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="self-start"
                      >
                        {isSubmitting && (
                          <Loader2 className="animate-spin" aria-hidden="true" />
                        )}
                        Conferma richiesta
                      </Button>
                    </form>
                  );
                })()}

              {step === "success" && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 p-4 text-sm font-semibold text-white">
                    <CheckCircle2 className="size-5" />
                    Richiesta ricevuta! Vi risponderemo al più presto per confermare la
                    disponibilità.
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {aiDisclosure.confirmationNote}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Domande nel frattempo? {siteConfig.phoneDisplay}
                  </p>
                  <Button onClick={closeBooking} variant="outline" size="sm">
                    Chiudi
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </BookingContext.Provider>
  );
}
