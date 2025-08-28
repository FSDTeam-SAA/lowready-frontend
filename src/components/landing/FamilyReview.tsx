"use client";

import { useState, useEffect } from "react";
import { reveiwsData } from "@/lib/constant";
import { CarouselNavigation } from "../shared/carousel-navigation";
import { ReviewCard } from "../shared/reviewcard";
import { Review } from "@/types/review";



interface ReviewFamilyCarouselProps {
  reveiws?: Review[];
}

export function ReviewFamilyCarousel({
  reveiws = reveiwsData,
}: ReviewFamilyCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

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

  const totalSlides = Math.max(0, reveiws.length - slidesToShow + 1);

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  

  if (reveiws.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No facilities available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 lg:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
          What Families  <span className="text-green-600">Are Saying</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Hear from families who have found trusted care and peace of mind through ALH Hub.
        </p>
      </div>
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
          }}
        >
          {reveiws.map((reveiw:Review) => (
            <div
              key={reveiw.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / slidesToShow}%` }}
            >
              <ReviewCard 
              review={reveiw} 
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
  );
}
