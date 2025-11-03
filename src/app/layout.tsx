import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
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
  title: "Node.js Secrets Management Tutorial",
  description: "A comprehensive guide to managing secrets in Node.js applications - from bad practices to best practices",
  keywords: ["nodejs", "secrets", "security", "environment variables", "tutorial"],
  authors: [{ name: "Bradley Matera" }],
  openGraph: {
    title: "Node.js Secrets Management Tutorial",
    description: "Learn how to properly manage secrets in Node.js applications",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1 bg-gradient-to-b from-background to-default-50">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
