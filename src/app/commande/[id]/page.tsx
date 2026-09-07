import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { OrderSummary } from "@/components/order-summary";
import { getAdminSession } from "@/lib/admin";
import { auth, prepareAuth } from "@/lib/auth";
import { getAuthorizedOrder, getPublicPaidOrder, ORDER_ACCESS_COOKIE } from "@/lib/orders";
import { formatParisYmd } from "@/lib/orders/business-days";
import { SHIPPING_OFFERED_SENTENCE } from "@/lib/shipping-zone";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { t } = await searchParams;
  await prepareAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  const admin = await getAdminSession();
  const cookie = (await cookies()).get(ORDER_ACCESS_COOKIE)?.value;
  const order = admin
    ? await getPublicPaidOrder(id)
    : await getAuthorizedOrder(id, {
        token: t,
        cookie,
        userId: session?.user?.id,
        email: session?.user?.email,
      });
  if (!order) notFound();

  return (
    <div className="container-page max-w-xl space-y-6 py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Votre commande</h1>
      <OrderSummary order={order} />
      <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted sm:p-5">
        <p className="font-medium text-navy">Suivi</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            Paiement reçu
            {order.paidAt
              ? ` le ${new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(new Date(order.paidAt))}`
              : ""}
            .
          </li>
          <li>
            Préparation ({order.fulfillment.handlingBusinessDays} jours ouvrés)
            {order.fulfillment.phase === "preparing"
              ? ` — en cours, fin prévue le ${formatParisYmd(order.fulfillment.expectedPreparedOn)}`
              : " — terminée"}
            .
          </li>
          <li>
            Expédition
            {order.fulfillment.phase === "shipped"
              ? " — colis remis au transporteur"
              : order.fulfillment.phase === "prepared"
                ? " — en cours"
                : " — après la préparation"}
            .
          </li>
          <li>
            Acheminement : {order.fulfillment.transitBusinessDays} jours ouvrés après expédition. Un
            numéro de suivi n’est envoyé que lorsqu’il est communiqué par le transporteur.
          </li>
        </ol>
        <p className="mt-3">{SHIPPING_OFFERED_SENTENCE}</p>
      </div>
      <Link href="/compte" className="btn btn-secondary inline-flex">
        Toutes mes commandes
      </Link>
    </div>
  );
}
