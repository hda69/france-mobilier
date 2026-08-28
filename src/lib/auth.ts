import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, ensureDatabase } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

let ready: Promise<void> | null = null;

export async function prepareAuth() {
  if (!ready) ready = ensureDatabase();
  await ready;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {},
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [
    baseURL,
    "https://francemobilier.com",
    "https://www.francemobilier.com",
  ],
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
});

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};
