"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  PlusCircle,
  ShieldCheck,
  Trash2,
  XCircle,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Lock,
  User,
  Euro,
  Bed,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { rooms } from "@/config/rooms";
import {
  ADMIN_CREDENTIALS,
  addReservation,
  deleteReservation,
  getReservations,
  updateReservationStatus,
  type Reservation,
} from "@/lib/admin-store";
import { cn } from "@/lib/utils";

const italianMonths = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("donnamaria_admin_auth") === "true";
    }
    return false;
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"calendar" | "reservations" | "new">(
    "calendar",
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Calendar View State
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 7 = August (0-indexed)

  // New Reservation Form State
  const [formRoom, setFormRoom] = useState<"suite-francy" | "domi" | "mery">(
    "suite-francy",
  );
  const [formCustomer, setFormCustomer] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCheckIn, setFormCheckIn] = useState("2026-08-15");
  const [formCheckOut, setFormCheckOut] = useState("2026-08-18");
  const [formAdults, setFormAdults] = useState(2);
  const [formChildren, setFormChildren] = useState(0);
  const [formPrice, setFormPrice] = useState(450);
  const [formNotes, setFormNotes] = useState("");
  const [formType, setFormType] = useState<"booking" | "block">("booking");
  const [formSuccessMsg, setFormSuccessMsg] = useState("");

  // Check auth session in localStorage on mount
  useEffect(() => {
    loadData();

    function handleUpdate() {
      loadData();
    }
    window.addEventListener("donnamaria_reservations_updated", handleUpdate);
    return () =>
      window.removeEventListener("donnamaria_reservations_updated", handleUpdate);
  }, []);

  function loadData() {
    setReservations(getReservations());
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("donnamaria_admin_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Credenziali errate. Inserisci username: admin, password: root.");
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem("donnamaria_admin_auth");
  }

  function handleStatusChange(id: string, newStatus: Reservation["status"]) {
    updateReservationStatus(id, newStatus);
    loadData();
  }

  function handleDelete(id: string) {
    if (confirm("Sei sicuro di voler eliminare questa prenotazione?")) {
      deleteReservation(id);
      loadData();
    }
  }

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const roomObj = rooms.find((r) => r.slug === formRoom);

    addReservation({
      customerName: formType === "block" ? "Manutenzione / Blocco Admin" : formCustomer,
      email: formType === "block" ? "admin@donnamaria.it" : formEmail,
      phone: formType === "block" ? "+39 0825 000000" : formPhone,
      roomSlug: formRoom,
      roomName: roomObj?.name ?? formRoom,
      checkIn: formCheckIn,
      checkOut: formCheckOut,
      adults: formType === "block" ? 0 : formAdults,
      children: formType === "block" ? 0 : formChildren,
      status: formType === "block" ? "blocked" : "confirmed",
      totalPrice: formType === "block" ? 0 : Number(formPrice),
      notes: formNotes,
    });

    setFormSuccessMsg(
      formType === "block"
        ? "Le date sono state bloccate con successo!"
        : "Prenotazione aggiunta con successo!",
    );
    loadData();

    setTimeout(() => {
      setFormSuccessMsg("");
      setActiveTab("calendar");
    }, 1500);
  }

  // Calculate Dashboard KPI Stats
  const totalBookings = reservations.length;
  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;
  const totalRevenue = reservations
    .filter((r) => r.status === "confirmed")
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Calendar Helper Days Array
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filtered reservations list for Table view
  const filteredReservations = reservations.filter((res) => {
    const matchesFilter = filterStatus === "all" || res.status === filterStatus;
    const matchesSearch =
      res.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
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
                className="border-gold/40 hover:shadow-gold/30 mt-2 w-full border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] font-semibold text-amber-100 uppercase transition-all"
              >
                Accedi al Gestionale
              </Button>
            </form>

            <div className="border-border/60 mt-6 border-t pt-4 text-center">
              <p className="text-muted-foreground text-[0.7rem]">
                Credenziali di test: <code className="text-gold">admin</code> /{" "}
                <code className="text-gold">root</code>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  // ----------------------------------------------------
  // ADMIN DASHBOARD SCREEN
  // ----------------------------------------------------
  return (
    <Section className="relative py-12">
      <Container className="flex flex-col gap-8">
        {/* Admin Bar Header */}
        <div className="border-gold/40 flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-gradient-to-r from-[#181818] via-[#24201a] to-[#181818] p-6 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="border-gold/40 bg-gold/20 text-gold flex size-12 items-center justify-center rounded-2xl border shadow-inner">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gold text-xs font-semibold tracking-widest uppercase">
                  Pannello Gestionale
                </span>
                <span className="border-gold/40 bg-gold/20 text-gold rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase">
                  Admin: {ADMIN_CREDENTIALS.username}
                </span>
              </div>
              <h1 className="font-display text-2xl font-semibold text-white">
                Gestione Prenotazioni &amp; Camere
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Link href="/">Vedi Sito</Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5"
            >
              <LogOut className="size-4" />
              Esci
            </Button>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-gold/30 bg-card/90 flex items-center justify-between rounded-2xl border p-5 shadow-lg backdrop-blur-md">
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Totale Prenotazioni
              </p>
              <h3 className="font-display text-foreground text-3xl font-bold">
                {totalBookings}
              </h3>
            </div>
            <div className="border-gold/30 bg-gold/15 text-gold flex size-11 items-center justify-center rounded-xl border">
              <Calendar className="size-5" />
            </div>
          </div>

          <div className="border-gold/30 bg-card/90 flex items-center justify-between rounded-2xl border p-5 shadow-lg backdrop-blur-md">
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                In Attesa di Conferma
              </p>
              <h3 className="font-display text-3xl font-bold text-amber-500">
                {pendingCount}
              </h3>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-500">
              <Clock className="size-5" />
            </div>
          </div>

          <div className="border-gold/30 bg-card/90 flex items-center justify-between rounded-2xl border p-5 shadow-lg backdrop-blur-md">
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Prenotazioni Confermate
              </p>
              <h3 className="font-display text-3xl font-bold text-emerald-600">
                {confirmedCount}
              </h3>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
          </div>

          <div className="border-gold/30 bg-card/90 flex items-center justify-between rounded-2xl border p-5 shadow-lg backdrop-blur-md">
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Incasso Totale (€)
              </p>
              <h3 className="font-display text-gold text-3xl font-bold">
                € {totalRevenue}
              </h3>
            </div>
            <div className="border-gold/30 bg-gold/15 text-gold flex size-11 items-center justify-center rounded-xl border">
              <Euro className="size-5" />
            </div>
          </div>
        </div>

        {/* Tab Selector Controls */}
        <div className="border-gold/30 bg-card/80 flex flex-wrap items-center gap-2 rounded-2xl border p-2 shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all",
              activeTab === "calendar"
                ? "border-gold/60 shadow-gold/20 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 shadow-lg"
                : "text-muted-foreground hover:bg-gold/10 hover:text-foreground",
            )}
          >
            <Calendar className="size-4" />
            <span>Calendario &amp; Disponibilità</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reservations")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all",
              activeTab === "reservations"
                ? "border-gold/60 shadow-gold/20 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 shadow-lg"
                : "text-muted-foreground hover:bg-gold/10 hover:text-foreground",
            )}
          >
            <Users className="size-4" />
            <span>Tutte le Prenotazioni ({reservations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all",
              activeTab === "new"
                ? "border-gold/60 shadow-gold/20 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 shadow-lg"
                : "text-muted-foreground hover:bg-gold/10 hover:text-foreground",
            )}
          >
            <PlusCircle className="size-4" />
            <span>Nuova Prenotazione / Blocco Date</span>
          </button>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: CALENDARIO & DISPONIBILITÀ MATRICE */}
        {/* ---------------------------------------------------- */}
        {activeTab === "calendar" && (
          <div className="border-gold/30 bg-card/90 flex flex-col gap-6 rounded-3xl border p-6 shadow-xl backdrop-blur-md">
            <div className="border-border/60 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="font-display text-gold text-xl font-semibold">
                  Matrice Disponibilità Camere
                </h2>
                <p className="text-muted-foreground text-xs">
                  Panoramica giorno per giorno di posti liberi, occupati e bloccati
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear((y) => y - 1);
                    } else {
                      setCurrentMonth((m) => m - 1);
                    }
                  }}
                  className="border-gold/30 text-gold hover:bg-gold/20 flex size-9 items-center justify-center rounded-full border transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="font-display text-sm font-semibold tracking-wider uppercase">
                  {italianMonths[currentMonth]} {currentYear}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear((y) => y + 1);
                    } else {
                      setCurrentMonth((m) => m + 1);
                    }
                  }}
                  className="border-gold/30 text-gold hover:bg-gold/20 flex size-9 items-center justify-center rounded-full border transition-colors"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="border-border/60 bg-muted/40 flex flex-wrap items-center gap-6 rounded-2xl border p-4 text-xs font-medium">
              <span className="text-muted-foreground uppercase">Legenda Stato:</span>
              <div className="flex items-center gap-2">
                <span className="size-3.5 rounded-full bg-emerald-500" />
                <span>Libera (Disponibile)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3.5 rounded-full bg-emerald-700" />
                <span>Prenotazione Confermata</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3.5 rounded-full bg-amber-500" />
                <span>In Attesa di Conferma</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3.5 rounded-full bg-neutral-600" />
                <span>Bloccata dall&apos;Admin</span>
              </div>
            </div>

            {/* Calendar Grid Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[768px] border-collapse text-xs">
                <thead>
                  <tr className="border-border border-b">
                    <th className="text-gold w-44 p-3 text-left font-semibold uppercase">
                      Camera / Giorno
                    </th>
                    {calendarDays.map((day) => (
                      <th
                        key={day}
                        className="text-muted-foreground p-1.5 text-center font-semibold"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y">
                  {rooms.map((room) => (
                    <tr key={room.slug} className="hover:bg-muted/20">
                      <td className="text-foreground p-3 font-semibold">
                        <div className="flex items-center gap-2">
                          <Bed className="text-gold size-4 shrink-0" />
                          <span>{room.name}</span>
                        </div>
                      </td>
                      {calendarDays.map((day) => {
                        const mStr = String(currentMonth + 1).padStart(2, "0");
                        const dStr = String(day).padStart(2, "0");
                        const dateStr = `${currentYear}-${mStr}-${dStr}`;

                        // Check status of date
                        const targetTime = new Date(dateStr).getTime();
                        const foundRes = reservations.find((res) => {
                          if (res.roomSlug !== room.slug || res.status === "cancelled")
                            return false;
                          const start = new Date(res.checkIn).getTime();
                          const end = new Date(res.checkOut).getTime();
                          return targetTime >= start && targetTime < end;
                        });

                        let cellClass =
                          "bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30";
                        let statusText = "Libera";

                        if (foundRes) {
                          if (foundRes.status === "confirmed") {
                            cellClass = "bg-emerald-600 text-white font-bold shadow-sm";
                            statusText = `Occupata: ${foundRes.customerName}`;
                          } else if (foundRes.status === "pending") {
                            cellClass = "bg-amber-500 text-white font-bold animate-pulse";
                            statusText = `In attesa: ${foundRes.customerName}`;
                          } else if (foundRes.status === "blocked") {
                            cellClass = "bg-neutral-600 text-white font-medium";
                            statusText = `Bloccata: ${foundRes.customerName}`;
                          }
                        }

                        return (
                          <td key={day} className="p-1 text-center">
                            <div
                              title={`${room.name} — ${day} ${italianMonths[currentMonth]}: ${statusText}`}
                              className={cn(
                                "flex h-8 w-full cursor-pointer items-center justify-center rounded-lg text-[0.7rem] transition-all",
                                cellClass,
                              )}
                            >
                              {day}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: TABELLA TUTTE LE PRENOTAZIONI */}
        {/* ---------------------------------------------------- */}
        {activeTab === "reservations" && (
          <div className="border-gold/30 bg-card/90 flex flex-col gap-6 rounded-3xl border p-6 shadow-xl backdrop-blur-md">
            <div className="border-border/60 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="font-display text-gold text-xl font-semibold">
                  Elenco Prenotazioni &amp; Richieste
                </h2>
                <p className="text-muted-foreground text-xs">
                  Gestisci lo stato di ogni prenotazione, accetta o rifiuta le richieste
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Cerca cliente o camera..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-gold/30 pl-9 text-xs sm:w-56"
                  />
                </div>

                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border-gold/30 text-xs"
                >
                  <option value="all">Tutti gli Stati</option>
                  <option value="pending">In Attesa</option>
                  <option value="confirmed">Confermate</option>
                  <option value="cancelled">Cancellate</option>
                  <option value="blocked">Bloccate</option>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-xs">
                <thead>
                  <tr className="border-border text-gold border-b text-left font-semibold uppercase">
                    <th className="p-3">ID</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Contatti</th>
                    <th className="p-3">Camera</th>
                    <th className="p-3">Check-in / Check-out</th>
                    <th className="p-3">Ospiti</th>
                    <th className="p-3">Totale</th>
                    <th className="p-3">Stato</th>
                    <th className="p-3 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-muted-foreground p-8 text-center text-sm"
                      >
                        Nessuna prenotazione trovata per i filtri selezionati.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => (
                      <tr key={res.id} className="hover:bg-muted/20">
                        <td className="text-muted-foreground p-3 font-mono font-bold">
                          {res.id}
                        </td>
                        <td className="text-foreground p-3 font-semibold">
                          {res.customerName}
                        </td>
                        <td className="text-muted-foreground p-3">
                          <div>{res.email}</div>
                          <div className="text-[0.7rem]">{res.phone}</div>
                        </td>
                        <td className="text-gold p-3 font-medium">{res.roomName}</td>
                        <td className="p-3 font-medium whitespace-nowrap">
                          {res.checkIn} → {res.checkOut}
                        </td>
                        <td className="p-3">
                          {res.adults} Ad. {res.children > 0 && `+ ${res.children} Bam.`}
                        </td>
                        <td className="text-foreground p-3 font-bold">
                          € {res.totalPrice}
                        </td>
                        <td className="p-3">
                          {res.status === "confirmed" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-600 uppercase">
                              <CheckCircle2 className="size-3" />
                              Confermata
                            </span>
                          )}
                          {res.status === "pending" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[0.7rem] font-semibold text-amber-600 uppercase">
                              <Clock className="size-3" />
                              In Attesa
                            </span>
                          )}
                          {res.status === "cancelled" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[0.7rem] font-semibold text-red-600 uppercase">
                              <XCircle className="size-3" />
                              Cancellata
                            </span>
                          )}
                          {res.status === "blocked" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-500/15 px-2.5 py-1 text-[0.7rem] font-semibold text-neutral-400 uppercase">
                              <Lock className="size-3" />
                              Bloccata
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {res.status !== "confirmed" && (
                              <button
                                type="button"
                                title="Conferma prenotazione"
                                onClick={() => handleStatusChange(res.id, "confirmed")}
                                className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 p-1.5 text-emerald-600 transition-colors hover:bg-emerald-500/30"
                              >
                                <CheckCircle2 className="size-4" />
                              </button>
                            )}
                            {res.status !== "cancelled" && (
                              <button
                                type="button"
                                title="Cancella prenotazione"
                                onClick={() => handleStatusChange(res.id, "cancelled")}
                                className="rounded-lg border border-amber-500/30 bg-amber-500/15 p-1.5 text-amber-600 transition-colors hover:bg-amber-500/30"
                              >
                                <XCircle className="size-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              title="Elimina definitivamente"
                              onClick={() => handleDelete(res.id)}
                              className="rounded-lg border border-red-500/30 bg-red-500/15 p-1.5 text-red-500 transition-colors hover:bg-red-500/30"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: NUOVA PRENOTAZIONE / BLOCCO DATE */}
        {/* ---------------------------------------------------- */}
        {activeTab === "new" && (
          <div className="border-gold/30 bg-card/90 flex flex-col gap-6 rounded-3xl border p-6 shadow-xl backdrop-blur-md">
            <div>
              <h2 className="font-display text-gold text-xl font-semibold">
                Inserimento Manuale / Blocco Date
              </h2>
              <p className="text-muted-foreground text-xs">
                Registra una prenotazione telefonica o blocca le date per manutenzione
              </p>
            </div>

            {formSuccessMsg && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-sm font-semibold text-emerald-600">
                <Sparkles className="size-5" />
                <span>{formSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase">
                  <input
                    type="radio"
                    name="formType"
                    checked={formType === "booking"}
                    onChange={() => setFormType("booking")}
                    className="accent-gold"
                  />
                  <span>Nuova Prenotazione Cliente</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase">
                  <input
                    type="radio"
                    name="formType"
                    checked={formType === "block"}
                    onChange={() => setFormType("block")}
                    className="accent-gold"
                  />
                  <span>Blocco Date per Manutenzione</span>
                </label>
              </div>

              {formType === "booking" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="cName">Nome e Cognome Cliente</Label>
                    <Input
                      id="cName"
                      required
                      value={formCustomer}
                      onChange={(e) => setFormCustomer(e.target.value)}
                      placeholder="Mario Rossi"
                      className="border-gold/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="cEmail">Email</Label>
                    <Input
                      id="cEmail"
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="mario@gmail.com"
                      className="border-gold/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="cPhone">Telefono</Label>
                    <Input
                      id="cPhone"
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+39 340 0000000"
                      className="border-gold/30"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fRoom">Seleziona Camera</Label>
                  <Select
                    id="fRoom"
                    value={formRoom}
                    onChange={(e) =>
                      setFormRoom(e.target.value as "suite-francy" | "domi" | "mery")
                    }
                    className="border-gold/30"
                  >
                    {rooms.map((r) => (
                      <option key={r.slug} value={r.slug}>
                        {r.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fCheckIn">Data Check-in</Label>
                  <Input
                    id="fCheckIn"
                    type="date"
                    required
                    value={formCheckIn}
                    onChange={(e) => setFormCheckIn(e.target.value)}
                    className="border-gold/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fCheckOut">Data Check-out</Label>
                  <Input
                    id="fCheckOut"
                    type="date"
                    required
                    value={formCheckOut}
                    onChange={(e) => setFormCheckOut(e.target.value)}
                    className="border-gold/30"
                  />
                </div>
              </div>

              {formType === "booking" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="fAdults">Adulti</Label>
                    <Input
                      id="fAdults"
                      type="number"
                      min={1}
                      max={4}
                      value={formAdults}
                      onChange={(e) => setFormAdults(Number(e.target.value))}
                      className="border-gold/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="fChildren">Bambini</Label>
                    <Input
                      id="fChildren"
                      type="number"
                      min={0}
                      max={3}
                      value={formChildren}
                      onChange={(e) => setFormChildren(Number(e.target.value))}
                      className="border-gold/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="fPrice">Prezzo Totale (€)</Label>
                    <Input
                      id="fPrice"
                      type="number"
                      min={0}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="border-gold/30"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fNotes">Note Aggiuntive / Motivo Blocco</Label>
                <Textarea
                  id="fNotes"
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Inserisci eventuali dettagli o richieste particolari..."
                  className="border-gold/30"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="border-gold/40 hover:shadow-gold/30 self-start border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] font-semibold text-amber-100 uppercase transition-all"
              >
                {formType === "block" ? "Conferma Blocco Date" : "Salva Prenotazione"}
              </Button>
            </form>
          </div>
        )}
      </Container>
    </Section>
  );
}
