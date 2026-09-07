"use client";

import { useEffect } from "react";
import { adsConsentState } from "@/lib/ads/gtag";
import { COOKIE_CONSENT_EVENT, readCookieConsent, type CookieConsent } from "@/lib/cookie-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function applyConsent(consent: CookieConsent | null) {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", adsConsentState(consent?.optional === true));
}

export function GoogleConsentSync() {
  useEffect(() => {
    applyConsent(readCookieConsent());
    const onChange = (event: Event) => {
      applyConsent((event as CustomEvent<CookieConsent>).detail ?? readCookieConsent());
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);
  return null;
}
