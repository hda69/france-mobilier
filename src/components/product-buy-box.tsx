"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { IconLock, IconReturn, IconTruck } from "@/components/icons";
import type { Product } from "@/lib/types/commerce";

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
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex items-center gap-2">
            <IconLock className="h-4 w-4 text-navy" /> Paiement sécurisé
          </li>
          <li className="flex items-center gap-2">
            <IconTruck className="h-4 w-4 text-navy" /> Livraison suivie
          </li>
          <li className="flex items-center gap-2">
            <IconReturn className="h-4 w-4 text-navy" /> Retours sous 14 jours
          </li>
        </ul>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-3 backdrop-blur md:hidden">
        <button type="button" className="btn btn-primary w-full" onClick={add}>
          {added ? "Ajouté au panier" : "Ajouter au panier"}
        </button>
      </div>
    </>
  );
}
