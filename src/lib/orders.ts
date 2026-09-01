import { and, eq } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { purchase, shopOrder, shopOrderItem, user } from "@/lib/db/schema";
import { findProductById } from "@/lib/products/repository";
import { eurosToCents } from "@/lib/payments/stripe";

export type CheckoutLine = { productId: string; quantity: number };

export type CheckoutCustomer = {
  name: string;
  email: string;
  line1: string;
  postalCode: string;
  city: string;
  phone?: string;
  userId?: string | null;
};

export type PricedLine = {
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  quantity: number;
  unitPriceCents: number;
};

export function priceCheckoutLines(items: CheckoutLine[]) {
  if (items.length === 0) {
    throw new Error("PANIER_VIDE");
  }
  const priced: PricedLine[] = [];
  for (const item of items) {
    const quantity = Math.floor(item.quantity);
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
      throw new Error("QUANTITE_INVALIDE");
    }
    const product = findProductById(item.productId);
    if (!product) throw new Error("PRODUIT_INTROUVABLE");
    if (product.availabilityStatus !== "available") {
      throw new Error("PRODUIT_INDISPONIBLE");
    }
    priced.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] ?? null,
      quantity,
      unitPriceCents: eurosToCents(product.price),
    });
  }
  const amountCents = priced.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  if (amountCents < 50) throw new Error("MONTANT_INVALIDE");
  return { lines: priced, amountCents };
}

export async function createPendingOrder(input: {
  customer: CheckoutCustomer;
  lines: PricedLine[];
  amountCents: number;
}) {
  await ensureDatabase();
  const id = crypto.randomUUID();
  const now = new Date();
  await db.insert(shopOrder).values({
    id,
    stripeSessionId: null,
    userId: input.customer.userId || null,
    email: input.customer.email.trim().toLowerCase(),
    name: input.customer.name.trim(),
    phone: input.customer.phone?.trim() || null,
    line1: input.customer.line1.trim(),
    postalCode: input.customer.postalCode.trim(),
    city: input.customer.city.trim(),
    country: "FR",
    amountCents: input.amountCents,
    currency: "eur",
    status: "pending",
    createdAt: now,
    paidAt: null,
  });
  await db.insert(shopOrderItem).values(
    input.lines.map((line) => ({
      id: crypto.randomUUID(),
      orderId: id,
      productId: line.productId,
      name: line.name,
      quantity: line.quantity,
      unitPriceCents: line.unitPriceCents,
    })),
  );
  return id;
}

export async function attachStripeSession(orderId: string, stripeSessionId: string) {
  await ensureDatabase();
  await db.update(shopOrder).set({ stripeSessionId }).where(eq(shopOrder.id, orderId));
}

export async function markOrderPaid(orderId: string, stripeSessionId: string) {
  await ensureDatabase();
  const rows = await db.select().from(shopOrder).where(eq(shopOrder.id, orderId)).limit(1);
  const order = rows[0];
  if (!order) throw new Error("COMMANDE_INTROUVABLE");
  if (order.status === "paid") return order;

  const now = new Date();
  await db
    .update(shopOrder)
    .set({
      status: "paid",
      stripeSessionId,
      paidAt: now,
    })
    .where(eq(shopOrder.id, orderId));

  const items = await db.select().from(shopOrderItem).where(eq(shopOrderItem.orderId, orderId));
  let userId = order.userId;
  if (!userId) {
    const matched = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, order.email))
      .limit(1);
    userId = matched[0]?.id ?? null;
  }
  if (userId) {
    for (const item of items) {
      const already = await db
        .select({ id: purchase.id })
        .from(purchase)
        .where(
          and(
            eq(purchase.userId, userId),
            eq(purchase.productId, item.productId),
            eq(purchase.orderId, orderId),
          ),
        )
        .limit(1);
      if (already.length > 0) continue;
      await db.insert(purchase).values({
        id: crypto.randomUUID(),
        userId,
        productId: item.productId,
        orderId,
        createdAt: now,
      });
    }
  }
  return { ...order, status: "paid", stripeSessionId, paidAt: now };
}

export async function getOrderByStripeSession(stripeSessionId: string) {
  await ensureDatabase();
  const rows = await db
    .select()
    .from(shopOrder)
    .where(eq(shopOrder.stripeSessionId, stripeSessionId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getOrderById(orderId: string) {
  await ensureDatabase();
  const rows = await db.select().from(shopOrder).where(eq(shopOrder.id, orderId)).limit(1);
  const order = rows[0];
  if (!order) return null;
  const items = await db.select().from(shopOrderItem).where(eq(shopOrderItem.orderId, orderId));
  return { ...order, items };
}
