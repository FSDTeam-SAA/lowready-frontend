"use client";

import { useState, useEffect } from "react";

import FacilityCard from "@/components/shared/facility-card";
import { CarouselNavigation } from "@/components/shared/carousel-navigation";
import { useQuery } from "@tanstack/react-query";
import { getallFacilities } from "@/lib/api";

export function FacilitySimilar() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  const { data: facilitie } = useQuery({
    queryKey: ["facilitiescard"],
    queryFn: () => getallFacilities(),
  });
  const facilities = facilitie?.data || [];
  // Responsive slides calculation
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(3); // Desktop: show 3 cards
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2); // Tablet: show 2 cards
      } else {
        setSlidesToShow(1); // Mobile: show 1 card
      }
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const totalSlides = Math.max(0, facilities.length - slidesToShow + 1);

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleSeeDetails = (facilityId: string) => {
    console.log("See details for facility:", facilityId);
    // Implement navigation to facility details page
  };

  const handleBookTour = (facilityId: string) => {
    console.log("Book tour for facility:", facilityId);
    // Implement booking functionality
  };

  if (facilities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No facilities available</p>
      </div>
    );
  }

  return (
    <section>
      <div className="container bg-white mx-auto">
        <div className="  mx-auto py-8 lg:py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-playfair text-gray-900 mb-4">
              Similar <span className="text-green-600">Facilities</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover highlighted senior living options carefully tailored to
              meet the needs of families and their loved ones.
            </p>
          </div>
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentSlide * (100 / slidesToShow)
                }%)`,
              }}
            >
              {facilities.map((facility) => (
                <div
                  key={facility._id}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <FacilityCard
                    facility={facility}
                    onSeeDetails={() => handleSeeDetails(facility._id)}
                    onBookTour={() => handleBookTour(facility._id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {totalSlides > 1 && (
            <CarouselNavigation
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onDotClick={handleDotClick}
            />
          )}
        </div>
      </div>
    </section>
  );
}
