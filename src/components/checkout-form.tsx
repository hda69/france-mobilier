"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/products/repository";

export function CheckoutForm() {
  const { items, subtotal, itemCount, ready } = useCart();

  if (!ready) {
    return <div className="min-h-48" />;
  }

  if (itemCount === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        <p className="text-muted">Votre panier est vide.</p>
        <Link href="/collections/maison" className="btn btn-primary mt-6 inline-flex">
          Voir la sélection
        </Link>
      </div>
    );
  }

  return (
    <form
      className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-medium">Livraison</h2>
        <label className="block text-sm">
          Nom
          <input required name="name" autoComplete="name" className="input mt-1" />
        </label>
        <label className="block text-sm">
          E-mail
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="input mt-1"
          />
        </label>
        <label className="block text-sm">
          Adresse
          <input required name="line1" autoComplete="address-line1" className="input mt-1" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Code postal
            <input
              required
              name="postalCode"
              className="input mt-1" autoComplete="postal-code" inputMode="numeric"
            />
          </label>
          <label className="block text-sm">
            Ville
            <input required name="city" autoComplete="address-level2" className="input mt-1" />
          </label>
        </div>
        <label className="block text-sm">
          Téléphone
          <input name="phone" type="tel" autoComplete="tel" className="input mt-1" />
        </label>
        <p className="text-sm text-muted">Paiement par carte. Livraison en France métropolitaine.</p>
      </div>
      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-medium">Récapitulatif</h2>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span className="min-w-0 break-words">
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between border-t border-border pt-3 font-medium">
          <span>Total TTC</span>
          <span>{formatPrice(subtotal)}</span>
        </p>
        <button type="submit" className="btn btn-primary w-full">
          Payer {formatPrice(subtotal)}
        </button>
        <Link href="/cart" className="block text-center text-sm text-muted underline-offset-4 hover:underline">
          Retour au panier
        </Link>
      </aside>
    </form>
  );
}
