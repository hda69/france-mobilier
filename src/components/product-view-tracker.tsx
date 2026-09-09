"use client";

import { useEffect, useRef } from "react";
import { reportShopActivity } from "@/lib/activity-client";
import { trackViewItem } from "@/lib/ads/gtag";

export function ProductViewTracker({
  productId,
  productName,
  priceEur,
}: {
  productId: string;
  productName: string;
  priceEur: number;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    const key = `fm-view:${productId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }
    sent.current = true;
    reportShopActivity({
      type: "product_view",
      productId,
      productName,
      priceEur,
    });
    trackViewItem({ productId, productName, priceEur });
  }, [productId, productName, priceEur]);

  return null;
}
