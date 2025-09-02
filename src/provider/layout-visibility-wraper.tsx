"use client"
import React from "react";
import Navbar from "@/components/shared/Navbar";
import TopBanner from "@/components/shared/TopBanner";
import Footer from "@/components/shared/Footer";
import { usePathname } from "next/navigation";

const HIDDEN_ROUTES = [
  "/signup",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/verify",
  "/verify-otp",
  "/dashboard",
  '/signinaspage',
  '/forget-otp',
  '/forget-password',
  
];

const LayoutVisibilityWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const shouldHideLayout = HIDDEN_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  return (
    <>
        {!shouldHideLayout && <TopBanner />}
      {!shouldHideLayout && <Navbar />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default LayoutVisibilityWrapper;
