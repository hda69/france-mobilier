import { productFaqItems } from "@/lib/products/presentation";
import type { Product } from "@/lib/types/commerce";

export function ProductFAQ({ product }: { product: Product }) {
  const items = productFaqItems(product);
  if (items.length === 0) return null;

  return (
    <section className="section section-cream">
      <div className="container-page">
        <h2 className="display text-3xl text-navy">Questions fréquentes</h2>
        <div className="prose-narrow mt-8 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-navy">
                {item.question}
                <span className="text-lg text-muted transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-2 max-w-[46rem] text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
