import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth, prepareAuth } from "@/lib/auth";
import { sendProAccessActivatedEmail } from "@/lib/mail";
import { getProAccessByUserId, markProAccessApproved, upsertProAccessRequest } from "@/lib/pro-access";
import { isValidSiren, isValidSiret, lookupSiren, normalizeSiren } from "@/lib/siren";

const schema = z.object({
  siren: z.string().trim().min(9).max(14),
  siret: z.string().trim().max(20).optional(),
  companyName: z.string().trim().max(180).optional(),
  vatNumber: z.string().trim().max(20).optional(),
  message: z.string().trim().max(1500).optional(),
});

function publicRow(row: NonNullable<Awaited<ReturnType<typeof getProAccessByUserId>>>) {
  return {
    siren: row.siren,
    siret: row.siret,
    companyName: row.companyName,
    legalName: row.legalName,
    city: row.city,
    status: row.status,
    updatedAt: row.updatedAt,
  };
}

export async function GET() {
  await prepareAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }
  let row = await getProAccessByUserId(session.user.id);
  if (row?.status === "eligible") {
    row = await markProAccessApproved(session.user.id);
    if (row) {
      await sendProAccessActivatedEmail({
        email: session.user.email,
        companyName: row.companyName || row.legalName,
        siren: row.siren,
      });
    }
  }
  return NextResponse.json({ request: row ? publicRow(row) : null });
}

export async function POST(request: Request) {
  await prepareAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const existing = await getProAccessByUserId(session.user.id);
  if (existing?.status === "approved") {
    return NextResponse.json({ request: publicRow(existing) });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Vérifiez les champs du formulaire." }, { status: 400 });
  }

  const siren = normalizeSiren(parsed.data.siren);
  if (!isValidSiren(siren)) {
    return NextResponse.json(
      { error: "Ce SIREN n’est pas valide. Saisissez les 9 chiffres de l’entreprise." },
      { status: 400 },
    );
  }

  const siret = parsed.data.siret ? parsed.data.siret.replace(/\D/g, "") : "";
  if (siret && !isValidSiret(siret, siren)) {
    return NextResponse.json(
      { error: "Ce SIRET n’est pas valide, ou ne correspond pas au SIREN." },
      { status: 400 },
    );
  }

  const company = await lookupSiren(siren);
  if (!company) {
    return NextResponse.json(
      {
        error:
          "Nous n’avons pas trouvé cette entreprise dans le répertoire Sirene. Vérifiez le SIREN, sans pièce d’identité.",
      },
      { status: 422 },
    );
  }

  if (!company.active) {
    return NextResponse.json(
      { error: "Cette entreprise n’est plus active. L’accès pro n’est pas ouvert sur ce SIREN." },
      { status: 422 },
    );
  }

  const row = await upsertProAccessRequest({
    userId: session.user.id,
    siren: company.siren,
    siret: siret || company.siret,
    companyName: parsed.data.companyName?.trim() || company.legalName,
    legalName: company.legalName,
    city: company.city,
    activity: company.activity,
    vatNumber: parsed.data.vatNumber?.trim(),
    message: parsed.data.message?.trim(),
    status: "approved",
  });

  await sendProAccessActivatedEmail({
    email: session.user.email,
    companyName: row.companyName || row.legalName,
    siren: row.siren,
  });

  return NextResponse.json({ request: publicRow(row), ok: true });
}
