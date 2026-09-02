import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { IconPin, IconReturn, IconTag, IconTruck } from "@/components/icons";
import { store } from "@/config/store";
import { listProducts } from "@/lib/products/repository";
import { SHIPPING_OFFERED_SENTENCE, SHIPPING_ZONE_LABEL } from "@/lib/shipping-zone";

const categoryVisuals = [
  {
    slug: "rangement",
    image: "/lifestyle/rangement.jpg",
    title: "Rangement",
    text: "Optimisez chaque mètre carré.",
  },
  {
    slug: "bureau",
    image: "/lifestyle/bureau.jpg",
    title: "Bureau",
    text: "Travaillez mieux chez vous.",
  },
  {
    slug: "maison",
    image: "/lifestyle/maison.jpg",
    title: "Maison",
    text: "Des essentiels pensés pour le quotidien.",
  },
  {
    slug: "animaux",
    image: "/lifestyle/animaux.jpg",
    title: "Animaux",
    text: "Du pratique sans sacrifier votre intérieur.",
  },
] as const;

const guarantees = [
  {
    title: "Éditée à Lyon",
    text: `Boutique éditée à ${store.companyCity}.`,
    icon: IconPin,
  },
  {
    title: "Prix TTC",
    text: "Pas de mauvaise surprise au paiement.",
    icon: IconTag,
  },
  {
    title: "Livraison gratuite",
    text: `Offerte en ${SHIPPING_ZONE_LABEL}.`,
    icon: IconTruck,
  },
  {
    title: "Retours sous 14 jours",
    text: "Commandez en toute tranquillité.",
    icon: IconReturn,
  },
];

export default function HomePage() {
  const products = listProducts();
  const nouveautes = products.slice(0, 4);
  const essentiels = [...products].sort((a, b) => a.price - b.price).slice(0, 4);

  return (
    <div>
      <section className="relative min-h-[70svh] overflow-hidden bg-navy text-white md:min-h-[84vh]">
        <Image
          src="/lifestyle/hero.jpg"
          alt="Intérieur contemporain avec mobilier clair et lumineux"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-navy/20 md:bg-gradient-to-r md:from-navy/80 md:via-navy/45 md:to-navy/15" />
        <div className="container-page relative flex min-h-[70svh] items-end py-12 md:min-h-[84vh] md:items-center md:py-24">
          <div className="max-w-xl pb-2">
            <p className="eyebrow text-white">
              <span className="text-white">Mobilier & rangement</span>
            </p>
            <h1 className="display mt-4 text-[1.85rem] text-white sm:text-4xl md:text-6xl">
              Le mobilier qui simplifie votre intérieur.
            </h1>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/85 md:mt-5 md:text-lg">
              Des meubles et solutions de rangement sélectionnés pour gagner en confort, en espace
              et en simplicité au quotidien.
            </p>
            <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link href="/collections/maison" className="btn btn-inverse w-full sm:w-auto">
                Découvrir nos meubles
              </Link>
              <Link href="/nouveautes" className="btn w-full border border-white/70 text-white hover:bg-white hover:text-navy sm:w-auto">
                Voir les nouveautés
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="container-page grid grid-cols-2 gap-x-4 gap-y-5 py-7 md:grid-cols-4 md:gap-8 md:py-10">
          {guarantees.map((item) => (
            <div key={item.title} className="flex gap-2.5">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
              <div>
                <p className="text-sm font-semibold text-navy">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted md:text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <p className="eyebrow">Collections</p>
          <h2 className="display mt-3 text-[1.75rem] text-navy md:text-4xl">Trouver le bon meuble</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {categoryVisuals.map((item, index) => (
              <Link
                key={item.slug}
                href={`/collections/${item.slug}`}
                className={`group relative overflow-hidden rounded-[var(--radius)] ${
                  index === 0 ? "min-h-56 sm:min-h-72 lg:col-span-2 lg:row-span-2 lg:min-h-[34rem]" : "min-h-48 sm:min-h-56"
                }`}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                  <h3 className="display text-2xl">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/85">{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between md:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow text-white">Professionnels</p>
            <h2 className="display mt-3 text-[1.85rem] text-white sm:text-4xl md:text-5xl">
              Demander un accès professionnel
            </h2>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-white/85 md:text-lg">
              Bureaux, commerces, copropriétés, commandes d’équipe : ouvrez un accès lié à votre
              compte et bénéficiez des tarifs professionnels.
            </p>
            <p className="mt-3 text-sm text-white/55">
              Demande en ligne, vérification de l’entreprise au SIREN — sans pièce d’identité.
            </p>
          </div>
          <Link
            href="/pro"
            className="btn btn-inverse w-full shrink-0 text-base sm:w-auto md:min-h-12 md:px-8"
          >
            Demander un accès pro
          </Link>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container-page">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Nouveautés</p>
              <h2 className="display mt-3 text-3xl text-navy md:text-4xl">Les dernières nouveautés</h2>
              <p className="mt-3 max-w-xl text-muted">
                Des meubles pratiques sélectionnés pour améliorer votre quotidien.
              </p>
            </div>
            <Link href="/nouveautes" className="btn btn-secondary w-full sm:w-auto">
              Voir toutes les nouveautés
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {nouveautes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <p className="eyebrow">Sélection</p>
          <h2 className="display mt-3 text-3xl text-navy md:text-4xl">Nos essentiels pour la maison</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {essentiels.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)]">
            <Image
              src="/lifestyle/marque.jpg"
              alt="Détail de mobilier contemporain en bois clair"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="eyebrow">La marque</p>
            <h2 className="display mt-3 text-3xl text-navy md:text-4xl">Un intérieur plus simple à vivre</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Chez {store.storeName}, nous sélectionnons des meubles et accessoires pensés pour les
              logements d’aujourd’hui : moins d’espace perdu, plus de confort et des solutions
              faciles à intégrer au quotidien.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Notre boutique est éditée à {store.companyCity} et s’adresse aux particuliers
              recherchant des produits pratiques, modernes et accessibles.
            </p>
            <Link href="/about" className="btn btn-primary mt-8 w-full sm:w-auto">
              Lire notre histoire
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <p className="eyebrow">Notre histoire</p>
          <h2 className="display mt-3 max-w-2xl text-3xl text-navy md:text-4xl">
            Née d’un besoin simple : mieux vivre avec moins d’espace.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            {store.storeName} est née à {store.companyCity} de l’observation des logements
            d’aujourd’hui. Plutôt que d’empiler les références, nous choisissons des meubles qui
            gagnent de la place, du confort et de la clarté au quotidien.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-navy">Le constat</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Les pièces sont plus petites, les usages se mélangent. Un meuble doit justifier sa
                place, pas seulement habiller une photo.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">La sélection</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Peu de références, choisies pour un geste précis : ranger, travailler, s’installer,
                vivre avec un animal sans encombrer.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">La boutique</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Une boutique en ligne éditée à {store.companyCity}. {SHIPPING_OFFERED_SENTENCE} SAV
                du lundi au vendredi.
              </p>
            </div>
          </div>
          <Link href="/about" className="btn btn-secondary mt-8 inline-flex w-full sm:w-auto">
            Découvrir {store.storeName}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <div className="md:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)]">
              <Image
                src="/lifestyle/petits-espaces.jpg"
                alt="Studio bien organisé avec du mobilier compact"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div>
            <p className="eyebrow">Gain de place</p>
            <h2 className="display mt-3 text-3xl text-navy md:text-4xl">Bien penser les petits espaces</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Chaque mètre carré compte. Découvrez des meubles sélectionnés pour les appartements,
              studios, bureaux et pièces où l’espace doit être optimisé.
            </p>
            <Link href="/collections/rangement" className="btn btn-primary mt-8 w-full sm:w-auto">
              Voir les solutions gain de place
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="display text-3xl text-navy">Livraison et retours</h2>
            <p className="mt-4 leading-relaxed text-muted">
              {SHIPPING_OFFERED_SENTENCE} Vous disposez de 14 jours pour vous rétracter
              après réception, lorsque le droit français le prévoit.
            </p>
            <div className="mt-5 flex gap-4 text-sm">
              <Link href="/shipping" className="text-navy underline-offset-4 hover:underline">
                Livraison
              </Link>
              <Link href="/returns" className="text-navy underline-offset-4 hover:underline">
                Retours
              </Link>
            </div>
          </div>
          <div>
            <h2 className="display text-3xl text-navy">Questions fréquentes</h2>
            <div className="mt-5 space-y-4">
              <div>
                <p className="font-medium text-navy">Où livrez-vous ?</p>
                <p className="mt-1 text-sm text-muted">{SHIPPING_OFFERED_SENTENCE} Un suivi est communiqué après l’expédition.</p>
              </div>
              <div>
                <p className="font-medium text-navy">Les prix sont-ils TTC ?</p>
                <p className="mt-1 text-sm text-muted">Oui. Le total est confirmé au paiement.</p>
              </div>
              <div>
                <p className="font-medium text-navy">Qui édite la boutique ?</p>
                <p className="mt-1 text-sm text-muted">
                  {store.companyName}, à {store.companyCity}. {store.supportEmail}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
