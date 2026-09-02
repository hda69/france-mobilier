/** National French number: 0X XX XX XX XX. Accepts +33 / 0033 / spaces and separators. */
export function normalizeFrenchPhone(raw: string): string | null {
  let compact = raw.trim().replace(/[.\s\-()/]/g, "");
  if (!compact) return null;

  if (compact.startsWith("0033")) compact = compact.slice(4);
  else if (compact.startsWith("+33")) compact = compact.slice(3);
  else if (compact.startsWith("33") && compact.length >= 11) compact = compact.slice(2);

  if (compact.startsWith("0")) compact = compact.slice(1);
  if (!/^[1-9]\d{8}$/.test(compact)) return null;
  return `0${compact}`;
}
