import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { OrderSummary } from "@/components/order-summary";
import { getAdminSession } from "@/lib/admin";
import { auth, prepareAuth } from "@/lib/auth";
import { getAuthorizedOrder, getPublicPaidOrder, ORDER_ACCESS_COOKIE } from "@/lib/orders";

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
      <p className="text-sm leading-relaxed text-muted">
        Livraison offerte en France métropolitaine. Un suivi sera communiqué après l’expédition.
      </p>
      <Link href="/compte" className="btn btn-secondary inline-flex">
        Toutes mes commandes
      </Link>
    </div>
  );
}
