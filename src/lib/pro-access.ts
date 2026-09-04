import { and, desc, eq, sql } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { proAccessRequest, proAuditLog, shopOrder, user } from "@/lib/db/schema";

export type ProAccessStatus = "pending" | "approved" | "rejected" | "suspended";

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
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  website: string | null;
  activityOther: string | null;
  expectedOrderVolume: string | null;
  billingLine1: string | null;
  billingLine2: string | null;
  postalCode: string | null;
  country: string | null;
  discountType: "percentage" | "fixed" | null;
  discountValue: number | null;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProAccessInput = {
  userId: string;
  siren: string;
  siret?: string | null;
  companyName: string;
  legalName: string;
  city?: string | null;
  activity?: string | null;
  vatNumber?: string | null;
  message?: string | null;
  status: ProAccessStatus;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  website?: string | null;
  activityOther?: string | null;
  expectedOrderVolume?: string | null;
  billingLine1?: string | null;
  billingLine2?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

function mapRow(row: typeof proAccessRequest.$inferSelect): ProAccessRow {
  return {
    ...row,
    status: (row.status === "eligible" ? "approved" : row.status) as ProAccessStatus,
    discountType:
      row.discountType === "percentage" || row.discountType === "fixed" ? row.discountType : null,
    discountValue: row.discountValue ?? null,
    approvedAt: row.approvedAt ?? null,
  };
}

export function isProApproved(row: ProAccessRow | null | undefined) {
  return row?.status === "approved";
}

export async function writeProAudit(input: {
  userId?: string | null;
  actorEmail?: string | null;
  action: string;
  detail?: string | null;
}) {
  await ensureDatabase();
  await db.insert(proAuditLog).values({
    id: crypto.randomUUID(),
    userId: input.userId || null,
    actorEmail: input.actorEmail || null,
    action: input.action,
    detail: input.detail || null,
    createdAt: new Date(),
  });
}

export async function getProAccessByUserId(userId: string) {
  await ensureDatabase();
  const rows = await db
    .select()
    .from(proAccessRequest)
    .where(eq(proAccessRequest.userId, userId))
    .limit(1);
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getProAccessById(id: string) {
  await ensureDatabase();
  const rows = await db.select().from(proAccessRequest).where(eq(proAccessRequest.id, id)).limit(1);
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function upsertProAccessRequest(input: ProAccessInput) {
  await ensureDatabase();
  const existing = await getProAccessByUserId(input.userId);
  const now = new Date();
  const approvedAt = input.status === "approved" ? now : existing?.approvedAt || null;
  const values = {
    siren: input.siren,
    siret: input.siret || null,
    companyName: input.companyName,
    legalName: input.legalName,
    city: input.city || null,
    activity: input.activity || null,
    vatNumber: input.vatNumber || null,
    message: input.message || null,
    status: input.status,
    firstName: input.firstName || null,
    lastName: input.lastName || null,
    phone: input.phone || null,
    website: input.website || null,
    activityOther: input.activityOther || null,
    expectedOrderVolume: input.expectedOrderVolume || null,
    billingLine1: input.billingLine1 || null,
    billingLine2: input.billingLine2 || null,
    postalCode: input.postalCode || null,
    country: input.country || null,
    updatedAt: now,
    approvedAt,
  };
  if (existing?.status === "approved" || existing?.status === "suspended") {
    return existing;
  }
  if (existing) {
    await db.update(proAccessRequest).set(values).where(eq(proAccessRequest.userId, input.userId));
    return (await getProAccessByUserId(input.userId))!;
  }
  await db.insert(proAccessRequest).values({
    id: crypto.randomUUID(),
    userId: input.userId,
    ...values,
    discountType: null,
    discountValue: null,
    createdAt: now,
  });
  await writeProAudit({
    userId: input.userId,
    action: "pro_request_created",
    detail: input.status,
  });
  return (await getProAccessByUserId(input.userId))!;
}

export async function updateProCompanyProfile(
  userId: string,
  patch: Partial<
    Pick<
      ProAccessInput,
      | "companyName"
      | "legalName"
      | "siren"
      | "siret"
      | "phone"
      | "website"
      | "vatNumber"
      | "billingLine1"
      | "billingLine2"
      | "postalCode"
      | "city"
      | "country"
      | "firstName"
      | "lastName"
      | "activity"
      | "activityOther"
      | "expectedOrderVolume"
      | "message"
      | "status"
    >
  >,
) {
  await ensureDatabase();
  const existing = await getProAccessByUserId(userId);
  if (!existing) return null;
  const sirenChanged = Boolean(patch.siren && patch.siren !== existing.siren);
  await db
    .update(proAccessRequest)
    .set({
      ...patch,
      updatedAt: new Date(),
    })
    .where(eq(proAccessRequest.userId, userId));
  if (sirenChanged || (patch.status && patch.status !== existing.status)) {
    await writeProAudit({
      userId,
      action: sirenChanged ? "pro_siren_changed" : "pro_profile_status",
      detail: `${existing.siren || "—"} → ${patch.siren || existing.siren || "—"} (${patch.status || existing.status})`,
    });
  }
  return getProAccessByUserId(userId);
}

export async function setProAccessStatus(input: {
  id: string;
  status: ProAccessStatus;
  actorEmail: string;
}) {
  await ensureDatabase();
  const existing = await getProAccessById(input.id);
  if (!existing) return null;
  const now = new Date();
  await db
    .update(proAccessRequest)
    .set({
      status: input.status,
      approvedAt: input.status === "approved" ? now : existing.approvedAt,
      updatedAt: now,
    })
    .where(eq(proAccessRequest.id, input.id));
  await writeProAudit({
    userId: existing.userId,
    actorEmail: input.actorEmail,
    action: `pro_status_${input.status}`,
    detail: existing.id,
  });
  return getProAccessById(input.id);
}

export async function setProDiscount(input: {
  id: string;
  discountType: "percentage" | "fixed" | null;
  discountValue: number | null;
  actorEmail: string;
}) {
  await ensureDatabase();
  const existing = await getProAccessById(input.id);
  if (!existing) return null;
  await db
    .update(proAccessRequest)
    .set({
      discountType: input.discountType,
      discountValue: input.discountValue,
      updatedAt: new Date(),
    })
    .where(eq(proAccessRequest.id, input.id));
  await writeProAudit({
    userId: existing.userId,
    actorEmail: input.actorEmail,
    action: "pro_discount_updated",
    detail: `${input.discountType || "none"}:${input.discountValue ?? 0}`,
  });
  return getProAccessById(input.id);
}

export async function markProAccessApproved(userId: string) {
  await ensureDatabase();
  const existing = await getProAccessByUserId(userId);
  if (!existing || existing.status === "approved") return existing;
  await db
    .update(proAccessRequest)
    .set({ status: "approved", approvedAt: new Date(), updatedAt: new Date() })
    .where(eq(proAccessRequest.userId, userId));
  return getProAccessByUserId(userId);
}

export async function countProAccessRequests() {
  await ensureDatabase();
  const rows = await db.select({ count: sql<number>`count(*)` }).from(proAccessRequest);
  return Number(rows[0]?.count ?? 0);
}

export type AdminProListItem = ProAccessRow & {
  email: string;
  orderCount: number;
  orderTotalCents: number;
};

export async function listProAccessForAdmin(status?: ProAccessStatus | "all") {
  await ensureDatabase();
  const rows = await db
    .select({
      request: proAccessRequest,
      email: user.email,
    })
    .from(proAccessRequest)
    .innerJoin(user, eq(user.id, proAccessRequest.userId))
    .orderBy(desc(proAccessRequest.createdAt));
  const mapped = rows.map((row) => ({ ...mapRow(row.request), email: row.email }));
  const filtered =
    !status || status === "all" ? mapped : mapped.filter((row) => row.status === status);

  const stats = await db
    .select({
      userId: shopOrder.userId,
      orderCount: sql<number>`count(*)`,
      orderTotalCents: sql<number>`coalesce(sum(${shopOrder.amountCents}), 0)`,
    })
    .from(shopOrder)
    .where(and(eq(shopOrder.status, "paid"), eq(shopOrder.accountType, "pro")))
    .groupBy(shopOrder.userId);

  const byUser = new Map(
    stats.map((row) => [
      row.userId,
      { orderCount: Number(row.orderCount), orderTotalCents: Number(row.orderTotalCents) },
    ]),
  );

  return filtered.map((row) => ({
    ...row,
    orderCount: byUser.get(row.userId)?.orderCount ?? 0,
    orderTotalCents: byUser.get(row.userId)?.orderTotalCents ?? 0,
  })) satisfies AdminProListItem[];
}

export function publicProRow(row: ProAccessRow) {
  return {
    id: row.id,
    siren: row.siren,
    siret: row.siret,
    companyName: row.companyName,
    legalName: row.legalName,
    city: row.city,
    activity: row.activity,
    activityOther: row.activityOther,
    vatNumber: row.vatNumber,
    status: row.status,
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
    website: row.website,
    expectedOrderVolume: row.expectedOrderVolume,
    billingLine1: row.billingLine1,
    billingLine2: row.billingLine2,
    postalCode: row.postalCode,
    country: row.country,
    updatedAt: row.updatedAt,
  };
}
