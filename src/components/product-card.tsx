import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/commerce";
import { availabilityLabel, formatPrice } from "@/lib/products/repository";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-[#f3efe8]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="space-y-2 p-4">
          <p className="badge">{availabilityLabel(product.availabilityStatus)}</p>
          <h3 className="text-base font-medium leading-snug">{product.name}</h3>
          <p className="text-sm text-muted line-clamp-2">{product.shortDescription}</p>
          <p className="pt-1 text-sm font-medium">{formatPrice(product.price)} <span className="font-normal text-muted">indicatif</span></p>
        </div>
      </Link>
    </article>
  );
}
