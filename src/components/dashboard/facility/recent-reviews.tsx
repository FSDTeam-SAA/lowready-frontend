"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Review {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  location: string;
}

interface ApiReview {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  facility: {
    _id: string;
    name: string;
    address: string;
  };
  star: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RecentReviewsProps {
  facilityId: string;
}

// Fetch function
const fetchFacilityReviews = async (
  facilityId: string,
  token: string
): Promise<ApiReview[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/review-rating/facility/${facilityId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message || "Failed to fetch reviews");
  }
};

const transformReviews = (apiReviews: ApiReview[]): Review[] => {
  return apiReviews.map((apiReview) => ({
    id: apiReview._id,
    user: {
      name: `${apiReview.userId.firstName} ${apiReview.userId.lastName}`,
      email: apiReview.userId.email,
      avatar: "/placeholder.svg", // Default avatar
    },
    rating: apiReview.star || 0,
    comment: apiReview.comment || "No comment available",
    location: apiReview.facility.address || "Unknown location",
  }));
};

export function RecentReviews({ facilityId }: RecentReviewsProps) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  const { data: apiReviews, isLoading } = useQuery({
    queryKey: ["reviews", facilityId, token],
    queryFn: () => {
      if (!token) throw new Error("No access token found");
      return fetchFacilityReviews(facilityId, token);
    },
    enabled: !!token && !!facilityId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
      <div className="flex animate-pulse space-x-4">
        <div className="size-10 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-gray-200"></div>
              <div className="col-span-1 h-2 rounded bg-gray-200"></div>
            </div>
            <div className="h-2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>;
  }
  const reviews = apiReviews ? transformReviews(apiReviews) : [];

  return (
    <div className="bg-white rounded-lg border p-6 h-[300px] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
        <Link href="/reviewratings"> <Button
          variant="link"
          className="text-green-600 cursor-pointer text-sm font-medium p-0 h-auto"
        >
          See all
        </Button></Link> 
      </div>

      {/* Reviews List */}
      <div>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={review.id} className="py-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.avatar} />
                  <AvatarFallback>
                    {review.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">
                      {review.user.name}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-2 line-clamp-1">
                {review.comment}
              </p>
              {index < reviews.length - 1 && <Separator className="my-4" />}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-6 text-sm">
            No reviews yet
          </p>
        )}
      </div>
    </div>
  );
}
