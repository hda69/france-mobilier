"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { OrderSummary } from "@/components/order-summary";
import { CopyTextButton } from "@/components/copy-text-button";
import type { PublicOrder } from "@/lib/orders";

export function AccountOrders({ signedIn }: { signedIn: boolean }) {
  const [orders, setOrders] = useState<PublicOrder[] | null>(null);
  const [guestAccount, setGuestAccount] = useState<{ email: string; password: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, []);

  async function onLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") || ""),
          postalCode: String(form.get("postalCode") || ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Recherche impossible");
      setOrders(data.orders || []);
      setGuestAccount(data.guestAccount || null);
      if ((data.orders || []).length === 0) {
        setError("Aucune commande payée pour cet e-mail et ce code postal.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-w-0 space-y-4" id="commandes">
      <h2 className="text-xl font-semibold tracking-tight">Mes commandes</h2>
      {!signedIn ? (
        <p className="text-sm leading-relaxed text-muted">
          Sans compte, retrouvez une commande avec l’e-mail et le code postal utilisés au paiement.
          Un compte avec le même e-mail les affiche ensuite automatiquement.
        </p>
      ) : null}

      {guestAccount ? (
        <div className="rounded-2xl border border-navy/20 bg-cream p-4 sm:p-5">
          <p className="font-medium text-navy">Compte créé pour cet e-mail</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Identifiant : <span className="font-medium text-navy">{guestAccount.email}</span>
            <br />
            <span className="mt-1 inline-flex flex-wrap items-center gap-2">
              Mot de passe provisoire :{" "}
              <span className="font-medium text-navy">{guestAccount.password}</span>
              <CopyTextButton text={guestAccount.password} />
            </span>
          </p>
          <Link href="/connexion?next=%2Fcompte%23mot-de-passe" className="btn btn-secondary mt-4 inline-flex">
            Se connecter
          </Link>
        </div>
      ) : null}

      {orders && orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderSummary order={order} href={`/commande/${order.id}`} />
            </li>
          ))}
        </ul>
      ) : orders ? (
        <p className="text-sm text-muted">
          {signedIn ? "Aucune commande payée n’est liée à ce compte pour le moment." : null}
        </p>
      ) : (
        <p className="text-sm text-muted">Chargement des commandes…</p>
      )}

      <form className="space-y-3 rounded-2xl border border-border bg-white p-4 sm:p-5" onSubmit={onLookup}>
        <p className="text-sm font-medium text-navy">Retrouver une commande</p>
        <label className="block text-sm">
          E-mail
          <input required type="email" name="email" autoComplete="email" className="input mt-1" />
        </label>
        <label className="block text-sm">
          Code postal
          <input
            required
            name="postalCode"
            autoComplete="postal-code"
            inputMode="numeric"
            className="input mt-1"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto">
          {loading ? "Recherche…" : "Afficher"}
        </button>
      </form>

      {!signedIn ? (
        <p className="text-sm text-muted">
          <Link href="/connexion" className="text-accent underline-offset-2 hover:underline">
            Se connecter
          </Link>
          {" · "}
          <Link href="/inscription" className="text-accent underline-offset-2 hover:underline">
            Créer un compte
          </Link>
        </p>
      ) : null}
    </section>
  );
}
