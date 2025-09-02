"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReview, reviewratinSummery } from "@/lib/api";

interface CreateReviewInput {
  userId: string;
  facility: string;
  star: number;
  comment: string;
}
export interface ReviewRatingDashboardResponse {
  success: boolean;
  message: string;
  data: ReviewRatingDashboardData;
}

export interface ReviewRatingDashboardData {
  total: number;
  ratings: RatingsCount;
}

export interface RatingsCount {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

const AllReviewForm: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const param = useSearchParams();
  const facilityId = param?.get("id") || "";

  const { data: session } = useSession();
  const userId: string = session?.user?.id ?? "";

  const queryClient = useQueryClient();

  const { mutate, status } = useMutation({
    mutationFn: (payload: CreateReviewInput) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", facilityId] });
      queryClient.invalidateQueries({
        queryKey: ["reviewRatingSummery", facilityId],
      });
      setRating(0);
      setReviewText("");
      toast.success("Review created successfully");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    },
  });

  const { data: facilitie } = useQuery({
    queryKey: ["reviewRatingSummery", facilityId],
    queryFn: () => reviewratinSummery(facilityId),
  });

  // Calculate average rating
  const averageRating = facilitie?.data
    ? (facilitie.data.ratings[1] * 1 +
        facilitie.data.ratings[2] * 2 +
        facilitie.data.ratings[3] * 3 +
        facilitie.data.ratings[4] * 4 +
        facilitie.data.ratings[5] * 5) /
      facilitie.data.total
    : 0;

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rating || !reviewText.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    if (!userId) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    mutate({
      userId,
      facility: facilityId,
      star: rating,
      comment: reviewText.trim(),
    });
  };

  return (
    <div className="pt-[50px] lg:pt-[120px] lg:pb-[80px] pb-[40px]">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
        <div className="lg:flex gap-3 items-start justify-between">
          <form onSubmit={handleSubmitReview} className="w-full lg:w-[70%]">
            <h3 className="text-xl font-semibold mb-6">Reviews Form</h3>

            <div className="mb-6">
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
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-[#C0C3C1] fill-[#C0C3C1]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={status === "pending" || !userId}
              className="w-full text-white py-3 px-4 rounded-md cursor-pointer transition-colors font-medium"
            >
              {status === "pending" ? "Submitting..." : "Submit Review"}
            </Button>
          </form>

          <div className="ml-6 mt-5 lg:mt-0 lg:w-[30%]">
            <p className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-[#C0C3C1] fill-[#C0C3C1]"
                  }`}
                />
              ))}
              <span>{averageRating.toFixed(1)}</span>
            </p>
            <p className="text-[16px] pt-2 text-[#68706A]">
              Based on {facilitie?.data?.total || 0} reviews
            </p>

            <div className="mt-[40px] space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center">
                  <span className=" text-[#343A40] leading-[150%] font-medium text-[16px]">
                    {star} star
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                    <div
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{
                        width: facilitie?.data?.total
                          ? `${
                              (facilitie.data.ratings[
                                star as keyof RatingsCount
                              ] /
                                facilitie.data.total) *
                              90
                            }%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                  <span className="w-8 text-sm text-right">
                    {facilitie?.data?.ratings[star as keyof RatingsCount] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviewForm;
