"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AccountNav } from "@/components/account-nav";
import { QuoteRequestForm } from "@/components/quote-request-form";
import { useCart } from "@/components/cart-provider";
import { authClient } from "@/lib/auth-client";

type Quote = {
  id: string;
  reference: string;
  status: string;
  amountCents: number;
  createdAt: string;
};

export default function CompteDevisPage() {
  const { data: session, isPending } = authClient.useSession();
  const { items } = useCart();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/pro-access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setApproved(data?.request?.status === "approved"))
      .catch(() => {});
    fetch("/api/quotes")
      .then((res) => (res.ok ? res.json() : { quotes: [] }))
      .then((data) => setQuotes(data.quotes || []))
      .catch(() => {});
  }, [session?.user]);

  if (isPending) return <div className="container-page py-14 text-muted">Chargement…</div>;
  if (!session?.user) {
    return (
      <div className="container-page py-14">
        <Link href="/connexion?next=/compte/devis" className="btn btn-primary inline-flex">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page space-y-8 py-14">
      <AccountNav current="devis" proApproved={approved} />
      <h1 className="text-3xl font-semibold tracking-tight">Mes devis</h1>
      {!approved ? (
        <p className="text-muted">
          L’espace devis s’ouvre après activation de l’accès professionnel.{" "}
          <Link href="/compte/entreprise" className="underline">
            Mon entreprise
          </Link>
        </p>
      ) : (
        <>
          {items.length > 0 ? (
            <QuoteRequestForm
              source="account"
              items={items.map((item) => ({ productId: item.productId, quantity: item.quantity }))}
            />
          ) : (
            <p className="text-sm text-muted">Ajoutez des produits au panier ou demandez un devis depuis une fiche produit.</p>
          )}
          <ul className="space-y-3">
            {quotes.map((quote) => (
              <li key={quote.id} className="rounded-2xl border border-border bg-white p-4">
                <p className="font-medium">{quote.reference}</p>
                <p className="text-sm text-muted">
                  {quote.status} · {(quote.amountCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} ·{" "}
                  {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
