import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDailyUse } from "@/components/product-daily-use";
import { ProductDimensions } from "@/components/product-dimensions";
import { ProductFAQ } from "@/components/product-faq";
import { ProductGallery } from "@/components/product-gallery";
import { ProductHighlights } from "@/components/product-highlights";
import { ProductInfo } from "@/components/product-info";
import { ProductRecommendations } from "@/components/product-recommendations";
import { ProductReviews } from "@/components/product-reviews";
import { ProductShippingReturns } from "@/components/product-shipping-returns";
import { ProductSpecifications } from "@/components/product-specifications";
import { store } from "@/config/store";
import {
  collectionSlugForCategory,
  findProductBySlug,
  findRelatedProducts,
  getCollection,
  listProducts,
} from "@/lib/products/repository";
import {
  productGalleryImages,
  productHeroImage,
  productHighlights,
} from "@/lib/products/presentation";
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
  const hero = productHeroImage(product);
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `${store.domain}/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `${store.domain}/products/${product.slug}`,
      images: [hero, ...product.images.filter((src) => src !== hero)].map((url) => ({ url })),
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
  const gallery = productGalleryImages(product);
  const hero = productHeroImage(product);
  const highlights = productHighlights(product);

  const variants = product.variants ?? [];
  const prices = variants.map((variant) => variant.price);
  const lowPrice = prices.length ? Math.min(...prices) : product.price;
  const highPrice = prices.length ? Math.max(...prices) : product.price;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [hero, ...gallery.filter((src) => src !== hero)].map((src) => `${store.domain}${src}`),
    brand: { "@type": "Brand", name: store.storeName },
    offers:
      variants.length > 1
        ? {
            "@type": "AggregateOffer",
            url: `${store.domain}/products/${product.slug}`,
            priceCurrency: "EUR",
            lowPrice,
            highPrice,
            offerCount: variants.length,
            availability:
              product.availabilityStatus === "out_of_stock"
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
          }
        : {
            "@type": "Offer",
            url: `${store.domain}/products/${product.slug}`,
            priceCurrency: "EUR",
            price: product.price,
            availability:
              product.availabilityStatus === "out_of_stock"
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
          },
    ...(reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            ).toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
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
    <div className="bg-white pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0">
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
          <ProductGallery images={gallery} name={product.name} />
          <ProductInfo product={product} />
        </div>
      </div>

      <ProductHighlights items={highlights} />
      <ProductDailyUse items={product.dailyUses ?? []} />
      <ProductDimensions product={product} />
      <ProductSpecifications product={product} />
      <ProductShippingReturns product={product} />
      <ProductFAQ product={product} />
      <ProductReviews productId={product.id} initialReviews={reviews} />
      <ProductRecommendations products={related} />
    </div>
  );
}
