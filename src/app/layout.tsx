import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { AppToaster } from "@/components/layout/toaster";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const headingFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuildSight Tracker",
  description: "Labor productivity and construction progress monitoring MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
