export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  roomSlug: "suite-francy" | "domi" | "mery";
  roomName: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children: number;
  status: "pending" | "confirmed" | "cancelled" | "blocked";
  totalPrice: number;
  notes?: string;
  createdAt: string;
  cancelledAt?: string;
  /** % of totalPrice refunded to the guest; only set once cancelled. */
  refundPercentage?: number;
}

/** Postgres range literal, e.g. "2026-09-10" + "2026-09-12" → "[2026-09-10,2026-09-12)". */
export function toStayRange(checkIn: string, checkOut: string): string {
  return `[${checkIn},${checkOut})`;
}

/** Inverse of `toStayRange` — PostgREST returns `stay` as this literal string. */
export function fromStayRange(range: string): { checkIn: string; checkOut: string } {
  const match = /[[(]([^,]+),([^)\]]+)[)\]]/.exec(range);
  return { checkIn: match?.[1] ?? "", checkOut: match?.[2] ?? "" };
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/** Shape of a raw `reservations` row as returned by PostgREST. */
export interface ReservationRow {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  room_slug: string;
  stay: unknown;
  adults: number;
  children: number;
  status: string;
  total_price: number;
  notes: string | null;
  created_at: string;
  cancelled_at: string | null;
  refund_percentage: number | null;
}

/** Row → `Reservation`. Shared by the admin route and the guest-scoped
 * `/api/account/reservations` route so both format bookings identically. */
export function mapReservationRow(
  row: ReservationRow,
  getRoomName: (slug: string) => string | undefined,
): Reservation {
  const { checkIn, checkOut } = fromStayRange(String(row.stay));
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    roomSlug: row.room_slug as Reservation["roomSlug"],
    roomName: getRoomName(row.room_slug) ?? row.room_slug,
    checkIn,
    checkOut,
    adults: row.adults,
    children: row.children,
    status: row.status as Reservation["status"],
    totalPrice: row.total_price,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    cancelledAt: row.cancelled_at ?? undefined,
    refundPercentage: row.refund_percentage ?? undefined,
  };
}

/** Thrown by the reservation API routes on a Postgres exclusion-constraint
 * violation (SQLSTATE 23P01) — the dates are no longer free for that room. */
export class DoubleBookingError extends Error {}

async function parseReservationResponse(res: Response): Promise<never> {
  const body = await res.json().catch(() => ({}));
  if (res.status === 409) {
    throw new DoubleBookingError(body.error ?? "Queste date non sono più disponibili.");
  }
  throw new Error(body.error ?? "Si è verificato un errore. Riprova.");
}

export async function getReservations(): Promise<Reservation[]> {
  const res = await fetch("/api/admin/reservations");
  if (!res.ok) return parseReservationResponse(res);
  return res.json();
}

export async function addReservation(
  newRes: Omit<Reservation, "id" | "createdAt">,
): Promise<Reservation> {
  const res = await fetch("/api/admin/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRes),
  });
  if (!res.ok) return parseReservationResponse(res);
  return res.json();
}

export async function updateReservationStatus(
  id: string,
  status: Reservation["status"],
): Promise<void> {
  await updateReservation(id, { status });
}

export async function updateReservation(
  id: string,
  data: Partial<Reservation>,
): Promise<void> {
  const res = await fetch(`/api/admin/reservations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return parseReservationResponse(res);
}

export async function deleteReservation(id: string): Promise<void> {
  const res = await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
  if (!res.ok) return parseReservationResponse(res);
}

/**
 * Toggles a one-day admin block on a room/date. `current` is the already-
 * loaded reservation list (the calendar has it in hand from its last
 * render) — avoids a second round-trip just to find the block to remove.
 */
export async function toggleRoomDateBlock(
  roomSlug: "suite-francy" | "domi" | "mery",
  roomName: string,
  dateStr: string,
  current: Reservation[],
): Promise<void> {
  const targetTime = new Date(dateStr).getTime();
  const existingBlock = current.find((res) => {
    if (res.roomSlug !== roomSlug || res.status !== "blocked") return false;
    const start = new Date(res.checkIn).getTime();
    const end = new Date(res.checkOut).getTime();
    return targetTime >= start && targetTime < end;
  });

  if (existingBlock) {
    await deleteReservation(existingBlock.id);
    return;
  }

  const nextDate = new Date(dateStr);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split("T")[0]!;

  await addReservation({
    customerName: "Blocco Admin Manuale",
    email: "admin@donnamaria.it",
    phone: "+39 0825 000000",
    roomSlug,
    roomName,
    checkIn: dateStr,
    checkOut: nextDateStr,
    adults: 0,
    children: 0,
    status: "blocked",
    totalPrice: 0,
    notes: "Bloccata da gestione calendario",
  });
}

// ----------------------------------------------------
// ROOM PRICES & SITE SETTINGS
// ----------------------------------------------------
export interface RoomPrices {
  "suite-francy": number;
  domi: number;
  mery: number;
}

const ROOM_PRICES_KEY = "donnamaria_admin_room_prices_v1";

export const initialRoomPrices: RoomPrices = {
  "suite-francy": 160,
  domi: 140,
  mery: 130,
};

export function getRoomPrices(): RoomPrices {
  if (typeof window === "undefined") return initialRoomPrices;
  try {
    const data = localStorage.getItem(ROOM_PRICES_KEY);
    return data ? JSON.parse(data) : initialRoomPrices;
  } catch {
    return initialRoomPrices;
  }
}

export function saveRoomPrices(prices: RoomPrices): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ROOM_PRICES_KEY, JSON.stringify(prices));
    window.dispatchEvent(new Event("donnamaria_prices_updated"));
  } catch (err) {
    console.error("Failed to save room prices:", err);
  }
}

export interface AdminSiteSettings {
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  address: string;
}

const SITE_SETTINGS_KEY = "donnamaria_admin_site_settings_v1";

export const initialSiteSettings: AdminSiteSettings = {
  phone: "+39 347 1234567",
  email: "info@donnamariasuiterelax.it",
  checkInTime: "15:00 - 20:00",
  checkOutTime: "08:00 - 10:30",
  address: "Via Tenente Paolo de Vivo, 10 - 83028 Serino (AV)",
};

export function getSiteSettings(): AdminSiteSettings {
  if (typeof window === "undefined") return initialSiteSettings;
  try {
    const data = localStorage.getItem(SITE_SETTINGS_KEY);
    return data ? JSON.parse(data) : initialSiteSettings;
  } catch {
    return initialSiteSettings;
  }
}

export function saveSiteSettings(settings: AdminSiteSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("donnamaria_settings_updated"));
  } catch (err) {
    console.error("Failed to save site settings:", err);
  }
}
