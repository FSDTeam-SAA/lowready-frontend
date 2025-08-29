import { FacilityAbout } from "@/components/facilities/details/FacilityAbout";
import { FacilityAmenities } from "@/components/facilities/details/FacilityAmenities";
import { FacilityBooking } from "@/components/facilities/details/FacilityBooking";
import { FacilityCare } from "@/components/facilities/details/FacilityCare";
import  FacilityFAQ  from "@/components/facilities/details/FacilityFAQ";
import { FacilityGallery } from "@/components/facilities/details/FacilityGallery";
import { FacilityOverview } from "@/components/facilities/details/FacilityOverview";
import { FacilityReviews } from "@/components/facilities/details/FacilityReviews";
import { FacilitySimilar } from "@/components/facilities/details/FacilitySimilar";
import { FacilityTour } from "@/components/facilities/details/FacilityTour";
import React from "react";

const page = () => {
  return (
    <section>
        <div className="container mx-auto">

      <FacilityGallery />
      <FacilityOverview />
      <FacilityCare />
      <FacilityAmenities />
      <FacilityAbout />
      <FacilityTour />
      <FacilityBooking />
      <FacilityReviews />
      <FacilitySimilar />
      <FacilityFAQ />
        </div>
    </section>
  );
};

export default page;
