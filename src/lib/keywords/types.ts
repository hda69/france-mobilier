export type KeywordSearchMode = "metrics" | "ideas";

export type KeywordMetric = {
  keyword: string;
  closeVariants: string[];
  avgMonthlySearches: number | null;
  threeMonthChangePct: number | null;
  yoyChangePct: number | null;
  competition: "HIGH" | "MEDIUM" | "LOW" | "UNSPECIFIED";
  competitionIndex: number | null;
  lowTopOfPageBidEur: number | null;
  highTopOfPageBidEur: number | null;
  monthlySearches: Array<{ year: number; month: number; searches: number }>;
};

export const KEYWORD_PLANNER_PRESETS = [
  "meuble chaussures",
  "table de chevet",
  "chariot cuisine",
  "meuble colonne",
  "meuble d'entrée",
  "chevet",
  "étagère salle de bain",
  "bureau assis debout",
];
