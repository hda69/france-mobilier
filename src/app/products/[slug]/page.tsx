import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NotifyForm } from "@/components/notify-form";
import { ProductBuyBox } from "@/components/product-buy-box";
import { ProductCard } from "@/components/product-card";
import { ProductPrice, isOnSale } from "@/components/product-price";
import { ProductReviews } from "@/components/product-reviews";
import { store } from "@/config/store";
import { SHIPPING_OFFERED_SENTENCE, SHIPPING_ZONE_LABEL } from "@/lib/shipping-zone";
import {
  availabilityLabel,
  collectionSlugForCategory,
  findProductBySlug,
  findRelatedProducts,
  getCollection,
  listProducts,
} from "@/lib/products/repository";
import { listApprovedReviews } from "@/lib/reviews";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return listProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `${store.domain}/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `${store.domain}/products/${product.slug}`,
      images: product.images.map((url) => ({ url })),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (!product) notFound();
  const related = findRelatedProducts(product);
  const reviews = await listApprovedReviews(product.id);
  const collectionSlug = collectionSlugForCategory(product.category);
  const collection = getCollection(collectionSlug);
  const outOfStock = product.availabilityStatus === "out_of_stock";
  const benefits = product.features.slice(0, 4);
  const specEntries = Object.entries(product.specifications);
  const dimKeys = specEntries.filter(([key]) =>
    /largeur|hauteur|profondeur|plateau|module|dimensions|caisson|pieds|traverse/i.test(key),
  );
  const mentionsMontage = product.features.some((feature) => /montage/i.test(feature));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((src) => `${store.domain}${src}`),
    brand: { "@type": "Brand", name: store.storeName },
    offers: {
      "@type": "Offer",
      url: `${store.domain}/products/${product.slug}`,
      priceCurrency: "EUR",
      price: product.price,
      availability:
        product.availabilityStatus === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: store.domain },
      {
        "@type": "ListItem",
        position: 2,
        name: collection?.name ?? "Catalogue",
        item: `${store.domain}/collections/${collectionSlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${store.domain}/products/${product.slug}`,
      },
    ],
  };

  return (
    <div className="bg-cream/40 pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="container-page py-8 md:py-12">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/">Accueil</Link>
          <span> / </span>
          <Link href={`/collections/${collectionSlug}`}>{collection?.name ?? "Catalogue"}</Link>
          <span> / </span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-white">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 ? (
              <div className={`mt-3 grid gap-2 ${product.images.length >= 5 ? "grid-cols-5" : "grid-cols-4"}`}>
                {product.images.map((src) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-md bg-white">
                    <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            {isOnSale(product) ? <p className="badge">Offre en cours</p> : null}
            {product.availabilityStatus !== "available" ? (
              <p className="badge">{availabilityLabel(product.availabilityStatus)}</p>
            ) : null}
            <h1 className="display text-[1.75rem] text-navy md:text-4xl">{product.name}</h1>
            <ProductPrice product={product} size="pdp" />
            <p className="text-sm text-muted">Prix TTC. Total confirmé au paiement.</p>
            <p className="leading-relaxed text-muted">{product.shortDescription}</p>
            {product.shippingMinDays && product.shippingMaxDays ? (
              <p className="text-sm text-muted">
                Délai d’expédition estimé : {product.shippingMinDays}–{product.shippingMaxDays}{" "}
                jours. Chaque article est fabriqué après commande, ce qui explique ce délai.
              </p>
            ) : null}
            {benefits.length > 0 ? (
              <ul className="grid gap-2">
                {benefits.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-navy">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-red)]" />
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}
            {outOfStock ? (
              <NotifyForm productName={product.name} productSlug={product.slug} />
            ) : (
              <ProductBuyBox product={product} />
            )}
          </div>
        </div>

        <section className="mt-16 grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] bg-white">
            <Image src={product.images[0]} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          </div>
          <div>
            <h2 className="display text-3xl text-navy">Pourquoi vous allez l’aimer</h2>
            <p className="mt-4 leading-relaxed text-muted">{product.description}</p>
          </div>
        </section>

        {benefits.length > 0 ? (
          <section className="mt-16">
            <h2 className="display text-3xl text-navy">Pensé pour votre quotidien</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((feature) => (
                <div key={feature} className="rounded-[var(--radius)] bg-white p-5">
                  <p className="font-medium text-navy">{feature}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {dimKeys.length > 0 || product.dimensions || product.weight ? (
          <section className="mt-16">
            <h2 className="display text-3xl text-navy">Dimensions</h2>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {dimKeys.map(([key, value]) => (
                <div key={key} className="rounded-[var(--radius)] bg-white p-4">
                  <dt className="text-sm text-muted">{key}</dt>
                  <dd className="mt-1 font-medium text-navy">{value}</dd>
                </div>
              ))}
              {product.weight ? (
                <div className="rounded-[var(--radius)] bg-white p-4">
                  <dt className="text-sm text-muted">Poids</dt>
                  <dd className="mt-1 font-medium text-navy">{product.weight} kg</dd>
                </div>
              ) : null}
            </dl>
          </section>
        ) : null}

        {specEntries.length > 0 ? (
          <section className="mt-16">
            <h2 className="display text-3xl text-navy">Caractéristiques</h2>
            <div className="mt-6 overflow-x-auto rounded-[var(--radius)] bg-white">
              <table className="w-full min-w-[280px] text-left text-sm">
                <tbody>
                  {specEntries.map(([key, value]) => (
                    <tr key={key} className="border-b border-border last:border-0">
                      <th className="w-2/5 px-4 py-3 font-medium text-navy">{key}</th>
                      <td className="px-4 py-3 text-muted">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="display text-3xl text-navy">Livraison et retours</h2>
            <p className="mt-4 leading-relaxed text-muted">
              {SHIPPING_OFFERED_SENTENCE} Colis suivi. Rétractation de 14 jours après
              réception, lorsque le droit français le prévoit.
            </p>
          </div>
          <div>
            <h2 className="display text-3xl text-navy">Questions fréquentes</h2>
            <div className="mt-4 space-y-4">
              {product.dimensions ? (
                <div>
                  <p className="font-medium text-navy">Quelles sont ses dimensions ?</p>
                  <p className="mt-1 text-sm text-muted">{product.dimensions}</p>
                </div>
              ) : null}
              {product.shippingMinDays && product.shippingMaxDays ? (
                <div>
                  <p className="font-medium text-navy">Pourquoi ce délai de livraison ?</p>
                  <p className="mt-1 text-sm text-muted">
                    Chaque article est fabriqué après commande. L’expédition vers la France part
                    ensuite, en général sous {product.shippingMinDays} à {product.shippingMaxDays}{" "}
                    jours.
                  </p>
                </div>
              ) : null}
              {mentionsMontage ? (
                <div>
                  <p className="font-medium text-navy">Le meuble doit-il être monté ?</p>
                  <p className="mt-1 text-sm text-muted">
                    Un montage est prévu. Le détail figure dans les caractéristiques.
                  </p>
                </div>
              ) : null}
              <div>
                <p className="font-medium text-navy">Où est-il livré ?</p>
                <p className="mt-1 text-sm text-muted">
                  En {SHIPPING_ZONE_LABEL}, avec suivi de colis.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ProductReviews productId={product.id} initialReviews={reviews} />

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="display mb-8 text-3xl text-navy">Vous aimerez peut-être aussi</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
