"use client";

import Link from "next/link";
import { navigation, store } from "@/config/store";
import { useCart } from "@/components/cart-provider";

export function SiteHeader() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          {store.storeName}
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/collections/maison?q=" className="text-muted hover:text-foreground">
            Recherche
          </Link>
          <Link href="/cart" className="rounded-full border border-border px-3 py-1.5 hover:bg-white">
            Panier{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}
