import type { Metadata } from "next";
import { CompteChrome } from "@/components/compte-chrome";
import { getAdminSession } from "@/lib/admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  return <CompteChrome isAdmin={Boolean(admin)}>{children}</CompteChrome>;
}
