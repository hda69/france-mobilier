import type { Product } from "@/lib/types/commerce";
import { getPublicPrice } from "@/lib/merchant/price";
import { formatPrice } from "@/lib/products/repository";

export function isOnSale(product: Product) {
  return getPublicPrice(product).saleEligible;
}

export function salePercentOff(product: Product) {
  const price = getPublicPrice(product);
  if (!price.saleEligible || price.compareAt == null) return null;
  return Math.round((1 - price.amount / price.compareAt) * 100);
}

export function ProductPrice({
  product,
  size = "card",
  price,
}: {
  product: Product;
  size?: "card" | "pdp";
  price?: number;
  compareAtPrice?: number | null;
}) {
  const publicPrice = getPublicPrice(product);
  const amount = price ?? publicPrice.amount;
  const sale = publicPrice.saleEligible;
  const percent = salePercentOff(product);
  const priceClass = size === "pdp" ? "text-3xl font-medium text-navy" : "text-sm font-medium text-navy";
  const compareClass = size === "pdp" ? "text-base text-muted line-through" : "text-sm text-muted line-through";
  const percentClass = "text-sm font-semibold text-[var(--sale-fluo)]";

  return (
    <p className={`flex flex-wrap items-baseline ${size === "pdp" ? "gap-3" : "gap-2"}`}>
      <span className={priceClass}>{formatPrice(amount)}</span>
      {sale && publicPrice.compareAt != null ? (
        <span className={compareClass}>{formatPrice(publicPrice.compareAt)}</span>
      ) : null}
      {size === "pdp" && percent != null && percent > 0 ? (
        <span className={percentClass}>−{percent}&nbsp;%</span>
      ) : null}
    </p>
  );
}
