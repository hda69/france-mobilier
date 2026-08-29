import { and, eq, sql } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { stockAlert } from "@/lib/db/schema";

export async function subscribeStockAlert(input: {
  email: string;
  productId: string;
  productSlug: string;
}) {
  await ensureDatabase();
  const email = input.email.trim().toLowerCase();
  const existing = await db
    .select({ id: stockAlert.id })
    .from(stockAlert)
    .where(and(eq(stockAlert.email, email), eq(stockAlert.productId, input.productId)))
    .limit(1);

  if (existing.length > 0) {
    return { id: existing[0].id, created: false };
  }

  const id = crypto.randomUUID();
  await db.insert(stockAlert).values({
    id,
    email,
    productId: input.productId,
    productSlug: input.productSlug,
    createdAt: new Date(),
  });
  return { id, created: true };
}

export async function countStockAlerts() {
  await ensureDatabase();
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(stockAlert);
  return Number(rows[0]?.count ?? 0);
}

export async function countStockAlertsByProduct() {
  await ensureDatabase();
  return db
    .select({
      productSlug: stockAlert.productSlug,
      count: sql<number>`count(*)`,
    })
    .from(stockAlert)
    .groupBy(stockAlert.productSlug);
}
