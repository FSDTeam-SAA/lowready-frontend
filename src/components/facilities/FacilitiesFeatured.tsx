"use client";


import React from "react";
import FacilityCard from "../shared/facility-card";
import { useQuery } from "@tanstack/react-query";
import { getallFacilities } from "@/lib/api";

const FacilitiesFeatured = () => {
const {
    data: facilitie,
    isLoading: facilitiesLoading,
  
  } = useQuery({
    queryKey: ["facilitiescard"],
    queryFn: () => getallFacilities(),
  });
  const handleSeeDetails = (id: string) => {
    console.log("See details clicked for", id);
  };

  const handleBookTour = (id: string) => {
    console.log("Book tour clicked for", id);
  };
 
  if(facilitiesLoading){
    <h2>Loading..............</h2>
  }
  
const facilities = facilitie?.data || [];
  return (
    <section>
      <div className="container mx-auto py-8 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="text-green-600">Facilities</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover highlighted senior living options carefully tailored to
            meet the needs of families and their loved ones.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((item) => (
            <FacilityCard
              key={item._id}
              facility={item}
              onSeeDetails={() => handleSeeDetails(item._id)}
              onBookTour={() => handleBookTour(item._id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesFeatured;
