export const SHIPPING_COUNTRIES = [
  { code: "FR", name: "France métropolitaine" },
  { code: "BE", name: "Belgique" },
  { code: "CH", name: "Suisse" },
  { code: "LU", name: "Luxembourg" },
  { code: "MC", name: "Monaco" },
] as const;

export type ShippingCountryCode = (typeof SHIPPING_COUNTRIES)[number]["code"];

export const SHIPPING_COUNTRY_CODES = SHIPPING_COUNTRIES.map((country) => country.code) as [
  ShippingCountryCode,
  ...ShippingCountryCode[],
];

/** Phrase unique pour les pages et e-mails. */
export const SHIPPING_ZONE_LABEL =
  "France métropolitaine, Belgique, Luxembourg, Monaco et Suisse";

export const SHIPPING_OFFERED_SENTENCE = `Livraison offerte en ${SHIPPING_ZONE_LABEL}.`;

export function isShippingCountry(value: string): value is ShippingCountryCode {
  return SHIPPING_COUNTRIES.some((country) => country.code === value);
}

export function shippingCountryName(code: string) {
  return SHIPPING_COUNTRIES.find((country) => country.code === code)?.name ?? code;
}

export function normalizeShippingPostal(country: ShippingCountryCode, raw: string): string | null {
  const compact = raw.replace(/\s+/g, "").toUpperCase();
  if (!compact) return null;

  if (country === "FR") {
    if (!/^\d{5}$/.test(compact)) return null;
    const dept = compact.slice(0, 2);
    if (dept === "97" || dept === "98") return null;
    return compact;
  }

  if (country === "MC") {
    return /^980\d{2}$/.test(compact) ? compact : null;
  }

  if (country === "BE" || country === "CH") {
    return /^\d{4}$/.test(compact) ? compact : null;
  }

  const luxembourg = compact.replace(/^L-?/, "");
  return /^\d{4}$/.test(luxembourg) ? luxembourg : null;
}

export function shippingFieldHints(country: ShippingCountryCode) {
  if (country === "BE") {
    return { postal: "1000", phone: "0470 12 34 56" };
  }
  if (country === "CH") {
    return { postal: "1200", phone: "079 123 45 67" };
  }
  if (country === "LU") {
    return { postal: "1234", phone: "621 123 456" };
  }
  if (country === "MC") {
    return { postal: "98000", phone: "06 12 34 56 78" };
  }
  return { postal: "69004", phone: "06 12 34 56 78" };
}
