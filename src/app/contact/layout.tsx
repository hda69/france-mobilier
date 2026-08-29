import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter France Mobilier pour une question sur le pré-lancement ou la plateforme.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
