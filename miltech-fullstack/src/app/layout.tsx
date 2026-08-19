import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "MilTech - Военная техника и оборудование",
    template: "%s | MilTech",
  },
  description: "Платформа для покупки и продажи военной техники, запчастей и оборудования. Танки, самолеты, вертолеты, naval техника и комплектующие.",
  keywords: ["военная техника", "танки", "самолеты", "вертолеты", "запчасти", "оборудование", "military", "техника"],
  authors: [{ name: "MilTech Team" }],
  creator: "MilTech",
  publisher: "MilTech",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://miltech.vercel.app",
    siteName: "MilTech",
    title: "MilTech - Военная техника и оборудование",
    description: "Платформа для покупки и продажи военной техники, запчастей и оборудования.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MilTech - Военная техника",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MilTech - Военная техника и оборудование",
    description: "Платформа для покупки и продажи военной техники, запчастей и оборудования.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">{children}</body>
    </html>
  );
}
