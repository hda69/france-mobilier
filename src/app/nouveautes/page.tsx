import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { listProducts } from "@/lib/products/repository";

export const metadata: Metadata = {
  title: "Nouveautés",
  description: "Sélection récente — bientôt disponible.",
};

export default function NewArrivalsPage() {
  const products = listProducts().slice(0, 8);
  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Nouveautés</h1>
      <p className="mt-3 text-muted">
        Première sélection en préparation. Comparez les fiches, puis faites-vous prévenir pour
        commander dès l’ouverture.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link href="/collections/maison" className="btn btn-secondary mt-10 inline-flex">
        Voir toutes les collections
      </Link>
    </div>
  );
}
