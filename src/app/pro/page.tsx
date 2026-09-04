import type { Metadata } from "next";
import Link from "next/link";
import { ProAccessForm } from "@/components/pro-access-form";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "Demander un accès pro",
  description: `Demander un accès professionnel ${store.storeName}. Compte client, vérification SIREN, sans pièce d’identité.`,
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
        Bureaux, commerces, copropriétés, commandes d’équipe : passez votre compte existant en accès
        professionnel. Même e-mail, même mot de passe. Nous vérifions le SIREN — pas de carte
        d’identité.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ProAccessForm />
        <div className="rounded-[var(--radius)] bg-cream p-6 text-sm leading-relaxed text-muted">
          <p className="font-medium text-navy">Ce que l’accès pro ouvre</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>même e-mail et même mot de passe ;</li>
            <li>facture au nom de l’entreprise (SIREN) sur les prochaines commandes ;</li>
            <li>e-mail de confirmation dès que le SIREN est validé.</li>
          </ul>
          <p className="mt-4">
            Pas de justificatif d’identité. Un SIREN actif ouvre l’accès tout de suite, sur le
            compte déjà créé. Les prix du catalogue restent TTC. Vous pouvez aussi le faire depuis{" "}
            <Link href="/compte/entreprise" className="text-navy underline-offset-4 hover:underline">
              Mon espace
            </Link>
            .
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
