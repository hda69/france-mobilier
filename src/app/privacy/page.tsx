import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = { title: "Confidentialité" };

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Politique de confidentialité</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>{store.storeName} traite les données nécessaires au fonctionnement de la boutique :</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>contact : nom, e-mail, message ;</li>
          <li>compte client : nom, e-mail, mot de passe hashé ;</li>
          <li>commande : coordonnées de livraison et historique d’achat ;</li>
          <li>paiement par carte : traité par le prestataire de paiement ;</li>
          <li>journaux techniques d’hébergement.</li>
        </ul>
        <p>
          Base légale : exécution du contrat, obligation légale ou intérêt légitime selon le
          traitement. Droits RGPD (accès, rectification, effacement) : {store.supportEmail}.
        </p>
      </div>
    </div>
  );
}
