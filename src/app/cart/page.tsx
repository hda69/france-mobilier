"use client";

import Image from "next/image";
import Link from "next/link";
import { NotifyForm } from "@/components/notify-form";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/products/repository";

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotal, itemCount } = useCart();
  const publicCheckout = process.env.NEXT_PUBLIC_STORE_CHECKOUT_ENABLED === "true";

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Votre sélection</h1>
      <p className="mt-2 text-muted">
        {itemCount === 0
          ? "Gardez les produits qui vous intéressent, puis laissez votre e-mail pour le lancement."
          : `${itemCount} article${itemCount > 1 ? "s" : ""} de côté — le paiement n’est pas encore ouvert.`}
      </p>

      {items.length === 0 ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="text-muted">Votre sélection est vide.</p>
            <Link href="/collections/maison" className="btn btn-primary mt-6 inline-flex">
              Parcourir la sélection
            </Link>
          </div>
          <NotifyForm variant="launch" anchor />
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
                  <p className="text-sm text-muted">{formatPrice(item.price)} indicatif</p>
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
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted">Sous-total indicatif</p>
              <p className="mt-1 text-2xl font-semibold">{formatPrice(subtotal)}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Aucun paiement n’est collecté pour le moment. Laissez votre e-mail : on vous
                prévient dès que ces produits pourront être commandés.
              </p>
              {publicCheckout ? (
                <Link href="/checkout" className="btn btn-primary mt-6 w-full">
                  Continuer
                </Link>
              ) : (
                <a href="#alerte" className="btn btn-primary mt-6 w-full">
                  Être prévenu à l’ouverture
                </a>
              )}
            </div>
            <NotifyForm variant="launch" anchor />
          </aside>
        </div>
      )}
    </div>
  );
}
