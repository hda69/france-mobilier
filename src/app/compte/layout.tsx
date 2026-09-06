import type { Metadata } from "next";
import { CompteChrome } from "@/components/compte-chrome";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  return <CompteChrome>{children}</CompteChrome>;
}
