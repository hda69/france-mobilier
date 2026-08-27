import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = { title: "Confidentialité" };

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Politique de confidentialité</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          {store.storeName} traite les données de contact (nom, e-mail, message) uniquement pour
          répondre aux demandes envoyées via le formulaire.
        </p>
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
          Texte type à faire valider avant production. TODO_LEGAL_CONFIG — DPO / représentant si
          requis.
        </p>
      </div>
    </div>
  );
}
