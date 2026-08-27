"use client";

import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/types/commerce";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={() =>
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0],
        })
      }
    >
      Ajouter au panier (démo)
    </button>
  );
}
