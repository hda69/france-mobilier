import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = { title: "Confidentialité" };

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Politique de confidentialité</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          {store.storeName} traite les données suivantes, uniquement pour le fonctionnement du
          site et le pré-lancement :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>formulaire de contact : nom, e-mail, message ;</li>
          <li>alerte disponibilité : e-mail et produit concerné ;</li>
          <li>compte client (si créé) : nom, e-mail, mot de passe hashé ;</li>
          <li>données techniques d’hébergement (journaux, adresse IP) chez Railway.</li>
        </ul>
        <p>
          Aucune donnée de paiement n’est collectée tant que le checkout n’est pas activé. Lors de
          l’activation Stripe, les données de carte seront traitées par Stripe.
        </p>
        <p>
          Base légale pré-lancement : intérêt légitime / mesures précontractuelles selon la nature
          de la demande. Droits RGPD : accès, rectification, effacement — contact{" "}
          {store.supportEmail}.
        </p>
        <p className="text-xs">
          Cette politique sera complétée et validée avant le lancement commercial.
        </p>
      </div>
    </div>
  );
}
