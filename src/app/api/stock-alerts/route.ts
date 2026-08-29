import { NextResponse } from "next/server";
import { z } from "zod";
import { LAUNCH_ALERT_PRODUCT_ID, LAUNCH_ALERT_SLUG } from "@/lib/launch-alert";
import { findProductBySlug } from "@/lib/products/repository";
import { subscribeStockAlert } from "@/lib/stock-alerts";

const schema = z.object({
  email: z.string().trim().email().max(200),
  productSlug: z.string().trim().min(1).max(120),
});

const hits = new Map<string, { count: number; ts: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return true;
  }
  if (row.count >= 8) return false;
  row.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const isLaunch = parsed.data.productSlug === LAUNCH_ALERT_SLUG;
  const product = isLaunch ? null : findProductBySlug(parsed.data.productSlug);
  if (!isLaunch && !product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  await subscribeStockAlert({
    email: parsed.data.email,
    productId: product?.id ?? LAUNCH_ALERT_PRODUCT_ID,
    productSlug: product?.slug ?? LAUNCH_ALERT_SLUG,
  });

  return NextResponse.json({ ok: true });
}
