import { googleMerchantFeedResponse } from "@/lib/merchant/feed-http";

export async function GET() {
  return googleMerchantFeedResponse();
}
