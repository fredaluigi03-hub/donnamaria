"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { type Reservation } from "@/lib/admin-store";

const STATUS_COLORS: Record<Reservation["status"], string> = {
  confirmed: "var(--color-emerald-500)",
  pending: "var(--color-amber-500)",
  cancelled: "var(--color-red-500)",
  blocked: "var(--color-neutral-500)",
};

const STATUS_LABELS: Record<Reservation["status"], string> = {
  confirmed: "Confermate",
  pending: "In Attesa",
  cancelled: "Cancellate",
  blocked: "Bloccate",
};

const italianMonthsShort = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

function cardClass(extra = "") {
  return `border-gold/30 bg-card/90 rounded-3xl border p-6 shadow-xl backdrop-blur-md ${extra}`;
}

/**
 * Every chart reads from the same `reservations` list the rest of the
 * dashboard already loads (via `getReservations()` in admin-dashboard.tsx)
 * — no separate fetch, just different views of data already in hand.
 */
export function AdminStats({ reservations }: { reservations: Reservation[] }) {
  const revenueByMonth = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const res of reservations) {
      if (res.status !== "confirmed") continue;
      const d = new Date(res.checkIn);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
      buckets.set(key, (buckets.get(key) ?? 0) + res.totalPrice);
    }
    return [...buckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, revenue]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          label: `${italianMonthsShort[month!]} '${String(year).slice(2)}`,
          revenue,
        };
      });
  }, [reservations]);

  const byStatus = useMemo(() => {
    const counts: Record<Reservation["status"], number> = {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      blocked: 0,
    };
    for (const res of reservations) counts[res.status]++;
    return (Object.keys(counts) as Reservation["status"][])
      .filter((status) => counts[status] > 0)
      .map((status) => ({ status, name: STATUS_LABELS[status], value: counts[status] }));
  }, [reservations]);

  const byRoom = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const res of reservations) {
      if (res.status === "blocked") continue;
      buckets.set(res.roomName, (buckets.get(res.roomName) ?? 0) + 1);
    }
    return [...buckets.entries()].map(([roomName, count]) => ({ roomName, count }));
  }, [reservations]);

  const cancellations = useMemo(() => {
    const cancelled = reservations.filter(
      (r) => r.status === "cancelled" && r.refundPercentage != null,
    );
    const fullRefund = cancelled.filter((r) => r.refundPercentage === 100).length;
    const partialRefund = cancelled.length - fullRefund;
    const withheldTotal = cancelled.reduce((sum, r) => {
      const withheldPct = 100 - (r.refundPercentage ?? 100);
      return sum + Math.round((r.totalPrice * withheldPct) / 100);
    }, 0);
    return { total: cancelled.length, fullRefund, partialRefund, withheldTotal };
  }, [reservations]);

  if (reservations.length === 0) {
    return (
      <div className={cardClass("text-muted-foreground text-center text-sm")}>
        Nessun dato disponibile per generare le statistiche.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={cardClass()}>
        <h2 className="font-display text-gold mb-1 text-xl font-semibold">
          Incasso Mensile (Prenotazioni Confermate)
        </h2>
        <p className="text-muted-foreground mb-4 text-xs">
          Somma del prezzo totale, raggruppata per mese di check-in
        </p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueByMonth} margin={{ left: 8, right: 16, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                tickFormatter={(v: number) => `€${v}`}
              />
              <Tooltip
                formatter={(value) => [`€ ${value ?? 0}`, "Incasso"]}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Incasso"
                stroke="var(--gold)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "var(--gold)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={cardClass()}>
          <h2 className="font-display text-gold mb-1 text-xl font-semibold">
            Prenotazioni per Stato
          </h2>
          <p className="text-muted-foreground mb-4 text-xs">
            Distribuzione di tutte le prenotazioni registrate
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {byStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardClass()}>
          <h2 className="font-display text-gold mb-1 text-xl font-semibold">
            Prenotazioni per Camera
          </h2>
          <p className="text-muted-foreground mb-4 text-xs">
            Numero di richieste/soggiorni per ciascuna camera (esclusi i blocchi admin)
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byRoom} margin={{ left: 8, right: 16, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="roomName"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Prenotazioni" fill="var(--gold)" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={cardClass()}>
        <h2 className="font-display text-gold mb-1 text-xl font-semibold">
          Cancellazioni &amp; Rimborsi
        </h2>
        <p className="text-muted-foreground mb-4 text-xs">
          Policy: rimborso 100% se cancellata almeno 7 giorni prima del check-in,
          altrimenti 70% (tratteniamo il 30%)
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border-border/60 bg-muted/30 rounded-2xl border p-4">
            <p className="text-muted-foreground text-xs uppercase">Totale Cancellate</p>
            <p className="font-display text-foreground text-2xl font-bold">
              {cancellations.total}
            </p>
          </div>
          <div className="border-border/60 bg-muted/30 rounded-2xl border p-4">
            <p className="text-muted-foreground text-xs uppercase">Rimborso 100% / 70%</p>
            <p className="font-display text-foreground text-2xl font-bold">
              {cancellations.fullRefund} / {cancellations.partialRefund}
            </p>
          </div>
          <div className="border-border/60 bg-muted/30 rounded-2xl border p-4">
            <p className="text-muted-foreground text-xs uppercase">Trattenuto (30%)</p>
            <p className="font-display text-gold text-2xl font-bold">
              € {cancellations.withheldTotal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
