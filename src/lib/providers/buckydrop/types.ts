export type BuckyDropCredentials = {
  appCode: string;
  appSecret: string;
  apiBaseUrl: string;
  env: "sandbox" | "production";
};

/** Reserved for future mapped DTOs once OpenAPI is available. */
export type BuckyDropOrderDraft = {
  externalOrderId: string;
  lines: Array<{
    supplierProductId: string;
    supplierVariantId?: string;
    quantity: number;
  }>;
};
