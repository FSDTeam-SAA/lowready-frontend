
// Updated ReviewCard component
"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/types/review";
import Image from "next/image";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Concatenate first and last name
  const fullName = `${review.userId?.firstName} ${review.userId?.lastName}`;
  
  // Use facility address or fallback to facility name
  const location = review.facility?.address || review.facility?.name;
  
  return (
    <Card className="w-full h-full overflow-hidden bg-white shadow-xs hover:shadow-sm transition-shadow duration-300">
      <CardContent className="p-4 ">
        {/* Header */}
        <div className="space-y-4 lg:space-y-8 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Image
                src={'/images/mini.jpg'}
                alt="profile image"
                className="rounded-full"
                width={50}
                height={50}
              />
              <div className="">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 leading-tight">
                  {fullName}
                </h3>
                <p className="flex flex-row text-sm text-gray-600">
                  {location}, {review.facility.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) =>
                  index < review.star ? (
                    <Star
                      key={index}
                      aria-label="Full star"
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ) : (
                    <Star
                      key={index}
                      aria-label="Empty star"
                      className="w-4 h-4 text-gray-300"
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-600 italic">
            <span className="text-sm">{review.comment}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
