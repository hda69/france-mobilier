import type { Metadata } from "next";
import Link from "next/link";
import { getIntegrationStatuses } from "@/lib/providers/manual/provider";
import { listProducts } from "@/lib/products/repository";
import { collections } from "@/config/store";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const products = listProducts();
  const statuses = getIntegrationStatuses();

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 text-sm text-muted">Vue interne — non indexée. Aucun secret affiché.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Produits</p>
          <p className="mt-1 text-3xl font-semibold">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Collections</p>
          <p className="mt-1 text-3xl font-semibold">{collections.length}</p>
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

      <p className="mt-6 text-sm text-muted">
        Retour boutique : <Link href="/" className="underline">accueil</Link>
      </p>
    </div>
  );
}
