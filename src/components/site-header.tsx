"use client";

import Image from "next/image";
import Link from "next/link";
import { navigation, store } from "@/config/store";
import { useCart } from "@/components/cart-provider";
import { authClient } from "@/lib/auth-client";

export function SiteHeader() {
  const { itemCount } = useCart();
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="container-page flex h-18 items-center justify-between gap-4 py-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src={store.logoPath}
            alt={store.storeName}
            width={160}
            height={72}
            className="h-12 w-auto object-contain md:h-14"
            priority
          />
          <span className="sr-only">{store.storeName}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href={session?.user ? "/compte" : "/connexion"}
            className="text-muted hover:text-foreground"
          >
            {session?.user ? "Compte" : "Connexion"}
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-border px-3 py-1.5 hover:bg-accent-soft"
          >
            Panier{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
        </div>
      </div>
    </header>
  );
}
