import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin";
import {
  fetchKeywordHistoricalMetrics,
  fetchKeywordIdeas,
  isKeywordPlannerConfigured,
  listMissingKeywordPlannerEnv,
  parseKeywordList,
} from "@/lib/keywords/google-ads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  keywords: z.string().min(1).max(4000),
  mode: z.enum(["metrics", "ideas"]).optional(),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }
  return NextResponse.json({
    configured: isKeywordPlannerConfigured(),
    missing: listMissingKeywordPlannerEnv(),
    geo: "France",
    language: "Français",
    network: "Google",
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  }
  if (!isKeywordPlannerConfigured()) {
    return NextResponse.json(
      {
        error: "Google Ads n’est pas encore branché. Ajoutez les variables GOOGLE_ADS_* puis relancez.",
        missing: listMissingKeywordPlannerEnv(),
      },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const keywords = parseKeywordList(parsed.data.keywords);
  const mode = parsed.data.mode || "metrics";
  const max = mode === "ideas" ? 10 : 40;
  if (keywords.length === 0) {
    return NextResponse.json({ error: "Saisissez au moins un mot-clé." }, { status: 400 });
  }
  if (keywords.length > max) {
    return NextResponse.json(
      { error: `Maximum ${max} mots-clés pour ce mode.` },
      { status: 400 },
    );
  }

  try {
    const results =
      mode === "ideas"
        ? await fetchKeywordIdeas(keywords)
        : await fetchKeywordHistoricalMetrics(keywords);
    return NextResponse.json({
      ok: true,
      mode,
      requested: keywords,
      results,
      geo: "France",
      language: "Français",
      network: "Google",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "La requête Keyword Planner a échoué.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
