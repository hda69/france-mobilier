import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function LegalPage() {
  const siege = [store.companyPostalCode, store.companyCity, store.companyCountry]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Mentions légales</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Le site {store.storeName} ({store.domain.replace("https://", "")}) est édité par{" "}
          {store.companyName}.
        </p>
        <p>Directeur de la publication : {store.companyName}.</p>
        {siege ? <p>Siège : {siege}.</p> : null}
        <p>Immatriculation : {store.companyRegistration}.</p>
        {store.companyNaf ? <p>Activité (NAF) : {store.companyNaf}.</p> : null}
        {store.vatNumber ? <p>TVA : {store.vatNumber}</p> : null}
        <p>Contact : {store.supportEmail}</p>
        <p>Hébergement : Railway, Pays-Bas / UE (infrastructure cloud).</p>
      </div>
    </div>
  );
}
