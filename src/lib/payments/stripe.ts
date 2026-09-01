import Stripe from "stripe";
import { store } from "@/config/store";

let stripeClient: Stripe | null = null;

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY?.trim() || "";
}

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";
}

export function stripeMode(): "test" | "live" | "none" {
  const secret = getStripeSecretKey();
  if (secret.startsWith("sk_test_")) return "test";
  if (secret.startsWith("sk_live_")) return "live";
  return "none";
}

export function isStripeConfigured() {
  const secret = getStripeSecretKey();
  const publishable = getStripePublishableKey();
  if (!secret || !publishable) return false;
  if (secret.startsWith("sk_test_")) return publishable.startsWith("pk_test_");
  if (secret.startsWith("sk_live_")) return publishable.startsWith("pk_live_");
  return false;
}

/** Test keys enable checkout. Live keys stay off until STORE_CHECKOUT_ENABLED=true. */
export function isCheckoutEnabled() {
  if (!isStripeConfigured()) return false;
  if (stripeMode() === "test") return true;
  return process.env.STORE_CHECKOUT_ENABLED === "true";
}

export function getStripe() {
  const key = getStripeSecretKey();
  if (!key) throw new Error("Stripe is not configured.");
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

export function getSiteUrl() {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || process.env.BETTER_AUTH_URL || "").replace(
    /\/$/,
    "",
  );
  if (fromEnv) return fromEnv;
  return store.domain.replace(/\/$/, "");
}

export function eurosToCents(amount: number) {
  return Math.round(amount * 100);
}

export function getStripePublicStatus() {
  if (!isStripeConfigured()) return "NOT_CONFIGURED" as const;
  if (!isCheckoutEnabled()) return "PRE_LAUNCH" as const;
  return stripeMode() === "test" ? ("TEST" as const) : ("READY" as const);
}
