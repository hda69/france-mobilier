import type { Product } from "@/lib/types/commerce";
import { formatPrice } from "@/lib/products/repository";

export function isOnSale(product: Product) {
  return product.compareAtPrice != null && product.compareAtPrice > product.price;
}

export function salePercentOff(product: Product) {
  if (!isOnSale(product) || product.compareAtPrice == null) return null;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}

export function ProductPrice({
  product,
  size = "card",
}: {
  product: Product;
  size?: "card" | "pdp";
}) {
  const sale = isOnSale(product);
  const percent = salePercentOff(product);
  const priceClass = size === "pdp" ? "text-2xl font-medium text-navy" : "text-sm font-medium text-navy";
  const compareClass = size === "pdp" ? "text-lg text-muted line-through" : "text-sm text-muted line-through";
  const percentClass =
    size === "pdp" ? "text-base font-semibold text-[var(--sale-fluo)]" : "text-sm font-semibold text-[var(--sale-fluo)]";

  return (
    <p className={`flex flex-wrap items-baseline ${size === "pdp" ? "gap-3" : "gap-2"}`}>
      <span className={priceClass}>{formatPrice(product.price)}</span>
      {sale ? <span className={compareClass}>{formatPrice(product.compareAtPrice as number)}</span> : null}
      {size === "pdp" && percent != null && percent > 0 ? (
        <span className={percentClass}>(-{percent}%)</span>
      ) : null}
    </p>
  );
}
