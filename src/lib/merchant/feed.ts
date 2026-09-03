import { store } from "@/config/store";
import { productHeroImage } from "@/lib/products/presentation";
import { listProducts } from "@/lib/products/repository";
import type { Product } from "@/lib/types/commerce";
import { SHIPPING_COUNTRIES } from "@/lib/shipping-zone";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function availability(product: Product) {
  if (product.availabilityStatus === "available") return "in_stock";
  if (product.availabilityStatus === "out_of_stock") return "out_of_stock";
  return "preorder";
}

function itemXml(product: Product, base: string) {
  const hero = productHeroImage(product);
  const image = hero ? `${base}${hero}` : "";
  const lines = [
    `<item>`,
    `<g:id>${escapeXml(product.id)}</g:id>`,
    `<g:title>${escapeXml(product.name)}</g:title>`,
    `<g:description>${escapeXml(product.description)}</g:description>`,
    `<g:link>${escapeXml(`${base}/products/${product.slug}`)}</g:link>`,
    image ? `<g:image_link>${escapeXml(image)}</g:image_link>` : "",
    `<g:condition>new</g:condition>`,
    `<g:availability>${availability(product)}</g:availability>`,
    `<g:price>${(product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : product.price
    ).toFixed(2)} EUR</g:price>`,
    product.compareAtPrice != null && product.compareAtPrice > product.price
      ? `<g:sale_price>${product.price.toFixed(2)} EUR</g:sale_price>`
      : "",
    `<g:brand>${escapeXml(store.storeName)}</g:brand>`,
    `<g:identifier_exists>false</g:identifier_exists>`,
    product.weight != null ? `<g:shipping_weight>${product.weight} kg</g:shipping_weight>` : "",
    ...SHIPPING_COUNTRIES.map(
      (country) =>
        `<g:shipping><g:country>${country.code}</g:country><g:price>0.00 EUR</g:price></g:shipping>`,
    ),
    `</item>`,
  ];
  return lines.filter(Boolean).join("");
}

/** Only commercially sellable products. Coming-soon items stay out of Merchant. */
export function buildGoogleMerchantFeedXml() {
  const base = store.domain.replace(/\/$/, "");
  const sellable = listProducts().filter((product) => product.availabilityStatus === "available");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">`,
    `<channel>`,
    `<title>${escapeXml(store.storeName)}</title>`,
    `<link>${escapeXml(base)}</link>`,
    `<description>${escapeXml(store.storeTagline)}</description>`,
    ...sellable.map((product) => itemXml(product, base)),
    `</channel>`,
    `</rss>`,
  ].join("");
}
