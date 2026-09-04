"use client";

import Link from "next/link";
import { AccountNav } from "@/components/account-nav";
import { ProAccessForm } from "@/components/pro-access-form";
import { authClient } from "@/lib/auth-client";

export default function CompteEntreprisePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="container-page py-14">
        <p className="text-muted">Chargement…</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container-page space-y-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Entreprise</h1>
        <p className="max-w-xl text-muted">
          Connectez-vous avec votre compte personnel, puis renseignez le SIREN. L’e-mail et le mot
          de passe restent les mêmes.
        </p>
        <Link href="/connexion?next=/compte/entreprise" className="btn btn-primary inline-flex">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page space-y-8 py-14">
      <AccountNav current="entreprise" />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Passer en compte professionnel</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Votre identifiant reste {session.user.email}. Aucun nouveau mot de passe. Nous vérifions
          le SIREN au répertoire Sirene, puis l’accès pro s’ouvre sur ce même compte.
        </p>
      </div>
      <ProAccessForm />
    </div>
  );
}
