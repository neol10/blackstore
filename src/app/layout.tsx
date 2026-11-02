import type { Metadata, Viewport } from "next";
import { Manrope, Oswald } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soublackstore.com.br"),
  title: "BLACK STORE | Moda Masculina, Casual e Esportiva",
  description:
    "Conheça a Black Store e explore opções de moda masculina, tênis, camisetas, bermudas e peças esportivas. Entre em contato e descubra as coleções.",
  keywords: [
    "moda masculina",
    "streetwear masculino",
    "tênis casuais",
    "camisas esportivas",
    "camisetas oversized",
    "Black Store",
    "elegância masculina",
  ],
  authors: [{ name: "BLACK STORE" }],
  creator: "BLACK STORE",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://soublackstore.com.br",
    title: "BLACK STORE | Moda Masculina, Casual e Esportiva",
    description:
      "Conheça a Black Store e explore opções de moda masculina, tênis, camisetas, bermudas e peças esportivas. Entre em contato e descubra as coleções.",
    siteName: "BLACK STORE",
    images: [
      {
        url: "/logo.jpg",
        width: 600,
        height: 600,
        alt: "BLACK STORE - Elegância em cada detalhe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BLACK STORE | Moda Masculina, Casual e Esportiva",
    description: "Moda masculina para quem valoriza estilo, conforto e personalidade.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/logo.jpg?v=2", type: "image/jpeg" },
      { url: "/favicon.ico?v=2" },
    ],
    shortcut: "/logo.jpg?v=2",
    apple: "/logo.jpg?v=2",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${oswald.variable}`}>
      <head>
        <link rel="icon" href="/logo.jpg?v=2" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg?v=2" />
      </head>
      <body className="bg-brand-black text-brand-offwhite font-sans antialiased selection:bg-brand-offwhite selection:text-brand-black min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
