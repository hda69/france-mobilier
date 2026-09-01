"use client";

import type { ReactNode } from "react";
import { openCookieConsent } from "@/lib/cookie-consent";

export function CookieManageButton({
  className,
  children = "Cookies",
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={openCookieConsent}>
      {children}
    </button>
  );
}
