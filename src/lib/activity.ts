import { and, desc, eq, gte } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { shopActivity } from "@/lib/db/schema";
import { eurosToCents } from "@/lib/payments/stripe";

export type ActivityType = "add_to_cart" | "purchase";

export type ActivityEvent = {
  id: string;
  type: ActivityType;
  productId: string | null;
  productName: string | null;
  quantity: number | null;
  amountCents: number | null;
  currency: string;
  email: string | null;
  orderId: string | null;
  orderReference: string | null;
  variantId: string | null;
  createdAt: Date;
};

function toEvent(row: typeof shopActivity.$inferSelect): ActivityEvent {
  return {
    id: row.id,
    type: row.type === "purchase" ? "purchase" : "add_to_cart",
    productId: row.productId,
    productName: row.productName,
    quantity: row.quantity,
    amountCents: row.amountCents,
    currency: row.currency,
    email: row.email,
    orderId: row.orderId,
    orderReference: row.orderReference,
    variantId: row.variantId,
    createdAt: row.createdAt,
  };
}

export async function recordAddToCart(input: {
  productId: string;
  productName: string;
  quantity: number;
  priceEur: number;
  variantId?: string | null;
  email?: string | null;
}) {
  await ensureDatabase();
  const quantity = Math.max(1, Math.min(20, Math.floor(input.quantity) || 1));
  await db.insert(shopActivity).values({
    id: crypto.randomUUID(),
    type: "add_to_cart",
    productId: input.productId.slice(0, 80),
    productName: input.productName.trim().slice(0, 180) || "Produit",
    quantity,
    amountCents: eurosToCents(input.priceEur) * quantity,
    currency: "eur",
    email: input.email?.trim().toLowerCase() || null,
    orderId: null,
    orderReference: null,
    variantId: input.variantId?.trim() || null,
    createdAt: new Date(),
  });
}

export async function recordPurchase(input: {
  orderId: string;
  orderReference: string;
  email: string;
  amountCents: number;
  productName: string;
}) {
  await ensureDatabase();
  const existing = await db
    .select({ id: shopActivity.id })
    .from(shopActivity)
    .where(and(eq(shopActivity.type, "purchase"), eq(shopActivity.orderId, input.orderId)))
    .limit(1);
  if (existing.length > 0) return;
  await db.insert(shopActivity).values({
    id: crypto.randomUUID(),
    type: "purchase",
    productId: null,
    productName: input.productName.slice(0, 240),
    quantity: null,
    amountCents: input.amountCents,
    currency: "eur",
    email: input.email.trim().toLowerCase(),
    orderId: input.orderId,
    orderReference: input.orderReference,
    variantId: null,
    createdAt: new Date(),
  });
}

export async function listRecentActivity(limit = 80): Promise<ActivityEvent[]> {
  await ensureDatabase();
  const rows = await db
    .select()
    .from(shopActivity)
    .orderBy(desc(shopActivity.createdAt))
    .limit(Math.min(200, Math.max(1, limit)));
  return rows.map(toEvent);
}

export async function activitySummary() {
  await ensureDatabase();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const rows = await db.select().from(shopActivity).where(gte(shopActivity.createdAt, since));
  let addToCart = 0;
  let purchases = 0;
  let revenueCents = 0;
  for (const row of rows) {
    if (row.type === "purchase") {
      purchases += 1;
      revenueCents += row.amountCents ?? 0;
    } else {
      addToCart += 1;
    }
  }
  return { addToCart, purchases, revenueCents, windowHours: 24 };
}
