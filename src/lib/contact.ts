import { sql } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { contactMessage } from "@/lib/db/schema";

export async function saveContactMessage(input: {
  name: string;
  email: string;
  message: string;
}) {
  await ensureDatabase();
  const id = crypto.randomUUID();
  await db.insert(contactMessage).values({
    id,
    name: input.name,
    email: input.email.trim().toLowerCase(),
    message: input.message,
    createdAt: new Date(),
  });
  return { id };
}

export async function countContactMessages() {
  await ensureDatabase();
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(contactMessage);
  return Number(rows[0]?.count ?? 0);
}
