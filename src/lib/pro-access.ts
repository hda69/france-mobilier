import { eq, sql } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { proAccessRequest } from "@/lib/db/schema";

export type ProAccessStatus = "eligible" | "rejected" | "approved";

export type ProAccessRow = {
  id: string;
  userId: string;
  siren: string;
  siret: string | null;
  companyName: string;
  legalName: string;
  city: string | null;
  activity: string | null;
  vatNumber: string | null;
  message: string | null;
  status: ProAccessStatus;
  createdAt: Date;
  updatedAt: Date;
};

export function isProApproved(row: ProAccessRow | null | undefined) {
  return row?.status === "approved";
}

export async function getProAccessByUserId(userId: string) {
  await ensureDatabase();
  const rows = await db
    .select()
    .from(proAccessRequest)
    .where(eq(proAccessRequest.userId, userId))
    .limit(1);
  return (rows[0] as ProAccessRow | undefined) ?? null;
}

export async function upsertProAccessRequest(input: {
  userId: string;
  siren: string;
  siret?: string;
  companyName: string;
  legalName: string;
  city?: string;
  activity?: string;
  vatNumber?: string;
  message?: string;
  status: ProAccessStatus;
}) {
  await ensureDatabase();
  const existing = await getProAccessByUserId(input.userId);
  const now = new Date();
  if (existing?.status === "approved") {
    return existing;
  }
  if (existing) {
    await db
      .update(proAccessRequest)
      .set({
        siren: input.siren,
        siret: input.siret || null,
        companyName: input.companyName,
        legalName: input.legalName,
        city: input.city || null,
        activity: input.activity || null,
        vatNumber: input.vatNumber || null,
        message: input.message || null,
        status: input.status,
        updatedAt: now,
      })
      .where(eq(proAccessRequest.userId, input.userId));
    return (await getProAccessByUserId(input.userId))!;
  }
  const id = crypto.randomUUID();
  await db.insert(proAccessRequest).values({
    id,
    userId: input.userId,
    siren: input.siren,
    siret: input.siret || null,
    companyName: input.companyName,
    legalName: input.legalName,
    city: input.city || null,
    activity: input.activity || null,
    vatNumber: input.vatNumber || null,
    message: input.message || null,
    status: input.status,
    createdAt: now,
    updatedAt: now,
  });
  return (await getProAccessByUserId(input.userId))!;
}

export async function markProAccessApproved(userId: string) {
  await ensureDatabase();
  const existing = await getProAccessByUserId(userId);
  if (!existing || existing.status === "approved") return existing;
  await db
    .update(proAccessRequest)
    .set({ status: "approved", updatedAt: new Date() })
    .where(eq(proAccessRequest.userId, userId));
  return (await getProAccessByUserId(userId))!;
}

export async function countProAccessRequests() {
  await ensureDatabase();
  const rows = await db.select({ count: sql<number>`count(*)` }).from(proAccessRequest);
  return Number(rows[0]?.count ?? 0);
}
