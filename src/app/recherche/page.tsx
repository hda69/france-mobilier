import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { store } from "@/config/store";
import { filterAndSortProducts, listProducts } from "@/lib/products/repository";

type Props = {
  searchParams: Promise<{ q?: string; sort?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Recherche : ${q}` : "Recherche",
    robots: { index: false, follow: true },
    alternates: { canonical: `${store.domain}/recherche` },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = await searchParams;
  const q = query.q?.trim() || "";
  const products = q
    ? filterAndSortProducts(listProducts(), { q, sort: query.sort })
    : [];

  return (
    <div className="container-page py-10 md:py-14">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/">Accueil</Link> / <span className="text-foreground">Recherche</span>
      </nav>
      <h1 className="display text-4xl text-navy">Recherche</h1>
      <form className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-end">
        <label className="flex-1 text-sm">
          <span className="mb-1 block text-muted">Produit</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Bureau, rangement, étagère…"
            className="w-full rounded-full border border-border bg-white px-4 py-2.5 outline-none focus:border-accent"
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Rechercher
        </button>
      </form>

      {!q ? (
        <p className="mt-8 text-muted">Saisissez un mot-clé pour parcourir le catalogue.</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-muted">Aucun produit ne correspond à « {q} ».</p>
      ) : (
        <>
          <p className="mt-8 text-sm text-muted">
            {products.length} résultat{products.length > 1 ? "s" : ""} pour « {q} ».
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
