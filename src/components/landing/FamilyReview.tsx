
// Updated ReviewFamilyCarousel component with API integration
"use client";

import { useState, useEffect } from "react";
import { CarouselNavigation } from "../shared/carousel-navigation";
import { ReviewCard } from "../shared/reviewcard";
import { Review } from "@/types/review";

interface ApiResponse {
  success: boolean;
  total: number;
  data: Review[];
}

interface ReviewFamilyCarouselProps {
  reviews?: Review[];
}

export function ReviewFamilyCarousel({
  reviews: propReviews,
}: ReviewFamilyCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [reviews, setReviews] = useState<Review[]>(propReviews || []);
  const [loading, setLoading] = useState(!propReviews);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews from API if not provided as props
  useEffect(() => {
    if (!propReviews) {
      const fetchReviews = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review-rating`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data: ApiResponse = await response.json();
          
          console.log('API Response:', data); // Debug log
          
          if (data.success && data.data && Array.isArray(data.data)) {
            setReviews(data.data);
            console.log('Reviews set:', data.data.length); // Debug log
          } else {
            console.log('API data structure issue:', data); // Debug log
            throw new Error('Invalid API response structure');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
          console.error('Error fetching reviews:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    }
  }, [propReviews]);

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

  const totalSlides = Math.max(0, reviews.length - slidesToShow + 1);

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            What Families  <span className="text-green-600">Are Saying</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hear from families who have found trusted care and peace of mind through ALH Hub.
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            What Families  <span className="text-green-600">Are Saying</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hear from families who have found trusted care and peace of mind through ALH Hub.
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-red-600 mb-2">Error loading reviews</div>
          <div className="text-gray-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="container mx-auto py-8 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            What Families  <span className="text-green-600">Are Saying</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Hear from families who have found trusted care and peace of mind through ALH Hub.
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No reviews available</p>
        </div>
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
          {reviews.map((review: Review) => (
            <div
              key={review._id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / slidesToShow}%` }}
            >
              <ReviewCard review={review} />
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