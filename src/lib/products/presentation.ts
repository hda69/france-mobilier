import type {
  Product,
  ProductFaqItem,
  ProductImageAsset,
  ProductMeasures,
} from "@/lib/types/commerce";
import { SHIPPING_ZONE_LABEL } from "@/lib/shipping-zone";

const PARSED_DIMENSION_KEYS = /^(largeur|hauteur|profondeur|pieds|caisson|traverse|hauteur des pieds|hauteur utile)$/i;
const EXTRA_DIMENSION_KEYS = /^(hauteur min\/max|plateau|module)$/i;

export function getImageAsset(product: Product, src: string): ProductImageAsset | undefined {
  return product.imageAssets?.find((asset) => asset.src === src);
}

export function isSupplierDiagram(product: Product, src: string) {
  const asset = getImageAsset(product, src);
  return asset?.role === "dimensions" || Boolean(asset?.issues?.includes("supplier_diagram"));
}

export function hasImageIssues(product: Product, src: string) {
  return Boolean(getImageAsset(product, src)?.issues?.length);
}

function parseCmValue(raw: string): number | undefined {
  const exact = raw.trim().match(/^(\d+(?:[.,]\d+)?)\s*cm$/i);
  if (exact) return Number(exact[1].replace(",", "."));
  const loose = raw.trim().match(/^(\d+(?:[.,]\d+)?)\s*cm\b/i);
  if (loose && !/[–-]/.test(raw)) return Number(loose[1].replace(",", "."));
  return undefined;
}

export function getProductMeasures(product: Product): ProductMeasures {
  const fromSpecs: ProductMeasures = {};
  for (const [key, value] of Object.entries(product.specifications)) {
    const cm = parseCmValue(value);
    if (cm == null) continue;
    const normalized = key.toLowerCase();
    if (normalized === "largeur") fromSpecs.widthCm = cm;
    else if (normalized === "profondeur") fromSpecs.depthCm = cm;
    else if (normalized === "hauteur") fromSpecs.heightCm = cm;
    else if (normalized === "pieds" || normalized === "hauteur des pieds") fromSpecs.legHeightCm = cm;
    else if (normalized === "caisson") fromSpecs.cabinetHeightCm = cm;
    else if (normalized === "traverse") fromSpecs.crossbarFromFloorCm = cm;
    else if (normalized === "hauteur utile") fromSpecs.usefulHeightCm = cm;
  }
  return { ...fromSpecs, ...product.measures };
}

export function measureEntries(product: Product): { label: string; value: string }[] {
  const measures = getProductMeasures(product);
  const rows: { label: string; value: string }[] = [];
  if (measures.widthCm != null) rows.push({ label: "Largeur", value: `${measures.widthCm} cm` });
  if (measures.depthCm != null) rows.push({ label: "Profondeur", value: `${measures.depthCm} cm` });
  if (measures.heightCm != null) rows.push({ label: "Hauteur", value: `${measures.heightCm} cm` });
  if (measures.usefulHeightCm != null) rows.push({ label: "Hauteur utile", value: `${measures.usefulHeightCm} cm` });
  if (measures.cabinetHeightCm != null) rows.push({ label: "Hauteur du caisson", value: `${measures.cabinetHeightCm} cm` });
  if (measures.legHeightCm != null) rows.push({ label: "Hauteur des pieds", value: `${measures.legHeightCm} cm` });
  if (measures.crossbarFromFloorCm != null) {
    rows.push({ label: "Traverse (du sol)", value: `${measures.crossbarFromFloorCm} cm` });
  }
  for (const [key, value] of Object.entries(product.specifications)) {
    if (!value.trim()) continue;
    if (EXTRA_DIMENSION_KEYS.test(key)) rows.push({ label: key, value });
    else if (PARSED_DIMENSION_KEYS.test(key) && parseCmValue(value) == null) {
      rows.push({ label: key, value });
    }
  }
  return rows;
}

export function canDrawDiagram(product: Product) {
  const measures = getProductMeasures(product);
  return measures.widthCm != null && measures.heightCm != null;
}

export function productGalleryImages(product: Product): string[] {
  const hideDiagram = canDrawDiagram(product);
  const visible = product.images.filter((src) => !(hideDiagram && isSupplierDiagram(product, src)));
  return [...visible].sort((a, b) => {
    const flaggedA = hasImageIssues(product, a) ? 1 : 0;
    const flaggedB = hasImageIssues(product, b) ? 1 : 0;
    return flaggedA - flaggedB;
  });
}

export function productHeroImage(product: Product): string {
  return productGalleryImages(product)[0] ?? product.images[0] ?? "";
}

export function productBenefits(product: Product): string[] {
  return (product.benefits ?? product.features).slice(0, 4);
}

export function productHighlights(product: Product): string[] {
  return (product.highlights ?? []).slice(0, 4);
}

export function preparationLabel(product: Product): string | null {
  const min = product.shippingMinDays;
  const max = product.shippingMaxDays;
  if (!min || !max) return null;
  if (min === max) return `environ ${min} jours`;
  return `${min}–${max} jours`;
}

export function specificationRows(product: Product): [string, string][] {
  const dimsShown = measureEntries(product).length > 0;
  return Object.entries(product.specifications).filter(([key, value]) => {
    if (!value.trim() || /^non renseigné$/i.test(value)) return false;
    if (dimsShown && (PARSED_DIMENSION_KEYS.test(key) || EXTRA_DIMENSION_KEYS.test(key))) return false;
    return true;
  });
}

export function productFaqItems(product: Product): ProductFaqItem[] {
  const items: ProductFaqItem[] = [...(product.faq ?? [])];
  const knownQuestions = new Set(items.map((item) => item.question.toLowerCase()));
  const add = (question: string, answer: string) => {
    if (knownQuestions.has(question.toLowerCase())) return;
    items.push({ question, answer });
    knownQuestions.add(question.toLowerCase());
  };

  const dims = measureEntries(product);
  if (dims.length > 0) {
    add(
      "Quelles sont ses dimensions ?",
      dims.map((row) => `${row.label} : ${row.value}`).join(" · "),
    );
  } else if (product.dimensions) {
    add("Quelles sont ses dimensions ?", product.dimensions);
  }

  const prep = preparationLabel(product);
  if (product.madeToOrder && prep) {
    add(
      "Quel est le délai de préparation ?",
      `Chaque article est fabriqué après commande. La préparation est estimée à ${prep}. Le délai de transport s’ajoute ensuite.`,
    );
  }

  if (product.features.some((feature) => /montage/i.test(feature))) {
    add("Le meuble est-il livré monté ?", "Un montage est prévu. Le détail figure dans les caractéristiques.");
  }

  add("Où est-il livré ?", `En ${SHIPPING_ZONE_LABEL}, avec suivi de colis.`);
  add(
    "Comment suivre ma commande ?",
    "Un numéro de suivi est communiqué par e-mail après l’expédition.",
  );
  add(
    "Puis-je retourner l’article ?",
    "Vous disposez de 14 jours à compter de la réception pour vous rétracter, lorsque le droit français de la consommation s’applique.",
  );

  return items;
}
