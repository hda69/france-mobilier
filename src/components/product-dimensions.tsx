import { ProductDimensionsDiagram } from "@/components/product-dimensions-diagram";
import { canDrawDiagram, getProductMeasures, measureEntries } from "@/lib/products/presentation";
import type { Product } from "@/lib/types/commerce";

export function ProductDimensions({ product }: { product: Product }) {
  const rows = measureEntries(product);
  if (rows.length === 0 && !product.weight) return null;
  const measures = getProductMeasures(product);
  const showDiagram = canDrawDiagram(product);

  return (
    <section className="section">
      <div className="container-page">
        <h2 className="display text-3xl text-navy">Dimensions</h2>
        <div className={`mt-8 grid gap-8 ${showDiagram ? "md:grid-cols-2 md:items-center" : ""}`}>
          {showDiagram ? <ProductDimensionsDiagram measures={measures} /> : null}
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
        </div>
      </div>
    </section>
  );
}
