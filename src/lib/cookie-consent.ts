export const COOKIE_CONSENT_KEY = "francemobilier-cookie-consent";
export const COOKIE_CONSENT_EVENT = "francemobilier:cookie-consent";
export const COOKIE_CONSENT_OPEN_EVENT = "francemobilier:open-cookie-consent";

export type CookieConsent = {
  version: 1;
  necessary: true;
  optional: boolean;
  updatedAt: string;
};

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed?.version !== 1 || typeof parsed.optional !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCookieConsent(optional: boolean): CookieConsent {
  const value: CookieConsent = {
    version: 1,
    necessary: true,
    optional,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }));
  return value;
}

export function hasOptionalCookieConsent() {
  return readCookieConsent()?.optional === true;
}

export function openCookieConsent() {
  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT));
}
