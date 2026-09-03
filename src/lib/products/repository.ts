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

export function findProductById(id: string): Product | null {
  return catalog.find((p) => p.id === id) ?? null;
}

export const getProductBySlug = findProductBySlug;

const COMPLEMENTARY_CATEGORIES: Record<Product["category"], Product["category"][]> = {
  maison: ["rangement"],
  rangement: ["maison"],
  bureau: ["rangement", "maison"],
  cuisine: ["rangement", "maison"],
  "salle-de-bain": ["rangement"],
  animaux: ["maison"],
};

function relatedScore(base: Product, other: Product): number {
  if (other.id === base.id) return -1;
  if (base.category !== "animaux" && other.category === "animaux") return -1;

  let score = 0;
  if (other.category === base.category) score += 100;
  else if (COMPLEMENTARY_CATEGORIES[base.category].includes(other.category)) score += 40;
  else return -1;

  const gap = Math.abs(other.price - base.price) / base.price;
  if (gap <= 0.35) score += 25;
  else if (gap <= 0.6) score += 10;
  else score -= 5;
  return score;
}

export function findRelatedProducts(product: Product, limit = 4): Product[] {
  return catalog
    .map((candidate) => ({ candidate, score: relatedScore(product, candidate) }))
    .filter((row) => row.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.candidate);
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
