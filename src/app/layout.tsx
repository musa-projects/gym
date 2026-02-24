import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bigvisiongym.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Big Vision Gym | Stronger Every Day",
    template: "%s | Big Vision Gym",
  },
  description:
    "Transform your body and mind at Big Vision Gym. Premium fitness facility with expert trainers, diverse classes, and a powerful community.",
  keywords: [
    "gym",
    "fitness",
    "personal training",
    "HIIT",
    "crossfit",
    "yoga",
    "boxing",
    "membership",
    "workout",
    "strength training",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Big Vision Gym",
    title: "Big Vision Gym | Stronger Every Day",
    description:
      "Transform your body and mind at Big Vision Gym. Premium fitness facility with expert trainers, diverse classes, and a powerful community.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Big Vision Gym",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Vision Gym | Stronger Every Day",
    description:
      "Transform your body and mind at Big Vision Gym. Premium fitness facility with expert trainers, diverse classes, and a powerful community.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#111111",
              border: "1px solid #262626",
              color: "#f5f5f5",
            },
          }}
        />
      </body>
    </html>
  );
}
