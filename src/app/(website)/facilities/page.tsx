import FacilitiesBrowse from "@/components/facilities/FacilitiesBrowse";
import FacilitiesDecide from "@/components/facilities/FacilitiesDecide";
import FacilitiesFeatured from "@/components/facilities/FacilitiesFeatured";
import FacilitiesHero from "@/components/facilities/FacilitiesHero";
import ResidentialFacility from "@/components/facilities/ResidentialFacility";
import { ReviewFamilyCarousel } from "@/components/landing/FamilyReview";
import React from "react";

const page = () => {
  return (
    <main>
      <FacilitiesHero />
      <FacilitiesFeatured />
      <FacilitiesDecide />
      <FacilitiesBrowse />
      <ReviewFamilyCarousel />
      <ResidentialFacility />
    </main>
  );
};

export default page;
