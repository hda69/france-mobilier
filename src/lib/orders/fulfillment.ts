import { getDefaultDeliveryProfile } from "@/lib/merchant/delivery";
import {
  addBusinessDaysYmd,
  formatParisDate,
  formatParisYmd,
  parisYmd,
} from "@/lib/orders/business-days";

export type OrderFulfillmentPhase = "preparing" | "prepared" | "shipped";

export type OrderFulfillment = {
  phase: OrderFulfillmentPhase;
  handlingBusinessDays: number;
  transitBusinessDays: number;
  preparedAt: Date | null;
  shippedAt: Date | null;
  expectedPreparedOn: string;
  expectedShippedOn: string;
};

export function shopDeliveryDays() {
  const profile = getDefaultDeliveryProfile();
  return {
    handlingBusinessDays: profile.handlingMinBusinessDays,
    transitBusinessDays: profile.transitMinBusinessDays,
  };
}

export function buildOrderFulfillment(order: {
  paidAt: Date | null;
  createdAt: Date;
  handlingDays?: number | null;
  transitDays?: number | null;
  preparedAt?: Date | null;
  shippedAt?: Date | null;
}): OrderFulfillment {
  const defaults = shopDeliveryDays();
  const handlingBusinessDays = order.handlingDays ?? defaults.handlingBusinessDays;
  const transitBusinessDays = order.transitDays ?? defaults.transitBusinessDays;
  const start = order.paidAt ?? order.createdAt;
  const expectedPreparedOn = addBusinessDaysYmd(start, handlingBusinessDays);
  const expectedShippedOn = order.preparedAt ? parisYmd(order.preparedAt) : expectedPreparedOn;
  const phase: OrderFulfillmentPhase = order.shippedAt
    ? "shipped"
    : order.preparedAt
      ? "prepared"
      : "preparing";
  return {
    phase,
    handlingBusinessDays,
    transitBusinessDays,
    preparedAt: order.preparedAt ?? null,
    shippedAt: order.shippedAt ?? null,
    expectedPreparedOn,
    expectedShippedOn,
  };
}

export function fulfillmentCustomerLabel(fulfillment: OrderFulfillment) {
  if (fulfillment.phase === "shipped") {
    const when = fulfillment.shippedAt ? ` le ${formatParisDate(fulfillment.shippedAt)}` : "";
    return `Colis expédié${when} — acheminement ${fulfillment.transitBusinessDays} jours ouvrés`;
  }
  if (fulfillment.phase === "prepared") {
    const when = fulfillment.preparedAt ? ` le ${formatParisDate(fulfillment.preparedAt)}` : "";
    return `Préparation terminée${when} — expédition en cours`;
  }
  return `En préparation — fin prévue le ${formatParisYmd(fulfillment.expectedPreparedOn)}`;
}
