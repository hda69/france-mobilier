"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Product } from "@/lib/types/commerce";
import { getProductMeasures } from "@/lib/products/presentation";
import { isSellable, PRODUCT_TYPE_LABELS } from "@/lib/products/merchandising";

export type ProductFilterQuery = {
  q?: string;
  sort?: string;
  productType?: string;
  material?: string;
  color?: string;
  maxDepth?: string;
  maxWidth?: string;
  maxHeight?: string;
  maxPrice?: string;
  availability?: string;
};

type Props = {
  products: Product[];
  query: ProductFilterQuery;
};

function unique<T>(values: Array<T | undefined | null>): T[] {
  return [...new Set(values.filter((value): value is T => Boolean(value)))];
}

function FilterFields({ products, query }: Props) {
  const types = unique(products.map((product) => product.productType)).sort();
  const materials = unique(products.map((product) => product.material)).sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
  const colors = [
    ...new Map(
      products.flatMap((product) =>
        (product.variants ?? []).map((variant) => [variant.color, variant.colorLabel] as const),
      ),
    ).entries(),
  ];
  const depths = products
    .map((product) => getProductMeasures(product).depthCm)
    .filter((value): value is number => value != null);
  const widths = products
    .map((product) => getProductMeasures(product).widthCm)
    .filter((value): value is number => value != null);
  const heights = products
    .map((product) => getProductMeasures(product).heightCm)
    .filter((value): value is number => value != null);
  const prices = products.map((product) => product.price);
  const hasAvailable = products.some(isSellable);
  const hasUnavailable = products.some((product) => !isSellable(product));

  const depthOptions = [20, 30, 40].filter((limit) => depths.some((depth) => depth <= limit));
  const widthOptions = [60, 80, 100, 120, 160].filter((limit) => widths.some((width) => width <= limit));
  const heightOptions = [40, 60, 80, 100, 140].filter((limit) => heights.some((height) => height <= limit));
  const priceOptions = [80, 120, 160, 200, 300].filter((limit) => prices.some((price) => price <= limit));

  return (
    <>
      <label className="text-sm md:col-span-3">
        <span className="mb-1 block text-muted">Recherche</span>
        <input name="q" defaultValue={query.q || ""} placeholder="Meuble, 20 cm…" className="input" />
      </label>
      {types.length > 1 ? (
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-muted">Type</span>
          <select name="productType" defaultValue={query.productType || ""} className="input">
            <option value="">Tous</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {PRODUCT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {depthOptions.length > 0 ? (
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-muted">Profondeur</span>
          <select name="maxDepth" defaultValue={query.maxDepth || ""} className="input">
            <option value="">Toutes</option>
            {depthOptions.map((limit) => (
              <option key={limit} value={limit}>
                Moins de {limit} cm
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {widthOptions.length > 0 ? (
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-muted">Largeur max.</span>
          <select name="maxWidth" defaultValue={query.maxWidth || ""} className="input">
            <option value="">Toutes</option>
            {widthOptions.map((limit) => (
              <option key={limit} value={limit}>
                {limit} cm
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {heightOptions.length > 0 ? (
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-muted">Hauteur max.</span>
          <select name="maxHeight" defaultValue={query.maxHeight || ""} className="input">
            <option value="">Toutes</option>
            {heightOptions.map((limit) => (
              <option key={limit} value={limit}>
                {limit} cm
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {priceOptions.length > 0 ? (
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-muted">Prix</span>
          <select name="maxPrice" defaultValue={query.maxPrice || ""} className="input">
            <option value="">Tous</option>
            {priceOptions.map((limit) => (
              <option key={limit} value={limit}>
                Jusqu’à {limit} €
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {materials.length > 1 ? (
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-muted">Matière</span>
          <select name="material" defaultValue={query.material || ""} className="input">
            <option value="">Toutes</option>
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {colors.length > 1 ? (
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-muted">Couleur</span>
          <select name="color" defaultValue={query.color || ""} className="input">
            <option value="">Toutes</option>
            {colors.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {hasAvailable && hasUnavailable ? (
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-muted">Disponibilité</span>
          <select name="availability" defaultValue={query.availability || ""} className="input">
            <option value="">Toutes</option>
            <option value="available">Disponible à l’achat</option>
          </select>
        </label>
      ) : null}
      <label className="text-sm md:col-span-2">
        <span className="mb-1 block text-muted">Tri</span>
        <select name="sort" defaultValue={query.sort || ""} className="input">
          <option value="">Pertinence</option>
          <option value="newest">Nouveautés</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </label>
    </>
  );
}

export function ProductFilters({ products, query }: Props) {
  const pathname = usePathname();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const activeCount = [
    query.q,
    query.productType,
    query.material,
    query.color,
    query.maxDepth,
    query.maxWidth,
    query.maxHeight,
    query.maxPrice,
    query.availability,
  ].filter(Boolean).length;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-3 md:hidden">
        <button type="button" className="btn btn-secondary flex-1" onClick={() => setOpen(true)}>
          Filtres{activeCount ? ` (${activeCount})` : ""}
        </button>
        {activeCount > 0 ? (
          <Link href={pathname} className="text-sm text-navy underline-offset-4 hover:underline">
            Réinitialiser
          </Link>
        ) : null}
      </div>

      <form className="hidden gap-3 rounded-[var(--radius)] bg-white p-4 md:grid md:grid-cols-12 md:items-end">
        <FilterFields products={products} query={query} />
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" className="btn btn-primary w-full">
            Filtrer
          </button>
        </div>
        {activeCount > 0 ? (
          <Link
            href={pathname}
            className="self-center text-sm text-navy underline-offset-4 hover:underline md:col-span-2"
          >
            Réinitialiser
          </Link>
        ) : null}
      </form>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/40"
            aria-label="Fermer les filtres"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id={titleId} className="text-lg font-semibold text-navy">
                Filtres
              </h2>
              <button type="button" className="text-sm text-muted" onClick={() => setOpen(false)}>
                Fermer
              </button>
            </div>
            <form className="grid gap-3">
              <FilterFields products={products} query={query} />
              <button type="submit" className="btn btn-primary mt-2 w-full">
                Voir les meubles
              </button>
              {activeCount > 0 ? (
                <Link href={pathname} className="btn btn-secondary w-full" onClick={() => setOpen(false)}>
                  Réinitialiser
                </Link>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
