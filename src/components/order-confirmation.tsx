"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/products/repository";

export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const { clear } = useCart();
  const [state, setState] = useState<"loading" | "paid" | "error">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [amountCents, setAmountCents] = useState<number | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setState("error");
      return;
    }
    fetch(`/api/checkout?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paid) {
          setState("paid");
          setEmail(data.email || null);
          setAmountCents(typeof data.amountCents === "number" ? data.amountCents : null);
          clear();
        } else setState("error");
      })
      .catch(() => setState("error"));
  }, [searchParams, clear]);

  if (state === "loading") {
    return <p className="text-muted">Confirmation du paiement…</p>;
  }

  if (state === "error") {
    return (
      <div>
        <p className="text-muted">Nous n’avons pas pu confirmer ce paiement.</p>
        <Link href="/checkout" className="btn btn-primary mt-6 inline-flex">
          Retour à la commande
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <p className="mt-3 leading-relaxed text-muted">
        Le règlement a bien été enregistré
        {amountCents != null ? ` (${formatPrice(amountCents / 100)})` : ""}.
        {email ? ` Un e-mail Stripe est envoyé à ${email}.` : ""}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        La livraison est offerte en France métropolitaine. Un suivi sera communiqué après
        l’expédition.
      </p>
      <Link href="/collections/maison" className="btn btn-primary mt-8 inline-flex">
        Continuer vos achats
      </Link>
    </div>
  );
}
