import type { Product, ProductTypeSlug } from "@/lib/types/commerce";

const PRODUCT_TYPE_PATH: Partial<Record<ProductTypeSlug, string>> = {
  "table-basse": "Maison > Salon > Tables basses",
  "meuble-tv": "Maison > Salon > Meubles TV",
  "table-appoint": "Maison > Salon > Tables d’appoint",
  "table-a-manger": "Maison > Salon > Tables à manger",
  buffet: "Maison > Salon > Buffets",
  console: "Maison > Salon > Consoles",
  "table-de-chevet": "Maison > Chambre > Tables de chevet",
  coiffeuse: "Maison > Chambre > Coiffeuses",
  commode: "Maison > Chambre > Commodes",
  armoire: "Maison > Chambre > Armoires",
  banc: "Maison > Chambre > Bancs",
  "meuble-chaussures": "Maison > Entrée > Meubles à chaussures",
  casiers: "Maison > Entrée > Casiers",
  bureau: "Maison > Bureau > Bureaux",
  caisson: "Maison > Bureau > Caissons",
  etagere: "Maison > Rangement > Étagères",
};

const GOOGLE_CATEGORY: Partial<Record<ProductTypeSlug, string>> = {
  "table-basse": "Furniture > Living Room Furniture > Coffee Tables",
  "meuble-tv": "Furniture > Living Room Furniture > Entertainment Centers & TV Stands",
  "table-appoint": "Furniture > Living Room Furniture > End Tables",
  "table-a-manger": "Furniture > Kitchen & Dining Furniture > Dining Tables",
  buffet: "Furniture > Living Room Furniture > Sideboards & Buffets",
  console: "Furniture > Living Room Furniture > Console Tables",
  "table-de-chevet": "Furniture > Bedroom Furniture > Nightstands",
  coiffeuse: "Furniture > Bedroom Furniture > Dressers",
  commode: "Furniture > Bedroom Furniture > Dressers",
  armoire: "Furniture > Bedroom Furniture > Armoires & Wardrobes",
  banc: "Furniture > Living Room Furniture",
  "meuble-chaussures": "Furniture > Storage Furniture",
  casiers: "Furniture > Storage Furniture",
  bureau: "Furniture > Office Furniture > Desks",
  caisson: "Furniture > Office Furniture",
  etagere: "Furniture > Storage Furniture > Bookcases",
};

export function merchantProductType(product: Product) {
  const path = product.productType ? PRODUCT_TYPE_PATH[product.productType] : undefined;
  return path ?? "Maison > Mobilier";
}

export function googleProductCategory(product: Product) {
  const path = product.productType ? GOOGLE_CATEGORY[product.productType] : undefined;
  return path ?? "Furniture";
}
