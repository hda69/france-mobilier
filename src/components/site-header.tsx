"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigation, store } from "@/config/store";
import { useCart } from "@/components/cart-provider";
import { authClient } from "@/lib/auth-client";

/** Shrink only after this offset; expand only below the lower bound (hysteresis). */
const SHRINK_AFTER = 80;
const EXPAND_BEFORE = 16;

export function SiteHeader() {
  const { itemCount } = useCart();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCompact((isCompact) => (isCompact ? y > EXPAND_BEFORE : y >= SHRINK_AFTER));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get("q") || "").trim();
    setOpen(false);
    router.push(q ? `/recherche?q=${encodeURIComponent(q)}` : "/recherche");
  }

  return (
    <>
      <div className="h-20 md:h-[9.5rem] lg:h-[12.5rem]" aria-hidden />
      <header
        className={`fixed top-0 inset-x-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur transition-shadow duration-300 ${
          compact ? "shadow-sm" : ""
        }`}
      >
      <div
        className={`container-page flex items-center justify-between gap-4 transition-[min-height,padding] duration-300 ${
          compact
            ? "min-h-14 py-1.5 md:min-h-16 md:py-2"
            : "min-h-16 py-2 md:min-h-36 md:py-3 lg:min-h-48"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <Image
            src={store.logoPath}
            alt={store.storeName}
            width={400}
            height={296}
            className={`w-auto object-contain transition-[height] duration-300 ${
              compact ? "h-11 md:h-12 lg:h-14" : "h-16 md:h-32 lg:h-44"
            }`}
            priority
          />
          <span className="sr-only">{store.storeName}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={onSearch} className="hidden flex-1 max-w-xs md:block">
          <label className="sr-only" htmlFor="header-search">
            Rechercher
          </label>
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder="Rechercher un produit…"
            className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm outline-none focus:border-accent"
          />
        </form>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/#alerte" className="hidden text-muted hover:text-foreground md:inline">
            Prévenez-moi
          </Link>
          <Link
            href={session?.user ? "/compte" : "/connexion"}
            className="hidden text-muted hover:text-foreground sm:inline"
          >
            {session?.user ? "Compte" : "Connexion"}
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-border px-3 py-1.5 hover:bg-accent-soft"
          >
            Panier{itemCount > 0 ? ` (${itemCount})` : ""}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden className="flex flex-col gap-1.5">
              <span className={`h-0.5 w-4 bg-foreground transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-4 bg-foreground transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-4 bg-foreground transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-page space-y-4 py-4">
            <form onSubmit={onSearch}>
              <label className="sr-only" htmlFor="mobile-search">
                Rechercher
              </label>
              <input
                id="mobile-search"
                name="q"
                type="search"
                placeholder="Rechercher un produit…"
                className="w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </form>
            <nav className="grid gap-1 text-sm">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2 hover:bg-accent-soft"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#alerte"
                className="rounded-xl px-3 py-2 hover:bg-accent-soft"
                onClick={() => setOpen(false)}
              >
                Prévenez-moi
              </Link>
              <Link
                href={session?.user ? "/compte" : "/connexion"}
                className="rounded-xl px-3 py-2 hover:bg-accent-soft sm:hidden"
                onClick={() => setOpen(false)}
              >
                {session?.user ? "Compte" : "Connexion"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
