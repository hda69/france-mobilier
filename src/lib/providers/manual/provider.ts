import type {
  CreateProviderOrderInput,
  FulfillmentProvider,
  ProviderOrderResult,
  ProviderTrackingResult,
} from "@/lib/providers/types";
import { buckydropProvider } from "@/lib/providers/buckydrop/provider";
import { isKeywordPlannerConfigured } from "@/lib/keywords/google-ads";
import { isCheckoutEnabled, isStripeConfigured, stripeMode } from "@/lib/payments/stripe";

export class ManualFulfillmentProvider implements FulfillmentProvider {
  id = "manual";
  name = "Manual";

  async createOrder(): Promise<ProviderOrderResult> {
    return { status: "NOT_CONFIGURED", message: "Manual fulfillment is operator-driven." };
  }

  async getOrder(): Promise<ProviderOrderResult> {
    return { status: "NOT_CONFIGURED", message: "Manual fulfillment has no remote order API." };
  }

  async getTracking(): Promise<ProviderTrackingResult> {
    return {
      status: "NOT_CONFIGURED",
      message: "Manual tracking is entered by an operator.",
    };
  }
}

export const manualProvider = new ManualFulfillmentProvider();

export function getFulfillmentProvider(id?: string | null): FulfillmentProvider {
  if (id === "buckydrop") return buckydropProvider;
  return manualProvider;
}

export function getIntegrationStatuses() {
  return {
    checkout: isCheckoutEnabled() ? (stripeMode() === "test" ? "TEST" : "ENABLED") : "PRE_LAUNCH",
    stripe: isStripeConfigured() ? (stripeMode() === "test" ? "TEST" : "CONFIGURED") : "NOT_CONFIGURED",
    buckydrop:
      process.env.BUCKYDROP_ENABLED === "true" &&
      process.env.BUCKYDROP_APP_CODE &&
      process.env.BUCKYDROP_APP_SECRET &&
      process.env.BUCKYDROP_API_BASE_URL
        ? "CONFIGURED"
        : "NOT_CONFIGURED",
    merchantCenter:
      process.env.GOOGLE_MERCHANT_FEED_ENABLED === "true" ? "ENABLED" : "NOT_CONFIGURED",
    keywordPlanner: isKeywordPlannerConfigured() ? "CONFIGURED" : "NOT_CONFIGURED",
  };
}
