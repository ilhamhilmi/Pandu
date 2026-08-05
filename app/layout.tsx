import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Set NEXT_PUBLIC_SITE_URL in production (e.g. https://pandu.app) for correct canonical/OG URLs.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pandu — Belajar Programming Jadi Terarah",
    template: "%s · Pandu",
  },
  description:
    "Roadmap belajar programming yang dipersonalisasi dengan AI. Susun rencana belajar harian yang terstruktur dan progresif sesuai tujuan, target waktu, dan jam belajarmu.",
  applicationName: "Pandu",
  authors: [{ name: "Tim Pandu" }],
  creator: "Pandu",
  publisher: "Pandu",
  generator: "Next.js",
  keywords: [
    "pandu",
    "Belajar Programming Jadi Terarah",
    "belajar programming",
    "roadmap belajar",
    "roadmap programming",
    "belajar coding",
    "AI learning roadmap",
    "belajar web developer",
    "roadmap otodidak",
    "belajar dari nol",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Pandu — Belajar Programming Jadi Terarah",
    title: "Pandu — Belajar Programming Jadi Terarah",
    description:
      "Roadmap belajar programming yang dipersonalisasi dengan AI. Mulai belajar dengan terarah, tanpa bingung harus mulai dari mana.",
    images: [
      {
        url: "/icon/Pandu_Icon.png",
        width: 2004,
        height: 2028,
        alt: "Pandu — Belajar Programming Jadi Terarah",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Pandu — Belajar Programming Jadi Terarah",
    description:
      "Roadmap belajar programming yang dipersonalisasi dengan AI. Belajar dengan terarah dan progresif.",
    images: ["/icon/Pandu_Icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon/Pandu_Icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2dd4bf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

