import type { Metadata } from "next";
import Link from "next/link";
import { SHIPPING_OFFERED_SENTENCE, SHIPPING_ZONE_LABEL } from "@/lib/shipping-zone";

export const metadata: Metadata = { title: "Livraison" };

export default function ShippingPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Livraison</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          {SHIPPING_OFFERED_SENTENCE} Les délais estimés figurent sur chaque fiche produit. Un
          numéro de suivi est communiqué après l’expédition.
        </p>
        <p>
          Zone desservie : {SHIPPING_ZONE_LABEL}. Pas de livraison vers les DOM-TOM ni hors de cette
          zone.
        </p>
        <p>
          Pour la Suisse, hors Union européenne, des droits ou taxes d’importation peuvent être
          demandés à la réception. Ils ne sont pas inclus dans le prix payé sur le site.
        </p>
      </div>
      <Link href="/collections/maison" className="btn btn-secondary mt-8 inline-flex">
        Voir la sélection
      </Link>
    </div>
  );
}
