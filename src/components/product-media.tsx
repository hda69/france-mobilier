"use client";

import { useCallback, useMemo, useState } from "react";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { findProductVariant, uniqueVariantColors } from "@/lib/products/repository";
import type { Product } from "@/lib/types/commerce";

export function ProductMedia({ product, images }: { product: Product; images: string[] }) {
  const variants = product.variants ?? [];
  const [variantId, setVariantId] = useState(product.defaultVariantId ?? variants[0]?.id);
  const [index, setIndex] = useState(0);
  const variant = findProductVariant(product, variantId);

  const autoplayIndexes = useMemo(() => {
    const otherColorImages = new Set(
      uniqueVariantColors(product)
        .filter((option) => option.color !== variant?.color)
        .flatMap((option) => (option.image ? [option.image] : [])),
    );
    const related = images
      .map((src, imageIndex) => (otherColorImages.has(src) ? -1 : imageIndex))
      .filter((imageIndex) => imageIndex >= 0);
    return related.length > 0 ? related : images.map((_, imageIndex) => imageIndex);
  }, [images, product, variant?.color]);

  const handleVariantIdChange = useCallback(
    (nextId: string) => {
      setVariantId(nextId);
      const next = findProductVariant(product, nextId);
      if (!next?.image) return;
      const imageIndex = images.indexOf(next.image);
      if (imageIndex >= 0) setIndex(imageIndex);
    },
    [images, product],
  );

  const handleIndexChange = useCallback(
    (nextIndex: number) => {
      setIndex(nextIndex);
      const src = images[nextIndex];
      if (!src) return;
      const colorMatch = uniqueVariantColors(product).find((option) => option.image === src);
      if (!colorMatch || colorMatch.color === variant?.color) return;
      const next =
        variants.find((row) => row.color === colorMatch.color && row.sizeCm === variant?.sizeCm) ??
        variants.find((row) => row.color === colorMatch.color);
      if (next) setVariantId(next.id);
    },
    [images, product, variant?.color, variant?.sizeCm, variants],
  );

  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-14">
      <ProductGallery
        images={images}
        name={product.name}
        index={index}
        onIndexChange={handleIndexChange}
        autoplayIndexes={autoplayIndexes}
      />
      <ProductInfo product={product} variantId={variantId} onVariantIdChange={handleVariantIdChange} />
    </div>
  );
}
