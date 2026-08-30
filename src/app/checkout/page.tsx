import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Commande</h1>
      <p className="mt-2 text-muted">Livraison offerte en France métropolitaine. Paiement par carte.</p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
