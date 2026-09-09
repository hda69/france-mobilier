"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ActivityEvent } from "@/lib/activity";

type Summary = {
  addToCart: number;
  purchases: number;
  revenueCents: number;
  windowHours: number;
};

function formatWhen(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Europe/Paris",
  }).format(date);
}

function formatMoney(cents: number | null) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function AdminActivityLive() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/activity", { cache: "no-store", credentials: "same-origin" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Chargement impossible");
        if (cancelled) return;
        setEvents(data.events || []);
        setSummary(data.summary || null);
        setUpdatedAt(new Date());
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erreur");
      }
    }
    void load();
    const timer = setInterval(() => void load(), 4000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="space-y-6">
      {summary ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">Ajouts au panier · 24 h</p>
            <p className="mt-1 text-3xl font-semibold">{summary.addToCart}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">Achats · 24 h</p>
            <p className="mt-1 text-3xl font-semibold">{summary.purchases}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">CA payé · 24 h</p>
            <p className="mt-1 text-3xl font-semibold">{formatMoney(summary.revenueCents)}</p>
          </div>
        </div>
      ) : null}

      <p className="text-xs text-muted">
        {updatedAt
          ? `Mis à jour ${formatWhen(updatedAt)} — rafraîchi toutes les 4 secondes.`
          : "Chargement…"}
        {error ? ` ${error}` : ""}
      </p>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border bg-background/60">
            <tr>
              <th className="px-4 py-3 font-medium">Quand</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Détail</th>
              <th className="px-4 py-3 font-medium">Montant</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-muted">
                  Aucune activité pour le moment. Les ajouts au panier et les paiements apparaissent ici.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-b border-border last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                    {formatWhen(event.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {event.type === "purchase" ? "Achat" : "Panier"}
                  </td>
                  <td className="px-4 py-3">
                    <p>{event.productName || "—"}</p>
                    <p className="text-xs text-muted">
                      {event.type === "purchase" && event.orderId ? (
                        <Link href={`/commande/${event.orderId}`} className="hover:underline">
                          {event.orderReference || event.orderId.slice(0, 8)}
                        </Link>
                      ) : event.quantity ? (
                        `× ${event.quantity}`
                      ) : null}
                      {event.email ? ` · ${event.email}` : " · visiteur"}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatMoney(event.amountCents)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
