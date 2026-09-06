import type { Product } from "@/lib/types/commerce";
import { getProductMeasures } from "@/lib/products/presentation";
import { PRODUCT_TYPE_LABELS } from "@/lib/products/merchandising";

type Props = {
  products: Product[];
  query: {
    q?: string;
    sort?: string;
    productType?: string;
    material?: string;
    color?: string;
    maxDepth?: string;
    maxWidth?: string;
    maxHeight?: string;
  };
};

function unique<T>(values: Array<T | undefined | null>): T[] {
  return [...new Set(values.filter((value): value is T => Boolean(value)))];
}

export function ProductFilters({ products, query }: Props) {
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
  const depths = products.map((product) => getProductMeasures(product).depthCm).filter((value): value is number => value != null);
  const widths = products.map((product) => getProductMeasures(product).widthCm).filter((value): value is number => value != null);
  const heights = products.map((product) => getProductMeasures(product).heightCm).filter((value): value is number => value != null);

  const depthOptions = [20, 30, 40].filter((limit) => depths.some((depth) => depth <= limit));
  const showWidth = widths.length > 0;
  const showHeight = heights.length > 0;

  return (
    <form className="mb-8 grid gap-3 rounded-[var(--radius)] bg-white p-4 md:grid-cols-12 md:items-end">
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
      {showWidth ? (
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-muted">Largeur max.</span>
          <select name="maxWidth" defaultValue={query.maxWidth || ""} className="input">
            <option value="">Toutes</option>
            {[60, 80, 100, 120, 160].filter((limit) => widths.some((width) => width <= limit)).map((limit) => (
              <option key={limit} value={limit}>
                {limit} cm
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
      {showHeight ? (
        <label className="sr-only">
          Hauteur max.
          <input type="hidden" name="maxHeight" defaultValue={query.maxHeight || ""} />
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
      <button type="submit" className="btn btn-primary w-full md:col-span-2">
        Filtrer
      </button>
    </form>
  );
}
