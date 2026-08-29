import Image from "next/image";
import Link from "next/link";
import { NotifyForm } from "@/components/notify-form";
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
              Choisissez maintenant. Commandez dès l’ouverture.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              Une sélection claire pour la maison, le rangement et le bureau. Les prix sont
              indicatifs. Laissez votre e-mail : on vous prévient le jour où les commandes
              ouvrent, sans stock inventé ni fausse promo.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/collections/maison" className="btn btn-primary">
                Voir la sélection
              </Link>
              <a href="#alerte" className="btn btn-secondary">
                Être prévenu du lancement
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium">Pré-lancement, sans artifice</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {store.storeName} est une boutique française basée à {store.companyCity}. Les fiches
              sont déjà là pour que vous puissiez comparer. Le paiement n’est pas encore ouvert :
              votre e-mail sert uniquement à vous prévenir.
            </p>
            <p className="mt-4 text-xs text-muted">
              Éditeur {store.companyName} · {store.companyLegalForm.toLowerCase()} · SIREN{" "}
              {store.companySiren}
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <TrustBar />
      </section>

      <section className="container-page py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Parcourir par besoin</h2>
          <p className="mt-2 text-muted">Quatre univers, une même promesse : utile, lisible, honnête.</p>
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
            <p className="mt-2 text-muted">
              Comparez, gardez vos favoris, et soyez prévenu dès qu’ils seront commandables.
            </p>
          </div>
          <Link href="/nouveautes" className="text-sm text-accent underline-offset-4 hover:underline">
            Toute la sélection
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-accent-soft/50">
        <div className="container-page grid gap-10 py-14 md:grid-cols-[1fr_0.9fr] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Ne manquez pas l’ouverture</h2>
            <p className="mt-3 max-w-xl text-muted leading-relaxed">
              Quand le checkout sera activé, les premiers inscrits seront prévenus en priorité. Pas
              de compte obligatoire. Pas de relance commerciale.
            </p>
          </div>
          <NotifyForm variant="launch" anchor />
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Utile d’abord",
              text: "Chaque fiche répond à un vrai problème d’espace, de rangement ou de bureau — pas à une mode.",
            },
            {
              title: "Transparence",
              text: "Pas de faux stock, pas de faux avis, pas de compte à rebours. Ce qui n’est pas vendable est indiqué.",
            },
            {
              title: "Cadre français",
              text: "Entreprise identifiée, mentions légales, rétractation 14 jours prévue au lancement, contact réel.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-10 pb-16 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Livraison et retours</h2>
          <p className="mt-3 text-muted leading-relaxed">
            Zone prévue : France métropolitaine. Les délais et le suivi seront publiés sur chaque
            fiche à l’ouverture. La rétractation de 14 jours s’appliquera dès les premières
            commandes, lorsque le droit français le prévoit.
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
              <p className="font-medium">Puis-je commander aujourd’hui ?</p>
              <p className="mt-1 text-muted">
                Pas encore. Laissez votre e-mail : on vous prévient le jour de l’ouverture, sans
                engagement.
              </p>
            </div>
            <div>
              <p className="font-medium">Les prix affichés sont-ils définitifs ?</p>
              <p className="mt-1 text-muted">
                Ce sont des prix TTC indicatifs. Le prix de vente exact sera confirmé avant tout
                paiement.
              </p>
            </div>
            <div>
              <p className="font-medium">Qui est derrière la boutique ?</p>
              <p className="mt-1 text-muted">
                {store.companyName}, {store.companyLegalForm.toLowerCase()}, enseigne{" "}
                {store.companyTradeName}. Siège à {store.companyCity}. Contact : {store.supportEmail}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
