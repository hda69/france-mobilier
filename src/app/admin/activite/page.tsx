import type { Metadata } from "next";
import Link from "next/link";
import { AdminActivityLive } from "@/components/admin-activity-live";
import { getAdminSession } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Activité en direct",
  robots: { index: false, follow: false },
};

export default async function AdminActivityPage() {
  const admin = await getAdminSession();
  if (!admin) {
    return (
      <div className="container-page py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Activité en direct</h1>
        <p className="mt-3 text-muted">
          <Link href="/connexion?next=/admin/activite" className="underline">
            Connexion administrateur
          </Link>
        </p>
        <p className="mt-2 text-sm text-muted">
          Connectez-vous avec hugo.rusu@gmail.com pour voir les ajouts au panier et les achats.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-sm">
        <Link href="/admin" className="text-navy underline-offset-2 hover:underline">
          ← Admin
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Activité en direct</h1>
      <p className="mt-2 text-sm text-muted">
        Ajouts au panier et achats payés, à mesure qu’ils arrivent.
      </p>
      <div className="mt-8">
        <AdminActivityLive />
      </div>
    </div>
  );
}
