import { NextResponse } from "next/server";

/**
 * Google Merchant feed endpoint — disabled until real sellable products exist.
 */
export async function GET() {
  if (process.env.GOOGLE_MERCHANT_FEED_ENABLED !== "true") {
    return NextResponse.json(
      {
        status: "DISABLED",
        message:
          "Google Merchant feed is disabled until products are commercially available. Set GOOGLE_MERCHANT_FEED_ENABLED=true later.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      status: "NOT_IMPLEMENTED",
      message: "Feed generation will be implemented when live catalog + availability are ready.",
    },
    { status: 501 },
  );
}
