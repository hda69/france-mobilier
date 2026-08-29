import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = { title: "Conditions générales" };

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Conditions générales de vente</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          {store.storeName} est en phase de pré-lancement. Aucune commande payante n’est acceptée
          tant que le checkout n’est pas activé.
        </p>
        <p>
          Les prix affichés sont indicatifs. Les conditions définitives de vente, de livraison et de
          rétractation seront publiées avant l’ouverture commerciale.
        </p>
        <p className="text-xs">
          Brouillon non opposable — conditions définitives avant ouverture commerciale.
        </p>
      </div>
    </div>
  );
}
