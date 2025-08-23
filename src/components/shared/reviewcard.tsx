"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/types/review";
import Image from "next/image";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="w-full overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-4 ">
        {/* Header */}
        <div className="space-y-4 lg:space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {" "}
              <Image
                src={review.imglink}
                alt="profile image"
                className="rounded-full"
                width={50}
                height={50}
              />
              <div className="">
                <h3 className="font-semibold text-base sm:text-lg  text-gray-900 leading-tight">
                  {review.user.name}
                </h3>
                <p className="flex flex-row">
                  {review.user.city}, {review.user.organization}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) =>
                  index < review.rating ? (
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

          <div className="flex items-center gap-1 text-gray-600">
            <span className="text-sm">{review.comment}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
