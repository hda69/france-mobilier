"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const STORAGE_KEY = "fm-pro-approved";
let memory: boolean | null = null;

function readStored(): boolean | null {
  if (memory !== null) return memory;
  if (typeof window === "undefined") return null;
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    if (value === "1") memory = true;
    else if (value === "0") memory = false;
  } catch {
    /* ignore */
  }
  return memory;
}

function writeStored(value: boolean) {
  memory = value;
  try {
    sessionStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function useProApproved() {
  const { data: session, isPending } = authClient.useSession();
  const [approved, setApproved] = useState(false);

  useLayoutEffect(() => {
    if (readStored() === true) setApproved(true);
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      writeStored(false);
      setApproved(false);
      return;
    }
    let cancelled = false;
    fetch("/api/pro-access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        const next = data?.request?.status === "approved";
        writeStored(next);
        setApproved(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [session?.user, isPending]);

  return approved;
}
