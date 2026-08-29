import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter France Mobilier.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
