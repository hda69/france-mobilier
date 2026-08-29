import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "À propos",
  description: `À propos de ${store.storeName}`,
};

export default function AboutPage() {
  return (
    <div className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)]">
        <Image
          src="/lifestyle/marque.jpg"
          alt="Détail de mobilier contemporain"
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>
      <div>
        <p className="eyebrow">La marque</p>
        <h1 className="display mt-3 text-3xl text-navy md:text-4xl">Un intérieur plus simple à vivre</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted">
          <p>
            {store.storeName} sélectionne des meubles et accessoires pensés pour les logements
            d’aujourd’hui : moins d’espace perdu, plus de confort, des solutions faciles à
            intégrer.
          </p>
          <p>
            La boutique est éditée à {store.companyCity} par {store.companyName}. Livraison en
            France métropolitaine, prix TTC, rétractation 14 jours.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/collections/maison" className="btn btn-primary">
            Découvrir nos meubles
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
