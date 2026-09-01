import type { MetadataRoute } from "next";
import { store } from "@/config/store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/checkout",
          "/commande",
          "/api/",
          "/compte",
          "/connexion",
          "/inscription",
        ],
      },
    ],
    sitemap: `${store.domain.replace(/\/$/, "")}/sitemap.xml`,
  };
}
