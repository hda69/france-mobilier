"use client";

import { useEffect, useState } from "react";
import { QuoteRequestForm } from "@/components/quote-request-form";
import { authClient } from "@/lib/auth-client";
import { DEFAULT_QUOTE_THRESHOLD_EUROS } from "@/lib/b2b";
import { formatPrice } from "@/lib/products/repository";
import type { Product } from "@/lib/types/commerce";

export function ProQuoteActions({
  product,
  quantity,
  cartItems,
  cartTotalEuros,
}: {
  product?: Product;
  quantity?: number;
  cartItems?: { productId: string; quantity: number }[];
  cartTotalEuros?: number;
}) {
  const { data: session } = authClient.useSession();
  const [approved, setApproved] = useState(false);
  const threshold = DEFAULT_QUOTE_THRESHOLD_EUROS;

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/pro-access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setApproved(data?.request?.status === "approved"))
      .catch(() => {});
  }, [session?.user]);

  if (!approved) return null;

  const items = product
    ? [{ productId: product.id, quantity: quantity || 1 }]
    : cartItems || [];
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      {cartTotalEuros && cartTotalEuros >= threshold ? (
        <p className="text-sm text-navy">
          Vous préparez une commande importante ? Demandez un devis personnalisé à France Mobilier
          Pro.
        </p>
      ) : (
        <p className="text-sm text-muted">Besoin de plusieurs unités ? Demandez un devis.</p>
      )}
      <QuoteRequestForm
        source={product ? "product" : "cart"}
        items={items}
        productLabel={product?.name}
        catalogPriceLabel={product ? formatPrice(product.price) : undefined}
      />
    </div>
  );
}
