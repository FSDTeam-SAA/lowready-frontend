"use client";
import React from "react";
import { FacilityGallery } from "./FacilityGallery";

import { FacilityCare } from "./FacilityCare";

import { FacilityAbout } from "./FacilityAbout";
import { FacilityTour } from "./FacilityTour";
import { FacilityBooking } from "./FacilityBooking";
import { FacilityReviews } from "./FacilityReviews";
import { FacilitySimilar } from "./FacilitySimilar";
import FacilityFAQ from "./FacilityFAQ";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getbySigleFacilities } from "@/lib/api";
import { useSession } from "next-auth/react";

const FacilitiesDetails = () => {
  const pathName = usePathname();
  const { data: session } = useSession();

  // Extract the last segment from the pathname
  const lastSegment = pathName?.split("/").filter(Boolean).pop() || "";
  
  const { data, isLoading } = useQuery({
    queryKey: ["facilities"],
    queryFn: () => getbySigleFacilities(lastSegment),
  });

  if (isLoading) {
    <div>
      <h2>Loding....</h2>
    </div>;
  }

  return (
    <div className="">
      <FacilityGallery data={data}  isLoading={isLoading}/>
      <FacilityCare data={data} />
      <FacilityAbout />
      <FacilityTour data={data} />
      <FacilityBooking data={data} facilityId={lastSegment || ""} />
      <FacilityReviews
        userId={session?.user.id || ""}
        facilityId={lastSegment}
      />
      <FacilitySimilar />
      <FacilityFAQ />
    </div>
  );
};

export default FacilitiesDetails;
