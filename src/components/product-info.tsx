import { NotifyForm } from "@/components/notify-form";
import { ProductBenefits } from "@/components/product-benefits";
import { ProductBuyBox } from "@/components/product-buy-box";
import { ProductPrice } from "@/components/product-price";
import { ProductTrustBar } from "@/components/product-trust-bar";
import { availabilityLabel } from "@/lib/products/repository";
import { preparationLabel, productBenefits } from "@/lib/products/presentation";
import type { Product } from "@/lib/types/commerce";

export function ProductInfo({ product }: { product: Product }) {
  const outOfStock = product.availabilityStatus === "out_of_stock";
  const prep = preparationLabel(product);
  const benefits = productBenefits(product);

  return (
    <div className="space-y-5">
      {product.availabilityStatus !== "available" ? (
        <p className="badge">{availabilityLabel(product.availabilityStatus)}</p>
      ) : null}
      <h1 className="display text-[1.75rem] text-navy md:text-4xl">{product.name}</h1>
      <div>
        <ProductPrice product={product} size="pdp" />
        <p className="mt-1 text-sm text-muted">Prix TTC</p>
      </div>
      <p className="max-w-[40rem] leading-relaxed text-muted">{product.shortDescription}</p>
      {product.madeToOrder && prep ? (
        <div className="max-w-[40rem] text-sm leading-relaxed text-muted">
          <p className="font-medium text-navy">Fabriqué à la commande</p>
          <p>Préparation estimée : {prep}.</p>
        </div>
      ) : prep ? (
        <p className="text-sm text-muted">Préparation estimée : {prep}.</p>
      ) : null}
      <ProductBenefits items={benefits} />
      {outOfStock ? (
        <>
          <NotifyForm productName={product.name} productSlug={product.slug} />
          <ProductTrustBar />
        </>
      ) : (
        <ProductBuyBox product={product} />
      )}
    </div>
  );
}
