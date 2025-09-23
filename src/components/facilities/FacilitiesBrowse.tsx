"use client";

import FacilityCard from "../shared/facility-card";
import { getallFacilities } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";

const ITEMS_PER_PAGE = 6; // how many facilities per page

const FacilitiesBrowse = () => {
  const [page, setPage] = useState(1);

  const { data: facilitie, isLoading } = useQuery({
    queryKey: ["facilitiescard"],
    queryFn: () => getallFacilities(),
  });

  const handleSeeDetails = (id: string) => {
    console.log("See details clicked for", id);
  };

  const handleBookTour = (id: string) => {
    console.log("Book tour clicked for", id);
  };

  const facilities = facilitie?.data || [];

  // pagination logic
  const totalPages = Math.ceil(facilities.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedFacilities = facilities.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <section>
      <div className="container mx-auto py-8 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="md:text-4xl font-bold text-gray-900 mb-4">
            Browse Our
            <span className="text-green-600 pl-2">Featured Facilities</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find a wide range of assisted living facilities tailored to
            different needs and preferences.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center">Loading facilities...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch lg:grid-cols-3 gap-6">
              {paginatedFacilities.map((item) => (
                <FacilityCard
                  key={item._id}
                  facility={item}
                  onSeeDetails={() => handleSeeDetails(item._id)}
                  onBookTour={() => handleBookTour(item._id)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <Button
                    key={num}
                    variant={page === num ? "default" : "outline"}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FacilitiesBrowse;
