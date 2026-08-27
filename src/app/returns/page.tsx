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
          le lancement commercial (rétractation 14 jours lorsque applicable).
        </p>
        <p>
          Adresse de retour : {store.returnAddress === "RETURN_ADDRESS_TODO"
            ? "RETURN_ADDRESS_TODO — à renseigner avant lancement"
            : store.returnAddress}
        </p>
        <p>Contact : {store.supportEmail}</p>
      </div>
    </div>
  );
}
