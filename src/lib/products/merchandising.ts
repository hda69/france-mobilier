import { catalogFlags } from "@/lib/catalog/flags";
import { deliveryCustomerLabel } from "@/lib/merchant/delivery";
import { getProductMeasures } from "@/lib/products/presentation";
import type { Product, ProductRoom, ProductTypeSlug } from "@/lib/types/commerce";

export const ROOM_LABELS: Record<ProductRoom, string> = {
  salon: "Salon",
  chambre: "Chambre",
  entree: "Entrée & rangement",
  bureau: "Bureau",
  accessoires: "Accessoires",
};

export const PRODUCT_TYPE_LABELS: Record<ProductTypeSlug, string> = {
  "table-basse": "Tables basses",
  "meuble-tv": "Meubles TV",
  "table-appoint": "Tables d’appoint",
  "table-a-manger": "Tables à manger",
  "table-de-chevet": "Tables de chevet",
  coiffeuse: "Coiffeuses",
  "meuble-chaussures": "Meubles à chaussures",
  casiers: "Casiers",
  etagere: "Étagères",
  bureau: "Bureaux",
  support: "Supports",
  organiseur: "Organiseurs",
  chariot: "Chariots",
  rangement: "Rangements",
  "meuble-litiere": "Meubles pour animaux",
  buffet: "Buffets",
  console: "Consoles",
  commode: "Commodes",
  armoire: "Armoires",
  caisson: "Caissons",
  banc: "Bancs",
};

export function isSellable(product: Product) {
  return product.availabilityStatus === "available";
}

export function isLowDepth(product: Product) {
  const depth = getProductMeasures(product).depthCm;
  return depth != null && depth <= catalogFlags.lowDepthMaxCm;
}

export function isNarrow(product: Product) {
  const width = getProductMeasures(product).widthCm;
  return width != null && width <= catalogFlags.narrowWidthMaxCm;
}

export function isWallMounted(product: Product) {
  const fixation = product.specifications?.Fixation;
  if (typeof fixation === "string" && /mural/i.test(fixation)) return true;
  const text = [product.slug, product.name, ...(product.features ?? [])].join(" ");
  return /mural/i.test(text);
}

export function isSmallSpaceProduct(product: Product) {
  return Boolean(
    product.smallSpaceFriendly ||
      product.extensible ||
      product.modular ||
      isLowDepth(product) ||
      isWallMounted(product),
  );
}

export function smallSpaceReasons(product: Product): string[] {
  const reasons: string[] = [];
  if (isLowDepth(product)) reasons.push("low-depth");
  if (isNarrow(product)) reasons.push("narrow");
  if (product.extensible) reasons.push("extensible");
  if (product.modular) reasons.push("modular");
  if (product.smallSpaceFriendly && reasons.length === 0) reasons.push("studio");
  return reasons;
}

export function formatLph(product: Product): string | null {
  const { widthCm, depthCm, heightCm } = getProductMeasures(product);
  if (widthCm != null && depthCm != null && heightCm != null) {
    return `${widthCm} × ${depthCm} × ${heightCm} cm`;
  }
  return null;
}

export function productCardMeta(product: Product): string | null {
  const measures = getProductMeasures(product);
  const parts: string[] = [];
  if (product.material) parts.push(product.material);
  if (isLowDepth(product) && measures.depthCm != null) {
    parts.push(`${measures.depthCm} cm de profondeur`);
  } else if (measures.widthCm != null) {
    parts.push(`${measures.widthCm} cm`);
  } else if (product.extensible) {
    parts.push("Extensible");
  }
  return parts.length ? parts.join(" · ") : null;
}

export function cardDeliveryLabel(product: Product): string | null {
  if (!isSellable(product)) return null;
  const delay = deliveryCustomerLabel(product);
  if (product.madeToOrder && delay) return `Fabriqué à la commande — ${delay}`;
  return delay;
}

export function sortSellableFirst(products: Product[]) {
  return [...products].sort((a, b) => {
    const aOk = isSellable(a) ? 0 : 1;
    const bOk = isSellable(b) ? 0 : 1;
    return aOk - bOk;
  });
}

export function applyAvailabilityVisibility(products: Product[]) {
  const available = products.filter(isSellable);
  const rest = products.filter((product) => !isSellable(product));
  if (!catalogFlags.hideUnavailableProducts) return [...available, ...rest];
  if (available.length > 0) return available;
  return rest;
}

export function primaryRoom(product: Product): ProductRoom {
  return product.rooms?.[0] ?? roomFromLegacyCategory(product.category);
}

function roomFromLegacyCategory(category: Product["category"]): ProductRoom {
  switch (category) {
    case "bureau":
      return "bureau";
    case "rangement":
      return "entree";
    case "animaux":
      return "accessoires";
    case "cuisine":
      return "salon";
    case "salle-de-bain":
      return "accessoires";
    default:
      return "salon";
  }
}

export function collectionSlugForProduct(product: Product): string {
  switch (primaryRoom(product)) {
    case "salon":
      return "salon";
    case "chambre":
      return "chambre";
    case "entree":
      return "entree-rangement";
    case "bureau":
      return "bureau";
    case "accessoires":
      return product.category === "animaux" ? "animaux" : "accessoires";
  }
}
