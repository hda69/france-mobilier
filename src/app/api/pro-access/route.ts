import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth, prepareAuth } from "@/lib/auth";
import { activityLabel, volumeLabel, PRO_ACTIVITY_TYPES, PRO_VOLUME_OPTIONS } from "@/lib/b2b";
import { sendProAccessActivatedEmail, sendProAccessRequestEmails } from "@/lib/mail";
import { normalizeZonePhone } from "@/lib/phone";
import {
  getProAccessByUserId,
  publicProRow,
  upsertProAccessRequest,
} from "@/lib/pro-access";
import { isValidSiren, isValidSiret, lookupSiren, normalizeSiren } from "@/lib/siren";
import { SHIPPING_COUNTRY_CODES, normalizeShippingPostal } from "@/lib/shipping-zone";

const activityValues = PRO_ACTIVITY_TYPES.map((item) => item.value) as [string, ...string[]];
const volumeValues = PRO_VOLUME_OPTIONS.map((item) => item.value) as [string, ...string[]];

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(6).max(30),
  companyName: z.string().trim().min(2).max(180),
  country: z.enum(SHIPPING_COUNTRY_CODES),
  billingLine1: z.string().trim().min(3).max(200),
  billingLine2: z.string().trim().max(200).optional(),
  postalCode: z.string().trim().min(2).max(12),
  city: z.string().trim().min(2).max(80),
  siren: z.string().trim().max(14).optional(),
  siret: z.string().trim().max(20).optional(),
  vatNumber: z.string().trim().max(32).optional(),
  website: z.string().trim().max(180).optional(),
  activity: z.enum(activityValues).optional(),
  activityOther: z.string().trim().max(120).optional(),
  expectedOrderVolume: z.enum(volumeValues).optional(),
  message: z.string().trim().max(1500).optional(),
});

export async function GET() {
  await prepareAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }
  const row = await getProAccessByUserId(session.user.id);
  return NextResponse.json({ request: row ? publicProRow(row) : null });
}

export async function POST(request: Request) {
  await prepareAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const existing = await getProAccessByUserId(session.user.id);
  if (existing?.status === "approved" || existing?.status === "suspended") {
    return NextResponse.json({ request: publicProRow(existing) });
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

  const data = parsed.data;
  const postalCode = normalizeShippingPostal(data.country, data.postalCode);
  const phone = normalizeZonePhone(data.phone, data.country);
  if (!postalCode) {
    return NextResponse.json({ error: "Code postal invalide pour le pays choisi." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "Téléphone invalide pour le pays choisi." }, { status: 400 });
  }

  const french = data.country === "FR" || data.country === "MC";
  let siren = data.siren ? normalizeSiren(data.siren) : "";
  let legalName = data.companyName;
  let city = data.city;
  let activityFromRegistry: string | undefined;
  let siret = data.siret ? data.siret.replace(/\D/g, "") : "";
  let status: "approved" | "pending" = "pending";

  if (french) {
    if (!isValidSiren(siren)) {
      return NextResponse.json(
        { error: "Ce SIREN n’est pas valide. Saisissez les 9 chiffres de l’entreprise." },
        { status: 400 },
      );
    }
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
            "Nous n’avons pas trouvé cette entreprise dans le répertoire Sirene. Vérifiez le SIREN.",
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
    siren = company.siren;
    legalName = company.legalName;
    city = company.city || data.city;
    activityFromRegistry = company.activity;
    siret = siret || company.siret;
    status = "approved";
  }

  const row = await upsertProAccessRequest({
    userId: session.user.id,
    siren: siren || "",
    siret: siret || null,
    companyName: data.companyName,
    legalName,
    city,
    activity: data.activity || activityFromRegistry,
    vatNumber: data.vatNumber,
    message: data.message,
    status,
    firstName: data.firstName,
    lastName: data.lastName,
    phone,
    website: data.website,
    activityOther: data.activity === "autre" ? data.activityOther : null,
    expectedOrderVolume: data.expectedOrderVolume,
    billingLine1: data.billingLine1,
    billingLine2: data.billingLine2,
    postalCode,
    country: data.country,
  });

  const mailPayload = {
    email: session.user.email,
    firstName: data.firstName,
    lastName: data.lastName,
    companyName: row.companyName || row.legalName,
    phone,
    siren: row.siren || null,
    vatNumber: row.vatNumber,
    activity: activityLabel(data.activity) || data.activityOther || activityFromRegistry,
    volume: volumeLabel(data.expectedOrderVolume),
    status: row.status,
  };

  if (row.status === "approved") {
    await sendProAccessActivatedEmail({
      email: session.user.email,
      firstName: data.firstName,
      companyName: mailPayload.companyName,
      siren: row.siren,
    });
  }
  await sendProAccessRequestEmails(mailPayload);

  return NextResponse.json({ request: publicProRow(row), ok: true });
}
