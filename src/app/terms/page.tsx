import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = { title: "Conditions générales" };

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Conditions générales de vente</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Les présentes conditions s’appliquent aux ventes conclues sur {store.storeName} (
          {store.domain.replace("https://", "")}), édité par {store.companyName}.
        </p>
        <p>
          Les prix sont indiqués en euros TTC. La commande est ferme après confirmation du
          paiement. Livraison en France métropolitaine.
        </p>
        <p>
          Conformément au code de la consommation, le client dispose d’un délai de 14 jours à
          compter de la réception pour se rétracter, lorsque ce droit s’applique.
        </p>
        <p>Contact : {store.supportEmail}</p>
      </div>
    </div>
  );
}
