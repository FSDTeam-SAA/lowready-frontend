"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "../ui/button";

const AllReviewForm = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rating, reviewText });
    // Add logic to submit the form (e.g., API call)
  };

  return (
    <div className=" pt-[50px] lg:pt-[120px] lg:pb-[80px] pb-[40px]">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
        <div className="flex gap-3 items-center justify-between">
          <form onSubmit={handleSubmitReview}>
            <h3 className="text-xl font-semibold mb-6">Reviews Form</h3>
            <div className="mb-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  How happy are you with our service?
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="focus:outline-none"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium"
            >
              Submit Review
            </Button>
          </form>

          <div>
            <p className="flex gap-2">
              {/* Display the star rating (static example here, can be dynamic) */}
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4.9
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span>4.9</span>
            </p>
            <p>Based on 2,529 reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviewForm;
