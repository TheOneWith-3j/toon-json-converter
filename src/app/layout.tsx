import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "./ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toon-json-converter.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JSON ↔ TOON Converter",
    template: "%s | JSON ↔ TOON Converter",
  },
  description:
    "Fast, private JSON ↔ TOON conversion with verification, schema insights, batch processing, and local-first project storage.",
  applicationName: "TOONWORKS",
  keywords: [
    "JSON to TOON",
    "TOON to JSON",
    "data conversion",
    "schema inspection",
    "developer tools",
  ],
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JSON ↔ TOON Converter",
    description:
      "A private, local-first converter for structured data workflows with verification and diffing.",
    url: "/",
    siteName: "TOONWORKS",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "TOONWORKS app icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON ↔ TOON Converter",
    description:
      "Convert JSON and TOON with trust, validation, and a local-first workflow.",
    images: ["/icon-512.png"],
    creator: "@TheOneWith-3j",
  },
  icons: {
    icon: "/icon-192.png",
    shortcut: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#171717",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
