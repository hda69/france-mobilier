import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import { activitySummary, listRecentActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const [events, summary] = await Promise.all([listRecentActivity(100), activitySummary()]);
  return NextResponse.json({ events, summary });
}
