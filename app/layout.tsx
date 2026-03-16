import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Suspense } from "react";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://learn-sci.vercel.app"),
  title: {
    default: "LearnSci - Computer-Assisted Learning",
    template: "%s · LearnSci",
  },
  description:
    "Learn basic science topics with Igbo terminology support and adaptive quiz feedback.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    title: "LearnSci - Computer-Assisted Learning",
    description:
      "Learn basic science topics with Igbo terminology support and adaptive quiz feedback.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnSci",
    description: "Science learning with Igbo terminology support.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`${fraunces.variable} ${plusJakarta.variable}`}>
      <body className='font-body bg-ink-950 text-ink-100 antialiased'>
        <SessionProvider>
          <ReduxProvider>
            <Suspense>{children}</Suspense>
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
