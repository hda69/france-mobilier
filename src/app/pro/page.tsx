import type { Metadata } from "next";
import Link from "next/link";
import { ProAccessForm } from "@/components/pro-access-form";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "Accès professionnel",
  description: `Demander un accès pro ${store.storeName} : SIREN vérifié, lié à votre compte, sans pièce d’identité.`,
  alternates: { canonical: `${store.domain}/pro` },
};

export default function ProPage() {
  return (
    <div className="container-page py-10 md:py-16">
      <p className="eyebrow">Professionnels</p>
      <h1 className="display mt-3 max-w-2xl text-3xl text-navy md:text-4xl">
        Demander un accès professionnel
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        Bureaux, commerces, copropriétés, commandes d’équipe : nous ouvrons un accès pro lié à votre
        compte. L’éligibilité se vérifie avec le SIREN de l’entreprise — pas de carte d’identité.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ProAccessForm />
        <div className="rounded-[var(--radius)] bg-cream p-6 text-sm leading-relaxed text-muted">
          <p className="font-medium text-navy">Ce que nous vérifions</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>SIREN à 9 chiffres, valide ;</li>
            <li>entreprise active au répertoire Sirene ;</li>
            <li>demande rattachée à votre compte client.</li>
          </ul>
          <p className="mt-4">
            Pas de justificatif d’identité. Une fois le SIREN confirmé, nous vous écrivons pour
            activer devis, facture et commandes d’équipe.
          </p>
          <p className="mt-4">
            Particulier ?{" "}
            <Link href="/collections/maison" className="text-navy underline-offset-4 hover:underline">
              Continuer vos achats
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
