import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/commerce";
import { ProductPrice, isOnSale } from "@/components/product-price";
import { productHeroImage } from "@/lib/products/presentation";
import { availabilityLabel } from "@/lib/products/repository";
import { cardDeliveryLabel, isLowDepth, isSellable, productCardMeta } from "@/lib/products/merchandising";

export function ProductCard({ product }: { product: Product }) {
  const badges: string[] = [];
  if (isOnSale(product) && isSellable(product)) badges.push("Promo");
  if (isLowDepth(product)) badges.push("Faible profondeur");
  if (!isSellable(product) && badges.length < 2) {
    badges.push(availabilityLabel(product.availabilityStatus));
  }
  const meta = productCardMeta(product);
  const delivery = cardDeliveryLabel(product);

  return (
    <article className="group flex flex-col bg-white">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-cream">
          <Image
            src={productHeroImage(product)}
            alt={product.name}
            fill
            className="object-cover transition duration-500 md:group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {badges.length > 0 ? (
            <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-col gap-1">
              {badges.slice(0, 2).map((badge) => (
                <p key={badge} className="badge w-fit">
                  {badge}
                </p>
              ))}
            </div>
          ) : null}
        </div>
        <div className="space-y-1 pt-3">
          <h3 className="text-sm font-medium leading-snug break-words text-navy md:text-base">{product.name}</h3>
          {meta ? <p className="text-xs text-muted md:text-sm">{meta}</p> : null}
          <ProductPrice product={product} />
          <p className="text-xs text-muted">Livraison offerte</p>
          {delivery ? <p className="text-xs text-muted">{delivery}</p> : null}
        </div>
      </Link>
    </article>
  );
}
