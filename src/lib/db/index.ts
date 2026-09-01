import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import fs from "node:fs";
import path from "node:path";

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  return `file:${path.join(dataDir, "maisonora.db")}`;
}

const globalForDb = globalThis as unknown as {
  libsql?: Client;
};

function getClient() {
  if (!globalForDb.libsql) {
    globalForDb.libsql = createClient({
      url: resolveDatabaseUrl(),
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
  return globalForDb.libsql;
}

export const db = drizzle(getClient(), { schema });

let migrated = false;

export async function ensureDatabase() {
  if (migrated) return;
  const client = getClient();
  await client.batch(
    [
      `CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS session (
        id TEXT PRIMARY KEY NOT NULL,
        expires_at INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS account (
        id TEXT PRIMARY KEY NOT NULL,
        account_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
        access_token TEXT,
        refresh_token TEXT,
        id_token TEXT,
        access_token_expires_at INTEGER,
        refresh_token_expires_at INTEGER,
        scope TEXT,
        password TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS verification (
        id TEXT PRIMARY KEY NOT NULL,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER,
        updated_at INTEGER
      )`,
      `CREATE TABLE IF NOT EXISTS purchase (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL,
        order_id TEXT,
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS review (
        id TEXT PRIMARY KEY NOT NULL,
        product_id TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL,
        title TEXT,
        body TEXT NOT NULL,
        verified_purchase INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at INTEGER NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_review_product ON review(product_id, status)`,
      `CREATE INDEX IF NOT EXISTS idx_purchase_user_product ON purchase(user_id, product_id)`,
      `CREATE TABLE IF NOT EXISTS stock_alert (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_slug TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_stock_alert_email_product ON stock_alert(email, product_id)`,
      `CREATE TABLE IF NOT EXISTS contact_message (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS pro_access_request (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL UNIQUE REFERENCES user(id) ON DELETE CASCADE,
        siren TEXT NOT NULL,
        siret TEXT,
        company_name TEXT NOT NULL,
        legal_name TEXT NOT NULL,
        city TEXT,
        activity TEXT,
        vat_number TEXT,
        message TEXT,
        status TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS shop_order (
        id TEXT PRIMARY KEY NOT NULL,
        stripe_session_id TEXT UNIQUE,
        user_id TEXT REFERENCES user(id) ON DELETE SET NULL,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        line1 TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL DEFAULT 'FR',
        amount_cents INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'eur',
        status TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        paid_at INTEGER
      )`,
      `CREATE TABLE IF NOT EXISTS shop_order_item (
        id TEXT PRIMARY KEY NOT NULL,
        order_id TEXT NOT NULL REFERENCES shop_order(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price_cents INTEGER NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_shop_order_email ON shop_order(email)`,
    ],
    "write",
  );
  const info = await client.execute("PRAGMA table_info(shop_order)");
  const cols = new Set(info.rows.map((row) => String(row.name)));
  const extras: string[] = [];
  if (!cols.has("reference")) extras.push("ALTER TABLE shop_order ADD COLUMN reference TEXT");
  if (!cols.has("view_token")) extras.push("ALTER TABLE shop_order ADD COLUMN view_token TEXT");
  if (!cols.has("confirmation_sent_at")) {
    extras.push("ALTER TABLE shop_order ADD COLUMN confirmation_sent_at INTEGER");
  }
  if (extras.length > 0) await client.batch(extras, "write");
  await client.execute(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_shop_order_reference ON shop_order(reference)",
  );
  migrated = true;
}
