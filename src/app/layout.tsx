import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/provider/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair", // ✅ fixed typo
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // ✅ better to include multiple
});

export const metadata: Metadata = {
  title: "Alhub",
  description: "Developed by EliteStack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
