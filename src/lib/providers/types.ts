import type {
  Order,
  OrderItem,
  ShippingAddress,
} from "@/lib/types/commerce";

export type CreateProviderOrderInput = {
  orderId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
};

export type ProviderOrderResult =
  | { status: "NOT_CONFIGURED"; message: string }
  | { status: "OK"; providerOrderId: string }
  | { status: "ERROR"; message: string };

export type ProviderTrackingResult =
  | { status: "NOT_CONFIGURED"; message: string }
  | {
      status: "OK";
      trackingNumber: string | null;
      trackingUrl: string | null;
      carrier: string | null;
    }
  | { status: "ERROR"; message: string };

export interface FulfillmentProvider {
  id: string;
  name: string;
  createOrder(input: CreateProviderOrderInput): Promise<ProviderOrderResult>;
  getOrder(providerOrderId: string): Promise<ProviderOrderResult>;
  getTracking(providerOrderId: string): Promise<ProviderTrackingResult>;
}

export function isOrderReadyForFulfillment(order: Order) {
  return order.status === "paid" || order.status === "processing";
}
