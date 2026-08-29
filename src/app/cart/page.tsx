"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/products/repository";

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotal, itemCount, ready } = useCart();

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="display text-4xl text-navy">Panier</h1>
      <p className="mt-2 text-muted">
        {!ready
          ? " "
          : itemCount === 0
            ? "Votre panier est vide."
            : `${itemCount} article${itemCount > 1 ? "s" : ""}.`}
      </p>

      {!ready ? (
        <div className="mt-10 min-h-48" />
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius)] bg-cream px-6 py-10">
          <h2 className="display text-2xl text-navy">Votre panier est vide</h2>
          <p className="mt-2 max-w-md text-muted">
            Découvrez nos meubles et solutions pour la maison.
          </p>
          <Link href="/collections/maison" className="btn btn-primary mt-6 inline-flex">
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-[#f3efe8]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 space-y-2">
                  <Link href={`/products/${item.slug}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-muted">
                      Qté{" "}
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                        className="ml-2 w-16 rounded-lg border border-border px-2 py-1"
                      />
                    </label>
                    <button
                      type="button"
                      className="text-sm text-muted underline"
                      onClick={() => removeItem(item.productId)}
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted">Sous-total TTC</p>
            <p className="mt-1 text-2xl font-semibold">{formatPrice(subtotal)}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Frais de livraison calculés à l’étape suivante.
            </p>
            <Link href="/checkout" className="btn btn-primary mt-6 w-full">
              Commander
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
