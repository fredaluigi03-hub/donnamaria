"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Euro,
  Bed,
  Edit,
  Settings,
  Tag,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { rooms } from "@/config/rooms";
import { useMounted } from "@/hooks/use-mounted";
import {
  addReservation,
  deleteReservation,
  getReservations,
  getRoomPrices,
  getSiteSettings,
  saveRoomPrices,
  saveSiteSettings,
  toggleRoomDateBlock,
  updateReservation,
  updateReservationStatus,
  type AdminSiteSettings,
  type Reservation,
  type RoomPrices,
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

// Server component (app/admin/page.tsx) only renders this once the session
// cookie has already been verified — no client-side auth state left here.
export function AdminDashboard() {
  const router = useRouter();
  const mounted = useMounted();

  const [activeTab, setActiveTab] = useState<
    "calendar" | "reservations" | "new" | "prices" | "settings"
  >("calendar");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Room Prices State
  const [roomPrices, setRoomPricesState] = useState<RoomPrices>(getRoomPrices());
  const [priceSuccessMsg, setPriceSuccessMsg] = useState("");

  // Site Settings State
  const [siteSettings, setSiteSettingsState] =
    useState<AdminSiteSettings>(getSiteSettings());
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState("");

  // Calendar View State
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 7 = August (0-indexed)

  // Edit Reservation Modal State
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);

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

  const [reservationsError, setReservationsError] = useState("");

  useEffect(() => {
    loadData();

    function handleUpdate() {
      loadData();
    }
    window.addEventListener("donnamaria_prices_updated", handleUpdate);
    window.addEventListener("donnamaria_settings_updated", handleUpdate);
    return () => {
      window.removeEventListener("donnamaria_prices_updated", handleUpdate);
      window.removeEventListener("donnamaria_settings_updated", handleUpdate);
    };
  }, []);

  async function loadData() {
    try {
      setReservations(await getReservations());
      setReservationsError("");
    } catch (err) {
      setReservationsError(err instanceof Error ? err.message : "Errore di caricamento.");
    }
    setRoomPricesState(getRoomPrices());
    setSiteSettingsState(getSiteSettings());
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleStatusChange(id: string, newStatus: Reservation["status"]) {
    await updateReservationStatus(id, newStatus);
    await loadData();
  }

  async function handleDelete(id: string) {
    if (confirm("Sei sicuro di voler eliminare questa prenotazione?")) {
      await deleteReservation(id);
      await loadData();
    }
  }

  async function handleCellClick(
    roomSlug: "suite-francy" | "domi" | "mery",
    roomName: string,
    dateStr: string,
    existingRes?: Reservation,
  ) {
    if (existingRes) {
      setEditingRes({ ...existingRes });
      return;
    }
    try {
      await toggleRoomDateBlock(roomSlug, roomName, dateStr, reservations);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore durante il blocco della data.");
    }
  }

  async function handleSaveEditRes(e: React.FormEvent) {
    e.preventDefault();
    if (!editingRes) return;
    try {
      await updateReservation(editingRes.id, editingRes);
      setEditingRes(null);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore durante il salvataggio.");
    }
  }

  function handleSavePrices(e: React.FormEvent) {
    e.preventDefault();
    saveRoomPrices(roomPrices);
    setPriceSuccessMsg("Tariffe camere aggiornate con successo!");
    setTimeout(() => setPriceSuccessMsg(""), 3000);
    loadData();
  }

  function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    saveSiteSettings(siteSettings);
    setSettingsSuccessMsg("Impostazioni struttura salvate con successo!");
    setTimeout(() => setSettingsSuccessMsg(""), 3000);
    loadData();
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    const roomObj = rooms.find((r) => r.slug === formRoom);

    try {
      await addReservation({
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
      await loadData();

      setTimeout(() => {
        setFormSuccessMsg("");
        setActiveTab("calendar");
      }, 1500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore durante il salvataggio.");
    }
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

  // The server already verified the session cookie before choosing to render
  // this component at all — `mounted` here is only to keep the localStorage
  // reads (reservations, prices, settings) off the server-rendered pass.
  if (!mounted) return null;

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
                  Pannello Gestionale Completo
                </span>
                <span className="border-gold/40 bg-gold/20 text-gold rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase">
                  Sessione Admin Attiva
                </span>
              </div>
              <h1 className="font-display text-2xl font-semibold text-white">
                Gestione Donna Maria Suite &amp; Relax
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

        {reservationsError && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm font-semibold text-red-500">
            <XCircle className="size-5 shrink-0" />
            <span>Prenotazioni non caricate: {reservationsError}</span>
          </div>
        )}

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
            <span>Calendario Interattivo</span>
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
            <span>Elenco Prenotazioni ({reservations.length})</span>
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
            <span>Nuova Prenotazione</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("prices")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all",
              activeTab === "prices"
                ? "border-gold/60 shadow-gold/20 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 shadow-lg"
                : "text-muted-foreground hover:bg-gold/10 hover:text-foreground",
            )}
          >
            <Tag className="size-4" />
            <span>Prezzi Camere</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all",
              activeTab === "settings"
                ? "border-gold/60 shadow-gold/20 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] text-amber-100 shadow-lg"
                : "text-muted-foreground hover:bg-gold/10 hover:text-foreground",
            )}
          >
            <Settings className="size-4" />
            <span>Info Struttura</span>
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
                  Matrice Disponibilità &amp; Modifica Diretta
                </h2>
                <p className="text-muted-foreground text-xs">
                  Clicca su qualsiasi giorno libero per bloccarlo/sbloccarlo o su una
                  prenotazione per modificarla
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
              <span className="text-muted-foreground uppercase">Legenda &amp; Clic:</span>
              <div className="flex items-center gap-2">
                <span className="size-3.5 rounded-full bg-emerald-500" />
                <span>Libera (Clicca per Bloccare)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3.5 rounded-full bg-emerald-700" />
                <span>Prenotata (Clicca per Modificare)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3.5 rounded-full bg-amber-500" />
                <span>In Attesa (Clicca per Modificare)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3.5 rounded-full bg-neutral-600" />
                <span>Bloccata Admin (Clicca per Sbloccare)</span>
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

                        const targetTime = new Date(dateStr).getTime();
                        const foundRes = reservations.find((res) => {
                          if (res.roomSlug !== room.slug || res.status === "cancelled")
                            return false;
                          const start = new Date(res.checkIn).getTime();
                          const end = new Date(res.checkOut).getTime();
                          return targetTime >= start && targetTime < end;
                        });

                        let cellClass =
                          "bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/40 hover:scale-105";
                        let statusText = "Libera — Clicca per Bloccare";

                        if (foundRes) {
                          if (foundRes.status === "confirmed") {
                            cellClass =
                              "bg-emerald-600 text-white font-bold shadow-sm hover:scale-105";
                            statusText = `Occupata: ${foundRes.customerName} — Clicca per Modificare`;
                          } else if (foundRes.status === "pending") {
                            cellClass =
                              "bg-amber-500 text-white font-bold animate-pulse hover:scale-105";
                            statusText = `In attesa: ${foundRes.customerName} — Clicca per Modificare`;
                          } else if (foundRes.status === "blocked") {
                            cellClass =
                              "bg-neutral-600 text-white font-medium hover:scale-105";
                            statusText = `Bloccata Admin — Clicca per Sbloccare`;
                          }
                        }

                        return (
                          <td key={day} className="p-1 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleCellClick(
                                  room.slug as "suite-francy" | "domi" | "mery",
                                  room.name,
                                  dateStr,
                                  foundRes,
                                )
                              }
                              title={`${room.name} — ${day} ${italianMonths[currentMonth]}: ${statusText}`}
                              className={cn(
                                "flex h-8 w-full cursor-pointer items-center justify-center rounded-lg text-[0.7rem] transition-all",
                                cellClass,
                              )}
                            >
                              {day}
                            </button>
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
                  Elenco Prenotazioni &amp; Modifica
                </h2>
                <p className="text-muted-foreground text-xs">
                  Gestisci, modifica o elimina qualsiasi prenotazione registrata
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
                            <button
                              type="button"
                              title="Modifica prenotazione"
                              onClick={() => setEditingRes({ ...res })}
                              className="border-gold/40 bg-gold/15 text-gold hover:bg-gold/30 rounded-lg border p-1.5 transition-colors"
                            >
                              <Edit className="size-4" />
                            </button>
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

        {/* ---------------------------------------------------- */}
        {/* TAB 4: GESTIONE PREZZI CAMERE */}
        {/* ---------------------------------------------------- */}
        {activeTab === "prices" && (
          <div className="border-gold/30 bg-card/90 flex max-w-2xl flex-col gap-6 rounded-3xl border p-6 shadow-xl backdrop-blur-md">
            <div>
              <h2 className="font-display text-gold text-xl font-semibold">
                Gestione Tariffe per Notte
              </h2>
              <p className="text-muted-foreground text-xs">
                Modifica i prezzi base a notte per ciascuna camera del B&amp;B
              </p>
            </div>

            {priceSuccessMsg && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs font-semibold text-emerald-600">
                <Sparkles className="size-4" />
                <span>{priceSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePrices} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="pFrancy">Suite Francy (€ / Notte)</Label>
                  <Input
                    id="pFrancy"
                    type="number"
                    min={0}
                    value={roomPrices["suite-francy"]}
                    onChange={(e) =>
                      setRoomPricesState((prev) => ({
                        ...prev,
                        "suite-francy": Number(e.target.value),
                      }))
                    }
                    className="border-gold/30 font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="pDomi">Camera Domi (€ / Notte)</Label>
                  <Input
                    id="pDomi"
                    type="number"
                    min={0}
                    value={roomPrices["domi"]}
                    onChange={(e) =>
                      setRoomPricesState((prev) => ({
                        ...prev,
                        domi: Number(e.target.value),
                      }))
                    }
                    className="border-gold/30 font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="pMery">Camera Mery (€ / Notte)</Label>
                  <Input
                    id="pMery"
                    type="number"
                    min={0}
                    value={roomPrices["mery"]}
                    onChange={(e) =>
                      setRoomPricesState((prev) => ({
                        ...prev,
                        mery: Number(e.target.value),
                      }))
                    }
                    className="border-gold/30 font-bold"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="border-gold/40 hover:shadow-gold/30 self-start border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] font-semibold text-amber-100 uppercase transition-all"
              >
                Salva Nuove Tariffe
              </Button>
            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: IMPOSTAZIONI STRUTTURA */}
        {/* ---------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="border-gold/30 bg-card/90 flex max-w-2xl flex-col gap-6 rounded-3xl border p-6 shadow-xl backdrop-blur-md">
            <div>
              <h2 className="font-display text-gold text-xl font-semibold">
                Impostazioni generali della Struttura
              </h2>
              <p className="text-muted-foreground text-xs">
                Aggiorna i contatti principali ed i relativi orari di check-in/out
              </p>
            </div>

            {settingsSuccessMsg && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs font-semibold text-emerald-600">
                <Sparkles className="size-4" />
                <span>{settingsSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sPhone">Telefono di Contatto</Label>
                  <Input
                    id="sPhone"
                    value={siteSettings.phone}
                    onChange={(e) =>
                      setSiteSettingsState((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="border-gold/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sEmail">Email di Contatto</Label>
                  <Input
                    id="sEmail"
                    type="email"
                    value={siteSettings.email}
                    onChange={(e) =>
                      setSiteSettingsState((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="border-gold/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sCheckIn">Orario Check-in</Label>
                  <Input
                    id="sCheckIn"
                    value={siteSettings.checkInTime}
                    onChange={(e) =>
                      setSiteSettingsState((prev) => ({
                        ...prev,
                        checkInTime: e.target.value,
                      }))
                    }
                    className="border-gold/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sCheckOut">Orario Check-out</Label>
                  <Input
                    id="sCheckOut"
                    value={siteSettings.checkOutTime}
                    onChange={(e) =>
                      setSiteSettingsState((prev) => ({
                        ...prev,
                        checkOutTime: e.target.value,
                      }))
                    }
                    className="border-gold/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sAddress">Indirizzo Struttura</Label>
                <Input
                  id="sAddress"
                  value={siteSettings.address}
                  onChange={(e) =>
                    setSiteSettingsState((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="border-gold/30"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="border-gold/40 hover:shadow-gold/30 self-start border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] font-semibold text-amber-100 uppercase transition-all"
              >
                Salva Impostazioni
              </Button>
            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* EDIT RESERVATION DIALOG MODAL */}
        {/* ---------------------------------------------------- */}
        <Dialog
          open={editingRes !== null}
          onOpenChange={(open) => !open && setEditingRes(null)}
        >
          <DialogContent className="border-gold/40 bg-card/95 max-w-2xl p-6 backdrop-blur-2xl">
            <DialogTitle className="font-display text-gold text-xl font-semibold">
              Modifica Prenotazione ({editingRes?.id})
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Aggiorna qualsiasi dettaglio della prenotazione del cliente
            </DialogDescription>

            {editingRes && (
              <form onSubmit={handleSaveEditRes} className="mt-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editName">Nome Cliente</Label>
                    <Input
                      id="editName"
                      value={editingRes.customerName}
                      onChange={(e) =>
                        setEditingRes({ ...editingRes, customerName: e.target.value })
                      }
                      className="border-gold/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={editingRes.email}
                      onChange={(e) =>
                        setEditingRes({ ...editingRes, email: e.target.value })
                      }
                      className="border-gold/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editPhone">Telefono</Label>
                    <Input
                      id="editPhone"
                      type="tel"
                      value={editingRes.phone}
                      onChange={(e) =>
                        setEditingRes({ ...editingRes, phone: e.target.value })
                      }
                      className="border-gold/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editRoom">Camera</Label>
                    <Select
                      id="editRoom"
                      value={editingRes.roomSlug}
                      onChange={(e) => {
                        const slug = e.target.value as "suite-francy" | "domi" | "mery";
                        const roomObj = rooms.find((r) => r.slug === slug);
                        setEditingRes({
                          ...editingRes,
                          roomSlug: slug,
                          roomName: roomObj?.name ?? slug,
                        });
                      }}
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
                    <Label htmlFor="editCheckIn">Check-in</Label>
                    <Input
                      id="editCheckIn"
                      type="date"
                      value={editingRes.checkIn}
                      onChange={(e) =>
                        setEditingRes({ ...editingRes, checkIn: e.target.value })
                      }
                      className="border-gold/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editCheckOut">Check-out</Label>
                    <Input
                      id="editCheckOut"
                      type="date"
                      value={editingRes.checkOut}
                      onChange={(e) =>
                        setEditingRes({ ...editingRes, checkOut: e.target.value })
                      }
                      className="border-gold/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editAdults">Adulti</Label>
                    <Input
                      id="editAdults"
                      type="number"
                      min={1}
                      max={4}
                      value={editingRes.adults}
                      onChange={(e) =>
                        setEditingRes({
                          ...editingRes,
                          adults: Number(e.target.value),
                        })
                      }
                      className="border-gold/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editChildren">Bambini</Label>
                    <Input
                      id="editChildren"
                      type="number"
                      min={0}
                      max={3}
                      value={editingRes.children}
                      onChange={(e) =>
                        setEditingRes({
                          ...editingRes,
                          children: Number(e.target.value),
                        })
                      }
                      className="border-gold/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="editPrice">Prezzo Totale (€)</Label>
                    <Input
                      id="editPrice"
                      type="number"
                      min={0}
                      value={editingRes.totalPrice}
                      onChange={(e) =>
                        setEditingRes({
                          ...editingRes,
                          totalPrice: Number(e.target.value),
                        })
                      }
                      className="border-gold/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="editStatus">Stato Prenotazione</Label>
                  <Select
                    id="editStatus"
                    value={editingRes.status}
                    onChange={(e) =>
                      setEditingRes({
                        ...editingRes,
                        status: e.target.value as Reservation["status"],
                      })
                    }
                    className="border-gold/30"
                  >
                    <option value="pending">In Attesa di Conferma</option>
                    <option value="confirmed">Confermata</option>
                    <option value="cancelled">Cancellata</option>
                    <option value="blocked">Bloccata Admin</option>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="editNotes">Note Aggiuntive</Label>
                  <Textarea
                    id="editNotes"
                    rows={3}
                    value={editingRes.notes ?? ""}
                    onChange={(e) =>
                      setEditingRes({ ...editingRes, notes: e.target.value })
                    }
                    className="border-gold/30"
                  />
                </div>

                <div className="mt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingRes(null)}
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    className="border-gold/40 border bg-gradient-to-r from-[#181818] via-[#28221b] to-[#181818] font-semibold text-amber-100 uppercase"
                  >
                    Salva Modifiche
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Section>
  );
}
