import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = { title: "Retours" };

export default function ReturnsPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Retours</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Une politique de retour conforme au droit français de la consommation sera publiée avant
          le lancement commercial (rétractation 14 jours lorsque applicable). L’adresse de retour
          sera indiquée à ce moment-là.
        </p>
        <p>Contact : {store.supportEmail}</p>
      </div>
      <a href={`mailto:${store.supportEmail}`} className="btn btn-secondary mt-8 inline-flex">
        Une question ? Écrivez-nous
      </a>
    </div>
  );
}
