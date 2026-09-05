"use client";

import { NotifyForm } from "@/components/notify-form";
import { ProductBenefits } from "@/components/product-benefits";
import { ProductBuyBox } from "@/components/product-buy-box";
import { ProductPrice } from "@/components/product-price";
import { ProductTrustBar } from "@/components/product-trust-bar";
import {
  availabilityLabel,
  findProductVariant,
  uniqueVariantColors,
  uniqueVariantSizes,
} from "@/lib/products/repository";
import { deliveryLabel, productBenefits } from "@/lib/products/presentation";
import type { Product, ProductVariant } from "@/lib/types/commerce";

export function ProductInfo({
  product,
  variantId,
  onVariantIdChange,
}: {
  product: Product;
  variantId: string | undefined;
  onVariantIdChange: (id: string) => void;
}) {
  const outOfStock = product.availabilityStatus === "out_of_stock";
  const delivery = deliveryLabel(product);
  const benefits = productBenefits(product);
  const variants = product.variants ?? [];
  const colors = uniqueVariantColors(product);
  const sizes = uniqueVariantSizes(product);
  const variant = findProductVariant(product, variantId);
  const price = variant?.price ?? product.price;
  const compareAtPrice = variant?.compareAtPrice ?? product.compareAtPrice;

  const selectedColor = variant?.color;
  const selectedSize = variant?.sizeCm;

  function selectColor(color: ProductVariant["color"]) {
    const next =
      variants.find((row) => row.color === color && row.sizeCm === selectedSize) ??
      variants.find((row) => row.color === color);
    if (next) onVariantIdChange(next.id);
  }

  function selectSize(sizeCm: number) {
    const next =
      variants.find((row) => row.sizeCm === sizeCm && row.color === selectedColor) ??
      variants.find((row) => row.sizeCm === sizeCm);
    if (next) onVariantIdChange(next.id);
  }

  return (
    <div className="space-y-5">
      {product.availabilityStatus !== "available" ? (
        <p className="badge">{availabilityLabel(product.availabilityStatus)}</p>
      ) : null}
      <h1 className="display text-[1.75rem] text-navy md:text-4xl">{product.name}</h1>
      <div>
        <ProductPrice product={product} price={price} compareAtPrice={compareAtPrice} size="pdp" />
        <p className="mt-1 text-sm text-muted">Prix TTC</p>
      </div>
      <p className="max-w-[40rem] leading-relaxed text-muted">{product.shortDescription}</p>
      {product.madeToOrder ? (
        <div className="max-w-[40rem] text-sm leading-relaxed text-muted">
          <p className="font-medium text-navy">Fabriqué à la commande</p>
          {delivery ? <p>Livraison {delivery}.</p> : null}
        </div>
      ) : delivery ? (
        <p className="text-sm text-muted">Livraison {delivery}.</p>
      ) : null}
      <ProductBenefits items={benefits} />
      {variants.length > 0 ? (
        <div className="space-y-4">
          <fieldset>
            <legend className="text-sm text-muted">Couleur</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((option) => {
                const selected = option.color === selectedColor;
                return (
                  <button
                    key={option.color}
                    type="button"
                    onClick={() => selectColor(option.color)}
                    aria-pressed={selected}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm ${
                      selected ? "border-navy bg-cream text-navy" : "border-border text-muted"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full ${
                        option.swatchClass ??
                        (option.color === "noir" ? "bg-[#1a1a1a]" : "bg-[#c5c8cc] ring-1 ring-black/10")
                      }`}
                      aria-hidden
                    />
                    {option.colorLabel}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm text-muted">{product.sizesLabel ?? "Taille"}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((option) => {
                const selected = option.sizeCm === selectedSize;
                return (
                  <button
                    key={option.sizeCm}
                    type="button"
                    onClick={() => selectSize(option.sizeCm)}
                    aria-pressed={selected}
                    className={`min-h-11 rounded-full border px-3 py-2 text-sm ${
                      selected ? "border-navy bg-cream text-navy" : "border-border text-muted"
                    }`}
                  >
                    {option.sizeLabel}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      ) : null}
      {outOfStock ? (
        <>
          <NotifyForm productName={product.name} productSlug={product.slug} />
          <ProductTrustBar />
        </>
      ) : (
        <ProductBuyBox product={product} variant={variant} />
      )}
    </div>
  );
}
