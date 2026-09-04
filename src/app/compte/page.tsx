"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AccountOrders } from "@/components/account-orders";
import { ChangePasswordForm } from "@/components/change-password-form";
import { authClient } from "@/lib/auth-client";
import { useProApproved } from "@/lib/use-pro-approved";

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
        else if (data.request.status === "pending" || data.request.status === "eligible") {
          setLabel("Votre demande professionnelle est en cours de vérification.");
        } else if (data.request.status === "suspended") {
          setLabel("Votre accès professionnel est temporairement indisponible.");
        } else if (data.request.status === "rejected") {
          setLabel("Votre demande n’a pas pu être validée. Contactez-nous si besoin.");
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
  const proApproved = useProApproved();

  async function logout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return <p className="text-muted">Chargement du compte…</p>;
  }

  if (!session?.user) {
    return (
      <>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Mon compte</h1>
          <p className="mt-2 max-w-xl text-muted">
            Connectez-vous pour l’accès pro et les avis. Les commandes payées se retrouvent aussi
            sans compte, avec l’e-mail et le code postal du paiement.
          </p>
        </div>
        <AccountOrders signedIn={false} />
      </>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Mon compte</h1>
        {proApproved ? <p className="mt-1 text-sm text-navy">Compte professionnel</p> : null}
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-sm text-muted">Nom</p>
          <p className="font-medium">{session.user.name}</p>
          <p className="mt-4 text-sm text-muted">E-mail</p>
          <p className="font-medium">{session.user.email}</p>
          <ChangePasswordForm />
        </div>
        <div className="min-w-0 space-y-6">
          <AccountOrders signedIn />
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-sm leading-relaxed text-muted">
              Les avis produits sont réservés aux achats vérifiés. Une fois envoyé, un avis n’apparaît
              en ligne qu’après validation.
            </p>
            <ProStatus />
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/compte/entreprise" className="btn btn-primary">
                {proApproved ? "Mon entreprise" : "Compte professionnel"}
              </Link>
              <button type="button" onClick={logout} className="btn btn-secondary">
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
