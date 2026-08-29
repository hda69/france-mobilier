import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { collections, store } from "@/config/store";
import {
  filterAndSortProducts,
  getCollection,
  listCollectionProducts,
} from "@/lib/products/repository";

const categoryLabels: Record<string, string> = {
  maison: "Maison",
  rangement: "Rangement",
  bureau: "Bureau",
  cuisine: "Cuisine",
  "salle-de-bain": "Salle de bain",
  animaux: "Animaux",
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; sort?: string; category?: string }>;
};

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
    alternates: { canonical: `${store.domain}/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const products = filterAndSortProducts(listCollectionProducts(slug), {
    q: query.q,
    sort: query.sort,
    category: query.category,
  });

  return (
    <div className="container-page py-10 md:py-16">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/">Accueil</Link> / <span className="text-foreground">{collection.name}</span>
      </nav>
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow">Collection</p>
        <h1 className="display mt-3 text-4xl text-navy">{collection.name}</h1>
        <p className="mt-4 text-lg text-muted">{collection.description}</p>
      </div>

      <form className="mb-10 flex flex-col gap-3 rounded-[var(--radius)] bg-white p-4 md:flex-row md:items-end">
        <label className="flex-1 text-sm">
          <span className="mb-1 block text-muted">Recherche</span>
          <input
            name="q"
            defaultValue={query.q || ""}
            placeholder="Bureau, rangement…"
            className="w-full rounded-full border border-border bg-white px-4 py-2.5 outline-none focus:border-accent"
          />
        </label>
        {collection.categories.length > 1 && (
          <label className="text-sm md:w-52">
            <span className="mb-1 block text-muted">Catégorie</span>
            <select
              name="category"
              defaultValue={query.category || ""}
              className="w-full rounded-full border border-border bg-white px-4 py-2.5 outline-none focus:border-accent"
            >
              <option value="">Toutes</option>
              {collection.categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category] ?? category}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="text-sm md:w-52">
          <span className="mb-1 block text-muted">Tri</span>
          <select
            name="sort"
            defaultValue={query.sort || ""}
            className="w-full rounded-full border border-border bg-white px-4 py-2.5 outline-none focus:border-accent"
          >
            <option value="">Pertinence</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom</option>
          </select>
        </label>
        <button type="submit" className="btn btn-primary">
          Filtrer
        </button>
      </form>

      {products.length === 0 ? (
        <p className="text-muted">Aucun produit pour ces critères.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
