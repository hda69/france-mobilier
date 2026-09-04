"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AccountNav } from "@/components/account-nav";
import { AccountOrders } from "@/components/account-orders";
import { ChangePasswordForm } from "@/components/change-password-form";
import { authClient } from "@/lib/auth-client";

function ProStatus() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pro-access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.request) {
          setLabel("Pas encore d’accès pro. Renseignez le SIREN dans Entreprise, sans changer d’e-mail.");
          return;
        }
        if (data.request.status === "approved") setLabel("Accès professionnel activé.");
        else if (data.request.status === "eligible") {
          setLabel(`SIREN ${data.request.siren} vérifié. Activation en cours.`);
        } else setLabel("Demande d’accès pro non retenue.");
      })
      .catch(() => {});
  }, []);

  if (!label) return null;
  return <p className="mt-4 text-sm leading-relaxed text-muted">{label}</p>;
}

export default function ComptePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function logout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return (
      <div className="container-page py-14">
        <p className="text-muted">Chargement du compte…</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container-page space-y-8 py-14">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Mon compte</h1>
          <p className="mt-2 max-w-xl text-muted">
            Connectez-vous pour l’accès pro et les avis. Les commandes payées se retrouvent aussi
            sans compte, avec l’e-mail et le code postal du paiement.
          </p>
        </div>
        <AccountOrders signedIn={false} />
      </div>
    );
  }

  return (
    <div className="container-page space-y-8 py-14">
      <div>
        <AccountNav current="apercu" />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Mon compte</h1>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-sm text-muted">Nom</p>
          <p className="font-medium">{session.user.name}</p>
          <p className="mt-4 text-sm text-muted">E-mail</p>
          <p className="font-medium">{session.user.email}</p>
          <ChangePasswordForm />
          <p className="mt-6 text-sm leading-relaxed text-muted">
            Les avis produits sont réservés aux achats vérifiés. Une fois envoyé, un avis n’apparaît
            en ligne qu’après validation.
          </p>
          <ProStatus />
          <Link href="/compte/entreprise" className="btn btn-primary mt-4 inline-flex w-full">
            Compte professionnel
          </Link>
          <button type="button" onClick={logout} className="btn btn-secondary mt-3 w-full">
            Se déconnecter
          </button>
        </div>
        <AccountOrders signedIn />
      </div>
    </div>
  );
}
