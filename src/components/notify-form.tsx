"use client";

import { useState } from "react";

export function NotifyForm({ productName }: { productName: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className="space-y-3 rounded-2xl border border-border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        setDone(true);
      }}
    >
      <p className="text-sm text-muted">
        Soyez informé lorsque <span className="text-foreground">{productName}</span> sera disponible.
      </p>
      {done ? (
        <p className="text-sm text-accent">Demande enregistrée localement. Notification e-commerce bientôt disponible.</p>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            className="w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="btn btn-primary whitespace-nowrap">
            M&apos;avertir
          </button>
        </div>
      )}
    </form>
  );
}
