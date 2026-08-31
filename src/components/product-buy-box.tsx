"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { IconLock, IconReturn, IconTruck } from "@/components/icons";
import { SignedNote } from "@/components/signed-note";
import { store } from "@/config/store";
import { founderNotes } from "@/content/founder-notes";
import type { Product } from "@/lib/types/commerce";

const objections = [
  {
    title: "Livraison offerte, colis suivi",
    text: "Livraison offerte en France métropolitaine. Un numéro de suivi est envoyé après l’expédition. Les délais estimés figurent sur la fiche.",
    icon: IconTruck,
  },
  {
    title: "Paiement par carte, page sécurisée",
    text: "Le règlement se fait par carte. Nous ne vous demandons pas de coordonnées bancaires par e-mail. Le total TTC est confirmé avant paiement.",
    icon: IconLock,
  },
  {
    title: "Retours sous 14 jours",
    text: "Vous disposez de 14 jours après réception pour vous rétracter, lorsque le droit français le prévoit. Le SAV répond du lundi au vendredi, 10h–22h.",
    icon: IconReturn,
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

        <ul className="space-y-4 border-t border-border pt-4">
          {objections.map((item) => (
            <li key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 h-5 w-5 text-navy" />
              <div>
                <p className="text-sm font-medium text-navy">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <SignedNote>
          <p className="text-sm">{founderNotes.trust}</p>
        </SignedNote>
        <p className="text-xs text-muted">
          Une question avant d’ajouter ? {store.supportEmail} — {store.supportHoursShort}.
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
