import Link from "next/link";
import { store } from "@/config/store";

const items = [
  {
    title: "Boutique française",
    text: `${store.companyCity} · SIREN ${store.companySiren}`,
  },
  {
    title: "Prix TTC",
    text: "Le montant est confirmé au paiement.",
  },
  {
    title: "Retours 14 jours",
    text: "Droit de rétractation après réception.",
    href: "/returns",
  },
  {
    title: "Contact",
    text: store.supportEmail,
    href: "/contact",
  },
] as const;

export function TrustBar({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item) => {
        const body = (
          <>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.text}</p>
          </>
        );
        return "href" in item ? (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-2xl border border-border bg-card px-4 py-4 transition hover:border-accent/40"
          >
            {body}
          </Link>
        ) : (
          <div key={item.title} className="rounded-2xl border border-border bg-card px-4 py-4">
            {body}
          </div>
        );
      })}
    </div>
  );
}
