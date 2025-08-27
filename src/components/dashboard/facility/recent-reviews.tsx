"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import type { Review } from "@/types/servicefacility"

interface RecentReviewsProps {
  reviews: Review[]
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
        <Button variant="link" className="text-green-600 p-0 h-auto">
          See all
        </Button>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id}>
            <div className="flex items-start space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {review.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-900">{review.user.name}</div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{review.location}</div>
              </div>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
