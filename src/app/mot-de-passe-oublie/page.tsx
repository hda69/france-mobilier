import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: `Réinitialiser le mot de passe de votre compte ${store.storeName}.`,
  robots: { index: false, follow: false },
};

export default function MotDePasseOubliePage() {
  return (
    <div className="container-page py-14">
      <ForgotPasswordForm />
    </div>
  );
}
