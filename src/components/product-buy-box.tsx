"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { IconCheck, IconReturn, IconTruck } from "@/components/icons";
import { store } from "@/config/store";
import type { Product } from "@/lib/types/commerce";
import { SHIPPING_OFFERED_SENTENCE } from "@/lib/shipping-zone";

const objections = [
  {
    title: "Livraison offerte, colis suivi",
    text: `${SHIPPING_OFFERED_SENTENCE} Un numéro de suivi est envoyé après l’expédition. Les délais estimés figurent sur la fiche.`,
    icon: IconTruck,
    badge: "bg-navy text-white",
  },
  {
    title: "Paiement sécurisé",
    text: "Carte, Apple Pay ou Google Pay sur la page Stripe. Nous ne demandons jamais vos coordonnées bancaires par e-mail. Le total TTC est confirmé avant paiement.",
    icon: IconCheck,
    badge: "bg-emerald-600 text-white",
  },
  {
    title: "Retours sous 14 jours",
    text: "Vous disposez de 14 jours après réception pour vous rétracter, lorsque le droit français le prévoit. Le SAV répond du lundi au vendredi, 10h–22h.",
    icon: IconReturn,
    badge: "bg-navy text-white",
  },
];

export function ProductBuyBox({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function add() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity,
    );
    setAdded(true);
  }

  return (
    <>
      <div className="space-y-4">
        <label className="block text-sm text-muted">
          Quantité
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            className="input mt-1 max-w-24"
          />
        </label>
        <button type="button" className="btn btn-primary w-full text-base" onClick={add}>
          {added ? "Ajouté au panier" : "Ajouter au panier"}
        </button>

        <section className="buy-trust">
          <p className="buy-trust-head">Inclus avec cette commande</p>
          <ul>
            {objections.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.badge}`}
                  aria-hidden
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[0.95rem] font-semibold text-navy">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-muted">
          Pour toute question : {store.supportEmail} — {store.supportHoursShort}.
        </p>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 px-3 pt-3 backdrop-blur md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button type="button" className="btn btn-primary w-full" onClick={add}>
          {added ? "Ajouté au panier" : "Ajouter au panier"}
        </button>
      </div>
    </>
  );
}
