import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { recordAddToCart, recordBeginCheckout, recordProductView } from "@/lib/activity";
import { auth, prepareAuth } from "@/lib/auth";

const schema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("add_to_cart"),
    productId: z.string().trim().min(1).max(80),
    productName: z.string().trim().min(1).max(180),
    quantity: z.number().int().min(1).max(20).optional(),
    priceEur: z.number().min(0).max(20000),
    variantId: z.string().trim().max(80).optional().nullable(),
  }),
  z.object({
    type: z.literal("product_view"),
    productId: z.string().trim().min(1).max(80),
    productName: z.string().trim().min(1).max(180),
    priceEur: z.number().min(0).max(20000).optional(),
  }),
  z.object({
    type: z.literal("begin_checkout"),
    productName: z.string().trim().min(1).max(500),
    quantity: z.number().int().min(1).max(200),
    priceEur: z.number().min(0).max(200000),
  }),
]);

const hits = new Map<string, { count: number; ts: number }>();

function rateLimit(ip: string, max: number) {
  const now = Date.now();
  const key = `${ip}:${max}`;
  const row = hits.get(key);
  if (!row || now - row.ts > 60_000) {
    hits.set(key, { count: 1, ts: now });
    return true;
  }
  if (row.count >= max) return false;
  row.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(
    body && typeof body === "object" && !("type" in body)
      ? { ...body, type: "add_to_cart" }
      : body,
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const max = parsed.data.type === "product_view" ? 80 : 40;
  if (!rateLimit(ip, max)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  await prepareAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? null;

  if (parsed.data.type === "product_view") {
    await recordProductView({
      productId: parsed.data.productId,
      productName: parsed.data.productName,
      priceEur: parsed.data.priceEur,
    });
  } else if (parsed.data.type === "begin_checkout") {
    await recordBeginCheckout({
      productName: parsed.data.productName,
      quantity: parsed.data.quantity,
      priceEur: parsed.data.priceEur,
      email,
    });
  } else {
    await recordAddToCart({
      productId: parsed.data.productId,
      productName: parsed.data.productName,
      quantity: parsed.data.quantity ?? 1,
      priceEur: parsed.data.priceEur,
      variantId: parsed.data.variantId,
      email,
    });
  }
  return NextResponse.json({ ok: true });
}
