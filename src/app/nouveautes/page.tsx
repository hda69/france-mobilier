import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { listProducts } from "@/lib/products/repository";

export const metadata: Metadata = {
  title: "Nouveautés",
  description: "Nouveautés — mobilier et rangement.",
};

export default function NewArrivalsPage() {
  const products = listProducts().slice(0, 8);
  return (
    <div className="container-page py-10 md:py-14">
      <p className="eyebrow">Catalogue</p>
      <h1 className="display mt-3 text-4xl text-navy">Nouveautés</h1>
      <p className="mt-3 text-muted">
        Les derniers ajouts au catalogue. Prix TTC, livraison en France métropolitaine.
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
