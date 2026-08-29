import type { Metadata } from "next";
import Link from "next/link";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "À propos",
  description: `À propos de ${store.storeName}`,
};

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">À propos</h1>
      <div className="mt-6 space-y-4 text-muted leading-relaxed">
        <p>
          {store.storeName} est une boutique française, éditée à {store.companyCity} par{" "}
          {store.companyName}. Nous proposons des équipements utiles pour la maison, le rangement et
          le bureau.
        </p>
        <p>
          Livraison en France métropolitaine, prix TTC, rétractation 14 jours. Une question ?
          Écrivez à{" "}
          <a href={`mailto:${store.supportEmail}`} className="text-accent underline-offset-4 hover:underline">
            {store.supportEmail}
          </a>
          .
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/collections/maison" className="btn btn-primary">
          Voir la sélection
        </Link>
        <Link href="/contact" className="btn btn-secondary">
          Contact
        </Link>
      </div>
    </div>
  );
}
