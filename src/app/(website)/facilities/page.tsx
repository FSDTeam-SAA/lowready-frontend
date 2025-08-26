import FacilitiesBrowse from "@/components/facilities/FacilitiesBrowse";
import FacilitiesDecide from "@/components/facilities/FacilitiesDecide";
import FacilitiesFeatured from "@/components/facilities/FacilitiesFeatured";
import FacilitiesHero from "@/components/facilities/FacilitiesHero";
import FamiliesSaying from "@/components/facilities/FamiliesSaying";
import ResidentialFacility from "@/components/facilities/ResidentialFacility";
import React from "react";

const page = () => {
  return (
    <main>
      <FacilitiesHero />
      <FacilitiesFeatured />
      <FacilitiesDecide />
      <FacilitiesBrowse />
      <FamiliesSaying />
      <ResidentialFacility />
    </main>
  );
};

export default page;
