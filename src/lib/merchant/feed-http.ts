import { NextResponse } from "next/server";
import { buildGoogleMerchantFeedXml, merchantFeedStatus } from "@/lib/merchant/feed";
import { businessChecks, returnChecks } from "@/lib/merchant/readiness";

export function googleMerchantFeedResponse() {
  const status = merchantFeedStatus();
  if (status.blocked) {
    return NextResponse.json(
      {
        status: "BLOCKED",
        enabled: status.enabled,
        businessReady: status.businessReady,
        offerCount: status.offerCount,
        blockers: [...businessChecks(), ...returnChecks()]
          .filter((item) => item.level === "BLOCKER")
          .map((item) => item.id),
        message:
          "Feed non publié : flags incomplets, identité/politiques bloquantes, ou aucun produit merchant-ready.",
      },
      { status: 503 },
    );
  }

  return new NextResponse(buildGoogleMerchantFeedXml(), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
