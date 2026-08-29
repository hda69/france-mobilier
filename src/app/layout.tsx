import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { store } from "@/config/store";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(store.domain),
  title: {
    default: `${store.storeName} — Maison & organisation`,
    template: `%s | ${store.storeName}`,
  },
  description: store.storeTagline,
  alternates: { canonical: store.domain },
  openGraph: {
    title: store.storeName,
    description: store.storeTagline,
    locale: "fr_FR",
    type: "website",
    url: store.domain,
    siteName: store.storeName,
    images: [{ url: store.logoPath, alt: store.storeName }],
  },
  twitter: {
    card: "summary",
    title: store.storeName,
    description: store.storeTagline,
    images: [store.logoPath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: store.storeName,
    url: store.domain,
    email: store.supportEmail,
    logo: `${store.domain}${store.logoPath}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: store.companyCity,
      postalCode: store.companyPostalCode,
      addressCountry: store.country,
    },
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: store.storeName,
    url: store.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: `${store.domain}/recherche?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <CartProvider>
          <SiteHeader />
          <main className="min-h-[70vh]">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
