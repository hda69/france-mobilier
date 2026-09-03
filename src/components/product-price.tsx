import type { Product } from "@/lib/types/commerce";
import { formatPrice } from "@/lib/products/repository";

export function isOnSale(product: Product) {
  return product.compareAtPrice != null && product.compareAtPrice > product.price;
}

export function ProductPrice({
  product,
  size = "card",
}: {
  product: Product;
  size?: "card" | "pdp";
}) {
  const sale = isOnSale(product);
  const priceClass = size === "pdp" ? "text-2xl font-medium text-navy" : "text-sm font-medium text-navy";
  const compareClass = size === "pdp" ? "text-lg text-muted line-through" : "text-sm text-muted line-through";

  return (
    <p className={`flex flex-wrap items-baseline ${size === "pdp" ? "gap-3" : "gap-2"}`}>
      <span className={priceClass}>{formatPrice(product.price)}</span>
      {sale ? <span className={compareClass}>{formatPrice(product.compareAtPrice as number)}</span> : null}
    </p>
  );
}
