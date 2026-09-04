"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProApproved } from "@/lib/use-pro-approved";
import { authClient } from "@/lib/auth-client";

const allLinks = [
  { href: "/compte", label: "Tableau de bord", key: "apercu" },
  { href: "/compte#commandes", label: "Mes commandes", key: "commandes" },
  { href: "/compte/devis", label: "Mes devis", key: "devis" },
  { href: "/compte/factures", label: "Mes factures", key: "factures" },
  { href: "/compte/entreprise", label: "Mon entreprise", key: "entreprise" },
] as const;

function currentFromPath(pathname: string) {
  if (pathname.startsWith("/compte/devis")) return "devis";
  if (pathname.startsWith("/compte/factures")) return "factures";
  if (pathname.startsWith("/compte/entreprise")) return "entreprise";
  return "apercu";
}

export function AccountNav() {
  const pathname = usePathname() || "/compte";
  const current = currentFromPath(pathname);
  const { data: session, isPending } = authClient.useSession();
  const proApproved = useProApproved();

  if (!session?.user && !isPending) return null;

  const links = proApproved
    ? allLinks
    : allLinks.filter((link) => link.key === "apercu" || link.key === "entreprise");

  return (
    <nav className="flex flex-nowrap gap-2 overflow-x-auto pb-0.5" aria-label="Mon espace">
      {links.map((link) => {
        const isCurrent = current === link.key;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isCurrent ? "page" : undefined}
            className={`account-nav-link shrink-0 rounded-full px-3.5 py-1.5 text-sm ${
              isCurrent ? "" : "bg-cream"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
