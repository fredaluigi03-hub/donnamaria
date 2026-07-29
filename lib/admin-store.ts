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

export function updateReservation(id: string, data: Partial<Reservation>): void {
  const current = getReservations();
  const updated = current.map((res) => (res.id === id ? { ...res, ...data } : res));
  saveReservations(updated);
}

export function deleteReservation(id: string): void {
  const current = getReservations();
  const updated = current.filter((res) => res.id !== id);
  saveReservations(updated);
}

export function toggleRoomDateBlock(
  roomSlug: "suite-francy" | "domi" | "mery",
  roomName: string,
  dateStr: string,
): void {
  const current = getReservations();
  const targetTime = new Date(dateStr).getTime();

  // Next day for checkout
  const nextDate = new Date(dateStr);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split("T")[0]!;

  const existingBlockIndex = current.findIndex((res) => {
    if (res.roomSlug !== roomSlug || res.status !== "blocked") return false;
    const start = new Date(res.checkIn).getTime();
    const end = new Date(res.checkOut).getTime();
    return targetTime >= start && targetTime < end;
  });

  if (existingBlockIndex >= 0) {
    // Unblock if already blocked
    current.splice(existingBlockIndex, 1);
    saveReservations([...current]);
  } else {
    // Block the date
    addReservation({
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
