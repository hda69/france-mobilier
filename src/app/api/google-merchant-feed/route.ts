import { NextResponse } from "next/server";
import { buildGoogleMerchantFeedXml } from "@/lib/merchant/feed";
import { listProducts } from "@/lib/products/repository";

/**
 * Google Merchant RSS feed.
 * Stays disabled until GOOGLE_MERCHANT_FEED_ENABLED=true and real sellable products exist.
 */
export async function GET() {
  if (process.env.GOOGLE_MERCHANT_FEED_ENABLED !== "true") {
    return NextResponse.json(
      {
        status: "DISABLED",
        message:
          "Google Merchant feed is disabled until products are commercially available. Set GOOGLE_MERCHANT_FEED_ENABLED=true later.",
        sellableProducts: listProducts().filter((p) => p.availabilityStatus === "available").length,
      },
      { status: 503 },
    );
  }

  const xml = buildGoogleMerchantFeedXml();
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
