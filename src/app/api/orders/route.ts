import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { auth, prepareAuth } from "@/lib/auth";
import { listOrdersForAccount, ORDER_ACCESS_COOKIE } from "@/lib/orders";

export async function GET() {
  await prepareAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  const jar = await cookies();
  const orders = await listOrdersForAccount({
    userId: session?.user?.id,
    email: session?.user?.email,
    cookie: jar.get(ORDER_ACCESS_COOKIE)?.value,
  });
  return NextResponse.json({ orders, signedIn: Boolean(session?.user) });
}
