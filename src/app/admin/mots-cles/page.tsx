import type { Metadata } from "next";
import Link from "next/link";
import { AdminKeywordPlanner } from "@/components/admin-keyword-planner";
import { getAdminSession, listAdminEmails } from "@/lib/admin";
import { isKeywordPlannerConfigured, listMissingKeywordPlannerEnv } from "@/lib/keywords/google-ads";

export const metadata: Metadata = {
  title: "Mots-clés",
  robots: { index: false, follow: false },
};

export default async function AdminKeywordsPage() {
  const admin = await getAdminSession();
  const adminEmail = listAdminEmails()[0];

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Volumes de recherche</h1>
      <p className="mt-2 text-sm text-muted">
        Keyword Planner Google Ads — France, français. Vue interne, non indexée.
      </p>

      {admin ? (
        <AdminKeywordPlanner
          configured={isKeywordPlannerConfigured()}
          missing={listMissingKeywordPlannerEnv()}
        />
      ) : (
        <section className="mt-8 rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-muted">
            Connectez-vous avec le compte administrateur pour lancer une recherche.
            {adminEmail ? (
              <>
                {" "}
                <Link href="/connexion?next=/admin/mots-cles" className="text-navy underline-offset-2 hover:underline">
                  Se connecter
                </Link>
              </>
            ) : null}
          </p>
        </section>
      )}
    </div>
  );
}
