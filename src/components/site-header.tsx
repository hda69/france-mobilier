"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigation, store } from "@/config/store";
import { useCart } from "@/components/cart-provider";
import { IconBag, IconSearch, IconUser } from "@/components/icons";
import { authClient } from "@/lib/auth-client";

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
      <div className="h-[calc(6.125rem+env(safe-area-inset-top))] md:h-[calc(7.25rem+env(safe-area-inset-top))]" aria-hidden />
      <header className="fixed inset-x-0 top-0 z-40 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <p className="border-b border-border bg-navy text-center text-[11px] tracking-[0.04em] text-white/90 md:text-xs">
          <span className="container-page flex h-8 items-center justify-center gap-x-3 overflow-hidden whitespace-nowrap">
            <span>Livraison en France</span>
            <span className="text-white/40">•</span>
            <span>Retours 14 jours</span>
            <span className="hidden text-white/40 sm:inline">•</span>
            <span className="hidden sm:inline">Service client</span>
          </span>
        </p>
        <div
          className={`border-b border-border/80 transition-shadow duration-300 ${
            compact ? "shadow-[var(--shadow)]" : ""
          }`}
        >
          <div
            className={`container-page flex items-center justify-between gap-4 ${
              compact ? "min-h-14 py-2" : "min-h-16 py-2.5 md:min-h-[4.25rem]"
            }`}
          >
            <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
              <Image
                src={store.logoPath}
                alt={store.storeName}
                width={220}
                height={163}
                className={`w-auto object-contain transition-[height] duration-300 ${
                  compact ? "h-9 md:h-10" : "h-11 md:h-12"
                }`}
                priority
              />
            </Link>
            <nav className="hidden items-center gap-7 text-[15px] text-navy lg:flex">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="relative py-1 hover:opacity-70">
                  {item.label}
                </Link>
              ))}
            </nav>
            <form onSubmit={onSearch} className="hidden max-w-xs flex-1 md:block">
              <label className="sr-only" htmlFor="header-search">
                Rechercher
              </label>
              <div className="relative">
                <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="header-search"
                  name="q"
                  type="search"
                  placeholder="Rechercher un produit…"
                  className="input pl-9"
                />
              </div>
            </form>
            <div className="flex items-center gap-1">
              <Link
                href={session?.user ? "/compte" : "/connexion"}
                className="hidden h-11 w-11 items-center justify-center text-navy hover:opacity-70 sm:inline-flex"
                aria-label={session?.user ? "Compte" : "Connexion"}
              >
                <IconUser />
              </Link>
              <Link
                href="/cart"
                className="relative inline-flex h-11 w-11 items-center justify-center text-navy hover:opacity-70"
                aria-label={itemCount > 0 ? `Panier, ${itemCount} articles` : "Panier"}
              >
                <IconBag />
                {itemCount > 0 ? (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent-red)] px-1 text-[10px] font-semibold text-white">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center text-navy lg:hidden"
                aria-expanded={open}
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                onClick={() => setOpen((value) => !value)}
              >
                <span aria-hidden className="flex flex-col gap-1.5">
                  <span className={`h-0.5 w-4 bg-navy transition ${open ? "translate-y-2 rotate-45" : ""}`} />
                  <span className={`h-0.5 w-4 bg-navy transition ${open ? "opacity-0" : ""}`} />
                  <span className={`h-0.5 w-4 bg-navy transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
                </span>
              </button>
            </div>
          </div>
          {open && (
            <div className="border-t border-border bg-white lg:hidden">
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
                    className="input"
                  />
                </form>
                <nav className="grid gap-1 text-navy">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-3 hover:bg-cream"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href={session?.user ? "/compte" : "/connexion"}
                    className="rounded-lg px-3 py-3 hover:bg-cream sm:hidden"
                    onClick={() => setOpen(false)}
                  >
                    {session?.user ? "Compte" : "Connexion"}
                  </Link>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
