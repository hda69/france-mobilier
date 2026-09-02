import type { ShippingCountryCode } from "@/lib/shipping-zone";
import { SHIPPING_COUNTRY_CODES } from "@/lib/shipping-zone";

function compactPhone(raw: string) {
  return raw.trim().replace(/[.\s\-()/]/g, "");
}

function stripLeadingZero(rest: string) {
  return rest.startsWith("0") ? rest.slice(1) : rest;
}

function parseNational(country: ShippingCountryCode, rest: string): string | null {
  const national = stripLeadingZero(rest);
  if (country === "FR") {
    return /^[1-9]\d{8}$/.test(national) ? `+33${national}` : null;
  }
  if (country === "BE") {
    if (/^4\d{8}$/.test(national) || /^[1-9]\d{7}$/.test(national)) return `+32${national}`;
    return null;
  }
  if (country === "CH") {
    return /^[1-9]\d{8}$/.test(national) ? `+41${national}` : null;
  }
  if (country === "LU") {
    return /^[1-9]\d{7,8}$/.test(national) ? `+352${national}` : null;
  }
  if (/^[1-9]\d{7}$/.test(national)) return `+377${national}`;
  if (/^[1-9]\d{8}$/.test(national)) return `+33${national}`;
  return null;
}

type PrefixRule = { country: ShippingCountryCode; prefixes: string[] };

const PREFIX_RULES: PrefixRule[] = [
  { country: "LU", prefixes: ["+352", "00352", "352"] },
  { country: "MC", prefixes: ["+377", "00377", "377"] },
  { country: "BE", prefixes: ["+32", "0032"] },
  { country: "CH", prefixes: ["+41", "0041"] },
  { country: "FR", prefixes: ["+33", "0033"] },
];

function detectPrefix(compact: string): { country: ShippingCountryCode; rest: string } | null {
  for (const rule of PREFIX_RULES) {
    for (const prefix of rule.prefixes) {
      if (!compact.startsWith(prefix)) continue;
      const rest = compact.slice(prefix.length);
      if (rest.length < 8) continue;
      return { country: rule.country, rest };
    }
  }
  if (compact.startsWith("32") && compact.length >= 10) {
    return { country: "BE", rest: compact.slice(2) };
  }
  if (compact.startsWith("41") && compact.length >= 11) {
    return { country: "CH", rest: compact.slice(2) };
  }
  if (compact.startsWith("33") && compact.length >= 11) {
    return { country: "FR", rest: compact.slice(2) };
  }
  return null;
}

export function normalizeFrenchPhone(raw: string): string | null {
  return parseNational("FR", compactPhone(raw));
}

/** Accepts the destination country first, then other numbers from the shipping zone. */
export function normalizeZonePhone(raw: string, preferred: ShippingCountryCode): string | null {
  const compact = compactPhone(raw);
  if (!compact) return null;

  const prefixed = detectPrefix(compact);
  if (prefixed) return parseNational(prefixed.country, prefixed.rest);

  const order: ShippingCountryCode[] = [
    preferred,
    ...SHIPPING_COUNTRY_CODES.filter((code) => code !== preferred),
  ];
  for (const country of order) {
    const parsed = parseNational(country, compact);
    if (parsed) return parsed;
  }
  return null;
}
