"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AccountOrders } from "@/components/account-orders";
import { authClient } from "@/lib/auth-client";

function ProStatus() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pro-access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.request) {
          setLabel("Pas encore d’accès pro. Demande liée au SIREN de l’entreprise.");
          return;
        }
        if (data.request.status === "approved") setLabel("Accès professionnel activé.");
        else if (data.request.status === "eligible") {
          setLabel(`SIREN ${data.request.siren} vérifié. Accès en cours d’ouverture.`);
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
      <h1 className="text-3xl font-semibold tracking-tight">Mon compte</h1>
      <AccountOrders signedIn />
      <div className="max-w-lg rounded-2xl border border-border bg-white p-6">
        <p className="text-sm text-muted">Nom</p>
        <p className="font-medium">{session.user.name}</p>
        <p className="mt-4 text-sm text-muted">E-mail</p>
        <p className="font-medium">{session.user.email}</p>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Les avis produits sont réservés aux achats vérifiés. Une fois envoyé, un avis n’apparaît
          en ligne qu’après validation.
        </p>
        <ProStatus />
        <Link href="/pro" className="btn btn-primary mt-4 inline-flex w-full">
          Demander un accès pro
        </Link>
        <button type="button" onClick={logout} className="btn btn-secondary mt-3 w-full">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
