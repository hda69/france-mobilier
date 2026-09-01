import nodemailer from "nodemailer";
import { store } from "@/config/store";

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

export async function sendOrderPaidEmail(order: {
  email: string;
  name: string;
  reference: string;
  amountCents: number;
  line1: string;
  postalCode: string;
  city: string;
  items: { name: string; quantity: number; unitPriceCents: number }[];
  viewUrl: string;
  testMode: boolean;
}) {
  const lines = order.items
    .map(
      (item) =>
        `${item.name} × ${item.quantity} — ${formatEuros(item.unitPriceCents * item.quantity)}`,
    )
    .join("\n");
  const subject = order.testMode
    ? `Commande test ${order.reference} — France Mobilier`
    : `Commande ${order.reference} — France Mobilier`;
  const intro = order.testMode
    ? "Paiement test enregistré. Aucun débit réel n’a été effectué."
    : "Nous avons bien reçu votre paiement.";
  const text = [
    `Bonjour ${order.name},`,
    "",
    intro,
    `Référence : ${order.reference}`,
    `Total TTC : ${formatEuros(order.amountCents)}`,
    "",
    lines,
    "",
    `Livraison : ${order.line1}, ${order.postalCode} ${order.city}`,
    `Voir la commande : ${order.viewUrl}`,
    "",
    `Livraison offerte en France métropolitaine. Un suivi sera envoyé après l’expédition.`,
    `SAV : ${store.supportEmail}`,
  ].join("\n");

  const rows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e4e0d8">${escapeHtml(item.name)} × ${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #e4e0d8;text-align:right">${formatEuros(item.unitPriceCents * item.quantity)}</td></tr>`,
    )
    .join("");

  const html = `<div style="font-family:Georgia,serif;color:#222;max-width:560px">
<p>Bonjour ${escapeHtml(order.name)},</p>
<p>${intro}</p>
<p><strong>Référence ${escapeHtml(order.reference)}</strong><br>Total TTC ${formatEuros(order.amountCents)}</p>
<table style="width:100%;border-collapse:collapse">${rows}</table>
<p>Livraison : ${escapeHtml(order.line1)}, ${escapeHtml(order.postalCode)} ${escapeHtml(order.city)}</p>
<p><a href="${escapeHtml(order.viewUrl)}">Voir la commande</a></p>
<p style="color:#5c6170;font-size:14px">Livraison offerte en France métropolitaine. Un suivi sera envoyé après l’expédition.</p>
<p style="color:#5c6170;font-size:14px">${escapeHtml(store.supportEmail)} — ${escapeHtml(store.supportHoursShort)}</p>
</div>`;

  return sendMail({ to: order.email, subject, text, html });
}
