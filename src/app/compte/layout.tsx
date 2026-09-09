import type { Metadata } from "next";
import { CompteChrome } from "@/components/compte-chrome";
import { getActivityAdminSession } from "@/lib/admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const admin = await getActivityAdminSession();
  return <CompteChrome isAdmin={Boolean(admin)}>{children}</CompteChrome>;
}
