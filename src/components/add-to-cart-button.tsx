"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/types/commerce";

export function AddToCartButton({
  product,
  className = "btn btn-primary",
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0],
        });
        setAdded(true);
      }}
    >
      {added ? "Ajouté au panier" : "Ajouter au panier"}
    </button>
  );
}
