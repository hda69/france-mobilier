"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { KEYWORD_PLANNER_PRESETS, type KeywordMetric } from "@/lib/keywords/types";

type PlannerStatus = {
  configured: boolean;
  missing: string[];
};

function formatCount(value: number | null) {
  if (value === null) return "—";
  return value.toLocaleString("fr-FR");
}

function formatEur(value: number | null) {
  if (value === null) return "—";
  return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function formatPct(value: number | null) {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value} %`;
}

function competitionLabel(value: KeywordMetric["competition"]) {
  if (value === "HIGH") return "Élevée";
  if (value === "MEDIUM") return "Moyenne";
  if (value === "LOW") return "Faible";
  return "—";
}

function Sparkline({ points }: { points: KeywordMetric["monthlySearches"] }) {
  if (points.length < 2) return <span className="text-muted">—</span>;
  const sorted = [...points].sort((a, b) => a.year * 12 + a.month - (b.year * 12 + b.month));
  const max = Math.max(...sorted.map((point) => point.searches), 1);
  const width = 72;
  const height = 22;
  const d = sorted
    .map((point, index) => {
      const x = (index / (sorted.length - 1)) * width;
      const y = height - (point.searches / max) * (height - 2) - 1;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="text-navy">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function pctClass(value: number | null) {
  if (value === null) return "text-muted";
  if (value > 0) return "text-navy";
  if (value < 0) return "text-[var(--accent-red)]";
  return "text-muted";
}

export function AdminKeywordPlanner({
  configured,
  missing,
}: {
  configured: boolean;
  missing: string[];
}) {
  const [keywords, setKeywords] = useState(KEYWORD_PLANNER_PRESETS.join("\n"));
  const [mode, setMode] = useState<"metrics" | "ideas">("metrics");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<KeywordMetric[] | null>(null);
  const [status] = useState<PlannerStatus>({ configured, missing });

  const count = useMemo(() => keywords.split(/[\n,;]+/).map((line) => line.trim()).filter(Boolean).length, [keywords]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, mode }),
      });
      const payload = (await response.json()) as { error?: string; results?: KeywordMetric[] };
      if (!response.ok) {
        setResults(null);
        setError(payload.error || "La recherche a échoué.");
        return;
      }
      setResults(payload.results || []);
    } catch {
      setResults(null);
      setError("Impossible de joindre l’API.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {!status.configured ? (
        <section className="rounded-2xl border border-border bg-white p-5">
          <h2 className="text-xl font-semibold tracking-tight">Brancher Google Ads</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Les volumes mensuels viennent du Keyword Planner officiel (même source que l’écran Google Ads).
            Il faut un jeton développeur + OAuth, une seule fois.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
            <li>
              Ouvrez{" "}
              <a
                href="https://ads.google.com/aw/apicenter"
                className="text-navy underline-offset-2 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                le centre API Google Ads
              </a>{" "}
              et créez un jeton développeur (accès de base suffit pour votre compte).
            </li>
            <li>
              Dans Google Cloud, activez « Google Ads API », créez un client OAuth de type{" "}
              <span className="font-medium text-navy">application de bureau</span>, et ajoutez
              l’URI <code className="rounded bg-cream px-1.5 py-0.5 text-xs">http://127.0.0.1:8765/oauth2callback</code>.
            </li>
            <li>
              En local : <code className="rounded bg-cream px-1.5 py-0.5 text-xs">npm run ads:oauth</code>
              — le script affiche le refresh token.
            </li>
            <li>
              Ajoutez les variables <code className="rounded bg-cream px-1.5 py-0.5 text-xs">GOOGLE_ADS_*</code>{" "}
              en local et sur Railway. L’ID client Ads est en haut à droite du compte (xxx-xxx-xxxx).
            </li>
          </ol>
          {status.missing.length > 0 ? (
            <p className="mt-4 text-sm text-muted">
              Variables manquantes : {status.missing.join(", ")}.
            </p>
          ) : null}
        </section>
      ) : null}

      <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <label htmlFor="keyword-list" className="text-sm font-medium text-navy">
              Mots-clés (France, français, réseau Google)
            </label>
            <p className="mt-1 text-xs text-muted">Un par ligne. {count} saisi{count > 1 ? "s" : ""}.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className={`btn ${mode === "metrics" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setMode("metrics")}
            >
              Volumes
            </button>
            <button
              type="button"
              className={`btn ${mode === "ideas" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setMode("ideas")}
            >
              Idées proches
            </button>
          </div>
        </div>
        <textarea
          id="keyword-list"
          className="input mt-3 min-h-44"
          value={keywords}
          onChange={(event) => setKeywords(event.target.value)}
          spellCheck
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {KEYWORD_PLANNER_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="badge"
              onClick={() => {
                setKeywords((current) => {
                  const lines = current.split("\n").map((line) => line.trim()).filter(Boolean);
                  if (lines.some((line) => line.toLowerCase() === preset.toLowerCase())) return current;
                  return [...lines, preset].join("\n");
                });
              }}
            >
              + {preset}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-primary" disabled={busy || !status.configured}>
            {busy ? "Recherche…" : mode === "ideas" ? "Chercher des idées" : "Voir les volumes"}
          </button>
          {!status.configured ? (
            <p className="text-sm text-muted">La recherche s’active dès que Google Ads est configuré.</p>
          ) : (
            <p className="text-sm text-muted">
              {mode === "ideas" ? "Jusqu’à 10 graines." : "Jusqu’à 40 mots-clés exacts."}
            </p>
          )}
        </div>
        {error ? <p className="mt-3 text-sm text-[var(--accent-red)]">{error}</p> : null}
      </form>

      {results ? (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium">
              {results.length} résultat{results.length > 1 ? "s" : ""} · 12 derniers mois complets
            </h2>
            <p className="text-xs text-muted">France · français · Google</p>
          </div>
          {results.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted">Aucun volume renvoyé pour ces termes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="border-b border-border bg-background/60">
                  <tr>
                    <th className="px-5 py-3 font-medium">Mot-clé</th>
                    <th className="px-5 py-3 font-medium">Recherches / mois</th>
                    <th className="px-5 py-3 font-medium">12 mois</th>
                    <th className="px-5 py-3 font-medium">3 mois</th>
                    <th className="px-5 py-3 font-medium">N-1</th>
                    <th className="px-5 py-3 font-medium">Concurrence</th>
                    <th className="px-5 py-3 font-medium">Enchère bas</th>
                    <th className="px-5 py-3 font-medium">Enchère haut</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row.keyword} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium">{row.keyword}</p>
                        {row.closeVariants.length > 0 ? (
                          <p className="text-xs text-muted">dont {row.closeVariants.join(", ")}</p>
                        ) : null}
                      </td>
                      <td className="px-5 py-3 font-medium">{formatCount(row.avgMonthlySearches)}</td>
                      <td className="px-5 py-3">
                        <Sparkline points={row.monthlySearches} />
                      </td>
                      <td className={`px-5 py-3 ${pctClass(row.threeMonthChangePct)}`}>
                        {formatPct(row.threeMonthChangePct)}
                      </td>
                      <td className={`px-5 py-3 ${pctClass(row.yoyChangePct)}`}>
                        {formatPct(row.yoyChangePct)}
                      </td>
                      <td className="px-5 py-3">
                        {competitionLabel(row.competition)}
                        {row.competitionIndex !== null ? (
                          <span className="text-muted"> · {row.competitionIndex}</span>
                        ) : null}
                      </td>
                      <td className="px-5 py-3">{formatEur(row.lowTopOfPageBidEur)}</td>
                      <td className="px-5 py-3">{formatEur(row.highTopOfPageBidEur)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      <p className="text-sm text-muted">
        Retour : <Link href="/admin" className="underline">admin</Link>
      </p>
    </div>
  );
}
