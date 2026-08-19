import { z } from "zod";

/**
 * Shared Zod schemas. Co-locate form-specific schemas next to their form
 * component; put schemas here only when reused across two or more forms.
 *
 * Note: `.email()` as a chained ZodString method is deprecated in Zod v4
 * in favor of the top-level `z.email()` format validator, but remains
 * fully supported — kept here for reliable `.trim().email()` ordering.
 * Migrate to `z.email()` if/when the chained form is removed upstream.
 */
export const emailSchema = z
  .string()
  .trim()
  .email("Inserisci un indirizzo email valido.");

export const bookingFormSchema = z
  .object({
    name: z.string().trim().min(2, "Inserisci il tuo nome."),
    email: emailSchema,
    phone: z.string().trim().min(6, "Inserisci un numero di telefono valido."),
    // Required, not optional: the room is what actually gets reserved in
    // the database now — "no preference" can't lock a specific row.
    room: z.string().trim().min(1, "Seleziona una camera."),
    checkIn: z.string().min(1, "Seleziona la data di check-in."),
    checkOut: z.string().min(1, "Seleziona la data di check-out."),
    // Adults/children rather than a single "guests" count, so the
    // request captures who's actually staying (a child often doesn't
    // count toward a room's adult capacity the same way).
    adults: z.number().min(1, "Indica almeno un adulto."),
    children: z.number().min(0),
    message: z.string().trim().optional(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "La data di check-out deve essere successiva al check-in.",
    path: ["checkOut"],
  })
  // Computed inside the refine, not hoisted to a module-level constant —
  // this schema is a shared singleton, so "today" must be evaluated fresh
  // on each validation call, not frozen at the moment the server started.
  .refine((data) => data.checkIn >= new Date().toISOString().slice(0, 10), {
    message: "La data di check-in non può essere nel passato.",
    path: ["checkIn"],
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
