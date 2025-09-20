"use client";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, fetchReviews } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ---------------- Types ----------------
export interface Review {
  _id: string;
  userId: string | null;
  facility: string | null;
  star: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FacilityReviewsProps {
  facilityId: string;
  userId: string;
}

interface CreateReviewInput {
  userId: string;
  facility: string;
  star: number;
  comment: string;
}

// ---------------- Component ----------------
export function FacilityReviews({ facilityId, userId }: FacilityReviewsProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const session = useSession();
  const queryClient = useQueryClient();

  // ✅ Fetch reviews query
  const { data: reviewsResponse, isLoading: isLoadingReviews } =
    useQuery<ReviewResponse>({
      queryKey: ["reviews", facilityId],
      queryFn: () => fetchReviews(facilityId, 1, 10),
      enabled: !!facilityId,
    });

  // ✅ Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: (payload: CreateReviewInput) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", facilityId] });
      setRating(0);
      setReviewText("");
      toast.success(`Review created successfully`);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create review");
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (session.status !== "authenticated") {
      toast.error("You must be logged in to submit a review");
      return;
    }

    if (!rating || !reviewText.trim()) {
      toast.error("Please provide both rating and comment");
      return;
    }

    createReviewMutation.mutate({
      userId,
      facility: facilityId,
      star: rating,
      comment: reviewText.trim(),
    });
  };

  // ✅ Derived data
  const reviews: Review[] = reviewsResponse?.data || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.star, 0) / reviews.length
      : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ---------------- Render ----------------
  if (isLoadingReviews) {
    return (
      <section className="my-12 px-4 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading reviews...</div>
        </div>
      </section>
    );
  }

  // if (reviewsError) {
  //   return (
  //     <section className="my-12 px-4 max-w-6xl mx-auto">
  //       <div className="flex justify-center items-center h-64">
  //         <div className="text-lg text-red-600">
  //           Error loading reviews. Please try again.
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section className="my-12 px-4 max-w-6xl mx-auto">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">
          What Families Say About Us
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Harness experiences and heartfelt stories from residents and their
          loved ones.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reviews Column */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.slice(0, 5).map((review: Review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 p-6 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">User Review</h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${
                            idx < review.star
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">
                    {formatDate(review.createdAt)}
                  </p>
                  <p className="text-gray-700 italic">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No reviews yet. Be the first to leave a review!
              </div>
            )}
          </div>

          {/* Form Column */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
            <div className="flex gap-3 items-start">
              <form onSubmit={handleSubmitReview} className="flex-1">
                <h3 className="text-xl font-semibold mb-6">Review Form</h3>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    How happy are you with our service
                  </label>
                  <div className="flex space-x-1 mb-4">
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
                  <div className="mb-6">
                    <label
                      htmlFor="description"
                      className="block text-gray-700 mb-2"
                    >
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
                    disabled={createReviewMutation.isPending}
                    className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium"
                  >
                    {createReviewMutation.isPending
                      ? "Submitting..."
                      : "Submit Review"}
                  </Button>
                </div>
              </form>
              <div>
                <p className="flex gap-2 items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{averageRating.toFixed(1)}</span>
                </p>
                <p>Based on {reviews.length} reviews</p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t flex gap-3 items-center border-gray-200">
              <div className="w-1/2">
                <Image
                  src={"/map.png"}
                  alt="map"
                  className="w-[200px] aspect-auto object-cover h-[200px] lg:w-[344px] lg:h-[400px]"
                  width={100}
                  height={100}
                />
              </div>
              <div className="w-1/2">
                <h3 className="text-xl font-semibold mb-4">
                  Contact Information
                </h3>
                <p className="text-gray-600 mb-4">
                  Find all the ways to reach us, including email, phone, and our
                  office address, so you can get the support easily.
                </p>

                <div className="space-y-2">
                  <p className="text-blue-600">
                    <a
                      href="mailto:support@dihuLacem.org"
                      className="hover:underline"
                    >
                      support@dihuLacem.org
                    </a>
                  </p>
                  <p className="text-gray-700">+1 (556) 128-4567</p>
                  <p className="text-gray-700">
                    123 Cara Street, City, State, ZIP Address: 123 Cara Street
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {reviews.length >= 5 ? (
          <div className="mt-[40px] lg:mt-[80px] flex justify-center">
            <Link
              href={`/allreview?id=${facilityId}`}
              className="w-[180px] h-[48px]   cursor-pointer"
            >
              <Button className="text-[#28A745] px-8 cursor-pointer  hover:text-white bg-white border-1">
                View all Reviews
              </Button>
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
}
