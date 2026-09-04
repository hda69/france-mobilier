"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AccountNav } from "@/components/account-nav";
import { authClient } from "@/lib/auth-client";

type Invoice = {
  id: string;
  number: string;
  orderId: string;
  amountCents: number;
  issuedAt: string;
};

export default function CompteFacturesPage() {
  const { data: session, isPending } = authClient.useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/pro-access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setApproved(data?.request?.status === "approved"))
      .catch(() => {});
    fetch("/api/invoices")
      .then((res) => (res.ok ? res.json() : { invoices: [] }))
      .then((data) => setInvoices(data.invoices || []))
      .catch(() => {});
  }, [session?.user]);

  if (isPending) return <div className="container-page py-14 text-muted">Chargement…</div>;
  if (!session?.user) {
    return (
      <div className="container-page py-14">
        <Link href="/connexion?next=/compte/factures" className="btn btn-primary inline-flex">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page space-y-8 py-14">
      <AccountNav current="factures" proApproved={approved} />
      <h1 className="text-3xl font-semibold tracking-tight">Mes factures</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium">Facture</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Commande</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={5}>
                  Aucune facture pour le moment. Elles apparaissent après un paiement professionnel.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{invoice.number}</td>
                  <td className="px-4 py-3">{new Date(invoice.issuedAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">
                    <Link href={`/commande/${invoice.orderId}`} className="underline">
                      Voir
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {(invoice.amountCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/api/invoices/${invoice.id}`} className="btn btn-secondary px-3 py-1.5 text-sm">
                      Télécharger
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
