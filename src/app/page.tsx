import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { collections, store } from "@/config/store";
import { listProducts } from "@/lib/products/repository";

export default function HomePage() {
  const featured = listProducts().slice(0, 8);

  return (
    <div>
      <section className="border-b border-border">
        <div className="container-page grid gap-10 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-end md:py-24">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">Home & Garden · France</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Des solutions pratiques pour un intérieur mieux pensé.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              Une sélection d&apos;équipements fonctionnels pour la maison, le rangement et le bureau.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/collections/maison" className="btn btn-primary">
                Découvrir la sélection
              </Link>
              <Link href="/platform" className="btn btn-secondary">
                Voir la plateforme
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium">Pré-lancement</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {store.storeName} prépare son catalogue Home & Garden pour la France. Les fiches produits
              sont actuellement en statut « bientôt disponible ». Aucun faux stock, aucun faux avis.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Catégories principales</h2>
            <p className="mt-2 text-muted">Une navigation claire pour trouver l&apos;essentiel.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="rounded-2xl border border-border bg-card p-5 transition hover:border-accent/40"
            >
              <h3 className="font-medium">{collection.name}</h3>
              <p className="mt-2 text-sm text-muted">{collection.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Produits sélectionnés</h2>
          <p className="mt-2 text-muted">Exemples de catalogue — commercialisation à venir.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-page grid gap-8 py-16 md:grid-cols-3">
          {[
            {
              title: "Utilité d’abord",
              text: "Nous privilégions des objets qui simplifient réellement le quotidien.",
            },
            {
              title: "Transparence",
              text: "Pas de fausses promotions ni de stocks inventés. Ce qui n’est pas prêt est indiqué clairement.",
            },
            {
              title: "Base technique solide",
              text: "Architecture prête pour Stripe, Google Shopping et une intégration sourcing API.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-10 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Livraison</h2>
          <p className="mt-3 text-muted leading-relaxed">
            Les délais définitifs seront indiqués sur chaque fiche produit lors du lancement. Aucun
            engagement de délai n&apos;est communiqué pendant la phase de pré-lancement.
          </p>
          <Link href="/shipping" className="mt-4 inline-flex text-sm text-accent underline-offset-4 hover:underline">
            En savoir plus
          </Link>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-medium">Puis-je commander maintenant ?</p>
              <p className="mt-1 text-muted">Non. Le checkout est en pré-lancement.</p>
            </div>
            <div>
              <p className="font-medium">Les produits sont-ils disponibles ?</p>
              <p className="mt-1 text-muted">Les fiches actuelles sont en « bientôt disponible ».</p>
            </div>
            <div>
              <p className="font-medium">Livrez-vous en France ?</p>
              <p className="mt-1 text-muted">Oui, le marché principal prévu est la France métropolitaine.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
