#!/usr/bin/env node
/**
 * One-shot OAuth for Google Ads Keyword Planner.
 * Requires GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET.
 * Prints a refresh token — do not commit it.
 */
import http from "node:http";
import { URL } from "node:url";

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET?.trim();
const PORT = Number(process.env.GOOGLE_ADS_OAUTH_PORT || 8765);
const REDIRECT_URI = `http://127.0.0.1:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/adwords";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Définissez GOOGLE_ADS_CLIENT_ID et GOOGLE_ADS_CLIENT_SECRET puis relancez.");
  process.exit(1);
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPE);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/oauth2callback") {
    response.writeHead(404);
    response.end();
    return;
  }
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  if (error || !code) {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error || "Code OAuth manquant.");
    server.close();
    process.exit(1);
    return;
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });
    const payload = await tokenResponse.json();
    if (!tokenResponse.ok || !payload.refresh_token) {
      throw new Error(payload.error_description || payload.error || "Pas de refresh token.");
    }
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Jeton reçu. Vous pouvez fermer cet onglet et revenir au terminal.");
    console.log("\nGOOGLE_ADS_REFRESH_TOKEN=" + payload.refresh_token);
    console.log("\nAjoutez-le en local et sur Railway. Ne le commitez pas.\n");
  } catch (err) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Échec de l’échange OAuth. Voir le terminal.");
    console.error(err instanceof Error ? err.message : err);
    server.close();
    process.exit(1);
    return;
  }
  server.close();
  process.exit(0);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Ouvrez cette URL, choisissez le compte Google Ads, puis acceptez :\n");
  console.log(authUrl.toString());
  console.log(`\nEn attente du retour sur ${REDIRECT_URI} …`);
});
