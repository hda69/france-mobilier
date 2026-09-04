"use client";

import { useState } from "react";

type Request = {
  id: string;
  email: string;
  companyName: string;
  legalName: string;
  siren: string;
  siret: string | null;
  vatNumber: string | null;
  website: string | null;
  billingLine1: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  activityLabel: string | null;
  volumeLabel: string | null;
  message: string | null;
  status: string;
  discountType: string | null;
  discountValue: number | null;
  createdAt: string;
  approvedAt: string | null;
  orderCount: number;
  orderTotalCents: number;
};

export function AdminProfessionalDetail({
  request,
  quotes,
}: {
  request: Request;
  quotes: { id: string; reference: string; status: string; amountCents: number; createdAt: string }[];
}) {
  const [row, setRow] = useState(request);
  const [percent, setPercent] = useState(String(row.discountValue || ""));
  const [busy, setBusy] = useState(false);

  async function patch(action: string, extra?: Record<string, unknown>) {
    if (!confirm("Confirmer cette action ?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/professionnels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action impossible");
      if (data.request) setRow((current) => ({ ...current, ...data.request }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight">{row.companyName}</h1>
        <p className="mt-1 text-sm text-muted">Statut : {row.status}</p>
        <h2 className="mt-6 text-sm font-medium text-navy">Entreprise</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>Raison sociale : {row.legalName}</li>
          <li>SIREN : {row.siren || "—"}</li>
          <li>SIRET : {row.siret || "—"}</li>
          <li>TVA : {row.vatNumber || "—"}</li>
          <li>
            Adresse : {[row.billingLine1, row.postalCode, row.city, row.country].filter(Boolean).join(", ") || "—"}
          </li>
          <li>Site : {row.website || "—"}</li>
        </ul>
        <h2 className="mt-6 text-sm font-medium text-navy">Contact</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>{[row.firstName, row.lastName].filter(Boolean).join(" ") || "—"}</li>
          <li>{row.email}</li>
          <li>{row.phone || "—"}</li>
        </ul>
        <h2 className="mt-6 text-sm font-medium text-navy">Activité</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>{row.activityLabel || "—"}</li>
          <li>Volume estimé : {row.volumeLabel || "—"}</li>
          <li>{row.message || "—"}</li>
        </ul>
      </section>
      <section className="space-y-6">
        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-sm font-medium text-navy">Historique</h2>
          <p className="mt-2 text-sm text-muted">
            Inscription : {new Date(row.createdAt).toLocaleDateString("fr-FR")}
            {row.approvedAt ? ` · Activé : ${new Date(row.approvedAt).toLocaleDateString("fr-FR")}` : ""}
          </p>
          <p className="mt-2 text-sm text-muted">
            Commandes : {row.orderCount} ·{" "}
            {(row.orderTotalCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
          </p>
          <p className="mt-2 text-sm text-muted">Devis : {quotes.length}</p>
          <ul className="mt-3 space-y-1 text-sm">
            {quotes.map((quote) => (
              <li key={quote.id}>
                {quote.reference} · {quote.status} ·{" "}
                {(quote.amountCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-sm font-medium text-navy">Actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {row.status === "pending" ? (
              <>
                <button type="button" disabled={busy} className="btn btn-primary" onClick={() => patch("approve")}>
                  Approuver
                </button>
                <button type="button" disabled={busy} className="btn btn-secondary" onClick={() => patch("reject")}>
                  Refuser
                </button>
              </>
            ) : null}
            {row.status === "approved" ? (
              <button type="button" disabled={busy} className="btn btn-secondary" onClick={() => patch("suspend")}>
                Suspendre
              </button>
            ) : null}
            {row.status === "suspended" ? (
              <button type="button" disabled={busy} className="btn btn-primary" onClick={() => patch("reactivate")}>
                Réactiver
              </button>
            ) : null}
          </div>
          <label className="mt-6 block text-sm">
            Remise permanente (%)
            <input
              className="input mt-1 max-w-32"
              inputMode="numeric"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
            />
          </label>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={busy}
              className="btn btn-primary"
              onClick={() =>
                patch("discount", {
                  discountType: Number(percent) > 0 ? "percentage" : null,
                  discountValue: Number(percent) > 0 ? Number(percent) : null,
                })
              }
            >
              Enregistrer la remise
            </button>
            <button
              type="button"
              disabled={busy}
              className="btn btn-secondary"
              onClick={() => {
                setPercent("");
                patch("discount", { discountType: null, discountValue: null });
              }}
            >
              Aucune remise
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
