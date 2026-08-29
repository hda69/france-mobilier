import { NextResponse } from "next/server";
import { z } from "zod";
import { saveContactMessage } from "@/lib/contact";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000),
});

const hits = new Map<string, { count: number; ts: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return true;
  }
  if (row.count >= 5) return false;
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

  try {
    await saveContactMessage(parsed.data);
  } catch (error) {
    console.error("[contact] persist failed", error);
    return NextResponse.json({ error: "Unable to store message" }, { status: 500 });
  }

  console.info("[contact]", {
    name: parsed.data.name,
    email: parsed.data.email,
    messageLength: parsed.data.message.length,
  });

  return NextResponse.json({ ok: true });
}
