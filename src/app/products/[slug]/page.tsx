import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { NotifyForm } from "@/components/notify-form";
import { ProductCard } from "@/components/product-card";
import { ProductReviews } from "@/components/product-reviews";
import { store } from "@/config/store";
import {
  availabilityLabel,
  collectionSlugForCategory,
  findProductBySlug,
  findRelatedProducts,
  formatPrice,
  getCollection,
  listProducts,
} from "@/lib/products/repository";
import { listApprovedReviews } from "@/lib/reviews";

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
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `${store.domain}/products/${product.slug}`,
      images: product.images.map((url) => ({ url })),
    },
  };
}

const trustPoints = [
  { title: "Prix TTC", text: "Total confirmé au paiement." },
  { title: "Livraison France", text: "France métropolitaine, colis suivi." },
  { title: "Rétractation 14 jours", text: "Après réception du colis." },
  { title: "Contact", text: store.supportEmail },
];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (!product) notFound();
  const related = findRelatedProducts(product);
  const reviews = await listApprovedReviews(product.id);
  const collectionSlug = collectionSlugForCategory(product.category);
  const collection = getCollection(collectionSlug);
  const outOfStock = product.availabilityStatus === "out_of_stock";

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

  return (
    <div className="container-page py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-muted">
        <Link href="/">Accueil</Link> /{" "}
        <Link href={`/collections/${collectionSlug}`}>{collection?.name ?? "Catalogue"}</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-[#f3efe8]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-5">
          {product.availabilityStatus !== "available" ? (
            <p className="badge">{availabilityLabel(product.availabilityStatus)}</p>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-muted leading-relaxed">{product.shortDescription}</p>
          <p className="text-2xl font-medium">{formatPrice(product.price)}</p>
          {outOfStock ? (
            <NotifyForm productName={product.name} productSlug={product.slug} />
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <AddToCartButton product={product} />
              <Link href="/cart" className="btn btn-secondary">
                Voir le panier
              </Link>
            </div>
          )}
          <ul className="grid gap-2 sm:grid-cols-2">
            {trustPoints.map((item) => (
              <li key={item.title} className="rounded-xl border border-border bg-card px-3 py-2.5">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
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
        </div>
      </div>

      <ProductReviews productId={product.id} initialReviews={reviews} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold">Dans le même esprit</h2>
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
