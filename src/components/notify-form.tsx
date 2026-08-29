"use client";

import { useId, useState } from "react";

export function NotifyForm({
  productName,
  productSlug,
}: {
  productName: string;
  productSlug: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const fieldId = useId();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/stock-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productSlug }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="space-y-3 rounded-2xl border border-border bg-card p-5" onSubmit={onSubmit}>
      <p className="text-sm font-medium leading-relaxed">
        Cet article est indisponible. Prévenez-moi lorsque {productName} sera de nouveau en stock.
      </p>
      {status === "ok" ? (
        <p className="text-sm text-accent">Demande enregistrée.</p>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor={fieldId}>
            E-mail
          </label>
          <input
            id={fieldId}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            className="w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="btn btn-primary whitespace-nowrap" disabled={status === "loading"}>
            {status === "loading" ? "Envoi…" : "M’avertir"}
          </button>
        </div>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">Impossible d’enregistrer la demande. Réessayez.</p>
      )}
    </form>
  );
}
