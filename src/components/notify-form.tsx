"use client";

import { useId, useState } from "react";
import { LAUNCH_ALERT_SLUG } from "@/lib/launch-alert";

type NotifyFormProps = {
  productName?: string;
  productSlug?: string;
  variant?: "product" | "launch";
  /** Unique page anchor. Use at most once per page. */
  anchor?: boolean;
};

export function NotifyForm({
  productName,
  productSlug,
  variant = "product",
  anchor = false,
}: NotifyFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const fieldId = useId();
  const slug = variant === "launch" ? LAUNCH_ALERT_SLUG : productSlug;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!slug) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/stock-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productSlug: slug }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  const heading =
    variant === "launch"
      ? "Soyez le premier informé à l’ouverture des commandes."
      : `Prévenez-moi lorsque ${productName} sera commandable.`;

  return (
    <form
      id={anchor ? (variant === "launch" ? "alerte" : "alerte-produit") : undefined}
      className="space-y-3 rounded-2xl border border-accent/25 bg-accent-soft/60 p-5"
      onSubmit={onSubmit}
    >
      <p className="text-sm font-medium leading-relaxed">{heading}</p>
      <p className="text-xs text-muted">Un e-mail au lancement, rien d’autre. Pas de newsletter cachée.</p>
      {status === "ok" ? (
        <p className="text-sm text-accent">
          C’est noté. Nous vous écrirons à cette adresse dès que les commandes ouvriront.
        </p>
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
            {status === "loading" ? "Envoi…" : "Prévenez-moi"}
          </button>
        </div>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">Impossible d’enregistrer la demande. Réessayez dans un instant.</p>
      )}
    </form>
  );
}
