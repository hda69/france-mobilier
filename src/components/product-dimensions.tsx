import { ProductDimensionsDiagram } from "@/components/product-dimensions-diagram";
import { canDrawDiagram, getProductMeasures, measureEntries } from "@/lib/products/presentation";
import { uniqueVariantSizes } from "@/lib/products/repository";
import type { Product } from "@/lib/types/commerce";

export function ProductDimensions({ product }: { product: Product }) {
  const rows = measureEntries(product);
  const sizes = uniqueVariantSizes(product);
  if (rows.length === 0 && !product.weight && sizes.length === 0) return null;
  const measures = getProductMeasures(product);
  const showDiagram = canDrawDiagram(product);

  return (
    <section className="section">
      <div className="container-page">
        <h2 className="display text-3xl text-navy">Dimensions</h2>
        <div className={`mt-8 grid gap-8 ${showDiagram ? "md:grid-cols-2 md:items-center" : ""}`}>
          {showDiagram ? <ProductDimensionsDiagram measures={measures} /> : null}
          <div className="space-y-6">
            {sizes.length > 1 ? (
              <div>
                <p className="text-sm text-muted">Formats cubes</p>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  {sizes.map((size) => (
                    <div key={size.sizeCm} className="rounded-xl border border-border bg-white px-4 py-3">
                      <dt className="text-sm text-muted">{size.sizeCm} cm</dt>
                      <dd className="mt-1 font-medium text-navy">
                        {size.sizeLabel}
                        {size.weightKg != null ? ` · ${size.weightKg.toString().replace(".", ",")} kg` : ""}
                      </dd>
                    </div>
                  ))}
                </dl>
                {showDiagram ? (
                  <p className="mt-3 text-sm text-muted">Le schéma représente le format 40 cm.</p>
                ) : null}
              </div>
            ) : (
              <dl className="grid gap-4 sm:grid-cols-2">
                {rows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-sm text-muted">{row.label}</dt>
                    <dd className="mt-1 text-xl font-medium text-navy">{row.value}</dd>
                  </div>
                ))}
                {product.weight ? (
                  <div>
                    <dt className="text-sm text-muted">Poids</dt>
                    <dd className="mt-1 text-xl font-medium text-navy">{product.weight} kg</dd>
                  </div>
                ) : null}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
