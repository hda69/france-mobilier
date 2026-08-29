import type { MetadataRoute } from "next";
import { store } from "@/config/store";
import { collections } from "@/config/store";
import { listProducts } from "@/lib/products/repository";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = store.domain.replace(/\/$/, "");
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/nouveautes",
    "/cart",
    "/legal",
    "/privacy",
    "/terms",
    "/returns",
    "/shipping",
    "/recherche",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
  }));

  const collectionRoutes = collections.map((c) => ({
    url: `${base}/collections/${c.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes = listProducts().map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
