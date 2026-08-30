import type { Metadata } from "next";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur la livraison, les retours et les commandes.",
};

const items = [
  {
    q: "Livrez-vous en France métropolitaine ?",
    a: "Oui, livraison offerte. Un numéro de suivi est communiqué après l’expédition.",
  },
  {
    q: "Les prix sont-ils TTC ?",
    a: "Oui. Le montant total est confirmé au paiement.",
  },
  {
    q: "Puis-je retourner un produit ?",
    a: "Vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation, lorsque le droit français le prévoit.",
  },
  {
    q: "Comment vous contacter ?",
    a: `Écrivez-nous à ${store.supportEmail}. SAV en semaine, ${store.supportHoursShort}.`,
  },
];

export default function FaqPage() {
  return (
    <div className="container-page max-w-3xl py-12 md:py-16">
      <p className="eyebrow">Aide</p>
      <h1 className="display mt-3 text-3xl text-navy md:text-4xl">Questions fréquentes</h1>
      <div className="mt-10 space-y-6">
        {items.map((item) => (
          <div key={item.q}>
            <h2 className="font-medium text-navy">{item.q}</h2>
            <p className="mt-2 leading-relaxed text-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
