import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "À propos",
  description: `À propos de ${store.storeName}`,
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">À propos</h1>
      <div className="mt-6 space-y-4 text-muted leading-relaxed">
        <p>
          {store.storeName} est une boutique française en pré-lancement, dédiée aux équipements
          pratiques pour la maison, le rangement et le bureau.
        </p>
        <p>
          Notre approche privilégie l’utilité, un rapport qualité/prix lisible, la simplicité
          d’usage et la transparence. Nous ne publions pas de stocks, d’avis ou de délais fictifs.
        </p>
        <p>
          Le catalogue actuel présente des fiches de démonstration en statut « bientôt disponible »
          pendant la préparation du lancement commercial.
        </p>
      </div>
    </div>
  );
}
