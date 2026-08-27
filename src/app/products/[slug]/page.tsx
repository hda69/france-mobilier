import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { NotifyForm } from "@/components/notify-form";
import { ProductCard } from "@/components/product-card";
import { store } from "@/config/store";
import {
  availabilityLabel,
  findProductBySlug,
  findRelatedProducts,
  formatPrice,
  listProducts,
} from "@/lib/products/repository";

type Props = { params: Promise<{ slug: string }> };

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
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (!product) notFound();
  const related = findRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((src) => `${store.domain}${src}`),
    brand: { "@type": "Brand", name: store.storeName },
    ...(product.availabilityStatus === "available"
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: product.price,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <div className="container-page py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-muted">
        <Link href="/">Accueil</Link> / <Link href={`/collections/${product.category === "salle-de-bain" || product.category === "cuisine" ? "maison" : product.category}`}>Catalogue</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-[#f3efe8]">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority sizes="(max-width:768px) 100vw, 50vw" />
        </div>
        <div className="space-y-5">
          <p className="badge">{availabilityLabel(product.availabilityStatus)}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-muted leading-relaxed">{product.shortDescription}</p>
          <p className="text-2xl font-medium">
            {formatPrice(product.price)}{" "}
            <span className="text-sm font-normal text-muted">prix indicatif</span>
          </p>
          <p className="text-sm text-muted">
            Les délais de livraison définitifs seront indiqués sur chaque fiche produit lors du lancement.
          </p>
          <div className="flex flex-wrap gap-3">
            <AddToCartButton product={product} />
          </div>
          <NotifyForm productName={product.name} />
          <div className="space-y-3 border-t border-border pt-5">
            <h2 className="font-medium">Description</h2>
            <p className="text-sm leading-relaxed text-muted">{product.description}</p>
          </div>
          <div className="space-y-3">
            <h2 className="font-medium">Caractéristiques</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="font-medium">Spécifications</h2>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-border bg-card px-3 py-2">
                  <dt className="text-muted">{key}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-2 text-sm text-muted">
            <p>
              <strong className="text-foreground">Retours :</strong> politique française prévue au
              lancement. Adresse de retour : à confirmer (RETURN_ADDRESS_TODO).
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold">Produits similaires</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
