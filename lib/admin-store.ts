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
}

export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "root",
};

const STORAGE_KEY = "donnamaria_admin_reservations_v1";

export const initialReservations: Reservation[] = [
  {
    id: "RES-1001",
    customerName: "Marco Rossi",
    email: "marco.rossi@gmail.com",
    phone: "+39 347 1234567",
    roomSlug: "suite-francy",
    roomName: "Suite Francy",
    checkIn: "2026-08-05",
    checkOut: "2026-08-08",
    adults: 2,
    children: 0,
    status: "confirmed",
    totalPrice: 480,
    notes: "Anniversario di matrimonio — Richiesto champagne in camera",
    createdAt: "2026-07-20T14:30:00Z",
  },
  {
    id: "RES-1002",
    customerName: "Giulia Bianchi",
    email: "giulia.b@hotmail.it",
    phone: "+39 333 9876543",
    roomSlug: "domi",
    roomName: "Domi",
    checkIn: "2026-08-10",
    checkOut: "2026-08-14",
    adults: 2,
    children: 1,
    status: "confirmed",
    totalPrice: 560,
    notes: "Culla richiesta per bambino",
    createdAt: "2026-07-22T09:15:00Z",
  },
  {
    id: "RES-1003",
    customerName: "Alessandro Neri",
    email: "alessandro.neri@outlook.com",
    phone: "+39 320 5551234",
    roomSlug: "mery",
    roomName: "Mery",
    checkIn: "2026-08-12",
    checkOut: "2026-08-15",
    adults: 2,
    children: 0,
    status: "pending",
    totalPrice: 390,
    notes: "Richiesta colazione senza glutine",
    createdAt: "2026-07-27T18:45:00Z",
  },
  {
    id: "RES-1004",
    customerName: "Manutenzione Programmata",
    email: "admin@donnamaria.it",
    phone: "+39 0825 000000",
    roomSlug: "suite-francy",
    roomName: "Suite Francy",
    checkIn: "2026-08-18",
    checkOut: "2026-08-20",
    adults: 0,
    children: 0,
    status: "blocked",
    totalPrice: 0,
    notes: "Sanificazione e controllo Jacuzzi",
    createdAt: "2026-07-25T11:00:00Z",
  },
];

export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return initialReservations;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReservations));
      return initialReservations;
    }
    return JSON.parse(data);
  } catch {
    return initialReservations;
  }
}

export function saveReservations(reservations: Reservation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    window.dispatchEvent(new Event("donnamaria_reservations_updated"));
  } catch (err) {
    console.error("Failed to save reservations:", err);
  }
}

export function addReservation(
  newRes: Omit<Reservation, "id" | "createdAt">,
): Reservation {
  const current = getReservations();
  const created: Reservation = {
    ...newRes,
    id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [created, ...current];
  saveReservations(updated);
  return created;
}

export function updateReservationStatus(id: string, status: Reservation["status"]): void {
  const current = getReservations();
  const updated = current.map((res) => (res.id === id ? { ...res, status } : res));
  saveReservations(updated);
}

export function deleteReservation(id: string): void {
  const current = getReservations();
  const updated = current.filter((res) => res.id !== id);
  saveReservations(updated);
}

/** Check if a specific date (YYYY-MM-DD) for a given room is occupied or blocked */
export function getRoomDateStatus(
  roomSlug: string,
  dateStr: string,
): { isOccupied: boolean; status?: Reservation["status"]; reservation?: Reservation } {
  const reservations = getReservations();
  const targetDate = new Date(dateStr).getTime();

  for (const res of reservations) {
    if (res.roomSlug !== roomSlug || res.status === "cancelled") continue;
    const start = new Date(res.checkIn).getTime();
    const end = new Date(res.checkOut).getTime();
    if (targetDate >= start && targetDate < end) {
      return { isOccupied: true, status: res.status, reservation: res };
    }
  }

  return { isOccupied: false };
}
