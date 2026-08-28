import { and, desc, eq } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { purchase, review, user } from "@/lib/db/schema";

export type PublicReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: string;
  verifiedPurchase: boolean;
};

export async function listApprovedReviews(productId: string): Promise<PublicReview[]> {
  await ensureDatabase();
  const rows = await db
    .select({
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      authorName: user.name,
      createdAt: review.createdAt,
      verifiedPurchase: review.verifiedPurchase,
    })
    .from(review)
    .innerJoin(user, eq(review.userId, user.id))
    .where(and(eq(review.productId, productId), eq(review.status, "approved")))
    .orderBy(desc(review.createdAt));

  return rows.map((row) => ({
    id: row.id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    authorName: row.authorName,
    createdAt: new Date(row.createdAt as Date).toISOString(),
    verifiedPurchase: Boolean(row.verifiedPurchase),
  }));
}

export async function userHasVerifiedPurchase(userId: string, productId: string) {
  await ensureDatabase();
  const rows = await db
    .select({ id: purchase.id })
    .from(purchase)
    .where(and(eq(purchase.userId, userId), eq(purchase.productId, productId)))
    .limit(1);
  return rows.length > 0;
}

export async function createReview(input: {
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  body: string;
}) {
  await ensureDatabase();
  const verified = await userHasVerifiedPurchase(input.userId, input.productId);
  if (!verified) {
    throw new Error("AVIS_ACHAT_REQUIS");
  }

  const id = crypto.randomUUID();
  const now = new Date();
  await db.insert(review).values({
    id,
    productId: input.productId,
    userId: input.userId,
    rating: input.rating,
    title: input.title?.trim() || null,
    body: input.body.trim(),
    verifiedPurchase: true,
    status: "approved",
    createdAt: now,
  });
  return id;
}
