"use client";

import type { ReactNode } from "react";
import { AccountNav } from "@/components/account-nav";

export function CompteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="container-page space-y-8 py-14">
      <AccountNav />
      {children}
    </div>
  );
}
