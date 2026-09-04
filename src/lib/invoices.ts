import { desc, eq } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { proInvoice, proInvoiceSeq, shopOrder, shopOrderItem } from "@/lib/db/schema";
import { getProAccessByUserId } from "@/lib/pro-access";
import { writeProAudit } from "@/lib/pro-access";

export type InvoiceRow = typeof proInvoice.$inferSelect & {
  items: { name: string; quantity: number; unitPriceCents: number }[];
  orderReference: string | null;
};

async function nextInvoiceNumber(issuedAt: Date) {
  const year = issuedAt.getFullYear();
  const existing = await db.select().from(proInvoiceSeq).where(eq(proInvoiceSeq.year, year)).limit(1);
  const last = existing[0]?.lastNumber ?? 0;
  const next = last + 1;
  if (existing[0]) {
    await db.update(proInvoiceSeq).set({ lastNumber: next }).where(eq(proInvoiceSeq.year, year));
  } else {
    await db.insert(proInvoiceSeq).values({ year, lastNumber: next });
  }
  return `FM-${year}-${String(next).padStart(6, "0")}`;
}

export async function ensureProInvoiceForOrder(orderId: string) {
  await ensureDatabase();
  const existing = await db.select().from(proInvoice).where(eq(proInvoice.orderId, orderId)).limit(1);
  if (existing[0]) return existing[0];

  const orders = await db.select().from(shopOrder).where(eq(shopOrder.id, orderId)).limit(1);
  const order = orders[0];
  if (!order || order.status !== "paid" || order.accountType !== "pro") return null;

  const pro = order.userId ? await getProAccessByUserId(order.userId) : null;
  const now = order.paidAt || new Date();
  const number = await nextInvoiceNumber(now);
  const row = {
    id: crypto.randomUUID(),
    number,
    orderId: order.id,
    userId: order.userId,
    companyName: order.companyName || pro?.companyName || pro?.legalName || order.name,
    siren: order.siren || pro?.siren || null,
    vatNumber: pro?.vatNumber || null,
    billingLine1: pro?.billingLine1 || order.line1,
    postalCode: pro?.postalCode || order.postalCode,
    city: pro?.city || order.city,
    country: pro?.country || order.country,
    amountCents: order.amountCents,
    currency: order.currency || "eur",
    issuedAt: now,
    createdAt: new Date(),
  };
  await db.insert(proInvoice).values(row);
  await writeProAudit({
    userId: order.userId,
    action: "invoice_created",
    detail: number,
  });
  return row;
}

export async function getInvoiceByIdForUser(id: string, userId: string) {
  await ensureDatabase();
  const rows = await db.select().from(proInvoice).where(eq(proInvoice.id, id)).limit(1);
  const invoice = rows[0];
  if (!invoice || invoice.userId !== userId) return null;
  return hydrateInvoice(invoice);
}

export async function getInvoiceByNumberForUser(number: string, userId: string) {
  await ensureDatabase();
  const rows = await db.select().from(proInvoice).where(eq(proInvoice.number, number)).limit(1);
  const invoice = rows[0];
  if (!invoice || invoice.userId !== userId) return null;
  return hydrateInvoice(invoice);
}

async function hydrateInvoice(invoice: typeof proInvoice.$inferSelect): Promise<InvoiceRow> {
  const items = await db.select().from(shopOrderItem).where(eq(shopOrderItem.orderId, invoice.orderId));
  const orders = await db.select({ reference: shopOrder.reference }).from(shopOrder).where(eq(shopOrder.id, invoice.orderId)).limit(1);
  return {
    ...invoice,
    items: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    })),
    orderReference: orders[0]?.reference || null,
  };
}

export async function listInvoicesForUser(userId: string) {
  await ensureDatabase();
  return db.select().from(proInvoice).where(eq(proInvoice.userId, userId)).orderBy(desc(proInvoice.issuedAt));
}
