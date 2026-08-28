import { products as catalog } from "@/data/products";
import { collections } from "@/config/store";
import type { Product } from "@/lib/types/commerce";

export function listProducts(): Product[] {
  return catalog;
}

export const getAllProducts = listProducts;

export function findProductBySlug(slug: string): Product | null {
  return catalog.find((p) => p.slug === slug) ?? null;
}

export const getProductBySlug = findProductBySlug;

export function findRelatedProducts(product: Product, limit = 4): Product[] {
  return catalog
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug) ?? null;
}

export const getCollectionBySlug = getCollection;

export function listCollectionProducts(slug: string): Product[] {
  const collection = getCollection(slug);
  if (!collection) return [];
  return catalog.filter((p) =>
    (collection.categories as readonly string[]).includes(p.category),
  );
}

export function collectionSlugForCategory(category: Product["category"]) {
  if (category === "cuisine" || category === "salle-de-bain") return "maison";
  return category;
}

export const listCollectionProductsAlias = listCollectionProducts;

export function filterAndSortProducts(
  items: Product[],
  options: { q?: string; sort?: string; category?: string },
) {
  let result = [...items];
  if (options.category) {
    result = result.filter((p) => p.category === options.category);
  }
  if (options.q) {
    const q = options.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.features.some((feature) => feature.toLowerCase().includes(q)),
    );
  }
  switch (options.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name, "fr"));
      break;
    default:
      break;
  }
  return result;
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function availabilityLabel(status: Product["availabilityStatus"]) {
  switch (status) {
    case "coming_soon":
      return "Bientôt disponible";
    case "available":
      return "Disponible";
    case "out_of_stock":
      return "Rupture temporaire";
  }
}
