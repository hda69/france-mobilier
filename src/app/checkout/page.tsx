import type { Metadata } from "next";
import Link from "next/link";
import { store } from "@/config/store";
import { isCheckoutEnabled } from "@/lib/payments/stripe";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  const enabled = isCheckoutEnabled();

  return (
    <div className="container-page max-w-2xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      {!enabled ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <p className="font-medium">Pré-lancement</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Notre boutique est actuellement en phase de pré-lancement. Aucun paiement n’est collecté
            et aucun PaymentIntent Stripe n’est créé.
          </p>
          <Link href="/cart" className="btn btn-secondary mt-6 inline-flex">
            Retour au panier
          </Link>
        </div>
      ) : (
        <p className="mt-6 text-muted">
          Checkout activé — brancher Stripe côté serveur avant d’accepter des paiements. Contact :{" "}
          {store.supportEmail}
        </p>
      )}
    </div>
  );
}
