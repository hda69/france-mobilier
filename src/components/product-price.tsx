import type { Product } from "@/lib/types/commerce";
import { formatPrice } from "@/lib/products/repository";

export function isOnSale(product: Product, price = product.price, compareAtPrice = product.compareAtPrice) {
  return compareAtPrice != null && compareAtPrice > price;
}

export function salePercentOff(product: Product, price = product.price, compareAtPrice = product.compareAtPrice) {
  if (!isOnSale(product, price, compareAtPrice) || compareAtPrice == null) return null;
  return Math.round((1 - price / compareAtPrice) * 100);
}

export function ProductPrice({
  product,
  size = "card",
  price,
  compareAtPrice,
}: {
  product: Product;
  size?: "card" | "pdp";
  price?: number;
  compareAtPrice?: number | null;
}) {
  const amount = price ?? product.price;
  const compare = compareAtPrice === undefined ? product.compareAtPrice : compareAtPrice;
  const sale = isOnSale(product, amount, compare);
  const percent = salePercentOff(product, amount, compare);
  const priceClass = size === "pdp" ? "text-3xl font-medium text-navy" : "text-sm font-medium text-navy";
  const compareClass = size === "pdp" ? "text-base text-muted line-through" : "text-sm text-muted line-through";
  const percentClass =
    size === "pdp" ? "text-sm font-semibold text-[var(--sale-fluo)]" : "text-sm font-semibold text-[var(--sale-fluo)]";

  return (
    <p className={`flex flex-wrap items-baseline ${size === "pdp" ? "gap-3" : "gap-2"}`}>
      <span className={priceClass}>{formatPrice(amount)}</span>
      {sale && compare != null ? <span className={compareClass}>{formatPrice(compare)}</span> : null}
      {size === "pdp" && percent != null && percent > 0 ? (
        <span className={percentClass}>−{percent}&nbsp;%</span>
      ) : null}
    </p>
  );
}
