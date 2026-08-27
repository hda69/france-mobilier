import type { Metadata } from "next";

export const metadata: Metadata = { title: "Livraison" };

export default function ShippingPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Livraison</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Les délais définitifs seront indiqués sur chaque fiche produit lors du lancement. Aucun
          délai « 48h » ou équivalent n’est promis en pré-lancement.
        </p>
        <p>
          Zone prévue : France métropolitaine. Les options transporteur et le tracking seront
          activés avec le fulfillment.
        </p>
        <p>
          Champs techniques prévus : shippingMinDays, shippingMaxDays, shippingProvider,
          trackingNumber.
        </p>
      </div>
    </div>
  );
}
