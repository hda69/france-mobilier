import { headers } from "next/headers";
import { store } from "@/config/store";
import { auth, prepareAuth } from "@/lib/auth";

export function listAdminEmails() {
  const fromEnv = (process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (fromEnv.length > 0) return fromEnv;
  return [store.supportEmail.toLowerCase()];
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return listAdminEmails().includes(email.trim().toLowerCase());
}

export async function getAdminSession() {
  await prepareAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || !isAdminEmail(session.user.email)) return null;
  return session;
}
