import { auth, prepareAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

async function withDb<T>(fn: () => Promise<T>) {
  await prepareAuth();
  return fn();
}

export async function GET(request: Request) {
  return withDb(() => handlers.GET(request));
}

export async function POST(request: Request) {
  return withDb(() => handlers.POST(request));
}
