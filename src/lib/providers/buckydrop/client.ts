/**
 * Placeholder for future BuckyDrop HTTP client.
 * Missing from repo: official OpenAPI base paths, auth flow, order/tracking schemas.
 */

export type BuckyDropClientConfig = {
  env: "sandbox" | "production";
  appCode: string;
  appSecret: string;
  apiBaseUrl: string;
};

export function getBuckyDropConfig(): BuckyDropClientConfig | null {
  const appCode = process.env.BUCKYDROP_APP_CODE;
  const appSecret = process.env.BUCKYDROP_APP_SECRET;
  const apiBaseUrl = process.env.BUCKYDROP_API_BASE_URL;
  if (!appCode || !appSecret || !apiBaseUrl) return null;
  return {
    env: process.env.BUCKYDROP_ENV === "production" ? "production" : "sandbox",
    appCode,
    appSecret,
    apiBaseUrl,
  };
}

export async function buckydropRequest(): Promise<never> {
  throw new Error(
    "NOT_CONFIGURED: BuckyDrop HTTP client awaits official OpenAPI documentation (paths + auth).",
  );
}
