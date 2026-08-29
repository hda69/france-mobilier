import type { Metadata } from "next";
import Link from "next/link";
import { store } from "@/config/store";

export const metadata: Metadata = {
  title: "Plateforme",
  description: "Architecture e-commerce sur mesure — France Home & Garden.",
  robots: { index: true, follow: true },
};

const rows = [
  ["Type de plateforme", "E-commerce retail développé sur mesure"],
  ["Marché principal", "France / Europe"],
  ["Catégorie", "Home & Garden"],
  ["Paiement", "Stripe prévu (non activé)"],
  ["Sourcing / fulfillment", "BuckyDrop OpenAPI — accès demandé, en attente des identifiants"],
  ["Acquisition", "Google Shopping / Merchant Center (feed prêt, désactivé)"],
];

export default function PlatformPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-sm uppercase tracking-[0.16em] text-muted">Platform</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">
        Plateforme e-commerce propriétaire pour le marché français
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
        {store.storeName} est une plateforme retail développée sur mesure, centrée sur les produits
        maison, organisation et bureau. L’architecture est conçue pour la synchronisation catalogue,
        la prise de commande, le fulfillment et le suivi logistique via API.
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b border-border last:border-0">
                <th className="w-[40%] px-5 py-4 font-medium">{label}</th>
                <td className="px-5 py-4 text-muted">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Capacités techniques</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Backend applicatif custom (Next.js App Router)</li>
            <li>Gestion catalogue / fiches produit</li>
            <li>Domaine commande (statuts, articles, adresse, fulfillment)</li>
            <li>Abstraction provider sourcing (BuckyDrop stub)</li>
            <li>Paiement Stripe prévu, non activé</li>
            <li>SEO / données structurées / feed Merchant XML (désactivé)</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">BuckyDrop</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Demande d’accès OpenAPI déposée. Aucun endpoint n’est inventé : le client HTTP restera
            inactif jusqu’à la documentation officielle, l’APPcode et l’APPsecret. Usage prévu :
            catalogue, commandes, colis, logistique, stock et webhooks.
          </p>
          <p className="mt-4 text-sm font-medium">BuckyDrop API integration: access requested</p>
          <p className="mt-2 text-sm text-muted">Status: WAITING_FOR_CREDENTIALS</p>
        </div>
      </section>

      <p className="mt-10 text-sm text-muted">
        Contact technique : <Link href="/contact" className="underline">{store.supportEmail}</Link>
      </p>
    </div>
  );
}
