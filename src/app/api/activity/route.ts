import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { recordAddToCart } from "@/lib/activity";
import { auth, prepareAuth } from "@/lib/auth";

const schema = z.object({
  productId: z.string().trim().min(1).max(80),
  productName: z.string().trim().min(1).max(180),
  quantity: z.number().int().min(1).max(20).optional(),
  priceEur: z.number().min(0).max(20000),
  variantId: z.string().trim().max(80).optional().nullable(),
});

const hits = new Map<string, { count: number; ts: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return true;
  }
  if (row.count >= 40) return false;
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

  await prepareAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  await recordAddToCart({
    productId: parsed.data.productId,
    productName: parsed.data.productName,
    quantity: parsed.data.quantity ?? 1,
    priceEur: parsed.data.priceEur,
    variantId: parsed.data.variantId,
    email: session?.user?.email ?? null,
  });
  return NextResponse.json({ ok: true });
}
