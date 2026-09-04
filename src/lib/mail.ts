import nodemailer from "nodemailer";
import { store } from "@/config/store";
import { SHIPPING_OFFERED_SENTENCE, shippingCountryName } from "@/lib/shipping-zone";

export function isMailConfigured() {
  if (process.env.RESEND_API_KEY?.trim()) return true;
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

function fromAddress() {
  return (
    process.env.MAIL_FROM?.trim() || `France Mobilier <${store.supportEmail}>`
  );
}

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  if (!isMailConfigured()) return false;
  const to = input.to.trim().toLowerCase();
  if (!to) return false;

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [to],
        reply_to: store.supportEmail,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[mail] resend failed", res.status, detail.slice(0, 400));
      return false;
    }
    return true;
  }

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return false;

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: fromAddress(),
    to,
    replyTo: store.supportEmail,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
  return true;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatEuros(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
}

const NAVY = "#0b2b55";
const CREAM = "#f7f5f1";
const MUTED = "#5c6170";
const BORDER = "#e4e0d8";
const LOGO_URL = `${store.domain.replace(/\/$/, "")}${store.logoPath}`;

function emailButton(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${NAVY};color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;padding:12px 22px;border-radius:6px">${escapeHtml(label)}</a>`;
}

/** Gabarit HTML des e-mails clients — logo, couleurs boutique, compatible Gmail. */
function layoutCustomerEmail(input: { preheader: string; title: string; body: string }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(input.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:#ffffff;border:1px solid ${BORDER};border-radius:12px;">
        <tr>
          <td align="center" style="padding:28px 32px 20px;border-bottom:1px solid ${BORDER};">
            <a href="${escapeHtml(store.domain)}" style="text-decoration:none">
              <img src="${escapeHtml(LOGO_URL)}" alt="${escapeHtml(store.storeName)}" width="168" style="display:block;width:168px;height:auto;border:0;margin:0 auto">
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;font-family:Georgia,'Times New Roman',serif;color:#222222;">
            ${input.body}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 24px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:${MUTED};border-top:1px solid ${BORDER};">
            ${escapeHtml(store.supportEmail)} — ${escapeHtml(store.supportHoursShort)}<br>
            ${escapeHtml(store.storeName)} · ${escapeHtml(store.companyCity)}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export type OrderPaidEmail = {
  email: string;
  name: string;
  reference: string;
  amountCents: number;
  phone?: string | null;
  line1: string;
  postalCode: string;
  city: string;
  country?: string | null;
  items: { name: string; quantity: number; unitPriceCents: number }[];
  viewUrl: string;
  loginUrl: string;
  testMode: boolean;
  temporaryPassword?: string | null;
  companyName?: string | null;
  siren?: string | null;
};

export function buildOrderPaidEmail(order: OrderPaidEmail) {
  const lines = order.items
    .map(
      (item) =>
        `${item.name} × ${item.quantity} — ${formatEuros(item.unitPriceCents * item.quantity)}`,
    )
    .join("\n");
  const subject = order.testMode
    ? `Commande test ${order.reference} — ${store.storeName}`
    : `Commande ${order.reference} — ${store.storeName}`;
  const intro = order.testMode
    ? "Paiement test enregistré. Aucun débit réel n’a été effectué."
    : "Nous avons bien reçu votre paiement.";
  const destination = `${order.line1}, ${order.postalCode} ${order.city}${
    order.country ? `, ${shippingCountryName(order.country)}` : ""
  }${order.phone ? `, ${order.phone}` : ""}`;
  const text = [
    `Bonjour ${order.name},`,
    "",
    intro,
    `Référence : ${order.reference}`,
    `Total TTC : ${formatEuros(order.amountCents)}`,
    "",
    lines,
    "",
    `Livraison : ${destination}`,
    ...(order.companyName && order.siren
      ? [`Facture entreprise : ${order.companyName} (SIREN ${order.siren})`]
      : []),
    `Voir la commande : ${order.viewUrl}`,
    "",
    ...(order.temporaryPassword
      ? [
          "Un compte a été créé pour suivre vos commandes :",
          `Identifiant : ${order.email}`,
          `Mot de passe provisoire : ${order.temporaryPassword}`,
          `Connexion : ${order.loginUrl}`,
          "Une fois connecté, changez ce mot de passe dans Mon compte.",
          "",
        ]
      : []),
    `${SHIPPING_OFFERED_SENTENCE} Un suivi sera envoyé après l’expédition.`,
    `SAV : ${store.supportEmail}`,
  ].join("\n");

  const rows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">${escapeHtml(item.name)} × ${item.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;text-align:right">${formatEuros(item.unitPriceCents * item.quantity)}</td>
        </tr>`,
    )
    .join("");

  const accountBlock = order.temporaryPassword
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 8px;background:${CREAM};border:1px solid ${BORDER};border-radius:8px">
        <tr>
          <td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#222">
            <strong>Votre compte</strong><br>
            Identifiant : ${escapeHtml(order.email)}<br>
            Mot de passe provisoire : ${escapeHtml(order.temporaryPassword)}<br>
            <span style="color:${MUTED};font-size:13px">Une fois connecté, changez ce mot de passe dans Mon compte.</span>
            <div style="margin-top:14px">${emailButton(order.loginUrl, "Se connecter")}</div>
          </td>
        </tr>
      </table>`
    : "";

  const body = `
    ${
      order.testMode
        ? `<p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${NAVY};background:${CREAM};border:1px solid ${BORDER};border-radius:8px;padding:10px 14px">Paiement test — aucun débit réel.</p>`
        : ""
    }
    <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:${NAVY}">Commande confirmée</p>
    <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#222">Bonjour ${escapeHtml(order.name)},<br>${escapeHtml(intro)}</p>
    <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#222">
      <strong>Référence ${escapeHtml(order.reference)}</strong><br>
      Total TTC ${formatEuros(order.amountCents)}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 18px">${rows}</table>
    <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:${MUTED}">
      Livraison : ${escapeHtml(destination)}
      ${
        order.companyName && order.siren
          ? `<br>Facture entreprise : ${escapeHtml(order.companyName)} (SIREN ${escapeHtml(order.siren)})`
          : ""
      }
    </p>
    <p style="margin:0 0 8px">${emailButton(order.viewUrl, "Voir la commande")}</p>
    ${accountBlock}
    <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:${MUTED}">${escapeHtml(SHIPPING_OFFERED_SENTENCE)} Un suivi sera envoyé après l’expédition.</p>
  `;

  return {
    subject,
    text,
    html: layoutCustomerEmail({
      preheader: `${intro} Référence ${order.reference}.`,
      title: subject,
      body,
    }),
  };
}

export async function sendOrderPaidEmail(order: OrderPaidEmail) {
  const built = buildOrderPaidEmail(order);
  return sendMail({ to: order.email, subject: built.subject, text: built.text, html: built.html });
}

export async function sendProAccessActivatedEmail(input: {
  email: string;
  companyName: string;
  siren: string;
}) {
  const accountUrl = `${store.domain.replace(/\/$/, "")}/compte/entreprise`;
  const subject = `Accès professionnel activé — ${store.storeName}`;
  const text = [
    `Votre accès professionnel est ouvert pour ${input.companyName} (SIREN ${input.siren}).`,
    "Connectez-vous avec le même e-mail et le même mot de passe.",
    "Les prochaines commandes passées depuis ce compte portent le nom et le SIREN de l’entreprise.",
    `Espace : ${accountUrl}`,
  ].join("\n");
  const html = layoutCustomerEmail({
    preheader: `Accès pro ouvert pour ${input.companyName}.`,
    title: subject,
    body: `
    <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:${NAVY}">Accès professionnel activé</p>
    <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#222">
      Votre compte est désormais un compte professionnel, sans changer d’e-mail ni de mot de passe.
    </p>
    <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#222">
      Entreprise : ${escapeHtml(input.companyName)}<br>
      SIREN : ${escapeHtml(input.siren)}
    </p>
    <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#222">
      Les prochaines commandes passées depuis ce compte portent le nom et le SIREN de l’entreprise. Les prix du catalogue restent TTC.
    </p>
    <p style="margin:0">${emailButton(accountUrl, "Voir mon espace")}</p>
    `,
  });
  const sent = await sendMail({ to: input.email, subject, text, html });
  await sendMail({
    to: store.supportEmail,
    subject: `Nouvel accès pro — ${input.companyName}`,
    text: `${input.email} · ${input.companyName} · SIREN ${input.siren}`,
    html: `<p>${escapeHtml(input.email)} · ${escapeHtml(input.companyName)} · SIREN ${escapeHtml(input.siren)}</p>`,
  });
  return sent;
}

export async function sendPasswordResetEmail(input: { email: string; url: string }) {
  const subject = `Réinitialiser votre mot de passe — ${store.storeName}`;
  const text = [
    "Vous avez demandé à réinitialiser le mot de passe de votre compte.",
    "Ouvrez ce lien pour en choisir un nouveau. Il expire dans une heure.",
    input.url,
    "Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.",
  ].join("\n");
  const html = layoutCustomerEmail({
    preheader: "Lien pour choisir un nouveau mot de passe.",
    title: subject,
    body: `
    <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:${NAVY}">Nouveau mot de passe</p>
    <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#222">
      Vous avez demandé à réinitialiser le mot de passe de votre compte ${escapeHtml(store.storeName)}.
    </p>
    <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#222">
      Ce lien expire dans une heure. Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.
    </p>
    <p style="margin:0">${emailButton(input.url, "Choisir un nouveau mot de passe")}</p>
    `,
  });
  return sendMail({ to: input.email, subject, text, html });
}
