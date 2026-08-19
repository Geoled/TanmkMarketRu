import type { Metadata } from "next";
import { Rajdhani, Inter, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/context/ToastContext";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: ["400"],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${rajdhani.variable} ${inter.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--tactical-black)] text-[var(--text-primary)] font-sans">
        {/* Noise overlay for gritty military feel */}
        <div className="noise-overlay pointer-events-none fixed inset-0 z-50" />
        
        {/* Scan line effect (optional, can be toggled) */}
        <div className="scan-line" />
        
        <ToastProvider>
          <Header />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
