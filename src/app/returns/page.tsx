import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = { title: "Retours" };

export default function ReturnsPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Retours</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Vous disposez de 14 jours à compter de la réception pour exercer votre droit de
          rétractation, lorsque le droit français de la consommation s’applique. Le produit doit
          être renvoyé dans un état permettant sa revente.
        </p>
        <p>
          Pour une demande de retour :{" "}
          <a href={`mailto:${store.supportEmail}`} className="text-accent underline-offset-4 hover:underline">
            {store.supportEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
