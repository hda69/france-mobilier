export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { startOrderLifecycleScheduler } = await import("@/lib/orders/lifecycle");
  startOrderLifecycleScheduler();
}
