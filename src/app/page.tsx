"use client";

import { FacilitiesCarousel } from "@/components/landing/facilities-carousel";
import FindCare from "@/components/shared/FindPerfectCare";
import Hero from "@/components/shared/Hero";
import Navbar from "@/components/shared/Navbar";
import TopBanner from "@/components/shared/TopBanner";

export default function Home() {
  return (
    <main role="main">
      <TopBanner />
      <Navbar />
      <Hero />
      <FacilitiesCarousel />
      <FindCare />
    </main>
  );
}
