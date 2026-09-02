export type AvailabilityStatus = "coming_soon" | "available" | "out_of_stock";

export type ProductCategory =
  | "maison"
  | "rangement"
  | "bureau"
  | "cuisine"
  | "salle-de-bain"
  | "animaux";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  availabilityStatus: AvailabilityStatus;
  supplierProvider: "buckydrop" | "manual" | null;
  supplierProductId: string | null;
  supplierVariantId: string | null;
  weight: number | null;
  dimensions: string | null;
  shippingMinDays: number | null;
  shippingMaxDays: number | null;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "supplier_ordered"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type Customer = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
};

export type ShippingAddress = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  supplierProvider: "buckydrop" | "manual" | null;
  supplierProductId: string | null;
  supplierVariantId: string | null;
};

export type Tracking = {
  shippingProvider: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
};

export type Fulfillment = {
  status: "pending" | "submitted" | "shipped" | "delivered" | "failed";
  provider: "buckydrop" | "manual" | null;
  providerOrderId: string | null;
  tracking: Tracking;
};

export type Order = {
  orderId: string;
  status: OrderStatus;
  customer: Customer;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  currency: "EUR";
  subtotal: number;
  shippingTotal: number;
  total: number;
  fulfillment: Fulfillment;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};
