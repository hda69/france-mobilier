import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function LegalPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Mentions légales</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Éditeur : {store.companyName || store.storeName}
          {store.companyLegalForm ? ` (${store.companyLegalForm})` : ""}
        </p>
        <p>
          Adresse :{" "}
          {store.companyAddress
            ? `${store.companyAddress}, ${store.companyPostalCode} ${store.companyCity}, ${store.companyCountry}`
            : "TODO_LEGAL_CONFIG — adresse à renseigner avant mise en production"}
        </p>
        <p>
          Immatriculation :{" "}
          {store.companyRegistration || "TODO_LEGAL_CONFIG — SIREN/SIRET à renseigner"}
        </p>
        <p>TVA : {store.vatNumber || "TODO_LEGAL_CONFIG — n° TVA si applicable"}</p>
        <p>Contact : {store.supportEmail}</p>
        <p>Hébergement : à compléter selon le prestataire (Vercel / Railway).</p>
        <p className="text-xs">
          Mentions à faire vérifier avant tout lancement commercial.
        </p>
      </div>
    </div>
  );
}
