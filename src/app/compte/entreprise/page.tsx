"use client";

import Link from "next/link";
import { CompanyProfileForm } from "@/components/company-profile-form";
import { ProAccessForm } from "@/components/pro-access-form";
import { authClient } from "@/lib/auth-client";
import { useProApproved } from "@/lib/use-pro-approved";
import { useEffect, useState } from "react";

export default function CompteEntreprisePage() {
  const { data: session, isPending } = authClient.useSession();
  const approvedHint = useProApproved();
  const [request, setRequest] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/pro-access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setRequest(data?.request || null))
      .catch(() => {});
  }, [session?.user]);

  if (isPending) {
    return <p className="text-muted">Chargement…</p>;
  }

  if (!session?.user) {
    return (
      <>
        <h1 className="text-3xl font-semibold tracking-tight">Entreprise</h1>
        <p className="max-w-xl text-muted">Connectez-vous pour ouvrir un compte professionnel.</p>
        <Link href="/connexion?next=/compte/entreprise" className="btn btn-primary inline-flex">
          Se connecter
        </Link>
      </>
    );
  }

  const status = String(request?.status || "");
  const approved = status === "approved" || (!request && approvedHint);

  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Mon entreprise</h1>
        {approved ? (
          <p className="mt-2 text-sm text-navy">Compte professionnel</p>
        ) : (
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            Votre identifiant reste {session.user.email}. Renseignez l’entreprise pour commander au
            nom de la société et demander des devis.
          </p>
        )}
      </div>
      {approved && request ? (
        <CompanyProfileForm
          initial={{
            companyName: String(request.companyName || ""),
            legalName: String(request.legalName || ""),
            siren: String(request.siren || ""),
            vatNumber: (request.vatNumber as string | null) || null,
            phone: (request.phone as string | null) || null,
            website: (request.website as string | null) || null,
            billingLine1: (request.billingLine1 as string | null) || null,
            billingLine2: (request.billingLine2 as string | null) || null,
            postalCode: (request.postalCode as string | null) || null,
            city: (request.city as string | null) || null,
            country: (request.country as string | null) || "FR",
            firstName: (request.firstName as string | null) || null,
            lastName: (request.lastName as string | null) || null,
            activity: (request.activity as string | null) || null,
            status,
          }}
        />
      ) : approved ? (
        <p className="text-muted">Chargement…</p>
      ) : (
        <ProAccessForm />
      )}
    </>
  );
}
