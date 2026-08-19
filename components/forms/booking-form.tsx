"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { GuestPicker } from "@/components/booking/guest-picker";
import { bookingFormSchema, type BookingFormValues } from "@/utils/validation";
import { rooms } from "@/config/rooms";
import { aiDisclosure } from "@/config/site";

/**
 * "Richiesta di disponibilità" — same pattern as contact-form.tsx (React
 * Hook Form + Zod + shadcn inputs), but now a real booking: POSTs to
 * /api/reservations, which inserts into Supabase. A Postgres exclusion
 * constraint on the room+date range (see supabase/migrations) is what
 * actually stops two guests from taking the same room — this form just
 * surfaces that as a 409 instead of trusting a client-side check.
 *
 * Prefilled from the homepage search widget via query params
 * (?checkIn=&checkOut=&adults=&children=&camera=) when present.
 */
export function BookingForm() {
  const searchParams = useSearchParams();
  const preselectedRoom = searchParams.get("camera") ?? "";
  const prefilledAdults = Number(searchParams.get("adults") ?? "2") || 2;
  const prefilledChildren = Number(searchParams.get("children") ?? "0") || 0;
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      room: preselectedRoom,
      checkIn: searchParams.get("checkIn") ?? "",
      checkOut: searchParams.get("checkOut") ?? "",
      adults: prefilledAdults,
      children: prefilledChildren,
    },
  });

  const adults = useWatch({ control, name: "adults" });
  const children = useWatch({ control, name: "children" });
  const checkInValue = useWatch({ control, name: "checkIn" });
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(values: BookingFormValues) {
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.error ?? "Qualcosa è andato storto. Riprova più tardi.");
        setStatus("error");
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setErrorMessage("Qualcosa è andato storto. Riprova più tardi.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome e cognome</Label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-sm" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-sm" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Telefono</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-destructive text-sm" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="room">Camera</Label>
          <Select
            id="room"
            defaultValue={preselectedRoom}
            aria-invalid={!!errors.room}
            {...register("room")}
          >
            <option value="" disabled>
              Seleziona una camera
            </option>
            {rooms.map((room) => (
              <option key={room.slug} value={room.slug}>
                {room.name}
              </option>
            ))}
          </Select>
          {errors.room && (
            <p className="text-destructive text-sm" role="alert">
              {errors.room.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="checkIn">Check-in</Label>
          <Input
            id="checkIn"
            type="date"
            min={today}
            aria-invalid={!!errors.checkIn}
            {...register("checkIn")}
          />
          {errors.checkIn && (
            <p className="text-destructive text-sm" role="alert">
              {errors.checkIn.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="checkOut">Check-out</Label>
          <Input
            id="checkOut"
            type="date"
            min={checkInValue || today}
            aria-invalid={!!errors.checkOut}
            {...register("checkOut")}
          />
          {errors.checkOut && (
            <p className="text-destructive text-sm" role="alert">
              {errors.checkOut.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label id="guests-label">Ospiti</Label>
          <GuestPicker
            value={{ adults, children }}
            onChange={(next) => {
              setValue("adults", next.adults, { shouldValidate: true });
              setValue("children", next.children, { shouldValidate: true });
            }}
            labelledBy="guests-label"
          />
          {(errors.adults ?? errors.children) && (
            <p className="text-destructive text-sm" role="alert">
              {errors.adults?.message ?? errors.children?.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Messaggio (facoltativo)</Label>
        <Textarea id="message" rows={4} {...register("message")} />
      </div>

      {/* Sopra il tasto di invio, non nel footer: è qui che l'ospite prende la
          decisione, ed è al momento della decisione che la dichiarazione conta. */}
      <p className="text-muted-foreground flex gap-2.5 text-xs leading-relaxed">
        <Sparkles className="text-warning mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
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

      <Button type="submit" size="lg" disabled={isSubmitting} className="self-start">
        {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
        Invia richiesta
      </Button>

      <div role="status" aria-live="polite" className="text-sm">
        {status === "success" && (
          <div className="flex flex-col gap-2">
            <p className="text-success">
              Grazie! Abbiamo ricevuto la vostra richiesta — vi risponderemo al più presto
              per confermare la disponibilità.
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {aiDisclosure.confirmationNote}
            </p>
          </div>
        )}
        {status === "error" && <p className="text-destructive">{errorMessage}</p>}
      </div>
    </form>
  );
}
