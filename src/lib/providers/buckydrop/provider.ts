import type {
  CreateProviderOrderInput,
  FulfillmentProvider,
  ProviderOrderResult,
  ProviderTrackingResult,
} from "@/lib/providers/types";

/**
 * BuckyDrop provider stub.
 * Do NOT invent OpenAPI endpoints — wait for official docs.
 */
export class BuckyDropProvider implements FulfillmentProvider {
  id = "buckydrop";
  name = "BuckyDrop";

  private configured() {
    return (
      process.env.BUCKYDROP_ENABLED === "true" &&
      Boolean(process.env.BUCKYDROP_APP_CODE) &&
      Boolean(process.env.BUCKYDROP_APP_SECRET) &&
      Boolean(process.env.BUCKYDROP_API_BASE_URL)
    );
  }

  async createOrder(): Promise<ProviderOrderResult> {
    if (!this.configured()) {
      return {
        status: "NOT_CONFIGURED",
        message:
          "BuckyDrop OpenAPI is not configured. Provide official base URL, app code and secret before enabling.",
      };
    }
    return {
      status: "NOT_CONFIGURED",
      message: "BuckyDrop endpoints are reserved until official OpenAPI documentation is wired.",
    };
  }

  async getOrder(): Promise<ProviderOrderResult> {
    return {
      status: "NOT_CONFIGURED",
      message: "BuckyDrop getOrder requires official OpenAPI documentation.",
    };
  }

  async getTracking(): Promise<ProviderTrackingResult> {
    return {
      status: "NOT_CONFIGURED",
      message: "BuckyDrop getTracking requires official OpenAPI documentation.",
    };
  }
}

export const buckydropProvider = new BuckyDropProvider();
