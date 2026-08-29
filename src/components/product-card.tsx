import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/commerce";
import { availabilityLabel, formatPrice } from "@/lib/products/repository";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col bg-white">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-cream">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          {product.availabilityStatus !== "available" ? (
            <p className="badge absolute left-3 top-3">{availabilityLabel(product.availabilityStatus)}</p>
          ) : null}
        </div>
        <div className="space-y-1.5 pt-4">
          <h3 className="text-base font-medium leading-snug break-words text-navy">{product.name}</h3>
          <p className="text-sm text-muted">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
