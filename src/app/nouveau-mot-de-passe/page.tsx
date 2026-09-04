import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  description: `Choisir un nouveau mot de passe ${store.storeName}.`,
  robots: { index: false, follow: false },
};

export default function NouveauMotDePassePage() {
  return (
    <div className="container-page py-14">
      <ResetPasswordForm />
    </div>
  );
}
