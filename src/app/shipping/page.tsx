import type { Metadata } from "next";
import Link from "next/link";
import { NotifyForm } from "@/components/notify-form";

export const metadata: Metadata = { title: "Livraison" };

export default function ShippingPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Livraison</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Zone prévue : France métropolitaine. Les délais, le transporteur et le suivi seront
          indiqués sur chaque fiche dès l’ouverture des commandes. Aucun délai express n’est promis
          aujourd’hui.
        </p>
        <p>
          Vous serez prévenu par e-mail lorsque ces informations seront confirmées et que le
          paiement sera ouvert.
        </p>
      </div>
      <Link href="/collections/maison" className="btn btn-secondary mt-8 inline-flex">
        Voir la sélection
      </Link>
      <div className="mt-8">
        <NotifyForm variant="launch" />
      </div>
    </div>
  );
}
