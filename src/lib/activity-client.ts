export function reportShopActivity(payload: Record<string, unknown>) {
  void fetch("/api/activity", {
    method: "POST",
    credentials: "same-origin",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* tracking must not block the shop */
  });
}
