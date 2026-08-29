"use client";

import { useState } from "react";
import { store } from "@/config/store";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (res.ok) {
        form.reset();
        setStatus("ok");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Une question sur une commande, un produit ou la livraison ? Écrivez-nous.
      </p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <label className="block text-sm">
            Nom
            <input name="name" required className="mt-1 w-full rounded-xl border border-border px-3 py-2" />
          </label>
          <label className="block text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Message
            <textarea
              name="message"
              required
              minLength={10}
              rows={5}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={status === "loading"}>
            {status === "loading" ? "Envoi…" : "Envoyer"}
          </button>
          {status === "ok" && (
            <p className="text-sm text-accent">Message reçu. Nous répondrons dès que possible.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-700">Envoi impossible pour le moment. Réessayez plus tard.</p>
          )}
        </form>
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
          <p className="font-medium text-foreground">Coordonnées</p>
          <p className="mt-3">{store.storeName}</p>
          <p>{store.supportEmail}</p>
          {store.phone ? <p className="mt-3">{store.phone}</p> : null}
        </div>
      </div>
    </div>
  );
}
