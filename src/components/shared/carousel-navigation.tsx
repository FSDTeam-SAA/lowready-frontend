"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

export function CarouselNavigation({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onDotClick,
}: CarouselNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-4  md:mt-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        className="rounded-full w-10 h-10 border-gray-300 hover:border-gray-400 bg-transparent cursor-pointer"
        disabled={currentSlide === 0}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Dots */}
      <div className="flex gap-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentSlide
                ? "bg-green-600"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        className="rounded-full w-10 h-10 bg-green-100 border-gray-300 hover:border-gray-400 cursor-pointer"
        disabled={currentSlide === totalSlides - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
