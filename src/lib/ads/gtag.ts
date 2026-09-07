export const GOOGLE_ADS_ID = "AW-17892406919";
export const GOOGLE_ADS_PURCHASE_SEND_TO = "AW-17892406919/RYdXCMq7ydYcEIft4dNC";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const gtagBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
`.trim();

export function adsConsentState(granted: boolean) {
  const value = granted ? "granted" : "denied";
  return {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  };
}

export function trackPurchaseConversion(input: {
  transactionId: string;
  valueEur: number;
  newCustomer?: boolean;
}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const transactionId = input.transactionId.trim();
  if (!transactionId) return;
  const key = `fm-ads-purchase:${transactionId}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore quota / private mode */
  }
  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_PURCHASE_SEND_TO,
    transaction_id: transactionId,
    value: Math.round(input.valueEur * 100) / 100,
    currency: "EUR",
    ...(typeof input.newCustomer === "boolean" ? { new_customer: input.newCustomer } : {}),
  });
}
