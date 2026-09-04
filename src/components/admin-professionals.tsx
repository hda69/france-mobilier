"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Row = {
  id: string;
  userId: string;
  email: string;
  companyName: string;
  legalName: string;
  firstName: string | null;
  lastName: string | null;
  siren: string;
  country: string | null;
  status: string;
  discountType: string | null;
  discountValue: number | null;
  createdAt: string;
  orderCount: number;
  orderTotalCents: number;
};

const filters = [
  { id: "all", label: "Tous" },
  { id: "pending", label: "En attente" },
  { id: "approved", label: "Approuvés" },
  { id: "rejected", label: "Refusés" },
  { id: "suspended", label: "Suspendus" },
];

function euros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function AdminProfessionals({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((row) => row.status === filter)),
    [rows, filter],
  );

  async function patch(id: string, action: string, extra?: Record<string, unknown>) {
    if (action !== "discount" && !confirm("Confirmer cette action ?")) return;
    setBusy(id);
    try {
      const res = await fetch("/api/admin/professionnels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action impossible");
      if (data.request) {
        setRows((current) =>
          current.map((row) => (row.id === id ? { ...row, ...data.request } : row)),
        );
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm ${filter === item.id ? "bg-navy text-white" : "bg-cream"}`}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-background/60">
            <tr>
              <th className="px-4 py-3 font-medium">Entreprise</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">SIREN</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Commandes</th>
              <th className="px-4 py-3 font-medium">Remise</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/professionnels/${row.id}`} className="font-medium hover:underline">
                    {row.companyName || row.legalName}
                  </Link>
                  <p className="text-xs text-muted">{row.country || "FR"}</p>
                </td>
                <td className="px-4 py-3">
                  {[row.firstName, row.lastName].filter(Boolean).join(" ") || "—"}
                  <p className="text-xs text-muted">{row.email}</p>
                </td>
                <td className="px-4 py-3">{row.siren || "—"}</td>
                <td className="px-4 py-3">
                  {row.status}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {row.status === "pending" ? (
                      <>
                        <button type="button" className="btn btn-primary px-2 py-1 text-xs" disabled={busy === row.id} onClick={() => patch(row.id, "approve")}>
                          Approuver
                        </button>
                        <button type="button" className="btn btn-secondary px-2 py-1 text-xs" disabled={busy === row.id} onClick={() => patch(row.id, "reject")}>
                          Refuser
                        </button>
                      </>
                    ) : null}
                    {row.status === "approved" ? (
                      <button type="button" className="btn btn-secondary px-2 py-1 text-xs" disabled={busy === row.id} onClick={() => patch(row.id, "suspend")}>
                        Suspendre
                      </button>
                    ) : null}
                    {row.status === "suspended" ? (
                      <button type="button" className="btn btn-primary px-2 py-1 text-xs" disabled={busy === row.id} onClick={() => patch(row.id, "reactivate")}>
                        Réactiver
                      </button>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {row.orderCount} · {euros(row.orderTotalCents)}
                </td>
                <td className="px-4 py-3">
                  {row.discountType === "percentage" && row.discountValue
                    ? `${row.discountValue} %`
                    : "Aucune"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
