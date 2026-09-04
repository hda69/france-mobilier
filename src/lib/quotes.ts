import { desc, eq } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { proQuote, proQuoteItem } from "@/lib/db/schema";
import { writeProAudit } from "@/lib/pro-access";
import { eurosToCents } from "@/lib/payments/stripe";
import { findProductById, findProductVariant, variantLineName } from "@/lib/products/repository";
import { isQuoteEligible } from "@/lib/b2b";

export type QuoteStatus =
  | "draft"
  | "requested"
  | "reviewing"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export type QuoteLineInput = { productId: string; quantity: number; variantId?: string };

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomQuoteRef() {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `DV-${Array.from(bytes, (byte) => REF_ALPHABET[byte % REF_ALPHABET.length]).join("")}`;
}

export async function createQuoteRequest(input: {
  userId: string;
  email: string;
  source: "product" | "cart" | "account";
  items: QuoteLineInput[];
  companyName?: string | null;
  siren?: string | null;
  contactName?: string | null;
  phone?: string | null;
  desiredDate?: string | null;
  message?: string | null;
}) {
  await ensureDatabase();
  if (!input.items.length) throw new Error("DEVIS_VIDE");
  const priced = input.items.map((item) => {
    const product = findProductById(item.productId);
    if (!product) throw new Error("PRODUIT_INTROUVABLE");
    if (!isQuoteEligible(product)) throw new Error("PRODUIT_NON_ELIGIBLE");
    const quantity = Math.max(1, Math.min(200, Math.floor(item.quantity)));
    const hasVariants = Boolean(product.variants?.length);
    const variant = hasVariants ? findProductVariant(product, item.variantId) : undefined;
    if (hasVariants && (!item.variantId || !variant)) {
      throw new Error("VARIANTE_INTROUVABLE");
    }
    return {
      productId: product.id,
      name: variant ? variantLineName(product, variant) : product.name,
      quantity,
      unitPriceCents: eurosToCents(variant?.price ?? product.price),
    };
  });
  const amountCents = priced.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  const now = new Date();
  let reference = randomQuoteRef();
  for (let i = 0; i < 6; i += 1) {
    const clash = await db.select({ id: proQuote.id }).from(proQuote).where(eq(proQuote.reference, reference)).limit(1);
    if (clash.length === 0) break;
    reference = randomQuoteRef();
  }
  const id = crypto.randomUUID();
  await db.insert(proQuote).values({
    id,
    reference,
    userId: input.userId,
    status: "requested",
    source: input.source,
    companyName: input.companyName || null,
    siren: input.siren || null,
    contactName: input.contactName || null,
    email: input.email,
    phone: input.phone || null,
    desiredDate: input.desiredDate || null,
    message: input.message || null,
    amountCents,
    createdAt: now,
    updatedAt: now,
  });
  await db.insert(proQuoteItem).values(
    priced.map((line) => ({
      id: crypto.randomUUID(),
      quoteId: id,
      ...line,
    })),
  );
  await writeProAudit({
    userId: input.userId,
    action: "quote_created",
    detail: reference,
  });
  return getQuoteById(id);
}

export async function getQuoteById(id: string) {
  await ensureDatabase();
  const rows = await db.select().from(proQuote).where(eq(proQuote.id, id)).limit(1);
  const quote = rows[0];
  if (!quote) return null;
  const items = await db.select().from(proQuoteItem).where(eq(proQuoteItem.quoteId, id));
  return { ...quote, items };
}

export async function listQuotesForUser(userId: string) {
  await ensureDatabase();
  const quotes = await db
    .select()
    .from(proQuote)
    .where(eq(proQuote.userId, userId))
    .orderBy(desc(proQuote.createdAt));
  return quotes;
}

export async function listQuotesForAdmin() {
  await ensureDatabase();
  return db.select().from(proQuote).orderBy(desc(proQuote.createdAt));
}

export async function setQuoteStatus(id: string, status: QuoteStatus, actorEmail: string) {
  await ensureDatabase();
  const existing = await getQuoteById(id);
  if (!existing) return null;
  await db.update(proQuote).set({ status, updatedAt: new Date() }).where(eq(proQuote.id, id));
  await writeProAudit({
    userId: existing.userId,
    actorEmail,
    action: `quote_status_${status}`,
    detail: existing.reference,
  });
  return getQuoteById(id);
}
