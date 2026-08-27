/**
 * Stripe payment scaffolding — no live PaymentIntent while checkout is disabled.
 */

export function isCheckoutEnabled() {
  return process.env.STORE_CHECKOUT_ENABLED === "true";
}

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
}

export async function createPaymentIntent(): Promise<never> {
  if (!isCheckoutEnabled()) {
    throw new Error(
      "Checkout is disabled (STORE_CHECKOUT_ENABLED=false). No PaymentIntent created.",
    );
  }
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured.");
  }
  throw new Error("Stripe PaymentIntent wiring is prepared but not activated for pre-launch.");
}

export function getStripePublicStatus() {
  if (!isCheckoutEnabled()) return "PRE_LAUNCH" as const;
  if (!isStripeConfigured()) return "NOT_CONFIGURED" as const;
  return "READY" as const;
}
