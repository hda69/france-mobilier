import type { Product } from "@/lib/types/commerce";

export type DeliveryEstimate = {
  handlingMinBusinessDays: number | null;
  handlingMaxBusinessDays: number | null;
  transitMinBusinessDays: number | null;
  transitMaxBusinessDays: number | null;
  overallMinDays: number | null;
  overallMaxDays: number | null;
  madeToOrder: boolean;
  customizedForCustomer: boolean;
  returnEligible: boolean;
  structured: boolean;
};

export function getDeliveryEstimate(product: Product): DeliveryEstimate {
  const handlingMin = product.handlingMinBusinessDays ?? null;
  const handlingMax = product.handlingMaxBusinessDays ?? handlingMin;
  const transitMin = product.transitMinBusinessDays ?? null;
  const transitMax = product.transitMaxBusinessDays ?? transitMin;
  const structured = handlingMin != null && transitMin != null;
  return {
    handlingMinBusinessDays: handlingMin,
    handlingMaxBusinessDays: handlingMax,
    transitMinBusinessDays: transitMin,
    transitMaxBusinessDays: transitMax,
    overallMinDays: product.shippingMinDays,
    overallMaxDays: product.shippingMaxDays,
    madeToOrder: Boolean(product.madeToOrder),
    customizedForCustomer: Boolean(product.customizedForCustomer),
    returnEligible: product.customizedForCustomer ? false : product.returnEligible !== false,
    structured,
  };
}

export function deliveryCustomerLabel(product: Product): string | null {
  const estimate = getDeliveryEstimate(product);
  if (estimate.structured && estimate.handlingMinBusinessDays != null && estimate.transitMinBusinessDays != null) {
    const prep =
      estimate.handlingMaxBusinessDays != null &&
      estimate.handlingMaxBusinessDays > estimate.handlingMinBusinessDays
        ? `${estimate.handlingMinBusinessDays}–${estimate.handlingMaxBusinessDays}`
        : `${estimate.handlingMinBusinessDays}`;
    const transit =
      estimate.transitMaxBusinessDays != null &&
      estimate.transitMaxBusinessDays > estimate.transitMinBusinessDays
        ? `${estimate.transitMinBusinessDays}–${estimate.transitMaxBusinessDays}`
        : `${estimate.transitMinBusinessDays}`;
    return `préparation ${prep} j ouvrés, acheminement ${transit} j ouvrés`;
  }
  const min = estimate.overallMinDays;
  if (!min) return null;
  const max = estimate.overallMaxDays;
  if (max && max > min) return `${min}–${max} jours après la commande`;
  return `à partir de ${min} jours après la commande`;
}

export function schemaAvailability(product: Product) {
  return product.availabilityStatus === "available"
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

export function feedAvailability(product: Product) {
  return product.availabilityStatus === "available" ? "in_stock" : "out_of_stock";
}
