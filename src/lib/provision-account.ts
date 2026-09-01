import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { db, ensureDatabase } from "@/lib/db";
import { account, user } from "@/lib/db/schema";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

function secretKey() {
  return createHash("sha256")
    .update(process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "france-mobilier-dev")
    .digest();
}

export function generateGuestPassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export function encryptSecret(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secretKey(), iv);
  const encoded = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encoded]).toString("base64");
}

export function decryptSecret(payload: string | null | undefined) {
  if (!payload) return null;
  try {
    const buf = Buffer.from(payload, "base64");
    if (buf.length < 29) return null;
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const encoded = buf.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", secretKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encoded), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export async function provisionCustomerAccount(input: { email: string; name: string }) {
  await ensureDatabase();
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim() || email.split("@")[0];
  const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
  if (existing[0]) return { userId: existing[0].id, created: false as const };

  const password = generateGuestPassword();
  const id = crypto.randomUUID();
  const now = new Date();
  try {
    await db.insert(user).values({
      id,
      name,
      email,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    });
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: id,
      providerId: "credential",
      userId: id,
      password: await hashPassword(password),
      createdAt: now,
      updatedAt: now,
    });
    return { userId: id, created: true as const, password };
  } catch {
    const again = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
    if (again[0]) return { userId: again[0].id, created: false as const };
    throw new Error("COMPTE_IMPOSSIBLE");
  }
}
