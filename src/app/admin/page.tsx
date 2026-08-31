import type { Metadata } from "next";
import Link from "next/link";
import { AdminReviews } from "@/components/admin-reviews";
import { collections } from "@/config/store";
import { getAdminSession, listAdminEmails } from "@/lib/admin";
import { countContactMessages } from "@/lib/contact";
import { listProducts } from "@/lib/products/repository";
import { getIntegrationStatuses } from "@/lib/providers/manual/provider";
import { countProAccessRequests } from "@/lib/pro-access";
import { countPendingReviews, listModerationReviews } from "@/lib/reviews";
import { countStockAlerts, countStockAlertsByProduct } from "@/lib/stock-alerts";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const products = listProducts();
  const statuses = getIntegrationStatuses();
  const admin = await getAdminSession();
  const [alertCount, contactCount, proCount, pendingReviews, alertsByProduct, reviews] =
    await Promise.all([
      countStockAlerts(),
      countContactMessages(),
      countProAccessRequests(),
      countPendingReviews(),
      countStockAlertsByProduct(),
      admin ? listModerationReviews() : Promise.resolve([]),
    ]);
  const sellable = products.filter((p) => p.availabilityStatus === "available").length;
  const adminEmail = listAdminEmails()[0];

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 text-sm text-muted">Vue interne — non indexée. Aucun e-mail ni secret affiché.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Produits</p>
          <p className="mt-1 text-3xl font-semibold">{products.length}</p>
          <p className="mt-1 text-xs text-muted">{sellable} vendable{sellable > 1 ? "s" : ""}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Collections</p>
          <p className="mt-1 text-3xl font-semibold">{collections.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Alertes disponibilité</p>
          <p className="mt-1 text-3xl font-semibold">{alertCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Messages contact</p>
          <p className="mt-1 text-3xl font-semibold">{contactCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Demandes accès pro</p>
          <p className="mt-1 text-3xl font-semibold">{proCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Avis à valider</p>
          <p className="mt-1 text-3xl font-semibold">{pendingReviews}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background/60">
            <tr>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Checkout", statuses.checkout],
              ["Stripe", statuses.stripe],
              ["BuckyDrop API", statuses.buckydrop],
              ["Merchant Center", statuses.merchantCenter],
            ].map(([label, value]) => (
              <tr key={label} className="border-b border-border last:border-0">
                <td className="px-5 py-3">{label}</td>
                <td className="px-5 py-3 font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {alertsByProduct.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background/60">
              <tr>
                <th className="px-5 py-3 font-medium">Produit</th>
                <th className="px-5 py-3 font-medium">Alertes</th>
              </tr>
            </thead>
            <tbody>
              {alertsByProduct.map((row) => (
                <tr key={row.productSlug} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">{row.productSlug}</td>
                  <td className="px-5 py-3 font-medium">{Number(row.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {admin ? (
        <AdminReviews initialReviews={reviews} />
      ) : (
        <section className="mt-10 rounded-2xl border border-border bg-white p-5">
          <h2 className="text-xl font-semibold tracking-tight">Avis clients</h2>
          <p className="mt-2 text-sm text-muted">
            Connectez-vous avec le compte administrateur pour mettre un avis en ligne ou l’archiver.
            {adminEmail ? (
              <>
                {" "}
                <Link href="/connexion?next=/admin" className="text-navy underline-offset-2 hover:underline">
                  Se connecter
                </Link>
              </>
            ) : null}
          </p>
        </section>
      )}

      <p className="mt-6 text-sm text-muted">
        Retour boutique : <Link href="/" className="underline">accueil</Link>
      </p>
    </div>
  );
}
