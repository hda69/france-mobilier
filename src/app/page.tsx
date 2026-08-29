import Image from "next/image";
import Link from "next/link";
import { MagazineTicker } from "@/components/magazine-ticker";
import { ProductCard } from "@/components/product-card";
import { TrustBar } from "@/components/trust-bar";
import { collections, store } from "@/config/store";
import { listCollectionProducts, listProducts } from "@/lib/products/repository";

export default function HomePage() {
  const featured = listProducts().slice(0, 8);

  return (
    <div>
      <section className="border-b border-border bg-[linear-gradient(180deg,#faf7f2_0%,#ffffff_70%)]">
        <div className="container-page grid gap-10 py-14 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-20">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              Home & Garden · France
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Des solutions pratiques pour un intérieur mieux pensé.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              Mobilier et rangement pour la maison, le bureau et les espaces contraints. Une
              sélection claire, des prix TTC, une livraison en France métropolitaine.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/collections/maison" className="btn btn-primary">
                Voir la sélection
              </Link>
              <Link href="/nouveautes" className="btn btn-secondary">
                Nouveautés
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium">Boutique française</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {store.storeName} est éditée à {store.companyCity}. Livraison en France
              métropolitaine, rétractation 14 jours, paiement par carte.
            </p>
          </div>
        </div>
      </section>

      <MagazineTicker />

      <section className="container-page py-10">
        <TrustBar />
      </section>

      <section className="container-page py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Parcourir par besoin</h2>
          <p className="mt-2 text-muted">Maison, rangement, bureau et animaux.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => {
            const preview = listCollectionProducts(collection.slug)[0];
            return (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-accent/40"
              >
                {preview ? (
                  <div className="relative aspect-[4/3] bg-[#f3efe8]">
                    <Image
                      src={preview.images[0]}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <h3 className="font-medium">{collection.name}</h3>
                  <p className="mt-2 text-sm text-muted">{collection.description}</p>
                  <p className="mt-3 text-sm text-accent">Voir les produits</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">La sélection</h2>
            <p className="mt-2 text-muted">Les essentiels pour organiser et équiper la maison.</p>
          </div>
          <Link href="/nouveautes" className="text-sm text-accent underline-offset-4 hover:underline">
            Voir tout
          </Link>
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
              title: "Utile d’abord",
              text: "Chaque fiche répond à un vrai besoin d’espace, de rangement ou de bureau.",
            },
            {
              title: "Livraison France",
              text: "Expédition en France métropolitaine, avec suivi de colis.",
            },
            {
              title: "Retours 14 jours",
              text: "Rétractation conformément au droit de la consommation.",
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
          <h2 className="text-2xl font-semibold tracking-tight">Livraison et retours</h2>
          <p className="mt-3 text-muted leading-relaxed">
            Livraison en France métropolitaine. Les délais figurent sur chaque fiche. Vous disposez
            de 14 jours pour vous rétracter après réception, lorsque le droit français le prévoit.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/shipping" className="text-accent underline-offset-4 hover:underline">
              Livraison
            </Link>
            <Link href="/returns" className="text-accent underline-offset-4 hover:underline">
              Retours
            </Link>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Questions fréquentes</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-medium">Livrez-vous en France ?</p>
              <p className="mt-1 text-muted">Oui, en France métropolitaine.</p>
            </div>
            <div>
              <p className="font-medium">Les prix sont-ils TTC ?</p>
              <p className="mt-1 text-muted">Oui. Le total est confirmé au paiement.</p>
            </div>
            <div>
              <p className="font-medium">Qui est derrière la boutique ?</p>
              <p className="mt-1 text-muted">
                {store.companyName}, à {store.companyCity}. {store.supportEmail}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
