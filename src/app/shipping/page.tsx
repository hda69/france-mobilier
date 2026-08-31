import type { Metadata } from "next";
import Link from "next/link";
import { SignedNote } from "@/components/signed-note";
import { founderNotes } from "@/content/founder-notes";

export const metadata: Metadata = { title: "Livraison" };

export default function ShippingPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Livraison</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Livraison offerte en France métropolitaine. Les délais estimés figurent sur chaque fiche
          produit. Un numéro de suivi est communiqué après l’expédition.
        </p>
      </div>
      <SignedNote className="mt-8">
        <p>{founderNotes.trust}</p>
      </SignedNote>
      <Link href="/collections/maison" className="btn btn-secondary mt-8 inline-flex">
        Voir la sélection
      </Link>
    </div>
  );
}
