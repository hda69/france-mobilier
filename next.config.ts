import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: "/collections/maison", destination: "/collections/meubles", permanent: true },
      { source: "/collections/rangement", destination: "/collections/entree-rangement", permanent: true },
      { source: "/returns", destination: "/retours", permanent: true },
    ];
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
