import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AlhHub - Assisted Living Management",
  description: "Manage your assisted living bookings and tours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <> {children}</>;
}
